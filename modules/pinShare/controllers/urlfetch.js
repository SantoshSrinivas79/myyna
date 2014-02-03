/**
 *  ==========
 *  CONTROLLER
 *  ==========
 *  
 *  PIN IMAGES FROM URL
 *  
 *  @author     :   Rahul P R <rahul.pr@cubettech.com>
 *  @date       :   30-Oct-2013
 *  
 */
var gm = require('gm');
var fs = require('fs');
var url = require('url');
var http = require('http');
var im = require('imagemagick');
var urls = []; // urls array
var img_arr = []; // image array
var tmb_img_arr = []; // thumb image array
//var boardModel = system.getModel('board');
//system.loadHelper('myhelper');
//var pin_type_id = "527b4158b850403f04000000";
//system.loadHelper('myhelper');

var urlfetchController = {
    /**
     * shows a form to submit url for fetching images
     *
     **/
    fetch_image: function(req, res) {
        var data = {
            layout: 'urlfetch_layout'
        }
        system.loadView(res, 'pin_image/url_form', data);
    },
    /**
     * displays list of images available in the given url
     * 
     **/
    post_url: function(req, res2) {
        var urls = [];
        var urltitle = req.body.url;
        var urlObj = url.parse(urltitle, true, true);
        var hostname = urlObj.hostname;
        var pathname = urlObj.pathname;
        var protocol = urlObj.protocol;
//        var request = http.request(options, function(res) {
//            var data = '';
//            res.on('data', function(chunk) {console.log();
//                data += chunk;
//                var m,
//                        //urls = [], 
//                        str = data,
//                        rex = /<img [^>]*src="([^>"]+\/([^>"]+))"[^>]*?>/g;
//                while (m = rex.exec(str)) {
//                    var img = '';
//                    var imgPath = m[1];
//                    //console.log(m[1]);
//                    var imgArr = imgPath.split(".") ; 
//                    if(imgArr.length>=2)
//                        var file_ext = imgArr[imgArr.length -1] ;
//                    else
//                        var file_ext = 'jpg' ;
//                    
//                    //filter svg images
//                    if(file_ext!='svg') {
//                        //check if domain name exists before the image name, 
//                        //if not add that before image name to get real path to image
//                        //console.log(imgPath.substr(0, 5));
//                        if (imgPath.substr(0, 5) == 'https') {
//                            img = imgPath.replace('https','http');
//                        } else if (imgPath.substr(0, 4) == 'http') {
//                            img = imgPath;
//                        } else if(imgPath.substr(0, 2) == '//') {
//                            img = imgPath.substr(2);
//                        } else {
//                            img = protocol + '//' + hostname + '/' + imgPath;
//                        }
//                        //make sure image not exist in `img` array 
//                        if (urls.indexOf(img) == '-1') {
//                            /*console.log(img);
//                            im.identify(img, function(err, features){
//                                if (err) throw err
//                                console.log(features.width);
//                                if(features.width<=200){*/
//                                    urls.push(img);
//                                    
//                                    
//                               /*}
//                            });*/
//                        }
//                        
//                        
//                    }
//                }
//                
//            });
//            res.on('end', function() {
//                var data = {
//                    layout: 'urlfetch_layout',
//                    home: urls,
//                    full_url: urltitle
//                }
//                //clear stored values
//                full_url = '';
//                urls = [];
//                //system.loadView(res2,'pin_image/select_image', data);
//                var htm = system.getCompiledView('pin_image/select_image', data);
//                res2.send(htm);
//
//            });
//        });
//        request.on('error', function(e) {
//            console.log(e.message);
//        });
//        request.end();
          urlfetchController.httpfunc(req,res2,'www');
        
    },
    /**
     * shows selected images,
     * and a field for selecting board, textarea for description
     * 
     **/
    select_action: function(req, res) {
        var imagepinModel = system.getModel('imagepin');
        boardModel.getBoardAll(function(result) {
            //check if img_chkbox is an array or not
            //if not an array convert it into an array
            var chkdbox_arr = req.body.img_chkbox instanceof Array ?
                              req.body.img_chkbox   :
                              [req.body.img_chkbox] ;
            var data = {
                            layout: 'urlfetch_layout',
                            checkedbox: chkdbox_arr,
                            boards: result,
                            full_url: req.body.full_url
                       }
            //system.loadView(res,'pin_image/checked_images', data);
            //var htm = system.getCompiledView('pin_image/checked_images', data);
            //res.send(htm);
            var url_length = req.body.img_chkbox.length; // count of image urls array
            // do this portion iff atleast one image url exist
            if (url_length != 0) {
                var i = 0;
                urlfetchController.addimg_loop(i, imagepinModel, req, res,function(cbk){
                    if(cbk==1)
                        res.redirect('/pins');
                });
            } //end if(url_length!=0)
        });
    },
    /**
     *  this part insert images as pins to database
     *  images are stored in an array
     *  
     **/
    pin_action: function(req, res) {
        var imagepinModel = system.getPluginModel('imagepin');
        var url_length = req.body.urls.length; // count of image urls array
        // do this portion iff atleast one image url exist
        if (url_length != 0) {
            var i = 0;
            urlfetchController.addimg_loop(i, imagepinModel, req, res,function(cbk){
                if(cbk==1)
                    res.redirect('/pins');
            });
        } //end if(url_length!=0)
    },
    /**
     * success page
     * 
     **/
    success: function(req, res) {
        var data = {
            layout: 'urlfetch_layout',
            message: 'Pins inserted successfully.'
        }
        system.loadView(res, 'pin_image/success', data);
    },
    /**
     * this function uploads all images to DEFINES.IMAGE_PATH_ORIGINAL_REL,
     * insert details to database
     * call this function recursively
     *
     **/
    addimg_loop: function(i, imagepinModel, req, res, callback) {
        var urltitle = req.body.full_url;
        var urlObj = url.parse(urltitle, true, true);
        var hostname = urlObj.hostname;
        var pathname = urlObj.pathname;
        var protocol = urlObj.protocol;
        var url_length = req.body.img_chkbox.length; // count of image urls array
        var cur_time = new Date().getTime();
        var img_url = req.body.img_chkbox[i];
        var img_ext = HELPER.get_extension(img_url); // get image extension from function
        var imagename = cur_time + '_' + i + '.' + img_ext;
        var imagename_small = cur_time + '_' + i + '_sml.' + img_ext;
        var board_id = req.body.board_id;
        var description = req.body.description;
        var cur_time = new Date().getTime();
       /* if(img_ext!='svg'){*/
            // console.log(urlObj);
            //add imagename to array
            img_arr.push(imagename);
           //add imagename to thumb array
            tmb_img_arr.push(imagename_small);
            img_url = img_url.replace('https://', 'http://');
            
            var request = http.get(img_url, function(res2) {
                var imagedata = '';
                res2.setEncoding('binary')
                res2.on('data', function(chunk) {
                    imagedata += chunk
                })
                res2.on('end', function() {
                    var uploadedPath = DEFINES.IMAGE_PATH_ORIGINAL_REL + imagename;
                    
                    fs.writeFile(uploadedPath, imagedata, 'binary', function(err) {
                        //fs.unlink(imagedata);
                        //console.log(imagedata);
                        if (err)
                            throw err
                        console.log('File saved.' + i)
                        if (i <= url_length)
                        {
                            HELPER.get_img_width(im, uploadedPath, function(width) {
                                //resizing image
                                var rez_opt = {
                                    srcPath: uploadedPath,
                                    dstPath: DEFINES.IMAGE_PATH_SMALL_REL + imagename_small,
                                    width: width
                                };
                                im.resize(rez_opt, function(err, stdout, stderr) {

                                    im.identify(uploadedPath, function(err, features) {
                                        width2 = features.width;
                                        if (features.width > 600) {
                                            width2 = '600';
                                        }

                                        //resizing image
                                        var rez_opt = {
                                            srcPath: uploadedPath,
                                            dstPath: DEFINES.IMAGE_PATH_THUMB_REL + imagename,
                                            width: width2 // pop up image width
                                        };
                                        im.resize(rez_opt, function(err, stdout, stderr) {
                                            if (err)
                                                throw err;
                                            //console.log('resized');
                                            //this portion works only for the last loop
                                            //console.log(i + '::' + (url_length - 1) );
                                            if (i == (url_length - 1))
                                            {
                                                var db_data = {
                                                    board_id: mongo.ObjectID(board_id),
                                                    image_name: img_arr,
                                                    tmb_image_name: tmb_img_arr,
                                                    pin_type: "url_image",
                                                    pin_url: urltitle,
                                                    source_url: urltitle,
                                                    time: cur_time,
                                                    user_id: mongo.ObjectID(req.session.login_user_id),
                                                    description: description,
                                                    domain: hostname,
                                                    image_width: width,
                                                    blocked : 0
                                                };
                                                imagepinModel.insert(db_data, function(inserted_data) {
                                                    inserted_data[0].popStatus = '1' ;
                                                    var htm = system.getCompiledView('pins/imagePinView', inserted_data[0]);
                                                    /**
                                                     * socket  part
                                                     *
                                                     */
                                                    sio.sockets.emit('pageview', {
                                                        pin_type: 'url_image',
                                                        str: htm
                                                    });
                                                    //console.log(req);
                                                    //console.log(board_id);
                                                    //send notifications
                                                    urlfetchController.notificationMail(req,board_id);
                                                    //clearing arrays
                                                    img_arr = [];
                                                    tmb_img_arr = [];
                                                   
                                                    //console.log('567');
                                                    callback(1);
                                                });
                                                //console.log('893');
                                            } else {
                                                i++;
                                                //console.log(i);
                                                // call this function recursively
                                                urlfetchController.addimg_loop(i, imagepinModel, req, res, callback);
                                            }

                                        });
                                    });
                                });
                                //end resizing
                            }); // end  get_img_width(im,newPath,function(width){
                        }
                    });
                });
            });
        /*} else {
            console.log('Sorry svg file cannot be uploaded');
        }*/
            
    },
    /**add pin pop up old
     *
     **/
    addpin_notusing: function(req, res) {
        var data = {
            layout: 'urlfetch_layout'
        }
        system.loadView(res, 'pin_image/addpin', data);
    },
    /**add pin pop up 
     *
     **/
    addpin: function(req, res) {
        boardModel.getBoardAll(function(result) {
            var data = {
                layout: 'urlfetch_layout',
                boards: result
            }
            system.loadView(res, 'pin_image/addpin', data);
        });
    },
    /**
     * send notification mails to board creator, followers
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
                var msg = req.session.login_user_name + " posts a image pin";

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
                            console.log(followers)
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
    },
    httpfunc : function(req,res2,type){
        var urltitle = req.body.url;
        var urlObj   = url.parse(urltitle, true, true);
        var hostname = urlObj.hostname;
        var pathname = urlObj.pathname;
        var protocol = urlObj.protocol;
        var htmlData = '';
        if(type=='www'){
            if (hostname.substr(0, 4) != 'www.') {
                hostname = 'www.' + hostname;
            }
        }else if(type=='no_www'){
            if (hostname.substr(0, 4) == 'www.') {
                hostname = hostname.substr(4) ;
            }
        }
        console.log(hostname);
        var options = {
            host: hostname,
            path: pathname
        }
        var request = http.request(options, function(res) {
            var data = '';
            res.on('data', function(chunk) {
                data += chunk;
                htmlData = data ;
                //console.log(data);
                var m,
                        //urls = [], 
                        str = data,
                        rex = /<img [^>]*src="([^>"]+\/([^>"]+))"[^>]*?>/g;
                while (m = rex.exec(str)) {
                    var img = '';
                    var imgPath = m[1];
                    //console.log(m[1]);
                    var imgArr = imgPath.split(".") ; 
                    if(imgArr.length>=2)
                        var file_ext = imgArr[imgArr.length -1] ;
                    else
                        var file_ext = 'jpg' ;
                    
                    //filter svg images
                    if(file_ext!='svg') {
                        //check if domain name exists before the image name, 
                        //if not add that before image name to get real path to image
                        //console.log(imgPath.substr(0, 5));
                        if (imgPath.substr(0, 5) == 'https') {
                            img = imgPath.replace('https','http');
                        } else if (imgPath.substr(0, 4) == 'http') {
                            img = imgPath;
                        } else if(imgPath.substr(0, 2) == '//') {
                            img = imgPath.substr(2);
                        } else {
                            img = protocol + '//' + hostname + '/' + imgPath;
                        }
                        //make sure image not exist in `img` array 
                        if (urls.indexOf(img) == '-1') {
                            /*console.log(img);
                            im.identify(img, function(err, features){
                                if (err) throw err
                                console.log(features.width);
                                if(features.width<=200){*/
                                    urls.push(img);
                                    
                               /*}
                            });*/
                        }
                        
                        
                    }
                }
            });
            res.on('end', function() {
                //console.log('data ::' + data);
               // console.log('t ::' + htmlData);
                
                if(!htmlData){
                    request.end();
                    //console.log('no data');
                    urlfetchController.httpfunc(req,res2,'no_www');
                } else {
                    var data = {
                        layout: 'urlfetch_layout',
                        home: urls,
                        full_url: urltitle
                    }
                    //clear stored values
                    full_url = '';
                    urls = [];
                    //system.loadView(res2,'pin_image/select_image', data);
                    var htm = system.getCompiledView('pin_image/select_image', data);
                    res2.send(htm);
                }
            });
        });
        request.on('error', function(e) {
            console.log(e.message);
            var data = {
                "error" : 'Website does not exist.'
            };
            res2.send(200, data);
        });
        request.end();
    }

};

module.exports = urlfetchController;
