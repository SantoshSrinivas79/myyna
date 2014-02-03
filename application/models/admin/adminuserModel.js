/** 
 * Admin user management Model
 * Db methods for admin user management
 * 
 * @package cubetboard
 * @version 2.0
 * @author Robin <robin@cubettech.com>
 * @Date 14-11-2013
 */

var admincollect = mongodb.collection('adminuser');
var adminUserModel = {
    /**
     * Authenticate Admin
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 14-11-2013
     */
    authenticate: function(data, callback){
         
        admincollect.findOne({username:data.username, password: data.password}, function(err, results) {
            if(results && results._id){
                admincollect.update({_id:results._id}, {$set: {'last_login': new Date().getTime()}}, {upsert:true,safe:true}, function(){
                    callback(results);
                });
            } else {
                callback();
            }
        });
    },
    getAdminUsers: function(curr_user,callback){
         
        admincollect.find({_id: {'$ne':mongo.ObjectID(curr_user)}}).toArray(function(err, results) {
            callback(results);
        });
    },
    addAdmin: function(user, callback){
         
        admincollect.insert(user, {safe:true},function(err, results) {
            callback(results);
        });
    },
    updateAdmin: function(id, update, callback){
         
        admincollect.update({_id:mongo.ObjectID(id)}, {$set: update},function(err, results) {
            callback(results);
        });
    },
    checkUsername: function(username, callback){
         
        admincollect.findOne({username:username}, function(err, results) {
            callback(results);
        });
    },
    deleteAdmin: function(id, callback){
         
        admincollect.remove({_id:mongo.ObjectID(id)}, function(err, results) {
            callback(results);
        });
    },
    getAdminUser: function(id, callback){
        
        admincollect.findOne({_id:mongo.ObjectID(id)}, function(err, results) {
            callback(results);
        });
    },
    getCounts: function(callback){
        var results = [];
        mongodb.collection('pins').count(function(err, res) {
            results['pins'] = res;
        });
        mongodb.collection('repin').count(function(err, res) {
            results['repins'] = res;
        });
        mongodb.collection('user').count(function(err, res) {
            results['users'] = res;
            callback(results);
        });
    }
}

module.exports = adminUserModel;