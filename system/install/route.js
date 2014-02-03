/* 
 * Installation
 * 
 * @package cubetboard
 * @version 2.0
 * @author Arya <arya@cubettech.com>
 * @Date 18/12/2014
 */

/**
 * routing for installation
 */
var fs = require("fs");
var path = require('path');
var mongodb = require('mongodb');
var hbs = require('handlebars');
var io = require('socket.io');
var http = require('http');
var ncp = require('ncp').ncp;
module.exports = function(app, sFolderPath, directory) {

    app.post('/installApp', function(req, res) {
        
        sio.sockets.emit('status_data',{
            msg:'starting...'
        }); 
     
     
        var formidable = require('formidable');
        var fs = require('fs');
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            var port = fields.app_port;
            var base_url = fields.base_url;
            var db_host = fields.db_host;
            var db_user = fields.db_user;
            var db_password = fields.db_password;
            var db_name = fields.db_name;
            var db_sample = fields.db_sample;
            var admin_username = fields.admin_username;
            var admin_pass = fields.admin_pass;
            var adm_email = fields.adm_email;
            var adm_title = fields.adm_title;
            var adm_keyword = fields.adm_keyword;
            var agree = fields.agree;
            var notify = fields.notify;

            var crypto = require('crypto');
            var user_pass = admin_pass + pass_salt;
            user_pass = crypto.createHash('md5').update(user_pass).digest("hex");
            var user_data = {
                "username": admin_username,
                "password": user_pass,
                "email": adm_email
            };

            var settings = {
                "title": adm_title ? adm_title : 'CubetboardV2',
                "meta_desc": 'cubetboardv2 pinterest clone',
                "meta_keys": adm_keyword ? adm_keyword : '',
                "layout": 'fixed',
                "timestamp": new Date().getTime()
            };
            //console.loge(files.site_logo);
            if (files.site_logo && files.site_logo.name && files.site_logo.name != '') {
                fs.readFile(files.site_logo.path, function(err, data) {
                    var image = files.site_logo.name;
                    var extension = image.split(".").pop();
                    var newimage = 'site-logo.' + extension;
                    var newPath = 'uploads/' + newimage;

                    fs.writeFile(newPath, data, function(err) {
                        settings.logo = '/' + newimage;

                    });

                });
            }
            else
            {
                settings.logo = '/' + 'site-logo.png';
            }

            sio.sockets.emit('status_data', {
                msg:'extract config...'
            });
            var cur_pat = path.join(__dirname);
            var config_path = cur_pat.replace('system/install', '') + 'application/config/config.js';

            var db_path = cur_pat.replace('system/install', '') + 'application/config/mongodb.js';

            var db_data = require(db_path);
            fs.readFile(config_path, 'utf8', function(err, data) {
                if (err) {
                    return console.log(err);
                }
                if (!port)
                {
                    port = sleekConfig.appPort;
                }
                var old_baseurl =  base_url;
                var new_base_url = base_url.replace('http://', '');
                base_url = "http://"+new_base_url;
                var result = data.replace(sleekConfig.appPort, port);
                var result = result.replace(sleekConfig.appHost, old_baseurl);
                var result = result.replace(sleekConfig.siteUrl, base_url + ":" + port);

                fs.writeFile(config_path, result, 'utf8', function(err) {
                    if (err)
                        return console.log(err);
                });

            });
            sio.sockets.emit('status_data', {
                msg:'extract db...'
            });
            fs.readFile(db_path, 'utf8', function(err, data) {

                if (err) {
                    return console.log(err);
                }
                var result = data.replace(db_data.dbHost, db_host);
                result = result.replace(db_data.dbName, db_name);

                fs.writeFile(db_path, result, 'utf8', function(err) {
                    if (err)
                        return console.log(err);


                    fs.exists(db_path, function(exists) {

                        if (exists) {

                            var config = require(db_path);

                            try {
                                var mongo = require('mongodb');
                            } catch (e) {
                                console.log('Please install "mongodb" module. run "npm install mongodb"');
                                process.exit();
                            }

                            
                            mongo.connect('mongodb://' + (db_host ? db_host : 'localhost') + ':' + (config.dbPort ? config.dbPort : '27017') + '/' + db_name, function(err, db) {
                                if (err)
                                    throw err;

                                var dta =   {
                                    'user_data':user_data,
                                    'settings':settings
                                }
                                if (!config.dbUser && !config.dbPass) {
                                    db.authenticate(config.dbUser, config.dbPass, function(err, ress) {
                                        insertdta(db_sample,db_name,dta,res,db, function(){
                                            sio.sockets.emit('status_data', {
                                                msg: 'New site Url Is '+base_url+":"+port, 
                                                last:true
                                            });
                                        });

                                    });
                                } else {
                                   
                                    insertdta(db_sample,db_name,dta,res,db, function(){
                                        sio.sockets.emit('status_data', {
                                            msg: 'New site Url Is '+base_url+":"+port, 
                                            last:true
                                        });
                                    });
                                    

                                }



                            });
                        }
                    });
                });

            });


        });

    });
    
    function insertdta(db_sample,db_name,user_data,res,db,callback){
        var util = require('util'),
        exec = require('child_process').exec,
        child;

        if (db_sample)
        {
            var command = 'mongorestore -d' + db_name + ' '+sFolderPath+'/db/withdata';
            var pin_path = sFolderPath + '/pins';
            var newpin_path = sFolderPath.replace('install', 'uploads') ;
                
            ncp(pin_path, newpin_path, function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log('done!');
            });
        }
        else
        {
            var command = 'mongorestore -d' + db_name + ' '+sFolderPath+'/db/withoutdata';
        }

        child = exec(command, // command line argument directly in string
            //child = exec('mongodump -d cbt -o petsbackup', 
            function(error, stdout, stderr) {      // one easy function to capture data/errors

                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                        
                var collection = db.collection('adminuser');
                collection.insert(user_data.user_data, function(err, inserted_data) {
                    if (err)
                        return console.error(err);
                    console.log('user inserted !! ');

                    var collection = db.collection('site_settings');
                    collection.insert(user_data.settings, function(err, inserted_setting_data) {
                        console.log(user_data.settings);
                        if (err)
                            return console.error(err);
                        console.log('settings inserted !! ');

                    });

                });
               
                fs.rename(sFolderPath, directory + '/_install', function(err) {
                    if (err)
                        throw err;
                    console.log('renamed complete');
                    var send_data ={
                        "res":1
                    }
                    res.send(send_data);
                    callback();
                });

                
           
            });
    }

    app.post('/permissioncheck', function(req, res) {
        var cur_pat = path.join(__dirname);
        var config_path = cur_pat.replace('system/install', '') + 'application/config/config.js';
        var check =0;
        var db_path = cur_pat.replace('system/install', '') + 'application/config/mongodb.js';
        fs.stat(config_path, function(error, stats) {
            if (stats.mode != '33206')
            {
               
                var data={
                    "res":0
                }
                check =1;
            }
            else{
                var data={
                    "res":1
                } 
                check =0;
            }
            if(check==1)
            {
                res.send(data);
            }
        });
       
        if(check==0)
        {
            fs.stat(db_path, function(error, stats) {
                console.log(stats.mode);
                if (stats.mode != '33206')
                {
                    var data={
                        "res":0
                    }
                }
                else{
                    var data={
                        "res":1
                    } 
                }
                console.log(data);
                res.send(data);
            });
        
        }
    
    });
    
    app.get('/success',function(req,res){
        var realPath = path.join(sFolderPath, 'application/views', sleekConfig.theme, 'success.html');

        if (!fs.existsSync(realPath)) {
            realPath = path.join(sFolderPath, 'applications', 'views', 'success.html');
        }
        var templateFile = fs.readFileSync(realPath, 'utf8');
        var template = hbs.compile(templateFile);
        var compiled = template({
            title: 'Success'
        });
        res.end(compiled);
    });
    
    app.get('/*', function(req, res) {
        
        sio.sockets.on('connection', function (socket) {
            socket.on('die', function(){
                console.log('Bye');
                process.exit();
               
            }); 
        });
        
        
        try{
            var realPath = path.join(sFolderPath, 'application/views', sleekConfig.theme, 'install.html');

            if (!fs.existsSync(realPath)) {
                realPath = path.join(sFolderPath, 'applications', 'views', 'install.html');
            }
            var templateFile = fs.readFileSync(realPath, 'utf8');
            var template = hbs.compile(templateFile);
            var compiled = template({
                title: 'Install'
            });
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(compiled);
        } catch(exception){
            console.log(exception);
            process.exit();
        }
    });
    
}
