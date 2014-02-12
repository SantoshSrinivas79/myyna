/**
 * controller for uploading all type of pins from computer
 * 
 * LICENSE: MIT
 *
 * @category cubetboard
 * @package Pins
 * @subpackage image,audio,video
 * @copyright Copyright (c) 2007-2014 Cubet Technologies. (http://cubettechnologies.com)
 * @version 2.0
 * @author Rahul P R <rahul.pr@cubettech.com>
 * @date 18-Nov-2013
 */

var fs = require('fs');
var url = require('url');
var http = require('http');
var util = require('util');
var sys = require('sys');
var formidable = require('formidable');
var im = require('imagemagick');
var img_arr = []; // image array
var tmb_img_arr = []; // thumb image array
var imagepinModel = system.getModel('imagepin');
var PostModel = system.getModel('pin');
var boardModel = system.getModel('board');
system.loadHelper('myhelper');

var 
maxImageSize = 1,//size in Mb
maxAudioSize = 5,
maxVideoSize = 10,
// supported formats
validImage   = ['image/jpeg','image/pjpeg','image/png','image/gif'],
validAudio   = ['audio/mpeg','audio/mp3','audio/x-mpeg','audio/x-mp3','audio/mpeg3',
                'audio/x-mpeg3','audio/mpg','audio/x-mpg','audio/x-mpegaudio'],
validVideo   = ['video/mp4','video/ogg','video/webm'];    

var imageController = {
    /**
     * shows a form for adding pin from computer and from web
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 27-Dec-2013
     */
    addpin: function(req, res) {
        boardModel.getAdminUsers(function(user) {
           user.push(mongo.ObjectID(req.session.login_user_id));
     
            boardModel.getBoardPincreation(user,function(result) {                   
            var data = {
                layout: 'urlfetch_layout',
                boards: result
            }
            system.loadView(res, 'pin_image/addpin', data);
            });
        });
    },
    /**
     * shows a form to browse image
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    browse_image: function(req, res) {
        boardModel.getBoardAll(function(result) {
            var data = {
                layout: 'urlfetch_layout',
                boards: result
            }
            var htm = system.getCompiledView('pin_image/browse_form', data);
            res.send(htm);
        });
    },
    /**
     *  retrieve posted data
     *  @author Rahul P R <rahul.pr@cubettech.com>
     *  @date 03-Dec-2013
     */
    upload_action: function(req, res) {
        var form = new formidable.IncomingForm();
        var i = 0;
        imageController.addimg(i, imagepinModel, form, req, res, function(status) {
            if (status == 1) {
                res.redirect('/pins');
            }
        });
    },
    /**
     * this function uploads all images to DEFINES.IMAGE_PATH_ORIGINAL_REL,
     * insert details to database
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 03-Dec-2013
     * @param i,imagepinModel,form,req,res
     */
    addimg: function(i, imagepinModel, form, req, res, callback) {
        form.parse(req, function(err, fields, files) {
            var urltitle    = '' ;
            var hostname    = '' ;
            var board_id    = fields.board_id ;
            var description = fields.description ;
            var cur_time    = new Date().getTime() ;
            var filename    = files.upload ? files.upload.name : '' ; 
            var fileType    = files.upload ? files.upload.type : '' ;
            var fileSize    = files.upload ? files.upload.size : '' ;
            //do this only if image exists
            if(filename!='' && board_id!='' && description!='')
            {
                // image
                // check file format    
                if (HELPER.typeValid(validImage,fileType))
                {
                    // check file size
                    if(fileSize<= ( maxImageSize * 1024 * 1024 ) )
                    {
                        var img_ext = HELPER.get_extension(filename); // get image extension from function
                        var imagename = cur_time + '_' + i + '.' + img_ext;
                        //add imagename to image array & thumb array
                        img_arr.push(imagename);
                        tmb_img_arr.push(imagename);
                        fs.readFile(files.upload.path, function(err, data) {
                            var newPath = DEFINES.IMAGE_PATH_ORIGINAL_REL + imagename;
                            // write file to folder
                            fs.writeFile(newPath, data, function(err) {
                                //console.log('renamed complete');
                                fs.unlink(files.upload.path);
                                //set image width to 415 or 300 px
                                HELPER.get_img_width(im, newPath, function(width) {
                                    //resizing image
                                    var rez_opt = {
                                        srcPath: DEFINES.IMAGE_PATH_ORIGINAL_REL + imagename,
                                        dstPath: DEFINES.IMAGE_PATH_SMALL_REL + imagename,
                                        width: width,
                                    };
                                    im.resize(rez_opt, function(err, stdout, stderr) {

                                        var rez_opt = {
                                            srcPath: DEFINES.IMAGE_PATH_ORIGINAL_REL + imagename,
                                            dstPath: DEFINES.IMAGE_PATH_THUMB_REL + imagename,
                                            width: '600' // pop up image width
                                        };
                                        im.resize(rez_opt, function(err, stdout, stderr) {

                                            if (err)
                                                throw err;
                                            // console.log('resized');
                                            //insert data to db after image upload completed
                                            var db_data = {
                                                board_id        : mongo.ObjectID(board_id),
                                                image_name      : img_arr,
                                                tmb_image_name  : tmb_img_arr,
                                                pin_type        : "image", // for type image
                                                pin_url         : urltitle,
                                                source_url      : urltitle,
                                                time            : cur_time,
                                                user_id         : mongo.ObjectID(req.session.login_user_id),
                                                description     : description,
                                                domain          : hostname,
                                                image_width     : width,
                                                blocked         : 0
                                            };
                                            imagepinModel.insert(db_data, function(inserted_data) {
                                                inserted_data[0].popStatus = '1' ;
                                                inserted_data[0].pinlike=1;
                                                inserted_data[0].loggeduser_id = req.session.login_user_id;
                                                inserted_data[0].creator_name = req.session.login_user_name;
                                                inserted_data[0].creator_image = req.session.login_user_img;
                                                //console.log(inserted_data);
                                                var htm = system.getCompiledView('pins/imagePinView', inserted_data[0]);
                                                // send details to socket
                                                boardModel.getCategoryByBoardId(board_id,function(catdetails){
                                                    inserted_data[0].category_id = catdetails.category_id ? catdetails.category_id: ''
                                                    sio.sockets.emit('pageview', {
                                                        pin_type: 'image',
                                                        str: htm,
                                                        data:inserted_data[0]
                                                    });
                                                });

                                                //send notifications
                                                imageController.notificationMail(req,board_id);
                                                //success
                                                callback(1);
                                            });
                                            //clearing arrays
                                            img_arr = [];
                                            tmb_img_arr = [];

                                        });
                                    });
                                /*end resizing*/
                                });
                            });
                        });
                    } else {
                        var data = {
                            error   : 1,
                            msg     : 'Image file size should < ' + maxImageSize + 'Mb'
                        } ;
                        res.send(data);
                   }

                } 
                // audio
                else if(HELPER.typeValid(validAudio,fileType) )
                {
                    // check file size
                    if(fileSize<= (maxAudioSize * 1024 * 1024 ) )
                    {
                        var file_ext =  HELPER.get_extension(filename); 
                        var filename =  cur_time + '_' + i + '.' + file_ext ;
                        var filenameMp3 = cur_time + '_' + i + '.mp3' ;
                        fs.readFile(files.upload.path, function (err, data) {
                            var newPath = DEFINES.AUDIO_PATH_REL + filenameMp3 ;
                            // save file to folder
                            fs.writeFile(newPath, data, function (err) {
                                    //insert data to db after image upload completed
                                    var db_data = {
                                        board_id        : mongo.ObjectID(board_id),
                                        pin_type        : "audio", 
                                        pin_url         : urltitle,
                                        source_url      : urltitle,
                                        time            : cur_time ,
                                        user_id         : mongo.ObjectID(req.session.login_user_id), 
                                        description     : description,
                                        domain          : hostname,
                                        audio_file      : filenameMp3,
                                        blocked         : 0
                                    }; 
                                    imagepinModel.insert(db_data,function(inserted_data){
                                        inserted_data[0].popStatus = '1' ;
                                        inserted_data[0].pinlike=1;
                                        inserted_data[0].loggeduser_id = req.session.login_user_id;
                                        inserted_data[0].creator_name = req.session.login_user_name;
                                        inserted_data[0].creator_image = req.session.login_user_img;
                                        var htm = system.getCompiledView('pins/audioPinView', inserted_data[0]);
                                        // send details to socket
                                        boardModel.getCategoryByBoardId(board_id,function(catdetails){
                                            inserted_data[0].category_id = catdetails.category_id ? catdetails.category_id: ''
                                            sio.sockets.emit('pageview', {
                                                pin_type: 'audio',
                                                str: htm,
                                                data:inserted_data[0]
                                            });
                                        });
                                        //send notifications
                                       imageController.notificationMail(req,board_id);
                                       callback(1);
                                    });

                            }); // end fs.writeFile(newPath, data, function (err) {
                        });// end fs.readFile(files.upload.path, function (err, data) {
                    } else {
                        var data = {
                            error   : 1,
                            msg     : 'Audio file size should < ' + maxAudioSize + 'Mb'
                        } ;
                        res.send(data);
                    }
                } 
                // video
                else if(HELPER.typeValid(validVideo,fileType))
                {
                    // check file size
                    if(fileSize<= (maxVideoSize * 1024 * 1024 ) )
                    {
                        fs.readFile(files.upload.path, function(err, data) {
                            var video_name = files.upload.name;
                            var extention = video_name.split(".").pop();

                            var newvideo_name = cur_time + '.' + extention;
                            var newPath = DEFINES.VIDEO_PATH_REL + newvideo_name;
                            fs.writeFile(newPath, data, function(err) {
                                //console.log('renamed complete');
                                fs.unlink(files.upload.path);
                                var thumbPath = DEFINES.VIDEO_PATH_REL + 'thumb/';
                                var thumb = cur_time + '.png';
                                
                                var exec;
                                exec = require('child_process').exec;
                                
                                exec('ffmpeg -ss 00:00:04 -i ' + newPath + ' -r 1 -s 300x200 -f image2 -vframes 1 ' + thumbPath + thumb, function() {
                                    console.log('snapshot saved to '+ thumbPath + thumb +' (300x200) with a frame at 00:00:04');
                                });


                                


                                var insert_data = {
                                    "board_id"      : mongo.ObjectID(board_id),
                                    "video_id"      : newvideo_name,
                                    "thumb"         : thumb,
                                    "pin_type"      : "video", // videotype            
                                    "time"          : cur_time ,
                                    "user_id"       : mongo.ObjectID(req.session.login_user_id), //logged user_id
                                    "video_type"    : "local_video",
                                    "video_version" : fileType,
                                    "description"   : fields.description,
                                    "blocked"       : 0
                                }

                                PostModel.PinCreation(insert_data, function(inserted_data) {
                                    inserted_data[0].popStatus = '1' ;
                                    inserted_data[0].pinlike=1;
                                    inserted_data[0].loggeduser_id = req.session.login_user_id;
                                    inserted_data[0].creator_name = req.session.login_user_name;
                                    inserted_data[0].creator_image = req.session.login_user_img;
                                    var template = system.getCompiledView('pins/videoPinView', inserted_data[0]);
                                    // send details to socket
                                    boardModel.getCategoryByBoardId(board_id,function(catdetails){
                                        inserted_data[0].category_id = catdetails.category_id ? catdetails.category_id: ''
                                        sio.sockets.emit('pageview', {
                                            pin_type: 'video',
                                            str: template,
                                            data:inserted_data[0]
                                        });
                                    });
                                    imageController.notificationMail(req,board_id);
                                    callback(1);
                                });
                            });
                        });
                    } else {
                        var data = {
                            error   : 1,
                             msg     : 'Video file size should < ' + maxVideoSize + 'Mb'
                        } ;
                        res.send(data);
                    }
                } else {
                    var data = {
                        error   : 1,
                        msg     : 'Invalid file format'
                    } ;
                    res.send(data);                   
                }
                
                
            } else {
                //console.log('File / Field missing.');
                var data = {
                    error   : 1,
                    msg     : 'File / Field missing'
                } ;
                res.send(data);
            }
        }); 
    },
    /**
     * send notification mails to board creator, followers
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 03-Dec-2013
     * @param req, board_id
     */
    notificationMail: function(req, board_id) {
        var
        user = req.session.login_user_id,
        loggeduser = req.session.login_user_name,
        board = board_id,
        followerModel = system.getModel('follower'),
        notificationModel = system.getModel('notification'),
        UserModel = system.getModel('user'),
        boardModel = system.getModel('board');

        boardModel.boardCreator(user, board, function(boarddata) {
            //check whether the logged user and creator are same or not
            if (boarddata.length > 0)
            {
                if (boarddata && user != boarddata[0]._id)
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
                        notification_generator: req.session.login_user_id
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
                if(followers.length>0){
                    var msg = req.session.login_user_name + " posts a pin";

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
                 if(followers.length>0){
                    var msg = req.session.login_user_name + " use the board you followed";
                    var i = 0,j=0;
                    for (i in followers)
                    {
                        if(boarddata && (boarddata[0]._id!=followers[i]._id))
                        {
                            //console.log(followers)
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
    }
};

module.exports = imageController;
