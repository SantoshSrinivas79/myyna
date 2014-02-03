/* 
 * Database intialization
 * 
 * @package Sleek.js
 * @version 1.0
 * 
 * The MIT License (MIT)

 * Copyright Cubet Techno Labs, Cochin (c) 2013 <info@cubettech.com>

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

var path = require('path');
var fs = require('fs');

try {
    //depricated function call
    if(sleekConfig.dbHost && sleekConfig.dbName){
        console.log('Sleek.js doesn\'t use mongoose by default. ! BTW, You can continue using mongoose, by adding as a library');
        console.log('See Docs at http://sleekjs.com/docs. ');
        console.log('changelog at http://sleekjs.com/change-log ');
        global.mongoose = require('mongoose');
        var options = {
          user: sleekConfig.dbUser,
          pass: sleekConfig.dbPass
        }
        mongoose.connect('mongodb://'+sleekConfig.dbHost+':'+sleekConfig.dbPort+'/' + sleekConfig.dbName, options);
    }
    
    fs.exists(path.join(appPath,'application/config', 'mongodb.js'), function(exists){
        if(exists) {
            var config = require(path.join(appPath, 'application/config','mongodb.js'));
            try {
                global.mongo = require('mongodb');
            } catch(e) {
                console.log('Please install "mongodb" module. run "npm install mongodb"');
                process.exit();
            }
            mongo.connect('mongodb://'+ (config.dbHost ? config.dbHost : 'localhost') + ':'+(config.dbPort ? config.dbPort : '27017') +'/' + config.dbName, function(err, db) {
                if(err) throw err;
                global.mongodb = db;
                if(config.dbUser && config.dbPass) {
                    mongodb.authenticate(config.dbUser, config.dbPass, function(err, res) {
                      // callback
                    });
                }
            });
        }
    });
}
catch (err) {
    console.log(err);
}

