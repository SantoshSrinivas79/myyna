var Handlebars = require('handlebars');

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 == v2) {
    return options.fn(this);
  }
  return options.inverse(this);

});

Handlebars.registerHelper('ObjIfCond', function(v1, v2, options) {
  if(String(v1) == String(v2)) {
    return options.fn(this);
  }
  return options.inverse(this);

});



Handlebars.registerHelper('notifCond', function(v1, v2, options) {
  
  if(v1 != v2) {
    return options.fn(this);
  }
  return options.inverse(this);

});




Handlebars.registerHelper('siteURL', function() {
  return sleekConfig.siteUrl;
});

Handlebars.registerHelper('getDefine', function(name) {
  return DEFINES[name];
});


Handlebars.registerHelper('loginbtn', function(v1, options) {
    if(DEFINES[v1] && (DEFINES[v1] == true || DEFINES[v1] == 'true')) {
        return options.fn(this);
    }
    return options.inverse(this);
});




//display unlike
//Handlebars.registerHelper('pinUnlike', function(v1,v2) {
//    var pinModel = system.getModel('pin');
//    pinModel.pinLikeCheck(v1,v2,function(callback){
//     
//        if(callback)
//        {
//           
//            return 1;
//        }
//        
//        else
//        {
//            return 0;
//        }
//    });
//  //return sleekConfig.siteUrl;
//});
////display like
//Handlebars.registerHelper('pinlike', function(v1,v2) {
//    var pinModel = system.getModel('pin');
//    pinModel.pinLikeCheck(v1,v2,function(callback){
//     
//        if(callback)
//        {
//            
//            return 0;
//        }
//        
//        else
//        {
//            return 1;
//        }
//    });
//  //return sleekConfig.siteUrl;
//});



/** 
*
* @author   :   Rahul P R <rahul.pr@cubettech.com>
* @date     :   31-Oct-2013
*
* returns image(original) stored path
*
**/

Handlebars.registerHelper('imagepathOriginal', function() {
      return DEFINES.IMAGE_PATH_ORIGINAL;
});



/** 
*
* @author   :   Rahul P R <rahul.pr@cubettech.com>
* @date     :   31-Oct-2013
* 
* returns image(small) stored path
*
**/

Handlebars.registerHelper('imagepathSmall', function() {
      return DEFINES.IMAGE_PATH_SMALL;
});

/** 
*
* @author   :   Rahul P R <rahul.pr@cubettech.com>
* @date     :   31-Oct-2013
* 
* returns audio file saved path
*
**/

Handlebars.registerHelper('audioPath', function() {
      return DEFINES.AUDIO_PATH;
});


/** 
*
* @author   :   Rahul P R <rahul.pr@cubettech.com>
* @date     :   31-Oct-2013
* 
* returns video path
*
**/

Handlebars.registerHelper('videoPath', function() {
      return DEFINES.VIDEO_PATH;
});



/** 
*
* @author   :   Rahul P R <rahul.pr@cubettech.com>
* @date     :   31-Oct-2013
*
* returns date from unix timestamp
* 
**/

Handlebars.registerHelper('pinTime', function(UNIX_timestamp) {
    if(UNIX_timestamp==''){
        return 'Time Not Available';
    } else {
        var a = new Date(new Number(UNIX_timestamp)) ;
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date+','+month+' '+year+' '+hour+':'+min+':'+sec ;
        return time;
        //return new Date(new Number(UNIX_timestamp));
    }
 });


/** 
*
* @author   :   Rahul P R <rahul.pr@cubettech.com>
* @date     :   01-Nov-2013
*
* returns audio files stored path
*
**/

Handlebars.registerHelper('audioPath', function() {
      return DEFINES.AUDIO_PATH;
});







/** 
*
* @author   :   Rahul P R <rahul.pr@cubettech.com>
* @date     :   01-Nov-2013
*
* check if select data matches with posted dataa
*
**/

Handlebars.registerHelper('sel', function(var1,var2) {
    if(var1==var2)
      return 'selected="selected"';
      
});






Handlebars.registerHelper('ifOr', function(v1, v2, options) {
  var condtions = v2.split(',');
  if(condtions.indexOf(v1) > -1) {
    return options.fn(this);
  }
  return options.inverse(this);

});

Handlebars.registerHelper('toDate', function(timestamp) {
    if(timestamp == undefined){
        return 'Not logged in yet!';
    } else {
        return new Date(timestamp);
    }
        
});

// returns substring of description 
Handlebars.registerHelper('substr', function(string,length) {
   if(typeof(string)=='string' && string.length!==0)
        return string.substring(0,length);        
    else
        return '' ;
});

// pinblock class
Handlebars.registerHelper('pinBlockClass', function(length) {
   if(DEFINES.site_layout=='fixed') {
        return 'element clearfix' ;
    } else {
        if(parseInt(length) <= 300){
            return 'element clearfix single_colm';
        } else {
            return 'element clearfix two_colm' ;
        }
    }
});


// video class
Handlebars.registerHelper('getVideoHeight', function() {
   if(DEFINES.site_layout=='fixed') {
        return '200' ;
    } else {
        return '300' ;
    }
});


// get count of an array
Handlebars.registerHelper('arrlenGtZero', function(arr,options) {
    if( (arr instanceof Array) && arr.length>0) {
        return options.fn(this);
    }
    return options.inverse(this);
});

// get count of an array
Handlebars.registerHelper('arrlenGtOne', function(arr,options) {
    if( (arr instanceof Array) && arr.length>1) {
        return options.fn(this);
    }
    return options.inverse(this);
});
/** 
*
* @author   :   ARYA S A<arya@cubettech.com>
* @date     :   18-Dec-2013
*
* timestamp to time
*
**/
Handlebars.registerHelper('timeAgo',function(time){
  
var units = [
{ name: "second", limit: 60, in_seconds: 1 },


{ name: "minute", limit: 3600, in_seconds: 60 },


{ name: "hour", limit: 86400, in_seconds: 3600 },


{ name: "day", limit: 604800, in_seconds: 86400 },


{ name: "week", limit: 2629743, in_seconds: 604800 },


{ name: "month", limit: 31556926, in_seconds: 2629743 },


{ name: "year", limit: null, in_seconds: 31556926 }


];
var diff = (new Date() - new Date(time)) / 1000;


if (diff < 5) return "just now";


var i = 0;


while (unit = units[i++]) {


if (diff < unit.limit || !unit.limit){


var diff = Math.floor(diff / unit.in_seconds);


return diff + " " + unit.name + (diff>1 ? "s" : "") +


" ago";

}
};


});

Handlebars.registerHelper('logbuttonCheck', function(v1,v2, options) {
    
    console.log(DEFINES[v1]);
    console.log(DEFINES[v2]);
    if((DEFINES[v1] && (DEFINES[v1] == true || DEFINES[v1] == 'true')) || (DEFINES[v2] && (DEFINES[v2] == true || DEFINES[v2] == 'true'))) {
        return options.fn(this);
    }
    return options.inverse(this);
});




