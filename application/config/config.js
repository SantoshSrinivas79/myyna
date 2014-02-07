/* 
 * Configuration
 * 
 * @version 1.0
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

//port number
global.sleekConfig.appPort = 3000;

global.sleekConfig.appHost = '192.168.1.65:3000';

global.sleekConfig.siteUrl = 'http://192.168.1.65:3000';
global.sleekConfig.env = 'development';

//global.sleekConfig.configLibs = [];
//themeing
global.sleekConfig.theme = 'default'
//logging
global.sleekConfig.logToFile = false; // if true, logs will write to file instead of console.
global.sleekConfig.accesslog = 'application/var/logs/access.log'; // logging each access
global.sleekConfig.errorlog = 'application/var/logs/error.log'; // application errors
global.sleekConfig.systemlog = 'application/var/logs/system.log'; // manual logging

global.webpagepath = "public/webpages";
global.videopath = "public/videos";
global.user_images = "public/user_images";
global.loggedUser = new Array();//array to save socket id of logged user
global.pass_salt = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';//salt append with passwordower123
