/*
 * System library
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
var hbs = require('handlebars');
var fs = require('fs');
var async = require('async');
global.appPath = path.dirname(require.main.filename);
global.HELPER ={};
require(path.join(appPath,'application/config/defines.js'));
require('./db.js');
require(path.join(appPath,'system/lib/handhelpers.js'));
var _fns = require(path.join(appPath,'system/lib/functions.js'));

app.use(function(req,res,next){
        res.sleekReq = req;
        next();
});

//handle 500
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    var realPath  = path.join(appPath,'application/views',sleekConfig.theme, 'error.html');
    if (! fs.existsSync(realPath)) {
        realPath = path.join(__dirname,'error.html');
    } 
    var templateFile = fs.readFileSync(realPath, 'utf8');
    var template = hbs.compile(templateFile);
    var compiled = template({ title:'Application Error', error: err.stack });
    res.send(compiled);
});

app.use(app.router);

//load custom config libraries
if(sleekConfig.configLibs){
    for(var i in sleekConfig.configLibs){
        try {
            require(path.join(appPath,'lib', sleekConfig.configLibs[i]+'.js'));
        } catch(err){
            console.log(err);
        }
    }
    
}

//set loggings as in config
if(sleekConfig.logToFile == true) {
    var access = fs.createWriteStream(path.join(appPath, sleekConfig.accesslog), {
        flags:'a'
    });
    process.stdout.write = (function(write) {
        return function(string, encoding, fd) {
            access.write(string);
        }
    })(process.stdout.write)

    var errorLog = fs.createWriteStream(path.join(appPath, sleekConfig.errorlog), {
        flags:'a'
    });
    process.stderr.write = (function(write) {
        return function(string, encoding, fd) {
            errorLog.write(string);
        }
    })(process.stdout.write)
}
    
global.system = {
    /**
     * get model object
     * pass model name. example; for userModel pass user
     * 
     * @param model model name, ignoring trailing 'Model'
     * @return model object
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    getModel: function(model){
        try {
            return require(path.join(appPath, 'application/models',model+'Model.js'));
        } catch (err) {
            this.log(err);
        }
    },
    /**
     * get a library object
     * 
     * @param lib library name
     * @return library object
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    getLibrary: function(lib){
        try {
            return require(path.join(appPath ,'lib',lib+'.js'));
        } catch (err) {
            this.log(err);
        }
    },
    /**
     * load a helpers object
     * 
     * @param helper helper name
     * @return helper object
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    loadHelper: function(helper){
        try {
            if(helper instanceof Object) {
                for(var h in helper) {
                    _fns.extendJSON(global.HELPER, require(path.join(appPath ,'application/helpers',helper[h]+'.js')));
                }
            } else {
                _fns.extendJSON(global.HELPER, require(path.join(appPath ,'application/helpers',helper+'.js')));
            }
        } catch (err) {
            this.log(err);
        }
    },
    /**
     * get a controller object
     * 
     * @param controller controller name
     * @return controller object
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    getController: function(controller){
        try {
            return require(path.join(appPath,'application/controllers',controller+'.js'));
        } catch (err) {
            this.log(err);
        }
        
    },
    /**
     * Set a partial file to load in view
     * can load partial from view, using {{> partialname data}}
     * 
     * @param partial file path from view folder
     * @param name Set a name for partial to load in view
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    setPartial: function(partial, name){
        try {
            if(!name){
                name = partial;
            }
            var realPath  = path.join(appPath,'application/views',sleekConfig.theme, partial+'.html');
            if (! fs.existsSync(realPath)) {
                realPath = path.join(appPath,'application/views/default',partial+'.html');
            }
            var template = fs.readFileSync(realPath, 'utf8');
            var plugsDir = fs.readdirSync(path.join(appPath,'modules'));
            async.eachSeries(plugsDir, function (plug, _pcbk) {
                var stats = fs.statSync(path.join(appPath,'modules',plug));
                if(stats.isDirectory() && plug.charAt(0) != '.'){
                    var Ovr = require(path.join(appPath,'modules',plug, 'override.js'));
                    async.eachSeries(Ovr.data, function (ovdta, _ovdbk) {
                        if(ovdta.view == partial){
                            var _m = ovdta.mode;
                            if(_m == 'override'){
                                realPath  = path.join(appPath,'modules',plug,'views',partial+'.html');
                                template = fs.readFileSync(realPath, 'utf8');
                                _ovdbk();
                            } else if (_m == 'prepend' || _m == 'append' || _m == 'replace') {
                                if(ovdta.controller && ovdta.action){
                                    var M = system.getPluginController(ovdta.controller,plug);
                                    var fn = M[ovdta.action];
                                    fn(function(dt){
                                        if(_m == 'prepend') {
                                            template = dt + template;
                                        } else if (_m == 'append') {
                                            template += dt;
                                        } else {
                                            template = template;
                                        }
                                        _ovdbk();
                                    });
                                } else {
                                    realPath  = path.join(appPath,'modules',plug,'views',partial+'.html');
                                    var dt = fs.readFileSync(realPath, 'utf8');
                                    if(_m == 'prepend') {
                                        template = dt + template;
                                    } else if (_m == 'append') {
                                        template += dt;
                                    } else {
                                        template = template;
                                    }
                                    _ovdbk();
                                }
                                
                            } else {
                                _ovdbk();
                            }
                        } else {
                            _ovdbk();
                        }
                    }, function(){
                        _pcbk();
                    });
                } else {
                    _pcbk();
                }
            }, function(){
                hbs.registerPartial(name, template);
            });
        }
        catch (err) {
            this.log(err);
        }
        
    },
    /**
     * Set a plugin partial file to load in view
     * can load partial from view, using {{> partialname data}}
     * 
     * @param partial file path from view folder
     * @param name Set a name for partial to load in view
     * @param plugin (Optional) Plugin name
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 28-01-2014
     */
    setPluginPartial: function(partial, name , plugin){
        try {
            //if calling from plugins controller
            if(!plugin){
                var pt = _fns._getCallerFile();
                plugin = pt.split('/');
                if(plugin[plugin.indexOf('controllers')-2] == 'modules') {
                    plugin = plugin[plugin.indexOf('controllers')-1]
                } else {
                    this.log('Please specify plugin name');
                }
            }
            if(!name){
                name = partial;
            }
            var realPath  = path.join(appPath,'modules',plugin,'views',partial+'.html');
           
            var template = fs.readFileSync(realPath, 'utf8');
            hbs.registerPartial(name, template);
        }
        catch (err) {
            this.log(err);
        }
        
    },
    /**
     * Load view
     * 
     * @param res response object
     * @param view file path from view folder
     * @param passedData Set data to load in view
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    loadView: function(res, view, passedData){
        try {
            var pt = _fns._getCallerFile();
            var plugin = pt.split('/');
            var caller = plugin[plugin.indexOf('controllers')-1];
            //get plugin overrides
            var plugsDir = fs.readdirSync(path.join(appPath,'modules'));
            async.eachSeries(plugsDir, function (plug, _pcbk) {
                var stats = fs.statSync(path.join(appPath,'modules',plug));
                if(stats.isDirectory() && plug.charAt(0) != '.' && fs.existsSync(path.join(appPath,'modules',plug,'override.js'))){
                    var Ovr = require(path.join(appPath,'modules',plug, 'override.js'));
                    async.eachSeries(Ovr.data, function (_ovDt, _ovcbk) {
                        if(_ovDt.view == view && caller == 'application'){
                            var prio = _ovDt.priority ? _ovDt.priority : 0;
                            var _mode = _ovDt.mode;
                            if(_mode == 'override'){
                                system.loadPluginView(res,view,passedData,plug);
                                _ovcbk();
                                return;
                            } else if(_mode == 'controll'){
                                var M = system.getPluginController(_ovDt.controller,plug);
                                var fn = M[_ovDt.action];
                                fn(res.sleekReq,res,passedData);
                                _ovcbk();
                                return;
                            } else if(_mode == 'append' || _mode == 'prepend' || _mode == 'replace'){
                                passedData.locals = res.locals;
                                if(!passedData.PLUGINS){
                                    passedData.PLUGINS =  [];
                                }
                                var M = system.getPluginController(_ovDt.controller,plug);
                                var fn = M[_ovDt.action];
                                fn(res.sleekReq,res,passedData,function(dt){
                                     passedData.PLUGINS.push({data:dt, mode:_mode, prio:prio});
                                     _ovcbk();
                                });
                            } else {
                                _ovcbk();
                            }
                           
                        } else {
                            _ovcbk();
                        }
                    }, function(){
                        _pcbk();
                    });
                } else {
                    _pcbk();
                }
            }, function(){
                var getpath  = path.join(sleekConfig.theme,view+'.html');
                var realPath = getpath;
                fs.exists(path.join(appPath,'application/views',getpath), function(exists){
                    if(! exists) {
                        realPath = path.join('default',view+'.html');
                    }
                });

                var assetFile = path.join(app.get('views'), path.dirname(realPath), 'assets.json');
                var scripts = '';
                fs.exists(assetFile, function(exists){
                    if(exists) {
                        fs.readFile(assetFile, 'utf8', function (err, data) {
                            if (err) {
                                this.log(err);
                                return;
                            }
                            data = JSON.parse(data);

                            for(var count in data.css) {
                                if (fs.existsSync(path.join(appPath,'public', sleekConfig.theme, 'css', data.css[count]+'.css'))) {
                                    scripts += '<link rel="stylesheet" href="'+path.join('/',sleekConfig.theme, 'css', data.css[count]+'.css')+'"/>\n';
                                } else if (fs.existsSync(path.join(appPath,'application/views', sleekConfig.theme, 'assets/css', data.css[count]+'.css'))) {
                                    scripts += '<link rel="stylesheet" href="'+path.join('assets/themes', sleekConfig.theme, 'css', data.css[count])+'.css"/>\n';
                                } else if (fs.existsSync(path.join(appPath,'application/views/default/assets/css', data.css[count]+'.css'))) {
                                    scripts += '<link rel="stylesheet" href="'+path.join('assets/themes/default/css', data.css[count])+'.css"/>\n';
                                } else {
                                    scripts += '<link rel="stylesheet" href="'+path.join('/default', 'css', data.css[count]+'.css')+'"/>\n';
                                }
                            }

                            for(var count in data.js) {
                                if (fs.existsSync(path.join(appPath,'public', sleekConfig.theme, 'js', data.js[count]+'.js'))) {
                                    scripts += '<script type="text/javascript" src="'+path.join('/',sleekConfig.theme, 'js', data.js[count]+'.js')+'" ></script>\n';
                                } else if (fs.existsSync(path.join(appPath,'application/views', sleekConfig.theme, 'assets/js', data.js[count]+'.js'))) {
                                    scripts += '<script type="text/javascript" src="'+path.join('assets/themes', sleekConfig.theme, 'js', data.js[count])+'.js" ></script>\n';
                                } else if (fs.existsSync(path.join(appPath,'application/views/default/assets/js', data.js[count]+'.js'))) {
                                    scripts += '<script type="text/javascript" src="'+path.join('/assets/themes/default/js', data.js[count])+'.js" ></script>\n';
                                } else {
                                    scripts += '<script type="text/javascript" src="'+path.join('/default', 'js', data.js[count])+'.js" ></script>\n';
                                }

                            }

                            hbs.registerPartial('getSleekScripts', scripts);
                            _fns._render(res,view,passedData);

                        });
                    } else {
                        hbs.registerPartial('getSleekScripts', scripts);
                        _fns._render(res,view,passedData);
                    }                
                });
            
            });
        }
        catch (err) {
            this.log(err);
        }
    },
    /**
     * Write log
     * 
     * @param str string to log error
     * @param status Optional log status
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    log: function(str, status){
       var cf = _fns._getCalleeFile();
       var cl = _fns._getCalleeLine();
       if(!status) {
           status = 'Error';
       }
       if(str) {
           var log = status + ' :: ' + new Date() + ' :\n';
           log += str + ' - ' + cf + ' on line ' + cl + '\n';
           if(sleekConfig.logToFile == true) {
               fs.appendFile(path.join(appPath, sleekConfig.systemlog), log, function (err) {});
           } else {
               console.log(log);
           }
       }
   },
    /**
     * Get compiled handlebars template with data
     * 
     * @param name file path from view folder
     * @param data Data to compile with template
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 13-11-2013
     */
    getCompiledView: function(name, data, raw){
        try {
            if(!name){
                throw 'Please supply template name to compile'
            }
            var realPath  = path.join(appPath,'application/views',sleekConfig.theme, name+'.html');
            if (! fs.existsSync(realPath)) {
                realPath = path.join(appPath,'application/views/default',name+'.html');
            }
            var templateFile = fs.readFileSync(realPath, 'utf8');
            if(raw) {
                return templateFile;
            } else {
                var template = hbs.compile(templateFile);
                var compiled;
                if(data){
                    compiled = template(data);
                } else {
                    compiled = template();
                }
                return compiled;
            }
        }
        catch (err) {
            this.log(err);
        }
        
    },
    /**
     * Get controller from a plugin
     * 
     * @param controller controller name
     * @param plugin plugin name
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 22-01-2014
     */
    getPluginController: function(controller, plugin){
        try {
            return require(path.join(appPath,'modules', plugin, 'controllers', controller+'.js'));
        } catch (err) {
            this.log(err);
        }
        
    },
    /**
     * get model object from a plugin
     * pass model name. example; for userModel pass user
     * 
     * @param model model name, ignoring trailing 'Model'
     * @param plugin plugin name
     * @return model object
     * @author Robin <robin@cubettech.com>
     * @Date 22-01-2014
     */
    getPluginModel: function(model,plugin){
        
        try {
            //if calling from plugins controller
            if(!plugin){
                var pt = _fns._getCallerFile();
                plugin = pt.split('/');
                if(plugin[plugin.indexOf('controllers')-2] == 'modules') {
                    plugin = plugin[plugin.indexOf('controllers')-1]
                } else {
                    this.log('Please specify plugin name')
                }
            }
            
            return require(path.join(appPath,'modules', plugin, 'models',model+'Model.js'));
        } catch (err) {
            this.log(err);
        }
    },
    /**
     * Load Plugin view
     * 
     * @param res response object
     * @param view file path from view folder
     * @param passedData Set data to load in view
     * @param plugin name (optional, if calling from plugin)
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 22-01-2014
     */
    loadPluginView: function(res, view, passedData,plugin){
        try {
            
            //if calling from plugins controller
            if(!plugin){
                var pt = _fns._getCallerFile();
                plugin = pt.split('/');
                if(plugin[plugin.indexOf('controllers')-2] == 'modules') {
                    plugin = plugin[plugin.indexOf('controllers')-1]
                } else {
                    this.log('Please specify plugin name');
                }
            }
            
            var realPath  = path.join(appPath,'modules',plugin,'views',view+'.html');
            fs.exists(path.join(appPath,'modules',plugin,'views',view+'.html'), function(exists){
                if(! exists) {
                    realPath = path.join('default',view+'.html');
                }
            });
            
            var assetFile = path.join(path.dirname(realPath), 'assets.json');
            var scripts = '';
            fs.exists(assetFile, function(exists){
                if(exists) {
                    fs.readFile(assetFile, 'utf8', function (err, data) {
                        if (err) {
                            this.log(err);
                            return;
                        }
                        data = JSON.parse(data);

                        for(var count in data.css) {
                            if (fs.existsSync(path.join(appPath,'modules', plugin, 'assets', 'css', data.css[count]+'.css'))) {
                                scripts += '<link rel="stylesheet" href="'+path.join('/assets', plugin, 'css', data.css[count]+'.css')+'"/>\n';
                            } else if(fs.existsSync(path.join(appPath,'public', sleekConfig.theme, 'css', data.css[count]+'.css'))) {
                                scripts += '<link rel="stylesheet" href="'+path.join('/', sleekConfig.theme, 'css', data.css[count]+'.css')+'"/>\n';
                            } else {
                                scripts += '<link rel="stylesheet" href="'+path.join('/default', 'css', data.css[count]+'.css')+'"/>\n';
                            }
                            
                        }

                        for(var count in data.js) {
                            if(fs.existsSync(path.join(appPath,'modules', plugin, 'assets', 'js', data.js[count]+'.js'))){
                                scripts += '<script type="text/javascript" src="'+path.join('/assets', plugin, 'js', data.js[count]+'.js')+'" ></script>\n';
                            } else if (fs.existsSync(path.join(appPath,'public', sleekConfig.theme, 'js', data.js[count]+'.js'))) {
                                scripts += '<script type="text/javascript" src="'+path.join('/',sleekConfig.theme, 'js', data.js[count]+'.js')+'" ></script>\n';
                            } else {
                                scripts += '<script type="text/javascript" src="'+path.join('/default', 'js', data.js[count]+'.js')+'" ></script>\n';
                            }
                            
                        }
                        hbs.registerPartial('getSleekScripts', scripts);
                        res.render(realPath, passedData);
                    });
                } else {
                    hbs.registerPartial('getSleekScripts', scripts);
                    res.render(realPath, passedData);
                }

                
            });
        }
        catch (err) {
            this.log(err);
        }
    },
    /**
     * Get compiled handlebars template with data from plugin
     * 
     * @param name file path from view folder
     * @param data Data to compile with template
     * @param plugin name (optional, if calling from plugin)
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 22-01-2014
     */
    getCompiledPluginView: function(name, data, plugin, raw){
        try {
            //if calling from plugins controller
            if(!plugin){
                var pt = _fns._getCallerFile();
                plugin = pt.split('/');
                if(plugin[plugin.indexOf('controllers')-2] == 'modules') {
                    plugin = plugin[plugin.indexOf('controllers')-1]
                } else {
                    this.log('Please specify plugin name')
                }
            }
            
            if(!name){
                throw 'Please supply template name to compile';
            }
             
            var realPath  = path.join(appPath,'modules',plugin,'views',name+'.html');
            if (! fs.existsSync(realPath)) {
                realPath = path.join(appPath,'application/views/default',name+'.html');
            }
            var templateFile = fs.readFileSync(realPath, 'utf8');
            if(raw){
                return templateFile;
            } else {
                var template = hbs.compile(templateFile);
                var compiled;
                if(data){
                    compiled = template(data);
                } else {
                    compiled = template();
                }
                return compiled;
            }
        }
        catch (err) {
            this.log(err);
        }
        
    },
    /**
     * Set a partial file to load in view from plugin
     * can load partial from view, using {{> partialname data}}
     * 
     * @param partial file path from view folder
     * @param name Set a name for partial to load in view
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 22-01-2014
     */
    setPluginPartial: function(partial, name, plugin){
        try {
            if(!name){
                name = partial;
            }
            
            if(!plugin){
                var pt = _fns._getCallerFile();
                plugin = pt.split('/');
                if(plugin[plugin.indexOf('controllers')-2] == 'modules') {
                    plugin = plugin[plugin.indexOf('controllers')-1]
                } else {
                    this.log('Please specify plugin name')
                }
            }
            
            var realPath  = path.join(appPath,'modules',plugin,'views', partial+'.html');
            var template = fs.readFileSync(realPath, 'utf8');
            hbs.registerPartial(name, template);
        }
        catch (err) {
            this.log(err);
        }
        
    }
};

module.exports = function(app){
    try {
        //set commons
        var R = require(path.join(appPath, 'application/config/routes.js'));
        var Helper = require(path.join(appPath, 'application/helpers/routes.js'));
        var commonfns = [];
        if(R.commonRouteFunctions) {
            for(var i in R.commonRouteFunctions){
                var ct = R.commonRouteFunctions[i];
                if(Helper[ct] instanceof Function) {
                    var sc = Helper[ct] ? Helper[ct] : function(req,res,next){
                        next();
                    };
                    commonfns.push(sc);
                }
            }
        } else {
            commonfns = function(req,res,next){ next(); };
        }
        
        var plugsDir = fs.readdirSync(path.join(appPath,'modules'));
        var prts = [];
        for(var p in plugsDir) {
            var stats = fs.statSync(path.join(appPath,'modules',plugsDir[p]));
            if(stats.isDirectory() && plugsDir[p].charAt(0) != '.' && fs.existsSync(path.join(appPath,'modules',plugsDir[p],'routes.js'))){
                var P = require(path.join(appPath,'modules',plugsDir[p], 'routes.js'));
                for(var c in P.routes) {
                    var rt = P.routes[c];
                    prts[c] = system.getPluginController(rt.controller,plugsDir[p]);
                    var act = rt.action;
                    var rout = rt.route;
                    
                    for(var r in rt.params) {
                        rout += '/' + rt.params[r] + '([A-Za-z0-9_]+)?'
                    }
                    
                    var fn = Helper[rt.fn] ? Helper[rt.fn] : function(req,res,next){
                        next();
                    };
                    
                    if(rt.type && rt.type == "POST") {
                        app.post(rout,commonfns, fn, prts[c][act]);
                    } else {
                        app.get(rout,commonfns, fn, prts[c][act]);
                    }

                }
            }
        }
        
        var rts = [];
        for(var c in R.routes) {
            var rt = R.routes[c];
            rts[c] = system.getController(rt.controller);
            var act = rt.action;
            var rout = rt.route;
            for(var r in rt.params) {
                rout += '/' + rt.params[r] + '([A-Za-z0-9_]+)?'
            }
            var fn = Helper[rt.fn] ? Helper[rt.fn] : function(req,res,next){
                next();
            };
                        
            if(rt.type && rt.type == "POST") {
                app.post(rout, commonfns, fn, rts[c][act]);
            } else {
                app.get(rout, commonfns, fn, rts[c][act]);
            }

        }
        
        //file server for plugins & themes
        app.get('/assets/:mod?/:plugin?/:type?/:file?', function(req, res){
            if(!req.params.plugin || !req.params.type || !req.params.file || !req.params.mod) {
                res.end();
                return false;
            } 
            if(req.params.mod == 'modules'){
                res.sendfile(path.join(appPath,'modules',req.params.plugin,'assets',req.params.type,req.params.file));
            } else if (req.params.mod == 'themes') {
                res.sendfile(path.join(appPath,'application/views',req.params.plugin,'assets',req.params.type,req.params.file));
            }
        });

        //handle unknown requests
        app.get('*/([A-Za-z0-9_]+)', function(req, res){
            var realPath  = path.join(appPath,'application/views',sleekConfig.theme, 'error.html');
            if (! fs.existsSync(realPath)) {
                realPath = path.join(__dirname,'error.html');
            } 
            var templateFile = fs.readFileSync(realPath, 'utf8');
            var template = hbs.compile(templateFile);
            var compiled = template({title:'404! Page Not Found'});
            res.send(compiled);
        });


    } catch (e){
        system.log(e);
    }
}
