/**
 * Controller for adding board
 * 
 * LICENSE: MIT
 *
 * @category cubetboard
 * @package Board
 * @copyright Copyright (c) 2007-2014 Cubet Technologies. (http://cubettechnologies.com)
 * @version 2.0
 * @author Rahul P R <rahul.pr@cubettech.com>
 * @Date 18-Nov-2013
 */

var 
boardModel      = system.getModel('board'),
catModel        = system.getModel('category'),
costModel       = system.getModel('cost'),
fs              = require('fs'),
formidable      = require('formidable'),
boardImagePath  = appPath + '/uploads/boards/',
im              = require('imagemagick'),
UserModel       = system.getModel('user'),
FollowerModel   = system.getModel('follower'),
notificationModel = system.getModel('notification'),
maxImageSize    = 500 ,//size in Kb
validImage      = ['image/jpeg','image/pjpeg','image/png'];
system.loadHelper('myhelper');

var boardController = {
    /**
     * shows a form to add board
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @Date 18-Nov-2013
     */
    board_form: function(req, res) {
        catModel.getCategoryAll(function(categories) {
            costModel.getCostAll(function(cost) {
                var data = {
                    layout: 'urlfetch_layout',
                    msg: '',
                    categories: categories,
                    cost: cost,
                    posted_data: []
                }
                system.loadView(res, 'pin_image/board_form', data);
            });
        });
    },
    /**
     *  retrieve posted data from form & insert details to db
     *  @author Rahul P R <rahul.pr@cubettech.com>
     *  @Date 18-Nov-2013
     */
    board_action: function(req, res) {
        var form = new formidable.IncomingForm();
        var user = req.session.login_user_id;
        form.parse(req, function(err, fields, files) {
            var 
            cur_time        = new Date().getTime(),
            fileSize        = files.board_img ? files.board_img.size : 0 ,
            fileType        = files.board_img ? files.board_img.type : '' ,
            img_name        = files.board_img ? files.board_img.name : '' ,
            img_name_time   = cur_time + '_' + img_name,
            img_path        = files.board_img ? files.board_img.path : '' ,
            // cost         = fields.cost,
            board_name      = fields.board_name ? fields.board_name : '' ,
            description     = fields.description ? fields.description : '' ,
            category_id     = fields.category_id ? fields.category_id : '' ,
            newPath         = boardImagePath + img_name,
            tmb_name        = img_name_time,
            tmb_path        = boardImagePath + tmb_name;
            tmb_path2       = boardImagePath + 'thumb/' + tmb_name;
            
            if (category_id == '' ||
                //cost =='' ||
                board_name == '' ||
                description == '' ||
                img_name == '') 
            {
                var data = {
                    error   : 1,
                    msg     : 'Please complete all fileds.'
                } ;
                res.send(data);
                
            } else if (!HELPER.typeValid(validImage,fileType)) {
                var data = {
                    error   : 1,
                    msg     : 'Invalid image format.'
                } ;
                res.send(data);
            } else if(fileSize  >  maxImageSize * 1024 ) {
                var data = {
                    error   : 1,
                    msg     : 'Image size should less than ' + maxImageSize + ' Kb' 
                } ;
                res.send(data);
            } else {
                // save images to folder
                fs.readFile(img_path, function(err, data) {
                    // write file to folder
                    fs.writeFile(newPath, data, function(err) {
                        //  console.log('renamed complete');
                        fs.unlink(img_path);
                        //  resize options
                        var rez_opt = {srcPath: newPath,
                            dstPath: tmb_path,
                            width: 400 // width of image
                        };
                        var rez_opt2 = {srcPath: newPath,
                            dstPath: tmb_path2,
                            width: 120, // width of image
                            height: 120 // height of image
                        };
                        im.resize(rez_opt, function(err, stdout, stderr) {
                            im.resize(rez_opt2, function(err2, stdout2, stderr2) {
                                if (err)
                                    throw err;
                                //delete uploaded image
                                fs.unlink(newPath, function() {
                                });
                                var db_data = {
                                    locked :0,
                                    board_name: fields.board_name,
                                    description: fields.description,
                                    category_id: mongo.ObjectID(fields.category_id),
                                    //cost            :   fields.cost,
                                    cost: 1,
                                    image: tmb_name,
                                    creator: mongo.ObjectID(req.session.login_user_id),
                                    timestamp : cur_time
                                };
                                //insert to database
                                boardModel.insert(db_data, function(inserted_data)
                                {
                                    //send notification to followers of board creator
                                    UserModel.findFollowers(user, "user", function(followers)
                                    {

                                        var msg = req.session.login_user_name + " creates a board";

                                        for (i in followers)
                                        {
                                            //console.log(followers[i])

                                            HELPER.socketNotification(followers[i].value.socket_id, 'notification', msg, '', false);

                                            var notification_data =
                                                    {
                                                        key: "board creation"
                                                        , notification_generator: req.session.login_user_id
                                                        , notification_acceptor: followers[i]._id
                                                        , notification: msg
                                                        , status: ""
                                                    }
                                            notificationModel.NotificationInsertion(notification_data, function(callback)
                                            {

                                            });
                                            i++;
                                        }

                                    })
                                    res.redirect('/boards');
                                });
                            });
                        });
                    });
                });

            }
        }); 
    },
    /**
     *  get all boards
     *  @author Rahul P R <rahul.pr@cubettech.com>
     *  @Date 18-Nov-2013
     */
    getboard: function(req, res) {
        boardModel.getBoardAll(function(boards) {
            var data = {
                layout: 'urlfetch_layout',
                boards: boards
            }
            system.loadView(res, 'pin_image/view_board', data);
        });
    },
    /**
     *  delete board 
     *  @author Rahul P R <rahul.pr@cubettech.com>
     *  @Date 18-Nov-2013
     */
    delete_board: function(req, res) {
        var id = req.params.id;
        boardModel.deleteBoard(id, function(flag) {
            if (flag === 1) {
                res.redirect('/get_board');
            } 
        });
    },
    /**
     *  List all board except logged user's
     *  @author Arya <arya@cubettech.com>
     *  @Date 22-11-2013
     */
    boardList: function(req, res){
       catModel.getCategoryAll(function(result) {
            boardModel.SelectedBoards(req.session.login_user_id, function(user) {
                UserModel.userDetails(req.session.login_user_id, function(userdetail) {
                    var data = {
                        'data': user,
                        'pagetitle': 'Boards',
                        'loiginuser': req.session.login_user_name,
                        'loggeduser_id':req.session.login_user_id,
                        category: result,
                        'user_image': userdetail[0].image
                        
                    };
                    system.loadView(res, 'pins/boardlist', data);
                    system.setPartial('pins/pinheader', 'pinheader');
                });
            });
        });
    },
    /**
     *  follows a particular board
     *  @author Arya <arya@cubettech.com>
     *  @Date 22-11-2013
     */
    followBoard: function(req, res) {
        var insert_data = {
                    "follower_id": req.body.board_id,
                    "followed_by": req.session.login_user_id,
                    "time": new Date().getTime(),
                    "followed_by_name": req.session.login_user_name,
                    "follow_type": "board"
                }
        FollowerModel.followerCheck(insert_data, function(res1)
            {
                if (res1)
                {
                    FollowerModel.insertFollower(insert_data, function(ress) {

                        if (ress)
                        {
                            boardModel.getBoardOne(req.body.board_id,function(boardcreator){
                                if(boardcreator && boardcreator[0].creator == req.session.login_user_id){
                                    var msg = insert_data.followed_by_name + " followed his/her own board"; 
                                }
                                else{
                                    var msg = insert_data.followed_by_name + " followed your board";
                                }

                                UserModel.getUserSocketId(req.body.user_id, function(user) {
                          
                                    if (user.length > 0)
                                    {
                                        var notification_data =
                                        {
                                            key: "board_follow"
                                            , 
                                            notification_generator: req.session.login_user_id
                                            , 
                                            notification_acceptor:  mongo.ObjectID(req.body.user_id)
                                            , 
                                            notification: msg
                                            , 
                                            status: 1
                                        }
                                        UserModel.UserSettings(user[0]._id.toHexString(), function(settings){
                                   
                                            if(settings[0].follow==1){
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
                                    } else {
                                        var data = {
                                            "data": "inserted"
                                        };
                                        res.send(200, data);
                                    }
                                });
                            });
                        }
                    });
                }
            else
            {
                res.send(200, false);
                console.log('already followed');
            }
        });
    },
    /**
     *  unfollows a particular board
     *  @author Arya <arya@cubettech.com>
     *  @Date 22-11-2013
     */
    unFollowBoard: function(req, res) {
        var insert_data =
                {
                    "follower_id": req.body.board_id,
                    "followed_by": req.session.login_user_id,
                    "follow_type": "board"
                }
        FollowerModel.BoardUnfollow(insert_data, function(remove) {
            var data = {"data": "removed"};
            res.send(200, data);
        })
    }
};

module.exports = boardController;