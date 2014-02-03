/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


//write function here
var userModel = {
    list: function(callback){
        var collection =mongodb.collection('pins');
            // Locate all the entries using find
        collection.find().toArray(function(err, results) {
            callback(results);
        });
    }
}

module.exports = userModel;

