/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


//write function here
var settingsModel = {
    list: function(callback){
        var collection = mongodb.collection('paypalsettings');
        collection.find().toArray(function(err, results) {
            callback(results);
        });
    },
   
     insert:function(db_data,callback){
        var collection = mongodb.collection('paypalsettings');  
        collection.insert(db_data,function(err,inserted_data) {
            if (err) return console.error(err);
                console.log('paypal settings inserted ');
            callback(inserted_data);
        });
    },
   
    
    board_update:function(board_id,callback){
        
        var collection = mongodb.collection('board');  
        collection.update(
                            {   '_id' : board_id  },
                            {'$set':{
                                'locked' : 0
                            }},
                            function (err,data) {
                                if (err) return handleError(err);
                                callback(data);
         });
    },
    
    updateSettings: function(id, data, callback){
        var collection = mongodb.collection('paypalsettings');  
        if(id){
            collection.update({_id:mongo.ObjectID(id)}, {$set: data},function(err, results) {
                callback(results);
            });
        } else {
           collection.insert(data,function(err, results) {
                callback(results);
            });
        }
    },
}

module.exports = settingsModel;

