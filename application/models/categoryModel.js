/**
 * Database functions for category
 * 
 * LICENSE: MIT
 *
 * @category cubetboard
 * @package category
 * @copyright Copyright (c) 2007-2014 Cubet Technologies. (http://cubettechnologies.com)
 * @version 2.0
 * @author Rahul P R <rahul.pr@cubettech.com>
 * @date 18-Nov-2013
 */

var categoryModel = {
    /**
     * insert category details
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    insert:function(db_data,callback){
        var collection = mongodb.collection('category');  
        collection.insert(db_data,function(err,inserted_data) {
                if (err) return console.error(err);
                    console.log('Category inserted !! ');
                callback(inserted_data);
        });
    },
    /**
     * get all categories
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    getCategoryAll :function(callback){
        var collection = mongodb.collection('category');  
        collection.find({}, function(err, res){
                res.toArray(function(er, data){
                    callback(data);
                });
        });
    },
    /**
     * delete category
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    deleteCategory :function(id,callback){
        var collection = mongodb.collection('category');  
        collection.remove({'_id':mongo.ObjectID(id) },function (err, data) {
                //console.log(3);
                if (err) return handleError(err);
                callback(1);
            });
    },
    /**
     * get category by id
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    getCategoryOne :function(id,callback){
        var collection = mongodb.collection('category');  
        collection.find({'_id':mongo.ObjectID(id) },function (err,res) {
            res.toArray(function(er, data){
                //console.log(data);
                    callback(data);
            });
        });
    },
    /**
     * uddate category
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    updateCategory :function(con,db_data,callback){
        var collection = mongodb.collection('category');  
        collection.update(con,db_data,function (err,data) {
                if (err) return handleError(err);
                callback(data);
         });
    }
 
}

module.exports = categoryModel;
