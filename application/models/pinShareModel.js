/*functions related to pin share
 * pin Model 
 * The MIT License (MIT)
 * @category: cubetboard
 * @package :pinshare
 * @version 2.0
 * @author Arya <arya@cubettech.com>
 * @Date 20-12-2013
 */
var shareModel = {
  /* 
     * @author Arya <arya@cubettech.com>
     * @Date 20-12-2013
     * @param data to insert
     * @return share details inserted
     */
  InsertShare:function(db_data,callback){
    
        var collection = mongodb.collection('pin_share');  
        collection.insert(db_data,function(err,inserted_data) {
            if (err) return console.error(err);
                console.log('share data inserted');
               // console.log(inserted_data);
            callback(inserted_data);
        });
    },
    /* 
     * @author Arya <arya@cubettech.com>
     * @Date 20-12-2013
     * @param pin id
     * @return pin details
     */
    getPins:function(id,callback){
        
        var collection = mongodb.collection('pin_share');  
        collection.find({'_id':mongo.ObjectID(id) },function (err,res) {
            res.toArray(function(er, data){
                    callback(data);
            });
        });
        
    }
    
}
module.exports = shareModel;