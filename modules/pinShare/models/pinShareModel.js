var shareModel = {
  
  InsertShare:function(db_data,callback){
    
        var collection = mongodb.collection('pin_share');  
        collection.insert(db_data,function(err,inserted_data) {
            if (err) return console.error(err);
                console.log('share data inserted');
               // console.log(inserted_data);
            callback(inserted_data);
        });
    },
    
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