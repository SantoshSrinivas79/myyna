/* 
 * Pin Operations 
 * The MIT License (MIT)
 * @category: cubetboard
 * @package pins
 * @version 2.0
 * @author Arya <arya@cubettech.com>
 * @Date 28-10-2013
 */



var PostModel = system.getModel('pin');
var pinModel = system.getModel('imagepin');
var boardModel = system.getModel('board');
var UserModel = system.getModel('user');
var followerModel = system.getModel('follower');
var notificationModel = system.getModel('notification');
var shareModel = system.getModel('pinShare');
var catModel = system.getModel('category');
var msg = '';
system.loadHelper('pinHelper');
system.loadHelper('myhelper');
system.getLibrary('helpRegister');
var i = 0;
var check = 0;
var pinController = {
   
   
   
    /*
     * loads pin page     
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     */
    
    list: function(req, res) {
        //list all categories
        catModel.getCategoryAll(function(result) {
            //list all pins
            PostModel.Pinlists(req.session.login_user_id, function(person) {
                //get the details of the looged in user
                UserModel.userDetails(req.session.login_user_id, function(user) {
                    //list the unread notifications of the user
                    notificationModel.userUnreadnotifications(req.session.login_user_id, function(notifications) {
                        req.session.login_user_img = user[0].image;
                        var data = {
                            'data': person,
                            'pagetitle': 'Pins',
                            'notifications': notifications,
                            'notification_count': notifications.length,
                            'loiginuser': req.session.login_user_name,
                            'loggeduser_id': req.session.login_user_id,
                            category: result,
                            layout: 'default',
                            type: 'list',
                            'user_image': user[0].image
                        };


                        system.loadView(res, 'pins/pin', data);
                        system.setPartial('pins/pinheader', 'pinheader');
                        system.setPartial('pins/imagePinView', 'pinviewimage');
                        system.setPartial('pins/audioPinView', 'pinviewaudio');
                        system.setPartial('pins/webaudioPinView', 'pinviewwebaudio');
                        system.setPartial('pins/webPinView', 'pinvieweb');
                        system.setPartial('pins/videoPinView', 'pinviewvideo');
                    

                    });
                });
            });

        });
    },
    /*
     * loads most liked pins     
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     */
    mostLike: function(req, res) {
        //return all categories
        catModel.getCategoryAll(function(result) {
            //return pins in descending order of number of likes
            PostModel.PinMostLiked(req.session.login_user_id, function(person) {
                //get the details of the looged in user
                UserModel.userDetails(req.session.login_user_id, function(userdata) {
                    //console.log(result);
                    //console.log(person);
                    
                    var data = {
                        'data': person,
                        'pagetitle': 'Most Liked',
                        'loiginuser': req.session.login_user_name,
                        'loggeduser_id': req.session.login_user_id,
                        'type': 'like',
                        'layout': 'default',
                        'category': result,
                        'user_image': userdata[0].image
                    };



                    system.loadView(res, 'pins/pin', data);
                    system.setPartial('pins/pinheader', 'pinheader');
                    system.setPartial('pins/imagePinView', 'pinviewimage');
                    system.setPartial('pins/audioPinView', 'pinviewaudio');
                    system.setPartial('pins/webaudioPinView', 'pinviewwebaudio');
                    system.setPartial('pins/webPinView', 'pinvieweb');
                    system.setPartial('pins/videoPinView', 'pinviewvideo');
                


                // });
                });
            //       }
            });

        });
    },
    /*
     * loads most repinned pins     
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     */
    mostRepin: function(req, res) {
        //return all categories
        catModel.getCategoryAll(function(result) {
            //return pins in descending order of number of repins
            PostModel.PinMostRepinned(req.session.login_user_id, function(person) {
                //get the details of the looged in user
                UserModel.userDetails(req.session.login_user_id, function(userdata) {

                    var data = {
                        'data': person,
                        'pagetitle': 'Most Repinned',
                        'loiginuser': req.session.login_user_name,
                        'loggeduser_id': req.session.login_user_id,
                        'type': 'repin',
                        'layout': 'default',
                        'category': result,
                        'user_image': userdata[0].image
                    };



                    system.loadView(res, 'pins/pin', data);
                    system.setPartial('pins/pinheader', 'pinheader');
                    system.setPartial('pins/imagePinView', 'pinviewimage');
                    system.setPartial('pins/audioPinView', 'pinviewaudio');
                    system.setPartial('pins/webaudioPinView', 'pinviewwebaudio');
                    system.setPartial('pins/webPinView', 'pinvieweb');
                    system.setPartial('pins/videoPinView', 'pinviewvideo');
                // system.setPartial('pins/popup', 'popup');


               
                });
           
            });

        });
    },
    /*
     * page scrolling functionality    
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     */
    morepins: function(req, res) {
        //set start and end limits for taking data from db
        var start = req.body.startlimit ? req.body.startlimit : 0;
        var end = req.body.endlimit ? req.body.endlimit : 15;
        //specify the type of listing
        var list = req.params.list ? req.params.list : 'list';
        //specify the boardid/categoryid/userid for board/category/user based pin listing 
        var list_id = req.body.type_id ? req.body.type_id : '';
        //return the pins of the specified type of listing
        PostModel.morePinlists(req.session.login_user_id, start, end, list,list_id, function(person) {
            //console.log(person);
            var data = {
                'data': person,
                'layout': false
            };
            if (person)
            {
                //console.log(person);
                if (req.body.dataMode && req.body.dataMode == 1) {
                    res.send(data);
                } else {
                    system.loadView(res, 'pins/moredata', data);
                }

            }
            else
            {
                //empty response
                res.send('no response');
            }
        });
    },
    /**
     
     
     *loads the html page of pin operation
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     */
    webpin: function(req, res) {

        //form with upload functionality
        var formidable = require('formidable');
        // return allunblocked boards
        boardModel.getBoardAll(function(boards) {

            var data = {
                'pagetitle': 'Pin page', 
                'boards': boards
            };
            system.loadView(res, 'pins/webpin', data);
            system.setPartial('pins/pinheader', 'pinheader');

        });

    },
    /*       
     
     *screenshot creation (webshot) and resizing(imagemagick)
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     
     */

    pins: function(req, res)
    {

        var fs = require("fs");
      
        var youtube = require('youtube-feeds');
        var time = new Date().getTime();
        var user_id = req.session.login_user_id;
        
        var fields = req.body ;

             
        var pin_cat = fields.pin_cat;
        var form_data = {
            'blocked':0,
            "time": time,
            "url": fields.url,
            "board": fields.board_id,
            "description": fields.description,
            "userid": user_id,
            "logged_user": req.session.login_user_name
        };

        if (pin_cat == "webpage")
        {
            pinController.pin_webpage(form_data, req, res);
        }
        else if (pin_cat == "video")
        {
            if (fields.url)
                pinController.pin_video(fields, req, res);
        /*else
                {
                    pinController.pin_localvideo(fields, files, req, res);
                }*/
        }
    //});


    },
    
    /*webpage pin operation
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013*/
    
    pin_webpage: function(form_data, req, res)
    {
        //webshot creates the screen shot of the page
        var webshot = require('webshot');
        var im = require('imagemagick');
        var gm = require('gm');
        var time = form_data.time;
        var url = form_data.url;
        var board = form_data.board;
        var user = form_data.userid;
        var loggeduser = form_data.logged_user;
        var imagename = time + '.png';
        var options = {
            screenSize: {
                width: 'all', 
                height: 'all'
            }
        }
        
        var webshot_options = {
            renderDelay:5000
        }
        // save and resize the webpage screenshot based on size requirement
       
        webshot(url, DEFINES.IMAGE_PATH_REL + time + '.png', webshot_options, function(err) {
            if (err)
                console.log(err)
               
            im.identify(DEFINES.IMAGE_PATH_REL + time + '.png', function(err, features) {

                if (err)
                    throw err
               
                if (features.width >= '415')
                {
                   
                    im.resize({
                        srcPath: DEFINES.IMAGE_PATH_REL + time + '.png',
                        dstPath: DEFINES.IMAGE_PATH_REL + 'small/' + time + '.png',
                        width: '415'
                    }, function(err, stdout, stderr) {

                        if (err)
                            throw err;
                        //console.log('resized');
                    });
                }

                else
                {
                    im.resize({
                        srcPath: DEFINES.IMAGE_PATH_REL + time + '.png',
                        dstPath: DEFINES.IMAGE_PATH_REL + 'small/' + time + '.png',
                        width: '200'
                    }, function(err, stdout, stderr) {

                        if (err)
                            throw err;
                       // console.log('resized');
                    });
                }

                im.resize({
                    srcPath: DEFINES.IMAGE_PATH_REL + time + '.png',
                    dstPath: DEFINES.IMAGE_PATH_REL + 'thumb/' + time + '.png',
                    width: '20%'
                }, function(err, stdout, stderr) {

                    if (err)
                        throw err;
                    //console.log('resized');
                    // details of pin to save
                    var insert_data = {
                        "board_id": mongo.ObjectID(board),
                        "image_name": imagename,
                        "pin_type": "web_page", // videotype
                        "pin_url": url,
                        "source_url": url,
                        "time": time,
                        "user_id": mongo.ObjectID(user), //logged user_id              
                        "description": form_data.description,
                        'blocked':0
                    };
                    // insert pin details 
                    PostModel.PinCreation(insert_data, function(ress) {
                        ress[0].popStatus = '1' ;
                        ress[0].pinlike=1;
                        ress[0].loggeduser_id = user;
                        ress[0].creator_name = req.session.login_user_name;
                        ress[0].creator_image = req.session.login_user_img;
                        var template = system.getCompiledView('pins/webPinView', ress[0]);
                        // socket to add the created pin on the listing page
                        boardModel.getCategoryByBoardId(board,function(catdetails){
                            ress[0].category_id = catdetails.category_id ? catdetails.category_id: ''
                            sio.sockets.emit('pageview', {
                                pin_type: 'web_page',
                                str: template,
                                data:ress[0]
                            });
                        });
                        //get the creator of the board
                        boardModel.boardCreator(user, board, function(boarddata) {

                            // console.log(boarddata);
                            //check wether the logged user and creator are same or not
                            if (boarddata.length > 0)
                            {
                                if (boarddata && (user != boarddata[0]._id))
                                {
                                    //messages of mail and instant notification
                                    var html = '<b>Hi ' + boarddata[0].value.name + ', </b><br/>' + loggeduser + ' Creates a pin using your board.<br/>';
                                    var instant_msg = loggeduser + ' Creates a pin using your board.';
                                    var maildata = {
                                        mailcontent: {
                                            "subject": "Board Usage",
                                            "body": html
                                        },
                                        "tomail": boarddata[0].value.email,
                                        "html": html
                                    }
                                    //send mail notification
                                    HELPER.socketNotification('', 'notification', html, maildata, true);
                                    var notification_data =
                                    {
                                        key: "board_usage"
                                        , 
                                        notification_generator:  mongo.ObjectID(req.session.login_user_id)
                                        , 
                                        notification_acceptor: boarddata[0]._id
                                        , 
                                        notification: instant_msg
                                        , 
                                        status: 1
                                    }
                                    if (boarddata[0].value.socket_id.length > 0) {
                                        //send instant notification    
                                        for(i in boarddata[0].value.socket_id ){
                                            HELPER.socketNotification(boarddata[0].value.socket_id[i], 'notification', instant_msg, '', false);
                                            i++;   
                                        }
                                    }
                                    //log the notification details
                                    notificationModel.NotificationInsertion(notification_data, function(callback) {

                                        });


                                }
                            }
                            //get the followers of the user
                            UserModel.findFollowers(user, "user", function(followers) {
                                if(followers.length>0){
                                    var msg = req.session.login_user_name + " posts a web page pin";

                                    for (l in followers)
                                    {
                                        //console.log(followers[i])
                                        if (followers[l].value.socket_id.length > 0) {
                                               
                                            for(j in followers[l].value.socket_id ){
                                                HELPER.socketNotification(followers[l].value.socket_id[j], 'notification', msg, '', false);
                                                j++;
                                            }
                                        }
                                        var notification_data =
                                        {
                                            key: "pincreation"
                                            , 
                                            notification_generator:  mongo.ObjectID(req.session.login_user_id)
                                            , 
                                            notification_acceptor: followers[l]._id
                                            , 
                                            notification: msg
                                            , 
                                            status: 1
                                        }
                                        //log the notification details
                                        notificationModel.NotificationInsertion(notification_data, function(callback) {

                                            });
                                        l++;
                                    }
                                }
                            });
                            UserModel.findFollowers(board, 'board', function(followers) {
                                if(followers.length>0){
                                    var msg = req.session.login_user_name + " use the board you followed";
                                    var i = 0,j=0;
                                    for (i in followers)
                                    {
                                    
                                        if(boarddata &&(boarddata[0]._id!=followers[i]._id))
                                        {
                                            //console.log(followers[i]._id);
                                            //console.log(boarddata[0]._id);
                                            if (followers[i].value.socket_id.length > 0) {
                                               
                                                for(j in followers[i].value.socket_id ){
                                                    HELPER.socketNotification(followers[i].value.socket_id[j], 'notification', msg);
                                                    j++;
                                                }
                                            }
                                            var notification_data =
                                            {
                                                key: "pincreation"
                                                , 
                                                notification_generator:  mongo.ObjectID(req.session.login_user_id)
                                                , 
                                                notification_acceptor: followers[i]._id
                                                , 
                                                notification: msg
                                                , 
                                                status: 1
                                            }
                                            notificationModel.NotificationInsertion(notification_data, function(callback) {

                                                });
                                        }
                                        i++;
                                
                                    }
                                }

                            });
                            

                        });
                        res.redirect('/pins');
                    });
                    

                });
            });

        });

    },
    
    /*youtube video check and pin operation
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013*/
    
    pin_video: function(fields, req, res) {
        var http = require('http');
        var fs = require("fs");
        var youtube = require('youtube-feeds')
        var time = new Date().getTime();
        var url = fields.url;
        var board = fields.board_id;
        var user = req.session.login_user_id;
        var loggeduser = req.session.login_user_name;
        if(!board || !fields.description ||!url){
            
            return;
        }
        
       
        
        //check for youtube video
        youtube.feeds.videos({
            q: url
        }, function(err, data) {
            if (err instanceof Error) {
                console.log(err)
            } else {


//console.log(data.items[0].description);
                var thumbName = time + '_0.jpg';
                var request = http.get('http://img.youtube.com/vi/' + data.items[0].id + '/0.jpg', function(res2) {
                    var imagedata = '';
                    res2.setEncoding('binary')
                    res2.on('data', function(chunk) {
                        imagedata += chunk
                    });
                    //console.log(res);
                    res2.on('end', function() {
                        var uploadedPath = DEFINES.IMAGE_PATH_ORIGINAL_REL + thumbName;
                        fs.writeFile(uploadedPath, imagedata, 'binary', function(err) {
                            if (err)
                                throw err
                            //console.log('File saved.' + i)


                            var type = "youtube";
                            var imagename = data.items[0].id;
                            var dt = new Date();
                            var time = dt.getTime();
                            //details of the pin
                            var insert_data = {
                                "board_id": mongo.ObjectID(board),
                                "video_id": data.items[0].id,
                                "pin_type": "video", // videotype
                                "pin_url": url,
                                "source_url": url,
                                "domain": 'youtube.com',
                                "time": time,
                                "user_id": mongo.ObjectID(user), //logged user_id
                                "video_type": "youtube", //type of video now youtube
                                "description": fields.description,
                                "image_name": [thumbName],
                                "blocked" : 0
                            };
                            //save the pin details
                            PostModel.PinCreation(insert_data, function(ress) {
                                ress[0].popStatus = '1' ;
                                ress[0].pinlike=0;
                                ress[0].loggeduser_id = user;
                                ress[0].creator_name = req.session.login_user_name;
                                ress[0].creator_image = req.session.login_user_img;
                                var template = system.getCompiledView('pins/videoPinView', ress[0]);
                                
                                  boardModel.getCategoryByBoardId(board,function(catdetails){
                                    ress[0].category_id = catdetails.category_id ? catdetails.category_id: ''
                                    sio.sockets.emit('pageview', {
                                        pin_type: 'video',
                                        str: template,
                                        data:ress[0]
                                    });
                                });
                                 
                                //get board creator
                                boardModel.boardCreator(user, board, function(boarddata) {

                                   
                                    if (boarddata.length > 0)
                                    {
                                        if (user != boarddata[0]._id)
                                        {
                                            //notification messages
                                            var html = '<b>Hi ' + boarddata[0].value.name + ', </b><br/>' + loggeduser + ' Creates a pin using your board.<br/>';
                                            var instant_msg = loggeduser + ' Creates a pin using your board.';
                                            var maildata = {
                                                mailcontent: {
                                                    "subject": "Board Usage",
                                                    "body": html
                                                },
                                                "tomail": boarddata[0].value.email,
                                                "html": html
                                            }
                                            //send mail notifications
                                            HELPER.socketNotification('', 'notification', html, maildata, true);
                                            if (boarddata[0].value.socket_id.length > 0) {
                                                //send instant notifications
                                                for(i in boarddata[0].value.socket_id ){
                                                    HELPER.socketNotification(boarddata[0].value.socket_id[i], 'notification', instant_msg, '', false);
                                                    i++;   
                                                }
                                            }
                                            var notification_data =
                                            {
                                                key: "board_usage"
                                                , 
                                                notification_generator:  mongo.ObjectID(req.session.login_user_id)
                                                , 
                                                notification_acceptor: boarddata[0]._id
                                                , 
                                                notification: instant_msg
                                                , 
                                                status: 1
                                            }
                                            //log notification details
                                            notificationModel.NotificationInsertion(notification_data, function(callback) {

                                                });


                                        }
                                    }
                                    //get the followers of a particular user
                                    UserModel.findFollowers(user, "user", function(followers)
                                    {
                                        if(followers.length>0){
                                            var msg = req.session.login_user_name + " posts a you tube video";

                                            for (l in followers)
                                            {
                                                //console.log(followers[i])
                                                if (followers[l].value.socket_id.length > 0) {
                                               
                                                    for(j in followers[l].value.socket_id ){
                                                        HELPER.socketNotification(followers[l].value.socket_id[j], 'notification', msg, '', false);
                                                        j++;
                                                    }
                                                }
                                                var notification_data =
                                                {
                                                    key: "pincreation"
                                                    , 
                                                    notification_generator:  mongo.ObjectID(req.session.login_user_id)
                                                    , 
                                                    notification_acceptor: followers[l]._id
                                                    , 
                                                    notification: msg
                                                    , 
                                                    status: 1
                                                }
                                                notificationModel.NotificationInsertion(notification_data, function(callback) {

                                                    });
                                                l++;
                                            }
                                        }
                                    });
                                    //get followers of the board
                                    UserModel.findFollowers(board, 'board', function(followers) {
                                        if(followers.length>0){
                                            var msg = req.session.login_user_name + " use the board you followed";
                                            var i = 0,j=0;
                                            for (i in followers)
                                            {
                                                if(boarddata && (boarddata[0]._id!=followers[i]._id))
                                                {
                                                    //console.log(boarddata[0]._id);
                                                    //console.log(followers[i]._id);
                                                    if (followers[i].value.socket_id.length > 0) {
                                               
                                                        for(j in followers[i].value.socket_id ){
                                                            HELPER.socketNotification(followers[i].value.socket_id[j], 'notification', msg);
                                                            j++;
                                                        }
                                                    }
                                                    var notification_data =
                                                    {
                                                        key: "pincreation"
                                                        , 
                                                        notification_generator:  mongo.ObjectID(req.session.login_user_id)
                                                        , 
                                                        notification_acceptor: followers[i]._id
                                                        , 
                                                        notification: msg
                                                        , 
                                                        status: 1
                                                    }
                                                    notificationModel.NotificationInsertion(notification_data, function(callback) {

                                                        });
                                                }
                                        
                                                i++;
                                            }
                                        }
                                    });



                                });
                                res.redirect('/pins');
                            });

                        });
                    });
                });

            }
        });
    },
    
    /*lcal video pin operation
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013*/
    
    pin_localvideo: function(fields, files, req, res)
    {

        var fs = require("fs");
        var board = fields.board_id;
        var user = req.session.login_user_id;
        var loggeduser = req.session.login_user_name;
        var dt = new Date();
        var time = dt.getTime();
        fs.readFile(files.video_upld.path, function(err, data) {
            var video_name = files.video_upld.name;
            var extention = video_name.split(".").pop();

            var newvideo_name = time + '.' + extention;
            var newPath = DEFINES.VIDEO_PATH_REL + newvideo_name;
            fs.writeFile(newPath, data, function(err) {
                //console.log('renamed complete');
                fs.unlink(files.video_upld.path);
                var thumbler = require('video-thumb');
                var thumbPath = DEFINES.VIDEO_PATH_REL + 'thumb/';
                var thumb = time + '.png';
                thumbler.extract(newPath, thumbPath + thumb, '00:00:08', '300x200', function() {
                    console.log('snapshot saved to snapshot.png (300x200) with a frame at 00:00:22');
                });




                var insert_data = {
                    "board_id": mongo.ObjectID(board),
                    "video_id": newvideo_name,
                    "thumb": thumb,
                    "pin_type": "video", // videotype            
                    "time": time,
                    "user_id": mongo.ObjectID(user), //logged user_id
                    "video_type": "local_video",
                    "video_version": files.video_upld.type,
                    "description": fields.description,
                    'blocked':0
                }

                PostModel.PinCreation(insert_data, function(ress) {
                    ress[0].popStatus = '1' ;
                    ress[0].pinlike=0;
                        ress[0].loggeduser_id = user;
                        ress[0].creator_name = req.session.login_user_name;
                        ress[0].creator_image = req.session.login_user_img;
                    var template = system.getCompiledView('pins/videoPinView', ress[0]);
                    sio.sockets.emit('pageview', {
                        'str': template, 
                        'pin_type': "video"
                    });
                    boardModel.boardCreator(user, board, function(boarddata) {
                        // console.log(boarddata);
                        //check wether the logged user and creator are same or not
                        if (boarddata.length > 0)
                        {
                            if (user != boarddata[0]._id)
                            {
                                var html = '<b>Hi ' + boarddata[0].value.name + ', </b><br/>' + loggeduser + ' Creates a pin using your board.<br/>';
                                var instant_msg = loggeduser + ' Creates a pin using your board.';
                                var maildata = {
                                    mailcontent: {
                                        "subject": "Board Usage",
                                        "body": html
                                    },
                                    "tomail": boarddata[0].value.email,
                                    "html": html
                                }
                                HELPER.socketNotification('', 'notification', html, maildata, true);
                                if (boarddata[0].value.socket_id.length > 0) {
                                               
                                    for(i in boarddata[0].value.socket_id ){
                                        HELPER.socketNotification(boarddata[0].value.socket_id[i], 'notification', instant_msg, '', false);
                                        i++;   
                                    }
                                }
                                var notification_data =
                                {
                                    key: "board usage"
                                    , 
                                    notification_generator:  mongo.ObjectID(req.session.login_user_id)
                                    , 
                                    notification_acceptor: boarddata[0]._id
                                    , 
                                    notification: instant_msg
                                    , 
                                    status: 1
                                }
                                notificationModel.NotificationInsertion(notification_data, function(callback) {
                                    });

                            }
                        }
                        UserModel.findFollowers(user, "user", function(followers) {
                            var msg = req.session.login_user_name + " posts a video pin";
                            if(followers.length>0){
                                for (l in followers)
                                {
                                    //console.log(followers[i])
                                    if (followers[l].value.socket_id.length > 0) {
                                               
                                        for(j in followers[l].value.socket_id ){
                                            HELPER.socketNotification(followers[l].value.socket_id[j], 'notification', msg, '', false);
                                            j++;
                                        }
                                    }
                                    var notification_data =
                                    {
                                        key: "pincreation"
                                        , 
                                        notification_generator: req.session.login_user_id
                                        , 
                                        notification_acceptor: followers[l]._id
                                        , 
                                        notification: msg
                                        , 
                                        status: 1
                                    }
                                    notificationModel.NotificationInsertion(notification_data, function(callback) {

                                        });
                                    l++;
                                }
                            }
                        });
                        UserModel.findFollowers(board, 'board', function(followers) {
                            var msg = req.session.login_user_name + " use the board you followed";
                            var i = 0,j=0;
                            if(followers.length>0){
                                for (i in followers)
                                {
                                    if(boarddata && (boarddata[0]._id!=followers[i]._id)){
                                        if (followers[i].value.socket_id.length > 0) {
                                               
                                            for(j in followers[i].value.socket_id ){
                                                HELPER.socketNotification(followers[i].value.socket_id[j], 'notification', msg);
                                                j++;
                                            }
                                        }
                                        var notification_data =
                                        {
                                            key: "pincreation"
                                            , 
                                            notification_generator: req.session.login_user_id
                                            , 
                                            notification_acceptor: followers[i]._id
                                            , 
                                            notification: msg
                                            , 
                                            status: 1
                                        }
                                        notificationModel.NotificationInsertion(notification_data, function(callback) {

                                            });
                                    }
                                    i++;
                                }
                            }
                        });
                    });
                    res.redirect('/pins');
                });
            });
        });
    },
    /*
     * create screenshot of webpage during webpage pin operation
     *@author Arya <arya@cubettech.com>
     * @Date 29-10-2013*/

    screenshot: function(req, res)
    {
        var webshot = require('webshot');
        var fs = require('fs');
        var time = new Date().getTime();
         var webshot_options = {
            renderDelay:5000
        }
        if(req.session.login_user_id)
        {
            var imagename = req.session.login_user_id + '.png';
        }
        else{
            var imagename = time + '.png';
            req.session.temp_imagename = imagename;
        }
           
            
        var options = {
            screenSize: {
                width: 320
                , 
                height: 480
            }
            , 
            shotSize: {
                width: 320
                , 
                height: 'all'
            }
        }
        //console.log('hello');
        webshot(req.body.pageurl, DEFINES.IMAGE_PATH_REL + 'temp/' + imagename ,webshot_options, function(err) {
            if(!err){
                var data = {
                    "image": imagename
                };
                //res.writeHead(200, { 'Content-Type': 'application/json' }); 
                res.send(200, data);
            } else {
                var data = {
                    "error": 'Website does not exist or unable to create screenshot.'
                };
                res.send(200, data);
            }
        });


    },
    /**
     *
     * shows a pins corresponding to board_id
     *@author Arya <arya@cubettech.com>
     * @Date 10-11-2013*/
    listByBoard: function(req, res) {
        
        var board_id = req.params.bid;
        catModel.getCategoryAll(function(result) {
           
            boardModel.getBoardOne(board_id, function(board) {
                
                if(board.length>0){
                    followerModel.BoardFollowerCount(board_id,req.session.login_user_id, function(count) {
                        
                        boardModel.boardCreator(req.session.login_user_id, board_id, function(creator) {
                            if (creator && creator.length > 0) {
                                PostModel.getPinsByBoard_not(board_id, function(person1) {
                                    UserModel.userDetails(creator[0]._id.toHexString(), function(userimage) {
                                        UserModel.userDetails(req.session.login_user_id, function(userdata) {
                                            PostModel.getPinsByBoard(req.session.login_user_id, board_id, function(person) {
                                                var data = {
                                                    'data': person,
                                                    'pagetitle': 'Pins',
                                                    'loiginuser': req.session.login_user_name,
                                                    'loggeduser_id': req.session.login_user_id,
                                                    category: result,
                                                    type: 'board',
                                                    type_id:board_id,
                                                    'board_detail': board[0].board_name,
                                                    'description': board[0].description,
                                                    'board_image': board[0].image,
                                                    'followercount': count.length,
                                                    'pincount': person1.length,
                                                    'creator_name': creator[0].value.name,
                                                    'creator_image': userimage[0].image,
                                                    'user_image': userdata[0].image,                                              
                                                    'board_id':board_id,
                                                    'creator':board[0].creator
                                                
                                                
                                                };
                                            
                                                if(count.length>0){
                                                    data.boardfollow = count[0].boardfollow;
                                                }
                                                else{
                                                    data.boardfollow = 0;
                                                }

                                                system.loadView(res, 'pins/pin', data);
                                                system.setPartial('pins/pinheader', 'pinheader');
                                                system.setPartial('pins/imagePinView', 'pinviewimage');
                                                system.setPartial('pins/audioPinView', 'pinviewaudio');
                                                system.setPartial('pins/webaudioPinView', 'pinviewwebaudio');
                                                system.setPartial('pins/webPinView', 'pinvieweb');
                                                system.setPartial('pins/videoPinView', 'pinviewvideo');
                                            //system.setPartial('pins/popup', 'popup');
                                            });
                                        });
                                    });
                                });

                            } else {
                                 PostModel.getPinsByBoard_not(board_id, function(person1) {
                                        UserModel.userDetails(req.session.login_user_id, function(userdata) {
                                            PostModel.getPinsByBoard(req.session.login_user_id, board_id, function(person) {
                                                var data = {
                                                    'data': person,
                                                    'pagetitle': 'Pins',
                                                    'loiginuser': req.session.login_user_name,
                                                    'loggeduser_id': req.session.login_user_id,
                                                    category: result,
                                                    type: 'board',
                                                    type_id:board_id,
                                                    'board_detail': board[0].board_name,
                                                    'description': board[0].description,
                                                    'board_image': board[0].image,
                                                    'followercount': count.length,
                                                    'pincount': person1.length,
                                                    'creator_name': 'Admin User',
                                                    'user_image': userdata[0].image,                                              
                                                    'board_id':board_id,
                                                    'creator':board[0].creator
                                                
                                                
                                                };
                                            
                                                if(count.length>0){
                                                    data.boardfollow = count[0].boardfollow;
                                                }
                                                else{
                                                    data.boardfollow = 0;
                                                }

                                                system.loadView(res, 'pins/pin', data);
                                                system.setPartial('pins/pinheader', 'pinheader');
                                                system.setPartial('pins/imagePinView', 'pinviewimage');
                                                system.setPartial('pins/audioPinView', 'pinviewaudio');
                                                system.setPartial('pins/webaudioPinView', 'pinviewwebaudio');
                                                system.setPartial('pins/webPinView', 'pinvieweb');
                                                system.setPartial('pins/videoPinView', 'pinviewvideo');
                                            //system.setPartial('pins/popup', 'popup');
                                            });
                                        });
                                });
                            }
                        });

                    });

                }
            
                else {
                    res.redirect('/404');
                }
            });
        });

    },
    /*
     * popup detail page for pin
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 26-nov-2013
     */
    popup: function(req, res) {
        var pid = req.params.pid;
        if(!pid)
        {
            res.redirect('/404');
            return;
        }
        var popup = req.params.popup == 1 ? 1 : 0;
        catModel.getCategoryAll(function(categories) {
            UserModel.userDetails(req.session.login_user_id, function(user) {
                pinModel.getPinsOne(pid, function(result) {
                    if(!result){
                        res.redirect('/404');
                    }
                    var imgCount = (result.image_name) ? result.image_name.length : 1;
                    var data = {
                        pin: result,
                        pagetitle: 'Pins',
                        loiginuser: req.session.login_user_name,
                        loggeduser_id: req.session.login_user_id,
                        category: categories,
                        type: 'list',
                        user_image: user[0].image,
                        popup: popup,
                        imgCount: imgCount
                    };
                    if (popup == 1) {
                        data.layout = false;
                    }
                    system.loadView(res, 'pins/popup', data);
                    if (popup == 0) {
                        system.setPartial('pins/pinheader', 'pinheader');
                    }
                }, req.session.login_user_id, popup);

            });
        });
    },
    /*
     * more pins pinned by user
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 26-nov-2013
     */
    more_userpins: function(req, res) {
        var start = req.body.startlimit;
        var end = req.body.endlimit;
        var cur_pin_id = req.body.cur_pin_id;
        var popStatus = req.body.popup==1 ? 1 : 0 ;
        pinModel.moreUserPinlists(req.session.login_user_id, cur_pin_id, start, end, function(result) {
            //console.log(result);
            var data = {
                'data': result,
                'layout': false
            };
            if (result) {
                system.loadView(res, 'pins/moredata', data);
            } else {
                res.send(404);
            }
        },popStatus);
    },
    /* 
     * get more pins in a  board on scroll
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 26-nov-2013
     */
    morePinsByBoard: function(req, res) {
        var start = req.body.startlimit;
        var end = req.body.endlimit;
        var currentPinId = req.body.currentPinId;
        var popStatus = req.body.popup==1 ? 1 : 0 ;
        pinModel.morePinsByLimit(currentPinId, start, end, function(result) {
            var data = {
                'data': result,
                'layout': false
            };
            if (result) {
                system.loadView(res, 'pins/morePinsByBoard', data);
            } else {
                res.send(404);
            }
        },popStatus);
    },
    /*
     * get more pins by domain on scroll
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 26-nov-2013
     */
    morePinsByDomain: function(req, res) {
        var start = req.body.startlimit;
        var end = req.body.endlimit;
        var currentPinId = req.body.currentPinId;
        var popStatus = req.body.popup==1 ? 1 : 0 ;
        pinModel.moreDomainPinsByLimit(currentPinId, start, end, function(result) {
            var data = {
                'data': result,
                'layout': false
            };
            if (result) {
                system.loadView(res, 'pins/morePinsByBoard', data);
            } else {
                res.send(404);
            }
        },popStatus);
    },
    /**
     *like a pin
     *@author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * */
    
    pinLike: function(req, res) {
        var pin_id = req.body.pin_id;
        var user_id = req.session.login_user_id;


        //console.log(pin_id + ' :: ' + user_id);
        var insert_data = {
            "pin_id": mongo.ObjectID(pin_id),
            "user_id": mongo.ObjectID(user_id),
            "timestamp": new Date().getTime()
        }

        PostModel.pinLikeCheck(pin_id, user_id, function(checkresult) {
            
            if (checkresult.length == 0) {

                PostModel.insertPinLike(insert_data, function(person) {


                    if (person)
                    {
                        PostModel.getPinCreator(pin_id, function(creator) {

                            if (creator.length > 0)
                            {
                              
                                if (creator[0]._id != user_id)
                                {
                                    notificationModel.notificationSendCheck(creator[0]._id,function(settings){
                                        //console.log(creator[0]._id);
                                        if(settings[0].like==1){
                                            var html = '<b>Hi ' + creator[0].value.name + ', </b><br/>' + req.session.login_user_name + ' Liked your pin.<br/>';
                                            var instant_msg = req.session.login_user_name + ' Liked your pin.';
                                            var maildata = {
                                                mailcontent: {
                                                    "subject": "Pin Like",
                                                    "body": html
                                                },
                                                "tomail": creator[0].value.email,
                                                "html": html
                                            }
                                   
                                            HELPER.socketNotification('', 'notification', instant_msg, maildata, true);
                                            var notification_data =
                                            {
                                                key: "pin_like"
                                                , 
                                                notification_generator: req.session.login_user_id
                                                , 
                                                notification_acceptor: creator[0]._id
                                                , 
                                                notification: instant_msg
                                                , 
                                                status: 1
                                            }
                                            notificationModel.NotificationInsertion(notification_data, function(callback) {

                                                });
                                            UserModel.UserSettings(creator[0]._id.toHexString(), function(settings){
                                                if(settings[0].like==1){
                                   
                                                    if(creator[0].value.socket_id.length>0){
                                                        for(i in creator[0].value.socket_id)
                                                        {
                                                            HELPER.socketNotification(creator[0].value.socket_id[i], 'notification', instant_msg, '', false);
                                        
                                                            i++;
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    var data = {
                                        "data": "inserted"
                                    }
                                    res.send(data);
                                }
                                else{
                                    var data = {
                                        "data": "inserted"
                                    }
                                    res.send(data);
                                }
                            }
                            else
                            {
                                res.send({
                                    data: false
                                });
                            }
                        });
                    }
                    else
                    {
                        res.send({
                            data: false
                        });
                    }
                });
            }
        });
    },
    
    /**
     *unlike a pin
     *@author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * */
    pinUnlike: function(req, res) {
        var pin_id = req.body.pin_id;
        var user_id = req.session.login_user_id;
        var data = {
            "pin_id": mongo.ObjectID(pin_id),
            "user_id": mongo.ObjectID(user_id),
            "timestamp": new Date().getTime()
        }
        PostModel.removePinLike(data, function(person) {


            if (person)
            {
                var data = {
                    "data": "removed"
                }
                res.send(data);

            }
            else
            {
                res.send('no response');
            }
        });
    },
    createComment: function(req, res) {

        var pin_id = req.body.pin_id;
        var user_id = req.session.login_user_id;
        var comment = "This is atest Comment"
        var insert_data = {
            "pin_id": mongo.ObjectID(pin_id),
            "user_id": mongo.ObjectID(user_id),
            "comment": comment,
            "timestamp": new Date().getTime()
        }
        PostModel.insertComment(insert_data, function(person) {


            if (person)
            {
                PostModel.getPinCreator(pin_id, function(creator) {
                    if (creator.length > 0 && user_id != creator[0]._id)
                    {
                        var html = '<b>Hi ' + creator[0].value.name + ', </b><br/>' + req.session.login_user_name + ' Liked your pin.<br/>';
                        var maildata = {
                            "tomail": creator[0].value.email,
                            "html": html
                        }

                        HELPER.socketNotification('', 'notification', html, maildata, true);
                        var notification_data =
                        {
                            key: "pin_like"
                            , 
                            notification_generator: req.session.login_user_id
                            , 
                            notification_acceptor: creator[0]._id
                            , 
                            notification: html
                            , 
                            status: 1
                        }
                        notificationModel.NotificationInsertion(notification_data, function(callback) {

                            });

                        HELPER.socketNotification(creator[0].value.socket_id, 'notification', html, '', false);
                    }
                    var data = {
                        "data": "inserted"
                    }
                    res.send(data);
                });
            }
            else
            {
                res.send('no response');
            }
        });

    },
    /**
     *repin a pin
     *@author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * */
    repin: function(req, res) {

        var pin_id = req.body.pin_id;

        var user_id = req.session.login_user_id;
        var board_id = req.body.board_id;
        var description = req.body.description;
        var level = 0;
        var level_index = 0;
        PostModel.getPinDetails(pin_id, function(pins) {

            if (pins.length > 0)
            {
                PostModel.checkRepin(pin_id, function(repins) {

                    var parent_pin_id = pins[0]._id;
                    var source_pin_id = pins[0]._id;
                    if (repins.length > 0)
                    {
                        for (i in repins)
                        {
                            if (repins[i].level == 0)
                            {
                                level_index = i;
                            }
                            i++;
                        }
                        var source_pin_id = repins[level_index].source_pin_id;
                        level = repins.length;
                    }
                    for (var key in pins[0]) {
                        if (key == '_id') {
                            delete pins[0][key];
                        }
                    }

                    pins[0].user_id = mongo.ObjectID(req.session.login_user_id);
                    pins[0].time = new Date().getTime();
                    pins[0].repin = 1;
                    pins[0].board_id = mongo.ObjectID(board_id);
                    pins[0].description = description;
                    //get the template based on the type of pin
                    PostModel.PinCreation(pins[0], function(newpin) {
                        newpin = newpin[0];
                        if (pins[0].pin_type == 'web_page')
                        {
                            var template = system.getCompiledView('pins/webPinView', newpin);
                        }
                        else if (pins[0].pin_type == 'video')
                        {
                            var template = system.getCompiledView('pins/videoPinView', newpin);
                        }
                        else if (pins[0].pin_type == 'url_image' || pins[0].pin_type == 'image')
                        {
                            var template = system.getCompiledView('pins/imagePinView', newpin);
                        }
                        else if (pins[0].pin_type == 'webaudio')
                        {
                            var template = system.getCompiledView('pins/webaudioPinView', newpin);
                        }
                        else if (pins[0].pin_type == 'audio')
                        {
                            var template = system.getCompiledView('pins/audioPinView', newpin);
                        }
                        //console.log(template);
                        sio.sockets.emit('pageview', {
                            'str': template, 
                            'pin_type': pins[0].pin_type
                        });

                        var insertRePin_data = {
                            "pin_id": newpin._id,
                            "parent_pin_id": parent_pin_id,
                            "source_pin_id": source_pin_id,
                            "level": level,
                            "timestamp": new Date().getTime()
                        }
                        PostModel.rePinCreation(insertRePin_data, function(newrepin) {
                            if (newrepin)
                                res.redirect('back');
                        })
                    });
                });

            }
        });
    },
    /**
     *loads the repin page
     *@author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * */
    repinload: function(req, res) {
        var pin_id = req.params.pid;
        //console.log(pin_id);
        boardModel.getBoardAll(function(boards) {
            pinModel.getPinsOne(pin_id, function(result) {
               
                var data = {
                    pin: result,
                    pagetitle: 'Repin',
                    loiginuser: req.session.login_user_name,
                    loggeduser_id: req.session.login_user_id,
                    boards: boards,
                    popup: 0,
                    pin_id: pin_id,
                    layout: false
                };
                /*if(popup==1){
                 data.layout=false;
                 }*/
                //console.log(result);
                system.loadView(res, 'pins/repin', data);
            });
        });
    },
    /**
     *load the report pin page
     *@author Arya <arya@cubettech.com>
     * @Date 2-12-2013
     * */
    reportPinLoad: function(req, res) {
        var pin_id = req.params.pid;
        // get the details of a single pin
        pinModel.getPinsOne(pin_id, function(result) {
            var data = {
                pin: result,
                pagetitle: 'Report',
                loiginuser: req.session.login_user_name,
                loggeduser_id: req.session.login_user_id,
                popup: 0,
                pin_id: pin_id,
                layout: false
            };

            /*if(popup==1){
             data.layout=false;
             }*/

            system.loadView(res, 'pins/report', data);




        });

    },
    /**
     *report a pin
     *@author Arya <arya@cubettech.com>
     * @Date 2-12-2013
     * */
    report: function(req, res) {

        var pin_id = req.body.pin_id;
        var reason = req.body.reason;
        var rept_message = req.body.rept_message;
        var report_data = {
            "reported": 1,
            "report_by": req.session.login_user_id,
            "report_msg": rept_message,
            "report_reason": reason,
            "pin_id": pin_id
        };
        PostModel.reportPin(report_data, function(result) {
            console.log(result);
            res.redirect('back');
        });

    },
    /**
     *make notification as read
     *@author Arya <arya@cubettech.com>
     * @Date 2-12-2013
     * */
    removeNotification: function(req, res) {
        var acceptor = req.session.login_user_id;
        notificationModel.notificationStatusChange(acceptor, function(result) {
            if (result)
                var data = {
                    "data": "updated"
                }
            res.send(data);
        });
    },
    /**
     *list the pins of a particular user
     *@author Arya <arya@cubettech.com>
     * @Date 20-12-2013
     * */
    listByUser: function(req, res) {
        var user_id = req.params.uid;
        UserModel.userFollowDetails(req.session.login_user_id,user_id, function(userdetail) {
          
            catModel.getCategoryAll(function(result) {
                
                PostModel.UserFollowerCount(user_id,function(count){
                    PostModel.getUserPincount(user_id,function(person1) { 
                      
                        PostModel.getPinsByUser(req.session.login_user_id, user_id, userdetail, function(person) {
                            // boardModel.getBoardOne(board_id,function(board){
                   
                     
                            //  boardModel.boardCreator(req.session.login_user_id,board_id, function(creator){ 
                            //console.log(person);
                    
                            // UserModel.userDetails(creator[0]._id.toHexString(),function(userimage) {

                            UserModel.userDetails(req.session.login_user_id, function(userdata) {
                                var user_data = {
                                    creator_name: userdetail[0].name,
                                    creator_image: userdetail[0].image
                                }
                                var data = {
                                    'data': person,
                                    'pagetitle': 'User Pins',
                                    'loiginuser': req.session.login_user_name,
                                    'loggeduser_id': req.session.login_user_id,
                                    category: result,
                                    hidden_data: user_data,
                                    type: 'user',
                                    'user_detail': userdetail,
                                    // 'description': board[0].description,
                                    // 'board_image': board[0].image,
                                    // 'followercount': count.length,
                                    'pincount': person1.length,
                                    'followcount': count.length,
                                    //'creator_image': userimage[0].image,
                                    'user_image': userdata[0].image,
                                    'creator_image': userdetail[0].image,
                                    'creator_name': userdetail[0].name,
                                    'userfollow' : userdetail[0].userfollow,
                                    'listuser':user_id,
                                    type_id:user_id
                                };
                                system.loadView(res, 'pins/pin', data);
                                system.setPartial('pins/pinheader', 'pinheader');
                                system.setPartial('pins/imagePinView', 'pinviewimage');
                                system.setPartial('pins/audioPinView', 'pinviewaudio');
                                system.setPartial('pins/webaudioPinView', 'pinviewwebaudio');
                                system.setPartial('pins/webPinView', 'pinvieweb');
                                system.setPartial('pins/videoPinView', 'pinviewvideo');
                            //system.setPartial('pins/popup', 'popup');
                            });
                        });
                    });
                });
            //});
            //});
            // });
            });
        });
    },
    
    /**
     *loads the pins of a particular category
     *@author Arya <arya@cubettech.com>
     * @Date 20-12-2013
     * */
    
    listByCategory: function(req, res) {
        
        var cat_id = req.params.catid;
        catModel.getCategoryAll(function(result) {
                                        
            UserModel.userDetails(req.session.login_user_id, function(user) {
                boardModel.getBoardsByCategory(cat_id,function(boards){
                    
                    if(boards.length>0)
                    {
                                       
                        PostModel.getPinsFromMultipleBoard(req.session.login_user_id, boards, function(person) {
                            var data = {
                                'data': person,
                                'pagetitle': 'Pins',
                                'loiginuser': req.session.login_user_name,
                                'loggeduser_id': req.session.login_user_id,
                                category: result,
                                type: 'category',
                                type_id:cat_id,
                                'user_image': user[0].image
                            //                                                
                            };
                                   

                            system.loadView(res, 'pins/pin', data);
                            system.setPartial('pins/pinheader', 'pinheader');
                            system.setPartial('pins/imagePinView', 'pinviewimage');
                            system.setPartial('pins/audioPinView', 'pinviewaudio');
                            system.setPartial('pins/webaudioPinView', 'pinviewwebaudio');
                            system.setPartial('pins/webPinView', 'pinvieweb');
                            system.setPartial('pins/videoPinView', 'pinviewvideo');
                        //system.setPartial('pins/popup', 'popup');
                        });
                    }
                    else{
                        var data = {                                              
                            'pagetitle': 'Pins',
                            'loiginuser': req.session.login_user_name,
                            'loggeduser_id': req.session.login_user_id,
                            category: result,
                            type: cat_id,
                            'user_image': user[0].image
                        //                                                
                        };
                                   

                        system.loadView(res, 'pins/pin', data);
                        system.setPartial('pins/pinheader', 'pinheader');
                        system.setPartial('pins/imagePinView', 'pinviewimage');
                        system.setPartial('pins/audioPinView', 'pinviewaudio');
                        system.setPartial('pins/webaudioPinView', 'pinviewwebaudio');
                        system.setPartial('pins/webPinView', 'pinvieweb');
                        system.setPartial('pins/videoPinView', 'pinviewvideo'); 
                    }
                })
            });  
                                 
        });
       

    },
    
    /**
     *get youtube description
     *@author Arya <arya@cubettech.com>
     * @Date 30-01-2014
     * */
    
    
   YoutubeDescription:function(req,res){
       
       var youtube = require('youtube-feeds')
       var url = req.body.url;
        youtube.feeds.videos({
            q: url
        }, function(err, data) {
            if (err instanceof Error) {
               var response={
                   res:0
                  
               }
               res.send(response);
            } else {
               var response={
                   res:1,
                   desc:data.items[0].description
               }
               res.send(response);
            }
        });

       
   }
    
    
};
module.exports = pinController;
