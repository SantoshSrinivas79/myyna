/**
 * Site settings managemnet controller
 * Have functions to manage admin users
 * 
 * @package cubetboard
 * @version 2.0
 * @author Robin <robin@cubettech.com>
 * @Date 27-11-2013
 */

system.setPartial('admin/topBar', 'adminTopBar');
system.setPartial('admin/sideBar', 'adminSideBar')
system.loadHelper('adminHelper');
system.getLibrary('helpRegister');
system.getLibrary('mailer');

var settingsController = {
    
    /**
     * display site settings for updations
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 27-11-2013
     */
    general: function(req, res){
        res.locals.Breadcrumb = 'Site Settings';
        res.locals.BreadcrumbLink = '/admin/general-settings';
        res.locals.subBreadcrumb = 'General';
        
        var settingsModel = system.getModel('admin/settings');
        settingsModel.getGeneralSettings({},function(settings){
            system.loadView(res, 'admin/settings/general', {title: 'Settings' ,data:settings});
        });
    },
    updateGeneral: function(req, res){
        var formidable = require('formidable');
        var fs = require('fs');
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            var settings = {
                "title": fields.title,
                "meta_desc": fields.meta_desc,
                "meta_keys": fields.meta_keys,
                "layout": fields.layout,
                "timestamp": new Date().getTime()
            };
            var settingsModel = system.getModel('admin/settings');
            
            if(files.logo.name && files.logo.name != '') {
                fs.readFile(files.logo.path, function(err, data) {
                    var image = files.logo.name;
                    var extension = image.split(".").pop();
                    var newimage = 'site-logo.' + extension;
                    var newPath = 'uploads/' + newimage;

                    fs.writeFile(newPath, data, function(err) {
                        settings.logo = '/' + newimage;
                        settingsModel.updateGeneralSettings(fields.sid, settings, function(updated) {
                            if (updated)
                            {
                                fs.unlink(files.logo.path);
                                HELPER.updateConfigs(settings);
                                HELPER.setFlashMessage('Settings updated');
                                res.redirect('back');
                            } else {
                                HELPER.setFlashMessage('Something went wrong', 'danger', 'Error');
                                res.redirect('back');
                            }

                        });

                    });

                });
            } else {
                settingsModel.updateGeneralSettings(fields.sid, settings, function(updated) {
                            if (updated)
                            {
                                HELPER.updateConfigs(settings);
                                HELPER.setFlashMessage('Settings updated');
                                res.redirect('back');
                            } else {
                                HELPER.setFlashMessage('Something went wrong', 'danger', 'Error');
                                res.redirect('back');
                            }

                });
            }
        });
    },
    social: function(req, res){
        res.locals.Breadcrumb = 'Site Settings';
        res.locals.BreadcrumbLink = '/admin/general-settings';
        res.locals.subBreadcrumb = 'General';
        
        var fs = require('fs'); // file system module
        var fpath = appPath + '/application/config/defines.js';
        var key = 'FB';
        var value = 'Helloooo';
        fs.readFile(fpath, 'utf-8', function(err, data) {
            if (err) throw err;
            
            var parts = data.split('global.');
            parts[1] = parts[1].split('}')[0];
            
            var lines = parts[1].trim().split('\n');
            
            var settingsdummy = ['FB_APP_ID', 'FB_APP_SECRET', 'TW_CONS_KEY', 'TW_CONS_SECRET', 'TW_LOGIN', 'FB_LOGIN']
            var settings = [];
            lines.forEach(function(val,key){
                val = val.split(':');
                if(settingsdummy.indexOf(val[0].trim()) != -1){
                    val[1] = val[1].split('//');
                    settings[val[0].trim()] = val[1][0].replace(/[^\w\s]/gi, '').trim();
                }
                
                
            });
            
            system.loadView(res, 'admin/settings/social', {title: 'Settings' ,data:settings});
        });
    },
    updateSocial: function(req, res){    
        var params = req.body;
       
        var fs = require('fs'); // file system module
        var fpath = appPath + '/application/config/defines.js';
        fs.readFile(fpath, 'utf-8', function(err, data) {
            if (err) throw err;

            var parts = data.split('global.');
            parts[1] = parts[1].split('}')[0];

            var lines = parts[1].trim().split('\n');

            for(var key in params){
                    var value = params[key];
                    var match = 0;
                    lines.forEach(function(v,k){
                        if(v.indexOf(key) > -1){
                            if(key == 'TW_LOGIN' || key == 'FB_LOGIN') {
                                lines[k] = '    '+key+' : '+value+',';
                            } else {
                                lines[k] = '    '+key+' : "'+value+'",';
                            }
                            match = 1;
                        }
                    });
                    if(match == 0) {
                        console.log('Adding new key to config file..');
                        lines.push(',   '+key+' : "'+value+'"');
                    }
                    DEFINES[key] = value;
                    
            }

            var newfile = parts[0] + 'global.';
            lines.forEach(function(v,k){
                newfile += v + '\n';
            });
            newfile += '\n}\n //Last updated by admin user on ' + new Date();

            fs.writeFile(fpath, newfile, function(err) {
                if(err) {
                    HELPER.setFlashMessage('Something went wrong', 'danger', 'Error');
                    res.redirect('back');
                } else {
                    HELPER.setFlashMessage('Settings updated!');
                    res.redirect('back');
                }
            }); 
        });
    }
    
}

module.exports = settingsController;