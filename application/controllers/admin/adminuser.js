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
system.setPartial('admin/sideBar', 'adminSideBar');
system.loadHelper('adminHelper');
system.getLibrary('helpRegister');
system.getLibrary('mailer');
system.loadHelper('pinHelper');

var adminuserController = {
    
    /**
     * Login page for admin users
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 14-11-2013
     */
    login: function(req, res){
        system.loadView(res, 'admin/index');
    },
    /**
     * Authenticate admin 
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 14-11-2013
     */
    adminAuth: function(req, res){   
        var crypto = require('crypto');
        var user_name = req.body.username;
        var user_pass = req.body.password + pass_salt;
        user_pass = crypto.createHash('md5').update(user_pass).digest("hex");
        var data = {
            "username": user_name,
            "password": user_pass
        };
        var AdminModel = system.getModel('admin/adminuser');
        AdminModel.authenticate(data, function(admin) {
            if (admin && Object.keys(admin).length != 0)
            {
                req.session.admin_user_id = admin._id.toHexString();
                req.session.admin_user = admin;
                
                res.redirect('/admin/dashboard');
            }
            else {
                HELPER.setFlashMessage('Sorry! Wrong Credentials', 'danger', 'Error');
                res.redirect('back');
            }
        });
    },
    /**
     * Admin dashboard
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 14-11-2013
     */
    dashboard: function(req, res){
        res.locals.subBreadcrumb = 'Dashboard';
        
        var AdminModel = system.getModel('admin/adminuser');
        AdminModel.getCounts(function(counts){
            system.loadView(res, 'admin/dashboard', counts);
        });
        
    },
    /**
     * Logout
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 14-11-2013
     */
    logout: function(req, res){
        req.session.destroy(function(){
            res.redirect('/admin');
        });
    },
    /**
     * View admin users
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 14-11-2013
     */
    viewAdminUsers: function(req, res){
        res.locals.Breadcrumb = 'Admin Users';
        res.locals.BreadcrumbLink = '/admin/viewadmins';
        res.locals.subBreadcrumb = 'View all';
        
        var AdminModel = system.getModel('admin/adminuser');
        AdminModel.getAdminUsers(req.session.admin_user_id,function(users){
            system.loadView(res, 'admin/adminuser/list', {data:users});
        });
    },
    addAdminUsers: function(req, res){
        res.locals.Breadcrumb = 'Admin Users';
        res.locals.BreadcrumbLink = '/admin/viewadmins';
        res.locals.subBreadcrumb = 'Add Admin';
        
        system.loadView(res, 'admin/adminuser/add');
    },
    addAdminUsersPost: function(req, res){
        if(req.body.username && req.body.password && (req.body.password == req.body.password_r)){
            
            var crypto = require('crypto');
            var user_pass = req.body.password + pass_salt;
            user_pass = crypto.createHash('md5').update(user_pass).digest("hex");
            var data = {
                "name": req.body.name,
                "username": req.body.username,
                "password": user_pass,
                "email": req.body.email
            };
            var AdminModel = system.getModel('admin/adminuser');
            AdminModel.addAdmin(data, function(user){
                if(user[0]._id) {
                    var html = '<b>Hi ' + data.name + ', </b><br/>Your '+DEFINES.site_title+' admin account has been created.\
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
                res.redirect('/admin/viewadmins');
            });
        } else {
            HELPER.setFlashMessage('Sorry! Something Went wrong!', 'danger', 'Error');
            res.redirect('back');
        }
    },
    updateAdminUsersPost: function(req,res){
        if(req.body.id){
            var data = {
                "name": req.body.name,
                "email": req.body.email
            };
            
            if(req.body.password && req.body.password != '' && req.body.password_r && req.body.password_r != '' && (req.body.password == req.body.password_r)){
                console.log('pwd');
                var crypto = require('crypto');
                var user_pass = req.body.password + pass_salt;
                user_pass = crypto.createHash('md5').update(user_pass).digest("hex");
                data['password'] = user_pass;
            }
            var AdminModel = system.getModel('admin/adminuser');
            AdminModel.updateAdmin(req.body.id, data, function(updated){
                if(updated == 1) {
                    if(req.session.admin_user_id == req.body.id){
                        req.session.admin_user['name'] = req.body.name;
                        req.session.admin_user['email'] = req.body.email;
                    }
                    HELPER.setFlashMessage('User details updated!');
                } else {
                    HELPER.setFlashMessage('Sorry! something went wrong!', 'danger', 'Error');
                }
                res.redirect('/admin/viewadmins');
            });
        } else {
            HELPER.setFlashMessage('Sorry! Something Went wrong!', 'danger', 'Error');
            res.redirect('back');
        }
    },
    checkUsername: function(req,res){
        var AdminModel = system.getModel('admin/adminuser');
        AdminModel.checkUsername(req.params.username, function(user){
            if(user && user._id) {
                res.send({status:0});
            } else {
                res.send({status:1});
            }
        });
    },
    deleteAdminUser: function(req,res){
        var AdminModel = system.getModel('admin/adminuser');
        AdminModel.deleteAdmin(req.params.id, function(results){
            if(results == 1) {
                HELPER.setFlashMessage('User deleted successfully');
                res.redirect('back');
            } else {
                HELPER.setFlashMessage('User deletion failed!', 'danger', 'Error');
                res.redirect('back');
            }
        });
    },
    editAdminUser: function(req, res){
        res.locals.Breadcrumb = 'Admin Users';
        res.locals.BreadcrumbLink = '/admin/viewadmins';
        res.locals.subBreadcrumb = 'Edit Admin';
        
        var AdminModel = system.getModel('admin/adminuser');
        AdminModel.getAdminUser(req.params.id, function(user) {  
            var data = {
                'edit': 1,
                'user': user
            }
            system.loadView(res, 'admin/adminuser/add', data);
        });
    },
    ResetPassword: function(req, res){      
        
        var AdminModel = system.getModel('admin/adminuser');
            
        AdminModel.getAdminUser(req.params.id, function(user) {  
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
                    AdminModel.updateAdmin(req.params.id, data, function(updated){
                        if(updated == 1) {
                            var html = '<b>Hi '+user.name+', </b><br/> Your cubetboard admin password has been reset successfully.<br/>\
                                New password is :<b>'+pwd+'</b>';

                            var maildata = {
                                        mailcontent: {
                                            "subject": "Cubetboard Password Reset", // Subject line
                                            "body": html
                                        },
                                        "tomail":user.email, // list of receivers
                                        "html": html
                                    }
                         
                            HELPER.socketNotification('', 'notification', html, maildata, true);
                            
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
    }
}

module.exports = adminuserController;