module.exports = {
    get:function(board_id){
       var collection = mongodb.collection('board');
       collection.find({'_id':mongo.ObjectID(board_id) },function (err,res) {
            res.toArray(function(er, data){
                    //console.log(data[0].board_name);
            });
        });
    },
     /**
      * returns extension of filename
      * @author Rahul P R <rahul.pr@cubettech.com>
      * @date 18-Nov-2013
      * @param file_path
      * @return file extension
      */
     get_extension: function(file_path)
     {
         try {
            var n = file_path.split("/") ; 
            var file_name = n[n.length -1] ;
            var m = file_name.split(".") ; 
            if(m.length==2)
                var file_ext = m[m.length -1] ;
            else 
                var file_ext = 'jpg' ;
            return file_ext ;
         } catch(err){
             console.log(err);
         }
     },
      /** 
       * make thumbsize=415 if originall width>415
       * make thumbsize=200 if originall width<415 && width>200
       * @author Rahul P R <rahul.pr@cubettech.com>
       * @date 18-Nov-2013
       * @callback width to which image resize
       */
     get_img_width:function(im,newPath,callback)
     {
            im.identify(newPath, function(err, features){
                var width = '300' ;
                if(features.width>415){
                    width = '415' ;
                }else if(features.width<415 && features.width>300){
                    width ='300' ;
                }
               callback(width) ;
            });
    },
    /**
     * make a random string for password
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     * @return string
     */
    makeid : function()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },
    /**
     * check if email is valid
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     * @param email
     * @return boolean
     */
    validateEmail : function(email) {
        if (email.length == 0) return false;
        var re = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i;
        return re.test(email);  
    },
    /**
     * check if fileType is a subset of typeArr 
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @Date 13-Jan-2014
     * @param typeArr,fileType
     * @return boolean
     */
    typeValid : function(typeArr,fileType){
        var con = '' , con2 = '';
        for(var i in typeArr){
            if(con!='') {
                con2 = fileType==typeArr[i] ;  
                con =  con || con2 ;
                if(con)
                    break ;
            } else {
                con = fileType==typeArr[i] ;  
            }
        }
        return con ;
    }


}
 