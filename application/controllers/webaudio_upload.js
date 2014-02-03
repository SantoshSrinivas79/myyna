/**
 * add webaudio / soundcloud
 * 
 * LICENSE: MIT
 *
 * @category cubetboard
 * @package Pins
 * @subpackage webaudio / soundcloud
 * @copyright Copyright (c) 2007-2014 Cubet Technologies. (http://cubettechnologies.com)
 * @version 2.0
 * @author Rahul P R <rahul.pr@cubettech.com>
 * @date 01-Nov-2013
 */

var url             = require('url');
var http            = require('http');
var imagepinModel   = system.getModel('imagepin');
var boardModel      = system.getModel('board');

var webaudioController = {
    /**
     *  shows a form to browse audio file
     *  @author Rahul P R <rahul.pr@cubettech.com>
     *  @date 18-Nov-2013
     */
    webaudio_form:function(req, res){
       boardModel.getBoardAll(function(result){ 
       var data = {
            layout: 'urlfetch_layout',
            boards: result
        }
        system.loadView(res,'pin_image/webaudio_form', data);
       });
    },
    /**
     *  retrieve posted data from form & insert details to db
     *  @author Rahul P R <rahul.pr@cubettech.com>
     *  @date 18-Nov-2013
     */
    webaudio_action:function(req, res){
       var audio_link = req.body.url ; 
       //do this only if link exists
       if(audio_link!='')
       {
       var urlObj = url.parse(audio_link, true, true);
       var hostname = urlObj.hostname ;
       var urltitle = hostname ;
       var board_id    = req.body.board_id ;
       var description = req.body.description ;
       var cur_time = new Date().getTime() ;
       var filename = '';
            //insert data to db after image upload completed
            var db_data = {
                       board_id    : mongo.ObjectID(board_id), 
                       pin_type    : "webaudio", 
                       pin_url     : audio_link,
                       source_url  : audio_link,
                       time        : cur_time ,
                       user_id     : mongo.ObjectID(req.session.login_user_id),
                       description : description,
                       domain      : hostname,
                       audio_link  : audio_link,
                       blocked     : 0
             };
            imagepinModel.insert(db_data,function(inserted_data){
                  inserted_data[0].popStatus = '1' ;
                  var htm = system.getCompiledView('pins/webaudioPinView', inserted_data[0]);
                   // send inserted pin to socket
                   sio.sockets.emit('pageview', {
                         pin_type   : 'webaudio',
                         str        : htm
                   });
                   // send notifications
                   webaudioController.notificationMail(req,board_id);
                   res.redirect('/pins');
            });
        } else {
            console.log('no files present.');
        }
    },
    /**
     *  send notification mails to board creator, followers
     *  @author Rahul P R <rahul.pr@cubettech.com>
     *  @date 18-Nov-2013
     *  @param req,board_id
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
            // console.log(boarddata);
            //check wether the logged user and creator are same or not
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
                                , notification_generator: req.session.login_user_id
                                , notification_acceptor: boarddata[0]._id
                                , notification: instant_msg
                                , status: 1
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
                                    , notification_generator: req.session.login_user_id
                                    , notification_acceptor: followers[l]._id
                                    , notification: msg
                                    , status: 1
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
                        if(boarddata && boarddata[0]._id!=followers[i]._id)
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
                                        , notification_generator: req.session.login_user_id
                                        , notification_acceptor: followers[i]._id
                                        , notification: msg
                                        , status: 1
                                    }
                            notificationModel.NotificationInsertion(notification_data, function(callback) {

                            });
                        }
                        i++;
                    }
            });
        });
    }
};

module.exports = webaudioController ;