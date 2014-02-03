/* 
 * Sitewide helper functions
 * Add your routes functions here 
 * 
 * @package Sleek.js
 * @version 1.0
 * @author Robin <robin@cubettech.com>
 * @Date 27-11-2013
 */

module.exports = {
    updateConfigs: function(settings){
        if(settings.title) DEFINES.site_title = settings.title;
        if(settings.meta_desc) DEFINES.meta_desc = settings.meta_desc;
        if(settings.meta_keys) DEFINES.meta_keys = settings.meta_keys;
        if(settings.logo) DEFINES.site_logo = settings.logo;
        if(settings.layout) DEFINES.site_layout = settings.layout;
    }    
}