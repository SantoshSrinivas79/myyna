
/*
 * Sample Welcome page Controller
 * 
 * @package Sleek.js
 * @version 1.0
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */
var
formidable      = require('formidable'),
boardImagePath  = appPath + '/uploads/boards/',
fs              = require('fs'),
im              = require('imagemagick'),
UserModel       = system.getModel('user'),
FollowerModel   = system.getModel('follower'),
notificationModel = system.getModel('notification'),
maxImageSize    = 500 ,//size in Kb
validImage      = ['image/jpeg','image/pjpeg','image/png'],
 boardModel = system.getPluginModel('board');
system.loadHelper('myhelper');
system.getLibrary('helpRegister');
var settingsModel = system.getPluginModel('admin/settings');

//index function
var boardController = {
    
    limitcheck:function(req,res,data,clb){
        
       
        var boardModel = system.getPluginModel('board');
        var catModel   =   system.getPluginModel('category');
       catModel.getCategoryAll(function(categories) {
            boardModel.userBoards(req.session.login_user_id,function(count){
            console.log('entered');
                if(count>1){
                    var data = {
                        title: "Board cost",
                        categories: categories
                    }               
                    clb(system.getCompiledPluginView('home/addboard', data));
                } else {
                    clb(system.getCompiledView('pin_image/board_form'));
                }
            })
       });
           
//        }
//        else{
//            res.end();
//        }
    },
    
     paypalRedirect:function(req,res){
         
         
      
        var paypal_sdk = require('paypal-rest-sdk');
         var board_id = req.params.bid;
         req.session.board_id = board_id;
         settingsModel.list(function(settings){
        console.log(settings[0])
        paypal_sdk.configure({
            'host': settings[0].paypal_host,
            'port': '',
            'client_id': settings[0].paypal_client_id,
            'client_secret':settings[0].paypal_secret
        });
        
        var payment = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://192.168.1.65:3000/paypal",
                "cancel_url": "http://192.168.1.65:3000/cancel"
            },
            "transactions": [{
                "amount": {
                    "total": settings[0].paypal_cost,
                    "currency": "USD"
                },
                "description": "My awesome payment"
            }]
        };
        
        paypal_sdk.payment.create(payment, function (error, pay) {
            if (error) {
                console.log(error);
            } else {
               
                if(pay.payer.payment_method === 'paypal') {
                    req.session.paymentId = pay.id;
                    var redirectUrl;
                    for(var i=0; i < pay.links.length; i++) {
                        var link = pay.links[i];
                        if (link.method === 'REDIRECT') {
                            redirectUrl = link.href;
                        }
                    }
                   
                    res.redirect(redirectUrl);
                }
            }
        });
         });
     
        
    },
    
    paypal:function(req,res){
        
       var paypal_sdk = require('paypal-rest-sdk');
       var paymentId = req.session.paymentId;
  var payerId = req.param('PayerID');
  
  var transaction_data = {
      user_id : mongo.ObjectID(req.session.login_user_id),
      board_id: mongo.ObjectID(req.session.board_id),
      payment_id :req.session.paymentId,
      payer_id: payerId,
      time:new Date().getTime()
  }
 
  var details = { "payer_id": payerId };
  paypal_sdk.payment.execute(paymentId, details, function (error, payment) {
    if (error) {
      
      console.log(error);
    } else {
       
      transaction_data.txn_id = payment.transactions[0].related_resources[0].sale.id;
      
      boardModel.transaction_insert(transaction_data,function(insert){
       
       boardModel.board_update(mongo.ObjectID(req.session.board_id),function(update){
      res.redirect("/pins");
       });
      
      }); 
    }
  });
    },
    cancel:function(req,res){
        res.redirect('/boards')
    },
    
    paypalLoad: function(req, res) {
        
        var form = new formidable.IncomingForm();                
         var user = req.session.login_user_id;
         console.log(111111);
         console.log(user);
         
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
                                    locked :1,
                                    board_name: fields.board_name,
                                    description: fields.description,
                                    category_id: mongo.ObjectID(fields.category_id),
                                    //cost            :   fields.cost,
                                    cost: 5,
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
                                        if(followers.length>0){
                                        var msg = req.session.login_user_name + " creates a board";

                                        for (i in followers)
                                        {
                                            console.log(followers[i])

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
                                    }
                                    

                                    });
                                    var response = {
                                        location:'/paypalredirect/'+inserted_data[0]._id,
                                        error:0
                                    }
                                     res.send(response);
                         });
                            });
                        });
                    });
                });

            }
        }); 
   
    
}
}

module.exports = boardController;