/*
 * Notification Model
 * The MIT License (MIT)
 * @category cubetboard
 * @package Notification
 * @version 2.0
 * @author Arya <arya@cubettech.com>
 * @Date 20-11-2013
 */

var notificationModel = {
/* 
     * @author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * @param data to insert
     * @return notification details inserted
     */

NotificationInsertion : function(form_data, callback) 

{
  
    
   var collection = mongodb.collection('notification_logs');  
        collection.insert(form_data,function(err,new_data) {
            if (err) return console.error(err);
               
            callback(new_data);
        });
},
/* 
     * @author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * @param user id
     * @return unread notification details
     */
userUnreadnotifications:function(user_id,callback){
    
     var collection = mongodb.collection('notification_logs');  
        collection.find({'notification_acceptor':mongo.ObjectID(user_id),'status':1 },function (err,res) {
            res.toArray(function(er, data){
               //console.log(user_id);
               //console.log(data);
                    callback(data);
            });
        });
},
/* 
     * @author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * @param notification acceptor's id
     * @return changed details
     */
notificationStatusChange:function(acceptor,callback){
     var collection = mongodb.collection('notification_logs');  
        collection.update(
                            {   'notification_acceptor' : mongo.ObjectID(acceptor),'status':1   },
                            {'$set':{
                                        'status':0 
                                    }
                            },
                            {
                                'multi':true
                            },
                            
                            function (err,data) {
                                if (err) return handleError(err);
                                callback(data);
         });
    
},
/* 
     * @author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * @param user id
     * @return user settings
     */
notificationSendCheck:function(user_id,callback){
   
    var collection = mongodb.collection('settings');  
    collection.find({'user_id':user_id},function (err,res) {
            res.toArray(function(er, data){
                //console.log(data);
                    callback(data);
            });
        });
}

}

module.exports = notificationModel;