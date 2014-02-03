/**
 * Admin user management Model
 * Db methods for admin user management
 * 
 * @package cubetboard
 * @version 2.0
 * @author Robin <robin@cubettech.com>
 * @Date 14-11-2013
 */

var collection = mongodb.collection('user');
var adminModel = {
    getUsers: function(condition, callback){
         
        collection.find(condition).toArray(function(err, results) {
            callback(results);
        });
    },
    addUser: function(user, callback){
        user.verified = 1;
        user.blocked = 0;
        collection.insert(user, {safe:true},function(err, results) {
            if(results[0]._id){
                mongodb.collection('user_profile').insert({
                    "firstname": results[0].name,
                    "user_id": results[0]._id,
                    "pic": ""
                }, function(){} );
                
                mongodb.collection('settings').insert({
                        "user_id": results[0]._id,
                        "comment": 1,
                        "like": 1,
                        "follow": 1
                }, function(){});
            }
            callback(results);
            
        });
    },
    updateUser: function(id, update, callback){
         
        collection.update({_id:mongo.ObjectID(id)}, {$set: update},function(err, results) {
            callback(results);
        });
    },
    checkUsername: function(username, callback){
         
        collection.findOne({username:username}, function(err, results) {
            callback(results);
        });
    },
    deleteUser: function(id, callback){
         
        collection.remove({_id:mongo.ObjectID(id)}, function(err, results) {
            //get all baords
            mongodb.collection('boards').find({creator:mongo.ObjectID(id)}).toArray(function(err, data) {
                    if(data.length > 0) {
                        var i = 0;
                        data.forEach(function(v){
                            //delete pins having board
                            mongodb.collection('pins').remove({board_id:v._id}, function(){} );    
                            i++;
                        });
                    } 
                    mongodb.collection('boards').remove({creator:mongo.ObjectID(id)}, function(){} );
                    mongodb.collection('pins').remove({user_id:mongo.ObjectID(id)}, function(){} );    
                    mongodb.collection('settings').remove({user_id:mongo.ObjectID(id)}, function(){} ); 
                    mongodb.collection('user_profile').remove({user_id:mongo.ObjectID(id)}, function(){} ); 
                    mongodb.collection('followers').remove({'$or': {follower_id:mongo.ObjectID(id), follow_by:mongo.ObjectID(id)}}, function(){} ); 
                    callback(results);
            });
        });
    },
    getUser: function(id, callback){
        
        collection.findOne({_id:mongo.ObjectID(id)}, function(err, results) {
            callback(results);
        });
    },
    blockUser: function(id, type, call){
        collection.update({_id:mongo.ObjectID(id)}, {$set: {'blocked': mongo.Double(type)}},function(err, results) {
            console.log(results);
            call(results);
        });
    }
}

module.exports = adminModel;