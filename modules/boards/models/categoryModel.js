/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


//write function here
var categoryModel = {
    getCategoryAll :function(callback){
        var collection = mongodb.collection('category');  
        collection.find({}, function(err, res){
                res.toArray(function(er, data){
                    callback(data);
                });
        });
    }
}

module.exports = categoryModel;

