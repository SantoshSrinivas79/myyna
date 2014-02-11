/**
 * Sleek app init
 * Here we iniialize :: Its better to dont edit, if you're a beginner :)
 *  
 * @package Sleek.js
 * @version 1.0
 * 
 * The MIT License (MIT)

 * Copyright Cubet Techno Labs, Cochin (c) <2013> <info@cubettech.com>

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

//require our needs
var express = require('express');
var http = require('http');
var path = require('path');
var exphbs  = require('express3-handlebars');
var helmet  = require('helmet');
var fs = require('fs');
var hbs = require('handlebars');
var engines = require('consolidate');
var io = require('socket.io');
global.app = express();

global.sleekConfig = {};
require(path.join(__dirname,'application/config/config.js'));
app.configure(function(){
    app.set('env', sleekConfig.env);
    // all environments
    app.set('port', process.env.PORT || sleekConfig.appPort);
    app.set('host', sleekConfig.appHost ? sleekConfig.appHost : 'localhost');
    app.set('views', path.join(__dirname, 'application/views'));
    app.set('view engine', 'handlebars');
    app.engine('html',  exphbs({defaultLayout: 'default',
                                layoutsDir: path.join(__dirname, 'application/layouts/'), extname:".html"})
                ); 
    app.use(express.favicon(path.join(__dirname, 'public/favicon.ico'))); 
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());  
    app.use(helmet.xframe());
    app.use(helmet.iexss());
    app.use(helmet.contentTypeOptions());
    app.use(helmet.cacheControl());
    app.use(express.methodOverride());
    app.use(express.cookieParser('CubEtNoDeSlEek'));
    app.use(express.session());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'uploads')));
    app.set('strict routing');

    
});

//set Site url
//global.sleekConfig.siteUrl = app.get('host')+':'+app.get('port');
//get configs
var sFolderPath = path.join(__dirname, 'install');
var cur_directory = path.join(__dirname, '');
fs.exists(sFolderPath, function(exists) {
    if (!exists)
        require('./system/core/sleek.js')(app);
    else
    {
        require('./system/install/route.js')(app,sFolderPath,cur_directory);
    }
});
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
} else {
    //prevent crash
    process.on('uncaughtException', function (exception) {
        console.log(exception);
    });
}

var server = http.createServer(app);
try {
    global.sio = io.listen(server, {log: false});
    server.listen(app.get('port'), function(){
      console.log('application running at ' + sleekConfig.siteUrl);
    });
} catch (e) {
    system.log(e);
}
