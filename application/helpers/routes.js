/* 
 * Routing functions
 * Add your routes functions here 
 * 
 * @package Sleek.js
 * @version 1.0
 * 
 * 
 * The MIT License (MIT)

 * Copyright Cubet Techno Labs, Cochin (c) 2013 <info@cubettech.com>

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

//define route functions here
module.exports = {
    login_validate:function(req, res, next) {
        if (!req.session.login_user_id) {
            
            res.redirect('/login');
        } else {
            next();
        }
    },
    userLoginPreCheck: function(req, res, next) {
        if (req.session.login_user_id){
            res.redirect('/pins');
        }
        else {
            next();
        }
    },
    adminLoginPreCheck: function(req, res, next) {
        res.locals.layout = 'adminlogin';
        if (!req.session.admin_user_id) {
            next();
        } else {
            res.redirect('/admin/dashboard');
        }
    },
    adminLoginCheck: function(req, res, next) {
        res.locals.layout = 'admin';
        res.locals.loggedUser = req.session.admin_user;
        if (!req.session.admin_user_id) {
            //            next();
            res.redirect('/admin');
        } else {
            next();
        }
    },
    DefineLocals: function(req, res, next){
        system.loadHelper('siteWide');
        if(!DEFINES.title) {
            var settingsModel = system.getModel('admin/settings');
            settingsModel.getGeneralSettings({},function(settings){
                HELPER.updateConfigs(settings);
            });
        }
        
        res.locals.siteLayout = DEFINES.site_layout;
        res.locals.siteUrl = sleekConfig.siteUrl;
        if(req.route.path.indexOf(':') != -1){
            var paths = req.route.path.split('/:');
            res.locals.sideMenu = paths[0];
        } else {
            res.locals.sideMenu = req.route.path; 
        }
        next();
    }
    
}