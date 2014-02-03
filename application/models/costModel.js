/**
 * Database functions for cost
 * 
 * LICENSE: MIT
 *
 * @category cubetboard
 * @package cost
 * @copyright Copyright (c) 2007-2014 Cubet Technologies. (http://cubettechnologies.com)
 * @version 2.0
 * @author Rahul P R <rahul.pr@cubettech.com>
 * @date 18-Nov-2013
 */

var costModel = {
    /**
     * insert cost details
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    insert:function(db_data,callback){
        var collection = mongodb.collection('cost');  
        collection.insert(db_data,function(err,inserted_data) {
            if (err) return console.error(err);
                console.log('Cost inserted !! ');
            callback(inserted_data);
        });
    },
    /**
     * get all costs
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    getCostAll :function(callback){
        var collection = mongodb.collection('cost');  
        collection.find({}, function(err, res){
                res.toArray(function(er, data){
                    callback(data);
                });
        });
    },
    /**
     * delete cost
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    deleteCost :function(id,callback){
        var collection = mongodb.collection('cost');  
        collection.remove({'_id':mongo.ObjectID(id) },function (err, data) {
                //console.log(3);
                if (err) return handleError(err);
                callback(1);
            });
    },
    /**get cost by id
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    getCostOne :function(id,callback){
        var collection = mongodb.collection('cost');  
        collection.find({'_id':mongo.ObjectID(id) },function (err,res) {
            res.toArray(function(er, data){
                //console.log(data);
                    callback(data);
            });
        });
    },
    /**
     * update cost
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    updateCost :function(con,db_data,callback){
        var collection = mongodb.collection('cost');  
        collection.update(con,db_data,function (err,data) {
            if (err) return handleError(err);
            callback(data);
        });
    }
}

module.exports = costModel;
