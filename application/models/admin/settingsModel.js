/** 
 * Site settings management Model
 * Db methods for admin user management
 * 
 * @package cubetboard
 * @version 2.0
 * @author Robin <robin@cubettech.com>
 * @Date 27-11-2013
 */

var collection = mongodb.collection('site_settings');
var settingsModel = {
    getGeneralSettings: function(condition, callback){
         
        collection.findOne(condition,function(err, results) {
            callback(results);
        });
    },
    updateGeneralSettings: function(id, update, callback){
         
        collection.update({_id:mongo.ObjectID(id)}, {$set: update},function(err, results) {
            callback(results);
        });
    }
}

module.exports = settingsModel;