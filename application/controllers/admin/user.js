/* 
 * Admin user managemnet controller
 * Have functions to manage admin users
 * 
 * @package cubetboard
 * @version 2.0
 * @author Robin <robin@cubettech.com>
 * @Date 14-11-2013
 */

system.setPartial('admin/topBar', 'adminTopBar');
system.setPartial('admin/sideBar', 'adminSideBar')
system.loadHelper('adminHelper');
system.getLibrary('helpRegister');
system.getLibrary('mailer');

var userController = {
    
    /**
     * View admin users
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 14-11-2013
     */
    viewUsers: function(req, res){
        res.locals.Breadcrumb = 'Users';
        res.locals.BreadcrumbLink = '/admin/viewusers';
        res.locals.subBreadcrumb = 'View all';
        
        var userModel = system.getModel('admin/user');
        userModel.getUsers({},function(users){
            system.loadView(res, 'admin/user/list', {title: 'Users' ,data:users});
        });
    },
    addUsers: function(req, res){
        res.locals.Breadcrumb = 'Users';
        res.locals.BreadcrumbLink = '/admin/viewusers';
        res.locals.subBreadcrumb = 'Add User';
        
        system.loadView(res, 'admin/user/add');
    },
    addUsersPost: function(req, res){
        if(req.body.username && req.body.password && (req.body.password == req.body.password_r)){
            
            var crypto = require('crypto');
            var user_pass = req.body.password + pass_salt;
            user_pass = crypto.createHash('md5').update(user_pass).digest("hex");
            var data = {
                "name": req.body.name,
                "username": req.body.username,
                "password": user_pass,
                "email": req.body.email,
                "time_created": new Date().getTime()
            };
            var userModel = system.getModel('admin/user');
            userModel.addUser(data, function(user){
                if(user[0]._id) {
                    var html = '<b>Hi ' + data.name + ', </b><br/>Your '+DEFINES.site_title+' account has been created.\
                                 You can login using the following username and password.<br/>\n\
                                Username: '+data.username+' <br/>\
                                Password: '+req.body.password+' <br/>   ';
//                                 
                    var maildata = {
                        mailcontent:{
                           "subject": "Welcome to "+ DEFINES.site_title,
                           "body":html
                        },
                        "tomail": data.email,
                        "html"  : html,
                        "subject": "Welcome to "+ DEFINES.site_title
                    }

                    HELPER.socketNotification('', 'notification', html, maildata, true);
                    
                    HELPER.setFlashMessage('Added new user.');
                } else {
                    HELPER.setFlashMessage('Sorry! something went wrong!', 'danger', 'Error');
                }
                res.redirect('/admin/viewusers');
            });
        } else {
            HELPER.setFlashMessage('Sorry! Something Went wrong!', 'danger', 'Error');
            res.redirect('back');
        }
    },
    updateUsersPost: function(req,res){
        if(req.body.id){
            var data = {
                "name": req.body.name,
                "email": req.body.email
            };
            var userModel = system.getModel('admin/user');
            userModel.updateUser(req.body.id, data, function(updated){
                if(updated == 1) {
                    HELPER.setFlashMessage('User details updated!');
                } else {
                    HELPER.setFlashMessage('Sorry! something went wrong!', 'danger', 'Error');
                }
                res.redirect('/admin/viewusers');
            });
        } else {
            HELPER.setFlashMessage('Sorry! Something Went wrong!', 'danger', 'danger', 'Error');
            res.redirect('back');
        }
    },
    checkUsername: function(req,res){
        var userModel = system.getModel('admin/user');
        userModel.checkUsername(req.params.username, function(user){
            if(user && user._id) {
                res.send({status:0});
            } else {
                res.send({status:1});
            }
        });
    },
    deleteUser: function(req,res){
        var userModel = system.getModel('admin/user');
        userModel.deleteUser(req.params.id, function(results){
            if(results == 1) {
                HELPER.setFlashMessage('User deleted successfully');
                res.redirect('back');
            } else {
                HELPER.setFlashMessage('User deletion failed!', 'danger', 'Error');
                res.redirect('back');
            }
        });
    },
    editUser: function(req, res){
        res.locals.Breadcrumb = 'Users';
        res.locals.BreadcrumbLink = '/admin/viewusers';
        res.locals.subBreadcrumb = 'Edit User';
        
        var userModel = system.getModel('admin/user');
        userModel.getUser(req.params.id, function(user) {  
            var data = {
                'edit': 1,
                'user': user
            }
            system.loadView(res, 'admin/user/add', data);
        });
             
        
    },
    blockUser: function(req, res){  
        if(!req.params.type || ! req.params.id){
            return;
        }
        
        var action = 'block';
        if(req.params.type == 0){
            action = 'unblock';
        }
        
        var userModel = system.getModel('admin/user');
        userModel.blockUser(req.params.id, req.params.type, function(user) {  
            if(user == 1) {
                HELPER.setFlashMessage('User '+action+'ed succesfully!');
            } else {
                HELPER.setFlashMessage('Failed to '+action+' user!', 'danger', 'Error');
            }
            res.redirect('back');
        });
    },
    ResetPassword: function(req, res){      
        
        var userModel = system.getModel('admin/user');
            
        userModel.getUser(req.params.id, function(user) {  
            if(user){
                var crypto = require('crypto');
                crypto.randomBytes(3, function(ex, buf) {
                    
                    var pwd = buf.toString('hex');
//                var pwd = '123456';
                    var user_pass = pwd + pass_salt;
                    user_pass = crypto.createHash('md5').update(user_pass).digest("hex");

                    var data = {
                        "password": user_pass
                    };
                    userModel.updateUser(req.params.id, data, function(updated){
                        if(updated == 1) {
                            var html = '<b>Hi '+user.name+', </b><br/> Your cubetboard password has been reset successfully.<br/>\
                                New password is :<b>'+pwd+'</b>';

                            // setup e-mail data with unicode symbols
                            var mailOptions = {
                                from: "CubetboardV2 <info@cubettech.com>", // sender address
                                to: user.email, // list of receivers
                                subject: "Cubetboard Password Reset", // Subject line
                                html: html // html body
                            }
                            
                            sendMail(mailOptions, function(error, response){
                                if(error){
                                    console.log(error);
                                } else{
                                    console.log("Message sent: " + response.message);
                                }
                            });
                            
                            HELPER.setFlashMessage('Password reset succesfull!');

                        } else {
                            HELPER.setFlashMessage('Sorry! something went wrong!', 'danger', 'Error');
                        }
                    });
                });
                
            } else {
                HELPER.setFlashMessage('Sorry! something went wrong!', 'danger', 'Error');
            }
            res.redirect('back');
        });
    },
    blockedUsers: function(req, res){
        res.locals.Breadcrumb = 'Users';
        res.locals.BreadcrumbLink = '/admin/viewusers';
        res.locals.subBreadcrumb = 'Blocked users';
        
        var userModel = system.getModel('admin/user');
        userModel.getUsers({'blocked':1},function(users){
            system.loadView(res, 'admin/user/list', {title: 'Blocked Users' ,data:users});
        });
    }
}

module.exports = userController;