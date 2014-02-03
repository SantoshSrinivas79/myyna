/** 
 * Audio file controller
 * 
 * LICENSE: MIT
 *
 * @category cubetboard
 * @package Pins
 * @subpackage Audio
 * @copyright Copyright (c) 2007-2014 Cubet Technologies. (http://cubettechnologies.com)
 * @version 2.0
 * @author Rahul P R <rahul.pr@cubettech.com>
 * @Date 18-Nov-2013
 */

var fs      = require('fs'); 
var url     = require('url');
var http    = require('http');
var util    = require('util');
var sys     = require('sys');
var ffmpeg  = require('fluent-ffmpeg');
var formidable      = require('formidable');
var imagepinModel   = system.getModel('imagepin');
var boardModel      = system.getModel('board');
system.loadHelper('myhelper');

var audioController = {
    /**
     *  shows a form to browse audio file
     *  @author Rahul P R <rahul.pr@cubettech.com>
     *  @Date 18-Nov-2013
     */
    audio_upload:function(req, res){
        boardModel.getBoardAll(function(result){   
            var data = {
                layout: 'urlfetch_layout',
                boards: result
            }
            system.loadView(res,'pin_image/audio_form', data);
        });
    },
    /**
     * retrieve posted data from form
     *  @author Rahul P R <rahul.pr@cubettech.com>
     *  @Date 18-Nov-2013
     */
    audio_upload_action:function(req, res){
        var form = new formidable.IncomingForm();
        var i = 0 ;
        audioController.uploadAudio(i,imagepinModel,form,req,res,function(status){
            if(status==1){
                //redirect page only after file upload completed
                res.redirect('/pins');
            }
        });

    },
    /**
     *  uploads audio to DEFINES.AUDIO_PATH_REL,
     *  insert details to database
     *  @author Rahul P R <rahul.pr@cubettech.com>
     *  @Date 18-Nov-2013
     *  @param i,imagepinModel,form,req,res
     */
    uploadAudio:function(i,imagepinModel,form,req,res,callback){
        form.parse(req, function(err, fields, files){
            var filename    = files.upload.name ; 
            var urltitle    = '' ;
            var hostname    = '' ;
            var board_id    = fields.board_id ;
            var description = fields.description ;
            var cur_time    = new Date().getTime() ;
            //do this only iff all inputs filled
            if(filename!='' && board_id!='' && description!='')
            {
                var file_ext =  HELPER.get_extension(filename); // get image extension from function
                var filename =  cur_time + '_' + i + '.' + file_ext ;
                //check if file is in valid format
                if(
                    files.upload.type=='audio/mpeg' ||
                    files.upload.type=='audio/mp3'  ||
                    files.upload.type=='audio/x-mpeg'  ||
                    files.upload.type=='audio/x-mp3'  ||
                    files.upload.type=='audio/mpeg3'  ||
                    files.upload.type=='audio/x-mpeg3'  ||
                    files.upload.type=='audio/mpg'  ||
                    files.upload.type=='audio/x-mpg'  ||
                    files.upload.type=='audio/x-mpegaudio'
                    )
                    {
                    var filenameMp3 = cur_time + '_' + i + '.mp3' ;
                    var filenameOgg = cur_time + '_' + i + '.ogg' ;
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
                                var htm = system.getCompiledView('pins/audioPinView', inserted_data[0]);
                                // send details to socket
                                sio.sockets.emit('pageview', {
                                    pin_type : 'audio',
                                    str : htm
                                });
                                //send notifications
                                audioController.notificationMail(req,board_id);
                                    
                                callback(1);
                            });
                        }); 
                    });
                } else {
                    console.log('Sorry not a mp3 file!!!!');
                }
            } else {
                console.log('Please complete all fields!!!');
            }
        }); 
    },
    /**
     * function for sending notification mails to board creator, followers
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @Date 18-Nov-2013
     * @param req,board_id
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
                var msg = req.session.login_user_name + " posts an audio pin";

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

            });
            UserModel.findFollowers(board, 'board', function(followers) {
                var msg = req.session.login_user_name + " use the board you followed";
                var i = 0,j=0;
                for (i in followers)
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
                    i++;
                }
            });
        });
    }
};

module.exports = audioController ;
