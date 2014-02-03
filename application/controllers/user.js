/* 
 * User Operations 
 * The MIT License (MIT)
 * @category: cubetboard
 * @package pins
 * @version 2.0
 * @author Arya <arya@cubettech.com>
 * @Date 6-11-2013
 */

var UserModel = system.getModel('user');
var BoardModel = system.getModel('board');
var FollowerModel = system.getModel('follower');
var notificationModel = system.getModel('notification');
var im = require('imagemagick');
//var pinModel = system.getModel('pin');
system.loadHelper('pinHelper');
system.loadHelper('adminHelper');
system.getLibrary('helpRegister');
var crypto = require('crypto');

var userController = {
   
    /*
     * loads loginpage  
     * @author Arya <arya@cubettech.com>
     * @Date 6-11-2013
     */
    login: function(req, res) {
        UserModel.getLoginPage(function(data) {            
          var verify_message = req.session.mailverifymsg;
          req.session.mailverifymsg = null;
            var data = {
                'layout': 'login',
                'result': data,
                'msg':verify_message?verify_message:null
            };
            system.loadView(res, 'user/login', data);
            system.setPartial('user/signup', 'signupform');
            system.setPartial('user/forgot', 'forgotform');
        });

    },
    /*
     * login verification
     * @author Arya <arya@cubettech.com>
     * @Date 6-11-2013
     */
    logincheck: function(req, res)

    {
        //        pinModel.Pinlists1(function(callback){
        //            console.log(callback);
        //        });
        var crypto = require('crypto');

        var user_name = req.body.username;
        var user_pass = req.body.userpass + pass_salt;
        user_pass = crypto.createHash('md5').update(user_pass).digest("hex");
        var form_data = {
            "username": user_name,
            "password": user_pass
        };

        //console.log(req.body);

        UserModel.Usercheck(form_data, function(ress) {
            if (ress.length > 0)
            {

                req.session.login_user_name = ress[0].name;
                req.session.login_user_id = ress[0]._id.toHexString();
                req.session.loggedinfo = ress[0];


                sio.sockets.on('connection', function(socket)
                {
                    socket.on('socket_data', function(user_id) {
                        //  console.log(socket);
                        loggedUser['socket'] = socket.id;
                        var user_data = {
                            "user_id": user_id,
                            "socket_id": socket.id

                        }

                        //                    UserModel.pinLikeCheck(req.session.login_user_id,'528c79656a1167e117000001',function(callback){
                        //                        
                        //                    });

                        UserModel.UserSocketIdUpdate(user_data, function(resp) {

                            });
                    });
                });
                var data = {
                    "data": 1,
                    "user_id": ress[0]._id.toHexString()
                }
                
                res.send(data);
            }
            else
            {
                var data = {
                    "data": 0
                }
                res.send(data);
            }
        });



    },
    /*
     * logout and session clearance
     * @author Arya <arya@cubettech.com>
     * @Date 6-11-2013
     */
    logout: function(req, res) {

        var user_data = {
            "user_id": req.session.login_user_id,
            "socket_id": ""

        }
        //        var user_id = req.session.login_user_id;
        req.session.destroy(function() {

            UserModel.UserSocketIdRemove(user_data, function(resp)
            {
                res.redirect('/login');

            });
        });


    },
    /*
     * signup with email pageload
     * @author Arya <arya@cubettech.com>
     * @Date 6-11-2013
     */
    signup: function(req, res) {


        var data = {
            'pagetitle': 'Sign Up'
        };
        system.loadView(res, 'user/signup', data);
        system.setPartial('pins/pinheader', 'pinheader');
    },
    /*
     * user signup 
     * @author Arya <arya@cubettech.com>
     * @Date 6-11-2013
     */

    usersignup: function(req, res) {

        //console.log(req.body);

        //var formidable = require('formidable');
        var crypto = require('crypto');
        // var fs = require('fs');
        var dt = new Date();
        // var form = new formidable.IncomingForm();

        // form.parse(req, function(err, fields, files) {

        var name = req.body.name;
        var email = req.body.email;
        var username = req.body.username;
        var userpass = req.body.userpass + pass_salt;
        userpass = crypto.createHash('md5').update(userpass).digest("hex");
        var user_data = {
            "name": name,
            "email": email,
            "blocked": 0,
            "username": username,
            "password": userpass,
            "verified": 0,
            "time_created": dt.getTime()
        };

        UserModel.UserExistencecheck(email, function(res1)
        {

            if (res1 == 0)
            {

                UserModel.UserInsertion(user_data, function(ress) {

                    if (ress)
                    {
                        //                            fs.readFile(files.userimage.path, function(err, data) {
                        //                                var image = files.userimage.name;
                        //                                var extention = image.split(".").pop();
                        //                                var newimage = ress._id + '.' + extention;
                        //                                var newPath = user_images + '/' + newimage;
                        //
                        //                                fs.writeFile(newPath, data, function(err) {
                        //
                        var user_profile_data = {
                            "pic": "",
                            "user_id": ress[0]._id
                        };

                        UserModel.UserProfileInsertion(user_profile_data, function(res1) {

                            if (res1)
                            {


                                UserModel.InitialSettings(ress[0]._id, function(callback)
                                {



                                    var html = '<b>Hi ' + name + ', </b><br/>' + 'Please use the below link for your account activation.<br/>\n\
                                     <a href="' + sleekConfig.siteUrl + '/mailverify?mail=' + email + '">' + sleekConfig.siteUrl + '/mailverify?mail=' + email + '</a>                                  ';
                                   
                                    //                                 
                                    var maildata = {
                                        mailcontent:{
                                            "subject": "Mail Verification",
                                            "body":html
                                        },
                                        "tomail": email,
                                        "html"  : html,
                                        "subject": "Mail Verification"
                                    }

                                    HELPER.socketNotification('', 'notification', html, maildata, true);
                                    //HELPER.setFlashMessage('Please check email to verify the email account', 'success');
                                    var response ={
                                        "res":1
                                    };
                                    res.send(response);
                                ////                                        }
                                ////
                                ////                                    });
                                //
                                //                                });
                                //
                                //                            });
                                })
                            }else{
                                var response ={
                                    "res":0
                                };
                                res.send(response);
                            }
                        });
                    }


                });
       
            }
            else
            {
                console.log('already registered');
  
                HELPER.setFlashMessage('Already registered user', 'danger');
                res.redirect('/login');
            /*var response ={
                    "res":'registered'
                };
                res.send(response);*/
            }
        });
    // });

    },
    /*
     * facebook initialization with app details
     * @author Arya <arya@cubettech.com>
     * @Date 6-11-2013
     */

    socialsignup: function(req, res) {

        var fb = require('facebook-js');
        res.redirect(fb.getAuthorizeUrl({
            client_id: DEFINES.FB_APP_ID,
            redirect_uri: sleekConfig.siteUrl + '/auth',
            display: 'popup',
            scope: 'offline_access,publish_stream,email'
        }));



    },
    
    /*
     * facebook login/sign up authentication     
     * @author Arya <arya@cubettech.com>
     * @Date 6-11-2013
     */
    auth: function(req, res) {
        var fb = require('facebook-js');
        var Facebook = require('facebook-node-sdk');
        fb.getAccessToken(DEFINES.FB_APP_ID, DEFINES.FB_APP_SECRET, req.param('code'), sleekConfig.siteUrl + '/auth', function(error, access_token, refresh_token) {

            var facebook = new Facebook({
                appId: DEFINES.FB_APP_ID, 
                secret: DEFINES.FB_APP_SECRET
            }).setAccessToken(access_token);

            facebook.api('/me?fields=picture,email,name,location,first_name,last_name', function(err, data) {

                userController.fbdatasave(data, req, res);
            });
        });


    },
    
    
    /*
     * store the data from facebook to db     
     * @author Arya <arya@cubettech.com>
     * @Date 6-11-2013
     */


    fbdatasave: function(form_data, req, res)
    {
        var dt = new Date();
        var crypto = require('crypto');
        var location = '';
        var user_image = '';
        var fs = require("fs");
        var http = require("http");

        UserModel.UserExistencecheck(form_data.email, function(res1) {

            if (res1 == 0)
            {
                crypto.randomBytes(3, function(ex, buf) {
                    
                    var pwd = buf.toString('hex');
                    //              
                    var myString = pwd + pass_salt;
                    var pass = crypto.createHash('md5').update(myString).digest("hex");
                    var user_data = {
                        "name": form_data.name,
                        "email": form_data.email,
                        "username": form_data.email,
                        "password": pass,
                        "verified": 1,
                        "blocked": 0,
                        "time_created": dt.getTime()
                    };
                    UserModel.UserInsertion(user_data, function(ress) {

                        if (ress)
                        {

                            req.session.login_user_name = ress[0].name;
                            req.session.login_user_id = ress[0]._id.toHexString();

                            UserModel.InitialSettings(ress[0]._id, function(callback) {
                            
                                var html = '<b>Hi ' + form_data.name + ', </b><br/>Your CubetBoard User name and password.<br/>\n\
                                     UserName: '+form_data.email+' <br/>\
                                     Password: '+pwd+' <br/>   ';
        
                                   
                                //                                 
                                var maildata = {
                                    mailcontent:{
                                        "subject": "Login details",
                                        "body":html
                                    },
                                    "tomail": form_data.email,
                                    "html"  : html,
                                    "subject": "Login details"
                                }

                                HELPER.socketNotification('', 'notification', html, maildata, true);
                                       
                                      
                                sio.sockets.on('connection', function(socket)
                                {
                                    socket.on('socket_data', function(user_id) {
                                        //  console.log(socket);
                                        loggedUser['socket'] = socket;
                                        var user_data = {
                                            "user_id": user_id,
                                            "socket_id": socket.id

                                        }

                                        //                    UserModel.pinLikeCheck(req.session.login_user_id,'528c79656a1167e117000001',function(callback){
                                        //                        
                                        //                    });

                                       UserModel.UserSocketIdUpdate(user_data, function(resp) {

                                            });
                                   });
                                });
                                if (form_data.location)
                                {
                                    location = form_data.location.name;
                                }



                                if (form_data.picture.data.url)
                                {
                                    var image_path = form_data.picture.data.url;
                                    image_path = image_path.replace('https://', 'http://');
                                    var img_ext = image_path.split('.').pop(); // get image extension from function
                                    user_image = ress[0]._id + '.' + img_ext;


                                    http.get(image_path, function(res2) {
                                        var imagedata = '';
                                        res2.setEncoding('binary')
                                        res2.on('data', function(chunk) {
                                            imagedata += chunk

                                        });
                                        res2.on('end', function() {
                                            var uploadedPath = DEFINES.USER_IMAGE_PATH + user_image;
                                            fs.writeFile(uploadedPath, imagedata, 'binary', function(err) {

                                                if (err)
                                                    console.log(err);

                                                im.resize({
                                                    srcPath: DEFINES.USER_IMAGE_PATH + user_image,
                                                    dstPath: DEFINES.USER_IMAGE_PATH + user_image,
                                                    width: DEFINES.USER_IMAGE_WIDTH

                                                }, function(err, stdout, stderr) {

                                                    if (err)
                                                        throw err;
                                                    //console.log('resized');
                                                });
                                                im.resize({
                                                    srcPath: DEFINES.USER_IMAGE_PATH + user_image,
                                                    dstPath: DEFINES.USER_IMAGE_PATH + 'thumb/' + user_image,
                                                    width: '30'

                                                }, function(err, stdout, stderr) {

                                                    if (err)
                                                        throw err;
                                                    //console.log('resized');
                                                });

                                                var user_profile_data = {
                                                    "firstname": form_data.first_name,
                                                    "lastname": form_data.last_name,
                                                    "location": location,
                                                    "user_id": ress[0]._id,
                                                    "pic": user_image
                                                };

                                                UserModel.UserProfileInsertion(user_profile_data, function(res3) {

                                                    if (res3)
                                                    {
                                                        res.redirect('/closeSignup');
                                                    }

                                                });

                                            });
                                        });
                                    });

                                }

                                else {
                                    var user_profile_data = {
                                        "firstname": form_data.first_name,
                                        "lastname": form_data.last_name,
                                        "location": location,
                                        "user_id": ress[0]._id,
                                        "pic": ""
                                    };
                            

                                    UserModel.UserProfileInsertion(user_profile_data, function(res3) {

                                        if (res3)
                                        {
                                  
                                                
                                            res.redirect('/closeSignup');
                                       
                                        }

                                    });
                                }
                            });
                     
                        }


                    });
                });
            }

            else
            {

                req.session.login_user_name = res1[0].name;
                req.session.login_user_id = res1[0]._id.toHexString();
                sio.sockets.on('connection', function(socket)
                {
                    socket.on('socket_data', function(user_id) {
                        //  console.log(socket);
                        loggedUser['socket'] = socket;
                        var user_data = {
                            "user_id": user_id,
                            "socket_id": socket.id

                        }

                        //                    UserModel.pinLikeCheck(req.session.login_user_id,'528c79656a1167e117000001',function(callback){
                        //                        
                        //                    });

                        UserModel.UserSocketIdUpdate(user_data, function(resp) {

                            });
                    });
                });
                res.redirect('/closeSignup');
            }

        });
    },
   
    /*
     * twitter initialization 
     * @author Arya <arya@cubettech.com>
     * @Date 6-11-2013
     */

    twittersignup: function(req, res) {

        var twitterAPI = require('node-twitter-api');
        var twitter = new twitterAPI({
            consumerKey: DEFINES.TW_CONS_KEY,
            consumerSecret: DEFINES.TW_CONS_SECRET,
            callback: sleekConfig.siteUrl + '/twitterauth'

        });
        twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
            if (error) {
                console.log("Error getting OAuth request token : " + error);
            } else {
                //console.log(requestToken);
                req.session.reqtoken = requestToken;
                req.session.reqtokensecret = requestTokenSecret;
                res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + requestToken + '');
            }
        });
    },
   
    /*
     * Authentication in twitter login/sign up
     * @author Arya <arya@cubettech.com>
     * @Date 7-11-2013
     */
    twitterauth: function(req, res) {

        var twitterAPI = require('node-twitter-api');
        var twitter = new twitterAPI({
            consumerKey: DEFINES.TW_CONS_KEY,
            consumerSecret: DEFINES.TW_CONS_SECRET,
            callback: sleekConfig.siteUrl + '/twitterauth'

        });

        twitter.getAccessToken(req.session.reqtoken, req.session.reqtokensecret, req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
            if (error) {
                console.log(error);
            } else {
                twitter.verifyCredentials(accessToken, accessTokenSecret, function(error, data, response) {
                    if (error) {
                        console.log(error);
                    } else {

                        req.session.twitter_data = data;
                        UserModel.TwitterUserExistencecheck(data.id, function(res1) {
                            if (res1 == 0)
                            {
                                userController.getuserdetails(req, res);
                            }
                            else {
                                userController.twitterdatasave(res1[0].email, req, res);
                            }
                        });
                    //console.log(data);
                    }
                });
            }
        });




    },
    /*
     * close the facebook and twitter signup window
     * @author Robin <robin@cubettech.com>
     * @Date 20-11-2013
     */
    closeSignup: function(req, res) {
        
        system.loadView(res, 'user/wincloser', {
            layout: false, 
            user_id: req.session.login_user_id
        })
    },
    /*
     * get user email on twitter login pag eload
     * @author Arya <arya@cubettech.com>
     * @Date 8-11-2013
     */

    getuserdetails: function(req, res) {

        var data = {
            'pagetitle': 'User Credential'
        };
        system.loadView(res, 'user/getuser', data);
        system.setPartial('pins/pinheader', 'pinheader');

    },
    /*
     * get user email on twitter login 
     * @author Arya <arya@cubettech.com>
     * @Date 8-11-2013
     */
    twitteruser: function(req, res) {

        var formidable = require('formidable');

        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {

            var useremail = fields.useremail;
            userController.twitterdatasave(useremail, req, res);
        });



    },
    
    /*
     * store the data available from twitter in db
     * @author Arya <arya@cubettech.com>
     * @Date 8-11-2013
     */
    twitterdatasave: function(useremail, req, res)
    {
        var dt = new Date();
        var crypto = require('crypto');
        var form_data = req.session.twitter_data;
        var user_image = '';
        var fs = require("fs");
        var http = require('http');
        UserModel.UserExistencecheck(useremail, function(res1) {
            if (res1 == 0)
            {
                crypto.randomBytes(3, function(ex, buf) {
                    
                    var pwd = buf.toString('hex');
                    //              
                    var myString = pwd + pass_salt;

                    var pass = crypto.createHash('md5').update(myString).digest("hex");
                    var user_data = {
                        "name": form_data.name,
                        "email": useremail,
                        "username": useremail,
                        "password": pass,
                        "verified": 0,
                        "blocked": 0,
                        "twitter_id": form_data.id,
                        "time_created": dt.getTime(),
                    };

                    UserModel.UserInsertion(user_data, function(ress) {

                        if (ress)
                        {

//                            req.session.login_user_name = ress[0].name;
//                            req.session.login_user_id = ress[0]._id.toHexString();

                            UserModel.InitialSettings(ress[0]._id, function(callback) {
                          
                                var html = '<b>Hi ' + form_data.name + ', </b><br/>' + 'Please use the below link for your account activation.<br/>\n\
                                     <a href="' + sleekConfig.siteUrl + '/mailverify?mail=' + useremail + '">' + sleekConfig.siteUrl + '/mailverify?mail=' + useremail + '</a>                                  ';
                                   
                                //                                 
                                var maildata = {
                                    mailcontent:{
                                        "subject": "Mail Verification",
                                        "body":html,
                                    },
                                    "tomail": useremail,
                                    "html"  : html,
                                    "subject": "Mail Verification"
                                }

                                HELPER.socketNotification('', 'notification', html, maildata, true);
                          
                                var html = '<b>Hi ' + form_data.name + ', </b><br/>Your CubetBoard User name and password.<br/>\n\
                                     UserName: '+useremail+' <br/>\
                                     Password: '+pwd+' <br/>   ';
        
                                   
                                //                                 
                                var maildata = {
                                    mailcontent:{
                                        "subject": "Login details",
                                        "body":html,
                                    },
                                    "tomail": useremail,
                                    "html"  : html,
                                    "subject": "Login details"
                                }

                                HELPER.socketNotification('', 'notification', html, maildata, true);
                                  
                                       req.session.mailverifymsg = 'Please check your mailbox';  
//                                sio.sockets.on('connection', function(socket)
//                                {
//                                    socket.on('socket_data', function(user_id) {
//                                        //  console.log(socket);
//                                        loggedUser['socket'] = socket;
//                                        var user_data = {
//                                            "user_id": user_id,
//                                            "socket_id": socket.id
//
//                                        }
//
//                                        //                    UserModel.pinLikeCheck(req.session.login_user_id,'528c79656a1167e117000001',function(callback){
//                                        //                        
//                                        //                    });
//
////                                        UserModel.UserSocketIdUpdate(user_data, function(resp) {
////
////                                            });
//                                    });
//                                });

                                if (form_data.profile_image_url)
                                {
                                    var image_path = form_data.profile_image_url;
                                    var img_ext = image_path.split('.').pop(); // get image extension from function
                                    user_image = ress[0]._id + '.' + img_ext;


                                    http.get(image_path, function(res2) {
                                        var imagedata = '';
                                        res2.setEncoding('binary')
                                        res2.on('data', function(chunk) {
                                            imagedata += chunk

                                        });
                                        res2.on('end', function() {
                                            var uploadedPath = DEFINES.USER_IMAGE_PATH + user_image;
                                            fs.writeFile(uploadedPath, imagedata, 'binary', function(err) {

                                                if (err)
                                                    console.log(err);

                                                im.resize({
                                                    srcPath: DEFINES.USER_IMAGE_PATH + user_image,
                                                    dstPath: DEFINES.USER_IMAGE_PATH + user_image,
                                                    width: DEFINES.USER_IMAGE_WIDTH

                                                }, function(err, stdout, stderr) {

                                                    if (err)
                                                        throw err;
                                                    //console.log('resized');
                                                });
                                                im.resize({
                                                    srcPath: DEFINES.USER_IMAGE_PATH + user_image,
                                                    dstPath: DEFINES.USER_IMAGE_PATH + 'thumb/' + user_image,
                                                    width: '30'

                                                }, function(err, stdout, stderr) {

                                                    if (err)
                                                        throw err;
                                                    //console.log('resized');
                                                });

                                                var user_profile_data = {
                                                    "firstname": form_data.name,
                                                    "location": form_data.location,
                                                    "user_id": ress[0]._id,
                                                    "pic": user_image
                                                };

                                                UserModel.UserProfileInsertion(user_profile_data, function(res3) {

                                                    if (res3)
                                                    {
                                                
                                                        res.redirect('/closeSignup');
                                                  
                                                    }

                                                });

                                            });
                                        });
                                    });
                                }

                                else {

                                    var user_profile_data = {
                                        "firstname": form_data.name,
                                        "location": form_data.location,
                                        "user_id": ress[0]._id,
                                        "pic": ""
                                    };

                                    UserModel.UserProfileInsertion(user_profile_data, function(res3) {

                                        if (res3)
                                        {

                                            res.redirect('/closeSignup');
                                        }

                                    });
                                }
                            });
                        }

               
                    });
                });
            }

            else
            {
                req.session.login_user_name = res1[0].name;
                req.session.login_user_id = res1[0]._id.toHexString();
                sio.sockets.on('connection', function(socket)
                {
                    socket.on('socket_data', function(user_id) {
                        //  console.log(socket);
                        loggedUser['socket'] = socket;
                        var user_data = {
                            "user_id": user_id,
                            "socket_id": socket.id

                        }

                        //                    UserModel.pinLikeCheck(req.session.login_user_id,'528c79656a1167e117000001',function(callback){
                        //                        
                        //                    });

                        UserModel.UserSocketIdUpdate(user_data, function(resp) {

                            });
                    });
                });
                res.redirect('/closeSignup');
            }

       
        });
    },
    userList: function(req, res)

    {
        UserModel.SelectedUser(req.session.login_user_id, function(user) {
            var data = {
                'data': user,
                'pagetitle': 'Users',
                'logged_user': req.session.login_user_id

            };

            system.loadView(res, 'user/userlist', data);
            system.setPartial('pins/pinheader', 'pinheader');
        //system.setPartial('user/userdetail', 'userdetail');


        });


    },
     /*
     * follow user
     * @author Arya <arya@cubettech.com>
     * @Date 8-11-2013
     */
    followUser: function(req, res) {

        var insert_data =
        {
            "follower_id": req.body.board_id,
            "followed_by": req.session.login_user_id,
            "time": new Date().getTime(),
            "followed_by_name": req.session.login_user_name,
            "follow_type": "user"
        }
        FollowerModel.followerCheck(insert_data, function(res1) {

            if (res1)
            {
                FollowerModel.insertFollower(insert_data, function(ress) {
                    if (ress)
                    {
                        var msg = insert_data.followed_by_name + " followed you";

                        UserModel.getUserSocketId(req.body.board_id, function(user) {


                            var notification_data =
                            {
                                key: "user_follow"
                                , 
                                notification_generator:  mongo.ObjectID(req.session.login_user_id)
                                , 
                                notification_acceptor:  mongo.ObjectID(req.body.board_id)
                                , 
                                notification: msg
                                , 
                                status: 1
                            }
                            //console.log(user[0].socket_id);
                            UserModel.UserSettings(user[0]._id.toHexString(), function(settings){
                                if(settings[0] && settings[0].follow==1){
                                    HELPER.socketNotification(user[0].socket_id, 'notification', msg, '', false);
                                }
                                else{
                                    notification_data.status=0;  
                                }
                                notificationModel.NotificationInsertion(notification_data, function(callback) {

                                    });
                            });
                           
                            var data = {
                                "data": "inserted"
                            };
                            res.send(200, data);
                        });
                    }
                });
            }
            else
            {
                console.log('already followed');
            }
        });
    },
    /*
     * mail verification message on sign up
     * @author Arya <arya@cubettech.com>
     * @Date 8-11-2013
     */
    mailVerification: function(req, res) {
        var email = req.query.mail;      
        UserModel.UserMailVerification(email, function(callback) {
             req.session.mailverifymsg = 'Now you can login with your credentials';
            //HELPER.setFlashMessage('Now you can Login with Your credentials', 'danger', 'success');
            res.redirect('/login');
        })
    },
     /*
     * set initial settings on signup
     * @author Arya <arya@cubettech.com>
     * @Date 8-11-2013
     */
    Settings: function(req, res) {
        BoardModel.getBoardAll(function(result) {
            UserModel.UserSettings(req.session.login_user_id, function(settings)
            {
                UserModel.userDetails(req.session.login_user_id, function(details) {

                    var data = {
                        'pagetitle': 'Change Settings',
                        'layout':false,
                        'settings': settings,
                        'userdetail': details,
                        'loiginuser': req.session.login_user_name,
                        'loggeduser_id': req.session.login_user_id,
                        boards: result,
                        'user_image': details[0].image
                    };
                    system.loadView(res, 'pins/settings', data);

                //system.setPartial('pins/pinheader', 'pinheader');
                });
            });
        });

    },
     /*
     * change user settings
     * @author Arya <arya@cubettech.com>
     * @Date 15-11-2013
     */
    changeSettings: function(req, res)
    {

        var fs = require('fs');
        var crypto = require('crypto');
        var formidable = require('formidable');
        var user_id = req.session.login_user_id;
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {

            var comment = fields.comment ? 1 : 0;
            var like = fields.like ? 1 : 0;
            var follow = fields.follow ? 1 : 0;

            var comment = fields.comment ? 1 : 0;
            var like = fields.like ? 1 : 0;
            var follow = fields.follow ? 1 : 0;
            var user_data = {
                "name": fields.name
            };

            if (fields.pword)
            {
                var userpass = fields.pword + pass_salt;
                userpass = crypto.createHash('md5').update(userpass).digest("hex");
                user_data.password = userpass;
            }
            var update_data = {
                "user_id": mongo.ObjectID(req.session.login_user_id),
                "comment": comment,
                "like": like,
                "follow": follow
            };
            UserModel.updateSettings(update_data, function(update) {
                if (update)
                {

                    UserModel.updateuser(user_data, user_id, function(updateuser) {
                        req.session.login_user_name = user_data.name;
                        if (files.image_src.name)
                        {
                            fs.readFile(files.image_src.path, function(err, data) {
                                var image = files.image_src.name;

                                var extention = image.split(".").pop();
                                var newimage = user_id + '.' + extention;

                                var newPath = DEFINES.USER_IMAGE_PATH + newimage;
                                fs.writeFile(newPath, data, function(err) {

                                    im.resize({
                                        srcPath: DEFINES.USER_IMAGE_PATH + newimage,
                                        dstPath: DEFINES.USER_IMAGE_PATH + newimage,
                                        width: DEFINES.USER_IMAGE_WIDTH

                                    }, function(err, stdout, stderr) {

                                        if (err)
                                            throw err;
                                        //console.log('resized');
                                    });
                                    im.resize({
                                        srcPath: DEFINES.USER_IMAGE_PATH + newimage,
                                        dstPath: DEFINES.USER_IMAGE_PATH + 'thumb/' + newimage,
                                        width: '30'

                                    }, function(err, stdout, stderr) {

                                        if (err)
                                            throw err;
                                        //console.log('resized');
                                    });
                                    var user_profile_data = {
                                        "pic": newimage,
                                        "user_id": user_id,
                                        "location": ""
                                    };



                                    UserModel.UserProfileUpdate(user_profile_data, user_id, function(res1) {

                                        if (res1)
                                        {

                                            fs.unlink(files.image_src.path);
                                            res.redirect('back');
                                        }
                                    });


                                });

                            });
                        }
                        else
                        {
                            res.redirect('back');
                        }
                    });
                }

            // res.redirect('/pins');

            });
        });
    },
    /**
     * forgot form action
     * @author  : Rahul P R <rahul.pr@cubetech.com>'
     * @date    : 4-Dec-2013
     * 
     */
    forgotaction: function(req, res) {
        var usermail = req.body.email;
        var re = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i ;
        var valid_email =re.test(usermail) ;
        if (usermail == '') {
            var data = {
                status: '0', 
                msg: 'Enter your email.'
            };
            res.send(data);
        } else if( ! valid_email ){
            var data = {
                status : '0' ,
                msg : 'Enter valid email.'
            }; 
            res.send(data);
        } else {
            UserModel.UserExistencecheck(usermail, function(user) {
                if (user == 0) {
                    //user does'nt exist
                    var data = {
                        status: '0', 
                        msg: 'User does not exist.'
                    };
                    res.send(data);
                //HELPER.setFlashMessage('User does not exist.');
                } else {
                    //user exists
                    var crypto = require('crypto');
                    crypto.randomBytes(3, function(ex, buf) {
                        var pwd = buf.toString('hex');
                        var user_pass = pwd + pass_salt;
                        user_pass = crypto.createHash('md5').update(user_pass).digest("hex");
                        var data = {
                            //'_id' : user[0]._id,
                            //'email': user[0].email,
                            //'username': user[0].username,
                            'password': user_pass
                        };
                        //console.log(data);
                        UserModel.updateuser2(user[0]._id, data, function(updated) {
                            if (updated == 1) {
                                var html = '<b>Hi ' + user[0].name + ', </b><br/> \
                              Your cubetboard password has been reset successfully.<br/>\
                              New password is :<b>' + pwd + '</b>';
                                // setup e-mail data with unicode symbols
                                var mailOptions = {
                                    from: "CubetboardV2 <info@cubettech.com>", // sender address
                                    to: usermail, // list of receivers
                                    subject: "Cubetboard Password Reset", // Subject line
                                    html: html // html body
                                }
                                sendMail(mailOptions, function(error, response) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log("Message sent: " + response.message);
                                    }
                                });
                                var data = {
                                    status: '1',
                                    msg: 'Password reset successful. Check your mailbox.'
                                };

                                res.send(data);
                            // HELPER.setFlashMessage('User does not exist.', 'danger', 'Error');
                            } else {
                        // not updated      
                        }
                        });
                    });

                }//else 
            });
        }
    },
     /*
     * share pin functionality
     * @author Arya <arya@cubettech.com>
     * @Date 8-11-2013
     */
    socialShare: function(req, res) {

        var share = require('social-share');
        var url = share(req.query.service, req.query);

        res.redirect(url);
    },
    /*
     * username existence check
     * @author Arya <arya@cubettech.com>
     * @Date 7-11-2013
     */
    userNameChack:function(req,res){
        var username = req.body.username;
        
        UserModel.UserValidation(username, function(ress)
        {
            if(ress.length!=0)
            {
                var data={
                    "res":1
                };
            }
            else{
                var data={
                    "res":0
                }; 
            }
            res.send(data);
        });
        
    },
    /*
     * user existence check using email
     * @author Arya <arya@cubettech.com>
     * @Date 7-11-2013
     */
    EmailValidation:function(req,res){
        var email = req.body.email;
        
        UserModel.UserExistencecheck(email, function(ress)
        {
            //console.log(ress.length);
            if(ress.length!=0)
            {
                var data={
                    "res":1
                };
            }
            else{
                var data={
                    "res":0
                }; 
            }
            res.send(data);
        });
        
    },
    /*
     * unfollow user
     * @author Arya <arya@cubettech.com>
     * @Date 10-11-2013
     */
    unFollowUser: function(req, res) {

        var insert_data =
        {
            "follower_id": req.body.board_id,
            "followed_by": req.session.login_user_id,
            "follow_type": "user"
        }
        FollowerModel.BoardUnfollow(insert_data, function(remove) {
            var data = {
                "data": "removed"
            };
            res.send(200, data);
        })
    }
    
}



module.exports = userController;

