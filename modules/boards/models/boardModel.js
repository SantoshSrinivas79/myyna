/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


//write function here
var boardModel = {
    list: function(callback){
        var collection =mongodb.collection('pins');
            // Locate all the entries using find
        collection.find().toArray(function(err, results) {
            callback(results);
        });
    },
    userBoards: function(user_id,callback){
         mongodb.collection('board').count({'creator':mongo.ObjectID(user_id)},function(err, res) {
            callback(res);
        });
    },
     insert:function(db_data,callback){
        var collection = mongodb.collection('board');  
        collection.insert(db_data,function(err,inserted_data) {
            if (err) return console.error(err);
                console.log('Board inserted !! ');
            callback(inserted_data);
        });
    },
    transaction_insert:function(db_data,callback){
        var collection = mongodb.collection('transaction');  
        collection.insert(db_data,function(err,inserted_data) {
            if (err) return console.error(err);
                console.log('Payment details inserted !! ');
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
    }
}

module.exports = boardModel;

