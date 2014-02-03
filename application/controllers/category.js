/**
 * Category controller
 * 
 * LICENSE: MIT
 *
 * @category cubetboard
 * @package Category
 * @copyright Copyright (c) 2007-2014 Cubet Technologies. (http://cubettechnologies.com)
 * @version 2.0
 * @author Rahul P R <rahul.pr@cubettech.com>
 * @Date 18-Nov-2013
 */

var catModel    = system.getModel('category');
var fs          = require('fs'); 
var formidable  = require('formidable');
var im          = require('imagemagick');
var catImagePath = appPath + '/uploads/category/' ;

var categoryController = {
    /**
     *  shows a form to add category
     *  @author Rahul P R <rahul.pr@cubettech.com>
     *  @Date 18-Nov-2013
     */
    category_form:function(req, res){
       var data = {
            layout  : 'urlfetch_layout',
            msg     : '',
            posted_data : []
        }
        system.loadView(res,'pin_image/category_form', data);
    },
    /**
     *  insert details to db and save image
     *  @author Rahul P R <rahul.pr@cubettech.com>
     *  @Date 18-Nov-2013
     */
    category_action:function(req, res){
       var form = new formidable.IncomingForm(); 
       form.parse(req, function(err, fields, files){
            var 
            cur_time    = new Date().getTime(),
            img_name    = files.cat_img.name,
            img_path    = files.cat_img.path ,
            category    = fields.category,
            newPath     = catImagePath + img_name_time,
            tmb_name    = 'sml_' + img_name_time,
            tmb_path    = catImagePath + tmb_name ,
            img_name_time =  cur_time + '_' + img_name;
            
            var dat = { layout      : 'urlfetch_layout',
                        posted_data : fields,
                        msg         : ''
            };
            
            if(category=='' || img_name=='')
            {
                 //fields missing.
                 dat.msg = 'Please complete all fields.';
                 system.loadView(res,'pin_image/category_form', data);
            } else if((files.cat_img.type!='image/jpeg' &&
                   files.cat_img.type!='image/pjpeg' &&  
                   files.cat_img.type!='image/png' &&  
                   files.cat_img.type!='image/gif') ||
                   (Math.round(files.cat_img.size / 1024)>500)) 
            {
                 //fields missing.
                 dat.msg = 'Invalid image format/size.';
                 system.loadView(res,'pin_image/category_form', dat);
            } else {
            // for storing images to folder
            fs.readFile(img_path, function (err, data) {
                 // write file to folder
                 fs.writeFile(newPath, data, function (err) {
                     //console.log('renamed complete');
                     fs.unlink(img_path);
                     // resizing image
                     var rez_opt = {
                         srcPath: newPath,
                         dstPath: tmb_path,
                         width: '200' // width of image
                     };
                     im.resize(rez_opt, function(err, stdout, stderr) {
                         if (err)
                             throw err;
                         //delete uploaded image
                         fs.unlink(newPath,function(){});
                         var db_data = {
                                category_name   :   fields.category,
                                image           :   files.cat_img.name
                          };
                         //insert to database
                         catModel.insert(db_data,function(inserted_data){
                             res.redirect('/success');
                         });
                     });
                 });
            });
            } //  end else
       }); // end form.parse(req, function(err, fields, files){
    },
    /**
     * update category
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @Date 18-Nov-2013
     */
    category_update:function(req, res){
        var con     = {'_id'            : req.body._id      };
        var db_data = {'category_name'  : req.body.category };
        catModel.update(con,db_data,function(updated_data){
            res.redirect('/success');
        });
    },
    /**
     * get all categories
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @Date 18-Nov-2013
     */
    getcategory:function(req, res){
        catModel.getCategoryAll(function(categories){
            var data = {
                layout: 'urlfetch_layout',
                categories : categories
            }
            system.loadView(res,'pin_image/view_category',data);
        });
    },
    /**
     * delete category
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @Date 18-Nov-2013
     */
    delete_category:function(req, res){
        var _id = req.params.id ;
        catModel.getCategoryOne(_id,function(data){
            catModel.deleteCategory(_id,function(flag){
                if(flag===1){
                    //delete image if any
                    if (typeof data.cat_img != 'undefined' && data.cat_img!='') {
                        fs.unlink(catImagePath + data.cat_img);
                    }
                    res.redirect('/get_category');
                }else{
                    // not deleted
                }
            });
        });
    }
};

module.exports = categoryController ;