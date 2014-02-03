/* 
 * Pin Operations 
 * 
 * @package cubetboard
 * @version 2.0
 * @author Arya <arya@cubettech.com>
 * @Date 28-10-2013
 */

/**
 * GET pin listing.
 */


//var PostModel = system.getModel('pin');
//var pinModel = system.getModel('imagepin');
var boardModel = system.getPluginModel('board');
//var UserModel = system.getModel('user');
//var followerModel = system.getModel('follower');
//var notificationModel = system.getModel('notification');
var shareModel = system.getPluginModel('pinShare');
//var catModel = system.getModel('category');
//var msg = '';
//system.loadHelper('pinHelper');
//system.loadHelper('myhelper');
//system.getLibrary('helpRegister');
//var i = 0;
//var check = 0;
var pinController = {
   
    sharejs: function(req,res){
        var data = {'url': sleekConfig.siteUrl};
        var js = system.getCompiledPluginView('share/js', data);
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.end(js);
    },
    sharePinLoad:function(req,res){
       
         
        var data = {
            'pagetitle': 'Pin Page',
            'layout':false
        };
        system.loadPluginView(res, 'share/firststep', data);
       system.setPartial('pins/pinheader', 'pinheader');
    },
    
    InitialshareSave:function(req,res){

        var url = req.body.url;
        if(url.substr(0, 31) == 'http://www.youtube.com/watch?v='){
            var image='';
        }
        else{
            var image = req.body.image;
        }
        var pin_type = req.body.type;
        //console.log(image);
        var data ={
            "pin_type" : pin_type,
            "contents":image,
            "pin_url"   : url

        
        }
        shareModel.InsertShare(data,function(ress){
            var share_id = ress[0]._id;
            res.cookie('Cubet_share_pin', share_id, {
                maxAge: 60*5*1000, 
                httpOnly: false
            });
            
            res.send(JSON.stringify(ress[0]));           
            
        });
    },
    
    imageList:function(req,ress){
        var url = require('url');
        var http = require('http');
        var im = require('imagemagick');
        var urls = [];
        var urltitle = req.body.pageurl;
        var urlObj = url.parse(urltitle, true, true);
        var hostname = urlObj.hostname;
        var pathname = urlObj.pathname;
        var protocol = urlObj.protocol;
        var options = {
            host: hostname,
            path: pathname
        }
        var request = http.request(options, function(res) {
            var data = '';
            res.on('data', function(chunk) {
                data += chunk;
                var m,
                //urls = [], 
                str = data,
                rex = /<img [^>]*src="([^>"]+\/([^>"]+))"[^>]*?>/g;
               
                while (m = rex.exec(str)) {
                    //check if domain name exists before the image name, 
                    //if not add that before image name to get real path to image
                    var img = '';
                    var imgPath = m[1];
                    //console.log(m[1]);
                    var imgArr = imgPath.split(".") ; 
                    if(imgArr.length>=2)
                        var file_ext = imgArr[imgArr.length -1] ;
                    else
                        var file_ext = 'jpg' ;
                      
                    //filter svg images
                    //  console.log(imgPath.substr(0, 4));
                    if(file_ext!='svg') {
                       // console.log(imgPath); 
                        if (imgPath.substr(0, 4) == 'http'|| imgPath.substr(0, 1) == '//') {
                            img = imgPath;
                           //  console.log(img); 
                        // console.log(img);
                        } else {
                            // img = protocol + '//' + hostname + '/' + imgPath;
                            var index = pathname.lastIndexOf('/');
                            img = protocol + '//' + hostname + pathname.substring(0,index) + '/' + imgPath;
                        }
                      
                        //check if image already exist in `img` array 
                        if (urls.indexOf(img) == '-1') {
                           
                          
                            // console.log(img);          
                            urls.push(img);
                                      
                                        
                        
                        }
                    }
                }
            });
            res.on('end', function() {
                var data = {
                   
                    home: urls,
                    full_url: urltitle,
                    layout:false
                }
                //clear stored values
                full_url = '';
                urls = [];
                var templete = system.getCompiledView('share/listImage', data);
                //             
                ress.send(templete);

            });
        });
        request.on('error', function(e) {
            console.log(e.message);
        });
        request.end();
    },
    
    videoList:function(req,ress){
        var url = require('url');
        var http = require('http');
        var urls = [];
        var urltitle = req.body.pageurl;
        var actual_url =  urltitle;
        var urlObj = url.parse(urltitle, true, true);
        var hostname = urlObj.hostname;
        var pathname = urlObj.pathname;
        var protocol = urlObj.protocol;
        var options = {
            host: hostname,
            path: pathname
        }
        
        if(actual_url.substr(0, 31) == 'http://www.youtube.com/watch?v='){
            var split_url = actual_url.split("v=");
            var vid = split_url[1];
            console.log(vid);
            if (urls.indexOf(vid) == '-1') {
                urls.push(vid);
            }
                        
            var data = {
                   
                home: urls,
                full_url: urltitle
            }
            //clear stored values
            full_url = '';
            urls = [];
            var templete = system.getCompiledView('share/listVideo', data);
            //             
            ress.send(templete);
        }
        else{ 
            var request = http.request(options, function(res) {
                var data = '';
                res.on('data', function(chunk) {
                    data += chunk;
                    var m,
                    //urls = [], 
                    str = data;
               
                                       
                    var rex =  /href=[\'"]?\/watch([^\'" >]+)/g;
                    while (m = rex.exec(str)) {
                   
                  
                        var vid = m[0].split('v=');
                        if (urls.indexOf(vid[1]) == '-1') {
                            urls.push(vid[1]);
                        }
                    }
                    //                     }
                    //                     else{
                    //rex = /<img [^>]*src="([^>"]+\/([^>"]+))"[^>]*?>/g;
                    var rex =  /<* [^>]*youtube.com[^>]*?>/g;
                        
                    while (m = rex.exec(str)) {
                        var ytr = /http:\/\/[^\s"><]*/g
                        var n = ytr.exec(m[0]);
                        //console.log(n);
                        if(n && youtube_parser(n[0])){
                            var vid = youtube_parser(n[0]);
                            console.log(vid);
                            if (urls.indexOf(vid) == '-1') {
                                urls.push(vid);
                            }
                        }
                   
                    
                    }
             
                
                
                
                //   }
                });
            
                function youtube_parser(url){
                    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
                    var match = url.match(regExp);
                    if (match && match[7].length==11){
                        return match[7];
                    }else{
                        return false;
                    }
                }
                res.on('end', function() {
               
                    var data = {
                   
                        home: urls,
                        full_url: urltitle
                    }
                    //clear stored values
                    full_url = '';
                    urls = [];
                    var templete = system.getCompiledView('share/listVideo', data);
                    //             
                    ress.send(templete);
                });
            });
   
            request.on('error', function(e) {
                console.log(e.message);
            });
            request.end();
        }
    },
    
    audioList:function(req,ress){
        var url = require('url');
        var http = require('http');
        var urls = [];
        var urltitle = req.body.pageurl;
        var urlObj = url.parse(urltitle, true, true);
        var hostname = urlObj.hostname;
        var pathname = urlObj.pathname;
        var protocol = urlObj.protocol;
        var options = {
            host: hostname,
            path: pathname
        }
        
        var regexp = /^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/;
        var s_check = urltitle.match(regexp) && urltitle.match(regexp)[2];
        var is_valid = true;
        if(s_check == null){
            is_valid = false;
        }
        var data = {
            home: "",
            is_valid: is_valid,
            full_url: urltitle
        }
        var templete = system.getCompiledView('share/listAudio', data);
                        
        ress.send(templete);
    },
 
    // loaded the selected pin from thirdpaty sites
    loadThirdpartyShare:function(req,res){
     
        var fs = require("fs");
        var sahrepin_id = req.params.share_id;
        var imagename = req.session.temp_imagename;
      
        shareModel.getPins(sahrepin_id,function(pins){
            boardModel.getBoardAll(function(boards){
            
                pins[0].boards = boards;
          
                var send_data={
                    layout: 'urlfetch_layout',
                    data:pins
                }
          
                req.session.temp_imagename = null;         
                fs.unlink(DEFINES.IMAGE_PATH_REL + 'temp/' + imagename);
                system.loadPluginView(res, 'share/loadsharepin', send_data);

            });
        });
        
    },
    screenshot: function(req, res)
    {
        var webshot = require('webshot');
        var fs = require('fs');
        var time = new Date().getTime();
        if(req.session.login_user_id)
        {
            var imagename = req.session.login_user_id + '.png';
        }
        else{
            var imagename = time + '.png';
            req.session.temp_imagename = imagename;
        }
           
            
        var options = {
            screenSize: {
                width: 320
                , 
                height: 480
            }
            , 
            shotSize: {
                width: 320
                , 
                height: 'all'
            }
        }
        
        webshot(req.body.pageurl, DEFINES.IMAGE_PATH_REL + 'temp/' + imagename , function(err) {
            if(!err){
                var data = {
                    "image": imagename
                };
                //res.writeHead(200, { 'Content-Type': 'application/json' }); 
                res.send(200, data);
            } else {
                var data = {
                    "error": 'Website does not exist or unable to create screenshot.'
                };
                res.send(200, data);
            }
        });


    }
    
   
    
};
module.exports = pinController;
