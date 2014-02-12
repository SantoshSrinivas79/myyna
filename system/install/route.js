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
var async = require('async');
var installPath,installDir;



process.on('uncaughtException', function (exception) {
	sio.sockets.emit('except'); 
	console.log(exception);
	console.log('Sorry! Installation Failed!');
	installPath.replace('install', '_install')
	fs.rename(installPath, installDir + '/install', function(err) {
		if (err) {
			console.log(err);
		}
    		console.log('Reverting changes..');
		process.exit(); 
	});
	   
});

module.exports = function(app, sFolderPath, directory) {
	installPath = sFolderPath;
	installDir = directory;

    app.post('/installApp', function(req, res) {
        
        sio.sockets.emit('status_data',{
            msg:'Starting...'
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
                "title": adm_title ? adm_title : 'Myyna',
                "meta_desc": 'Myyna pinterest clone',
                "meta_keys": adm_keyword ? adm_keyword : '',
                "layout": 'fixed',
                "timestamp": new Date().getTime()
            };

            //console.loge(files.site_logo);
            if (files.site_logo && files.site_logo.name && files.site_logo.name != '') {
                    var image = files.site_logo.name;
                    var extension = image.split(".").pop();
                    var newimage = 'site-logo.' + extension;
                    var newPath = 'uploads/' + newimage;
                    settings.logo = '/' + newimage;
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
                // var result = result.replace(sleekConfig.appHost, old_baseurl);
                var result = result.replace(sleekConfig.siteUrl, base_url);

                fs.writeFile(config_path, result, 'utf8', function(err) {
                    if (err)
                        return console.log(err);
                });

            });
            sio.sockets.emit('status_data', {
                msg:'extract db...'
            });
            fs.readFile(db_path, 'utf8', function(err, Ddata) {

                if (err) {
                    return console.log(err);
                }
		db_data.dbHost = db_host;
		db_data.dbName = db_name;
		if(db_user && db_user != '' && db_user != null) {
			db_data.dbUser = db_user;
		}
		if(db_password && db_password != '' && db_password != null) {	
			db_data.dbPass = db_password;
		}

		Ddata = Ddata.replace(/{([^}]+)}/,  JSON.stringify(db_data));
		
                fs.writeFile(db_path, Ddata.replace(/,/g, ', \n'), 'utf8', function(err) {
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
                                if (config.dbUser && config.dbPass) {
                                    db.authenticate(config.dbUser, config.dbPass, function(err, ress) {
                                        insertdta(db_sample,db_name,dta,res,db,files,mongo, function(){
                                            sio.sockets.emit('status_data', {
                                                msg: 'New site Url Is '+base_url, 
                                                last:true
                                            });
                                        });

                                    });
                                } else {
                                   
                                    insertdta(db_sample,db_name,dta,res,db,files,mongo, function(){
                                        sio.sockets.emit('status_data', {
                                            msg: 'New site Url Is '+base_url, 
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
    
    function insertdta(db_sample,db_name,user_data,res,db,files,mongo,callback){
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
		if (files && files.site_logo && files.site_logo.name && files.site_logo.name != '') {
		        fs.readFile(files.site_logo.path, function(err, data) {
		            var image = files.site_logo.name;
		            var extension = image.split(".").pop();
		            var newimage = 'site-logo.' + extension;
		            var newPath = 'uploads/' + newimage;

		            fs.writeFile(newPath, data, function(err) {
		                if(err) console.log(err);
		            });

		        });
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

               // console.log('stderr: ' + stderr);
                if (error !== null) {
                  //  console.log('exec error: ' + error);
                }
                        
                var collection = db.collection('adminuser');
                collection.insert(user_data.user_data, function(err, inserted_data) {
                    if (err)
                        return console.error(err);

                    
                    var collection = db.collection('board');  
        collection.update(
                            {   'creator' : mongo.ObjectID('528da071b35661711a000001')   },
                            {'$set':{
                                'creator' : inserted_data[0]._id
                            }},
                        { multi: true },
                            function (errrr,data1) {
                                if (errrr) return handleError(errrr);
                              
         });

                    var collection = db.collection('site_settings');
                    collection.insert(user_data.settings, function(err, inserted_setting_data) {
                        
                        if (err)
                            return console.error(err);

                        	console.log('settings inserted !! ');

				fs.rename(sFolderPath, directory + '/_install', function(err) {
				    if (err) {
				        throw err;
					sio.sockets.emit('rename_err'); 				
					console.log('Please delete or rename your install directory to something else');
				    } else {
				    	console.log('install directory rename to _install');
				    }
				    var send_data ={
				        "res":1
				    }
				    res.send(send_data);
				    callback();
				});

                    });

                });
               
                

                
           
            });
    }

    app.post('/permissioncheck', function(req, res) {
        var cur_pat = path.join(__dirname);
        var app_path = cur_pat.replace('system/install', '');
        var check =0;
       
        var db_host = req.body.dbhost;
        var dbPort = '';
        var db_name = req.body.dbname;
        var dbUser = req.body.dbuser;
        var dbPass = req.body.dbpass;
         var data = {
            res:0
        };
         var mongo = require('mongodb');
        async.eachSeries(
            // Pass items to iterate over
            ['application/config/config.js', 'application/config/mongodb.js',
            'application/config/defines.js', 'uploads'],
            // Pass iterator function that is called for each item
            function(filename, cbk) {              
                fs.stat(app_path + filename, function(error, stats) {
                   
                    if (stats.mode != '33206' && stats.mode != '16895') {

                        data.res = 0;
                        check = 1;
                    } else{
                        data.res = 1;
                        check = 0;
                    }
                    cbk();
                    
                });
            },
            // Final callback after each item has been iterated over.
            function(err) {
                
                if(check == 0){
                    mongo.connect('mongodb://' + (db_host ? db_host : 'localhost') + ':' + (dbPort ? dbPort : '27017') + '/' + db_name, function(err, db) {
                       
                       if (err) {
                            data.res = 2;
                        } else {
                            data.res = 3;   
                        }
                        if (dbUser && dbPass) {
                            db.authenticate(dbUser, dbPass, function(err2, ress) {
                                if(err2){
                                    data.res = 2;
                                } else {
                                    data.res = 3;
                                }
                                res.send(data);
                            });
                        } else {
                            res.send(data);
                        }

                    });
                } else {
                    
                    res.send(data);
                }
            });
        
    
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
