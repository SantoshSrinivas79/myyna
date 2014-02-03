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

var pinsController = {
    
    /**
     * View admin users
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 14-11-2013
     */
    viewPins: function(req, res){
        res.locals.Breadcrumb = 'Users';
        res.locals.BreadcrumbLink = '/admin/viewusers';
        res.locals.subBreadcrumb = 'View all';
        var start = 0;
        var end = 10;
        var PinModel = system.getModel('admin/pins');
        
        // PinModel.getPinsAll(0,function(pins){               
        //PinModel.pinList(start,end,function(users){
            
        system.loadView(res, 'admin/pins/list', {
            title: 'Pins',
            type:0
                    
        });
    //});
    //})
    },
    addPins: function(req, res){
        res.locals.Breadcrumb = 'Users';
        res.locals.BreadcrumbLink = '/admin/viewusers';
        res.locals.subBreadcrumb = 'Add User';
        
        system.loadView(res, 'admin/user/add');
    },
    addPinsPost: function(req, res){
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
            var PinModel = system.getModel('admin/pins');
            PinModel.addUser(data, function(user){
                if(user[0]._id) {
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
    updatePinsPost: function(req,res){
        if(req.body.id){
            var data = {
                "name": req.body.name,
                "email": req.body.email
            };
            var PinModel = system.getModel('admin/pins');
            PinModel.updateUser(req.body.id, data, function(updated){
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
    deletePin: function(req,res){
        var PinModel = system.getModel('admin/pins');
        PinModel.deletePin(req.params.id, function(results){
            if(results == 1) {
                HELPER.setFlashMessage('Pin deleted successfully');
                res.redirect('back');
            } else {
                HELPER.setFlashMessage('Pin deletion failed!', 'danger', 'Error');
                res.redirect('back');
            }
        });
    },
    editPin: function(req, res){
        res.locals.Breadcrumb = 'Users';
        res.locals.BreadcrumbLink = '/admin/viewusers';
        res.locals.subBreadcrumb = 'Edit User';
        
        var PinModel = system.getModel('admin/pins');
        PinModel.getUser(req.params.id, function(user) {  
            var data = {
                'edit': 1,
                'user': user
            }
            system.loadView(res, 'admin/user/add', data);
        });
             
        
    },
    blockPin: function(req, res){  
        if(!req.params.type || ! req.params.id){
            return;
        }
        
        var action = 'block';
        if(req.params.type == 0){
            action = 'unblock';
        }
        
        var PinModel = system.getModel('admin/pins');
        PinModel.blockPin(req.params.id, req.params.type, function(user) {  
            if(user == 1) {
                HELPER.setFlashMessage('Pin '+action+'ed succesfully!');
            } else {
                HELPER.setFlashMessage('Failed to '+action+' pin!', 'danger', 'Error');
            }
            res.redirect('back');
        });
    },
    blockedPins: function(req, res){
        res.locals.Breadcrumb = 'Pins';
        res.locals.BreadcrumbLink = '/admin/viewpins';
        res.locals.subBreadcrumb = 'Blocked pins';
        
        var PinModel = system.getModel('admin/pins');
        //        PinModel.getPins({
        //            'blocked':1
        //        },function(users){
        system.loadView(res, 'admin/pins/list', {
            title: 'Blocked Pins',
            type:1
               
        // });
        });
    },
    reportedPins: function(req, res){
        res.locals.Breadcrumb = 'Pins';
        res.locals.BreadcrumbLink = '/admin/viewpins';
        res.locals.subBreadcrumb = 'Reported pins';
        
        var PinModel = system.getModel('admin/pins');
        PinModel.getPins({
            'reported':1
        },function(users){           
            system.loadView(res, 'admin/pins/reported', {
                title: 'Reported Pins' ,
                data:users
            });
        });
    },
    cleanPin: function(req, res){  
        if(! req.params.id){
            return;
        }
        
        var PinModel = system.getModel('admin/pins');
        PinModel.cleanPin(req.params.id, function(user) {  
            if(user == 1) {
                HELPER.setFlashMessage('Pin Restored succesfully!');
            } else {
                HELPER.setFlashMessage('Failed to restore pin!', 'danger', 'Error');
            }
            res.redirect('back');
        });
    },
    addBoard: function(req, res){
        res.locals.Breadcrumb = 'Board';
        res.locals.BreadcrumbLink = '/admin/viewboards';
        res.locals.subBreadcrumb = req.params.id ? 'Edit Board':'Add Board';
        
        var PinModel = system.getModel('admin/pins');
        PinModel.getCatgeories(function(cats){
            if(req.params.id){
                PinModel.getBoard(req.params.id, function(board){
                    var data ={
                        edit: 1,
                        cats:cats,
                        values: board
                    };
                    system.loadView(res, 'admin/board/add', data);
                });
            } else {
                system.loadView(res, 'admin/board/add', {
                    cats:cats
                });
            }
        });
        
        
    },
    addBoardPost: function(req, res){
        var formidable = require('formidable');
        var fs = require('fs');
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            var board = {
                "board_name": fields.name,
                "description": fields.desc,
                "category_id": mongo.ObjectID(fields.category),
                "timestamp": new Date().getTime(),
                "locked": 0,
                "creator": mongo.ObjectID(req.session.admin_user_id)
            };
            
            var id = fields.bid ? fields.bid : false;
            
            var PinModel = system.getModel('admin/pins');
            
            if(files.image.name && files.image.name != '') {
                fs.readFile(files.image.path, function(err, data) {
                    var image = files.image.name;
                    var extension = image.split(".").pop();
                    var newimage = image.split(".")[0] + '.' + extension;
                    var newPath = 'uploads/boards/' + newimage;

                    fs.writeFile(newPath, data, function(err) {
                        board.image = newimage;
                        PinModel.updateBoard(id, board, function(updated) {
                            if (updated)
                            {
                                fs.unlink(files.image.path);
                                if(id) {
                                    HELPER.setFlashMessage('Board updated');
                                } else {
                                    HELPER.setFlashMessage('Board Added succesfully');
                                }
                                res.redirect('/admin/viewboards');
                            } else {
                                HELPER.setFlashMessage('Something went wrong', 'danger', 'Error');
                                res.redirect('back');
                            }

                        });

                    });

                });
            } else {
                PinModel.updateBoard(id, board, function(updated) {
                    if (updated)
                    {
                        if(id) {
                            HELPER.setFlashMessage('Board updated');
                        } else {
                            HELPER.setFlashMessage('Board Added succesfully');
                        }
                        res.redirect('/admin/viewboards');
                    } else {
                        HELPER.setFlashMessage('Something went wrong', 'danger', 'Error');
                        res.redirect('back');
                    }

                });
            }
        });
    },
    showBoards: function(req, res){
        res.locals.Breadcrumb = 'Board';
        res.locals.BreadcrumbLink = '/admin/viewboards';
        res.locals.subBreadcrumb = 'All Boards';
        
        var PinModel = system.getModel('admin/pins');
        PinModel.getBoards(function(boards){
            system.loadView(res, 'admin/board/list', {
                title: 'Boards' ,
                data:boards
            });
        });
    },
    LockBoard: function(req, res){  
        if(!req.params.type || ! req.params.id){
            return;
        }
        
        var action = 'lock';
        if(req.params.type == 0){
            action = 'unlock';
        }
        
        var PinModel = system.getModel('admin/pins');
        PinModel.lockBoard(req.params.id, req.params.type, function(user) {  
            if(user == 1) {
                HELPER.setFlashMessage('Board '+action+'ed succesfully!');
            } else {
                HELPER.setFlashMessage('Failed to '+action+' pin!', 'danger', 'Error');
            }
            res.redirect('back');
        });
    },
    deleteBoard: function(req,res){
        var PinModel = system.getModel('admin/pins');
        PinModel.deleteBoard(req.params.id, function(results){
            if(results == 1) {
                HELPER.setFlashMessage('Board deleted successfully');
                res.redirect('back');
            } else {
                HELPER.setFlashMessage('Board deletion failed!', 'danger', 'Error');
                res.redirect('back');
            }
        });
    },
    addCategory: function(req, res){
        res.locals.Breadcrumb = 'Category';
        res.locals.BreadcrumbLink = '/admin/viewcategories';
        res.locals.subBreadcrumb = 'Add Category';
        
        var PinModel = system.getModel('admin/pins');
        if(req.params.id){
            PinModel.getCategory(req.params.id, function(board){
                var data ={
                    edit: 1,
                    values: board
                };
                system.loadView(res, 'admin/category/add', data);
            });
        } else {
            system.loadView(res, 'admin/category/add');
        }
        
    },
    addCategoryPost: function(req, res){
        var formidable = require('formidable');
        var fs = require('fs');
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            var category = {
                "category_name": fields.name,
                "description": fields.desc,
                "timestamp": new Date().getTime()
            };
            
            var id = fields.cid ? fields.cid : false;
            
            var PinModel = system.getModel('admin/pins');
            
            if(files.image.name && files.image.name != '') {
                fs.readFile(files.image.path, function(err, data) {
                    var image = files.image.name;
                    var extension = image.split(".").pop();
                    var newimage = image.split(".")[0] + '.' + extension;
                    var newPath = 'uploads/category/' + newimage;

                    fs.writeFile(newPath, data, function(err) {
                        category.image = newimage;
                        PinModel.updateCategory(id, category, function(updated) {
                            if (updated)
                            {
                                fs.unlink(files.image.path);
                                if(id) {
                                    HELPER.setFlashMessage('Category updated');
                                } else {
                                    HELPER.setFlashMessage('Category Added succesfully');
                                }
                                res.redirect('/admin/viewcategories');
                            } else {
                                HELPER.setFlashMessage('Something went wrong', 'danger', 'Error');
                                res.redirect('back');
                            }

                        });

                    });

                });
            } else {
                PinModel.updateCategory(id, category, function(updated) {
                    if (updated)
                    {
                        if(id) {
                            HELPER.setFlashMessage('Category updated');
                        } else {
                            HELPER.setFlashMessage('Category Added succesfully');
                        }
                        res.redirect('/admin/viewcategories');
                    } else {
                        HELPER.setFlashMessage('Something went wrong', 'danger', 'Error');
                        res.redirect('back');
                    }

                });
            }
        });
    },
    showCategories: function(req, res){
        res.locals.Breadcrumb = 'Users';
        res.locals.BreadcrumbLink = '/admin/viewcategories';
        res.locals.subBreadcrumb = 'All Categories';
        
        var PinModel = system.getModel('admin/pins');
        PinModel.getCatgeories(function(cats){
            system.loadView(res, 'admin/category/list', {
                title: 'Categories' ,
                data:cats
            });
        });
    },
    deleteCategory: function(req,res){
        var PinModel = system.getModel('admin/pins');
        PinModel.deleteCategory(req.params.id, function(results){
            if(results == 1) {
                HELPER.setFlashMessage('Category deleted successfully');
                res.redirect('back');
            } else {
                HELPER.setFlashMessage('Category deletion failed!', 'danger', 'Error');
                res.redirect('back');
            }
        });
    },
    
    pinPagination:function(req,res){
        
     
        var PinModel = system.getModel('admin/pins');  
        var nedata = [];
        var data1=[];
        var data ={};
        var data2='';
        var i =0;
        if(req.params.blocktype==1){
            var blocked=1;
        }
        else{
            var blocked=0; 
        }
        if(req.query.sSearch && req.query.sSearch!=""){
             
            var search = req.query.sSearch;
            if(search.length!=24){
               
                data.sEcho = parseInt(req.query.sEcho) + 1;
                data.iTotalRecords = 0;
                data.iTotalDisplayRecords = 0;
                data.aaData = '';
                res.send(data); 
                return;
            }
        }
        else{
            var search = null; 
        }
        PinModel.getPinsAll(blocked,search,function(pins){ 
             
            data.sEcho = parseInt(req.query.sEcho) + 1;
            data.iTotalRecords = pins;
            data.iTotalDisplayRecords = pins;
       
            PinModel.pinList(blocked,search,parseInt(req.query.iDisplayStart), parseInt(req.query.iDisplayLength),function(users){
                if(users.length>0){
                    users.forEach(function(v){
                
                        var pin_date = HELPER.getDate(v.time);                
                                           
   
                        var template = system.getCompiledView('admin/pins/row', v)
                        var actions = system.getCompiledView('admin/pins/action', v)
                        var data2 = [template,v.user.name, pin_date,actions];  
                
                        if(nedata.push(data2)){
                   
                            i++;
                            data2='';
                        }
              
                        if(users.length==i){
                            data.aaData = nedata;                     
                            res.send(data);
                        } 
                    })
           
                }
                else{
            
                    data.aaData = '';
                    res.send(data); 
                }
            });
        });
          
    }
}

module.exports = pinsController;
