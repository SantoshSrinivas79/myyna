/**
 * Admin pin management Model
 * Db methods for admin pin management
 * 
 * @package cubetboard
 * @version 2.0
 * @author Robin <robin@cubettech.com>
 * @Date 28-11-2013
 */

var collection = mongodb.collection('pins');
var boardCollection  = mongodb.collection('board');
var catCollection  = mongodb.collection('category');
var pinsModel = {
    getPins: function(condition, callback){
        collection.find(condition).sort({time:-1}).toArray(function(err, data) {                    
                    if(data.length > 0) {
                        var i = 0,
                        l=0,
                        j=0;
                        data.forEach(function(v){
                            if(v.report_by) {
                                mongodb.collection('user').findOne({_id:v.report_by}, function(err, res3){
                                    //console.log(i);
                                    if(res3) {
                                        v.reported_user = res3;
                                    }
                                });  
                                
                            }
                            mongodb.collection('user').findOne({_id:v.user_id}, function(err, res2){
                                i++;
                                //console.log(i);
                                if(res2) {
                                    v.user = res2;

                                    if(data.length == i){
                                        callback(data);
                                    } 
                                }

                            });  
                        });
                    } else  {
                        callback(data);
                    }
        });
    },
    addPin: function(user, callback){
         
        collection.insert(user, {safe:true},function(err, results) {
            callback(results);
        });
    },
    updatePin: function(id, update, callback){
         
        collection.update({_id:mongo.ObjectID(id)}, {$set: update},function(err, results) {
            callback(results);
        });
    },
    deletePin: function(id, callback){
         
        collection.remove({_id:mongo.ObjectID(id)}, function(err, results) {
            callback(results);
        });
    },
    getPin: function(id, callback){
        
        collection.findOne({_id:mongo.ObjectID(id)}, function(err, results) {
            callback(results);
        });
    },
    blockPin: function(id, type, call){
        collection.update({_id:mongo.ObjectID(id)}, {$set: {'blocked': mongo.Double(type)}},function(err, results) {
            call(results);
        });
    },
    cleanPin: function(id, call){
        collection.update({_id:mongo.ObjectID(id)}, {$set: {'reported': false}},function(err, results) {
            call(results);
        });
    },
    getBoards: function(callback){
        
        boardCollection.find().toArray(function(err, data) {
                if(data.length > 0) {
                        var i = 0;
                        data.forEach(function(v){
                            if(v.creator){
                                mongodb.collection('user').findOne({_id:v.creator}, function(err, res2){
                                    i++;
                                    console.log(res2);
                                    if(res2) {
                                        v.created_by = res2;

                                        if(data.length == i){
                                            callback(data);
                                        } 
                                    } else {
                                        callback(data);
                                    }

                                });  
                            } else {
                                i++;
                            }
                        });
                } else  {
                    callback(data);
                }
        });
    },
    getBoard: function(id, callback){
        boardCollection.findOne({_id:mongo.ObjectID(id)}, function(err, results) {
            callback(results);
        });
    },
    lockBoard: function(id, type, call){
        boardCollection.update({_id:mongo.ObjectID(id)}, {$set: {'locked': mongo.Double(type)}},function(err, results) {
            call(results);
        });
    },
    deleteBoard: function(id, callback){
        boardCollection.remove({_id:mongo.ObjectID(id)}, function(err, results) {
            mongodb.collection('pins').remove({board_id:mongo.ObjectID(id)}, function(){} );
            callback(results);
        });
    },
    updateBoard: function(id, data, callback){
        if(id){
            boardCollection.update({_id:mongo.ObjectID(id)}, {$set: data},function(err, results) {
                callback(results);
            });
        } else {
            boardCollection.insert(data,function(err, results) {
                callback(results);
            });
        }
    },
    getCatgeories: function(callback){
        catCollection.find().toArray(function(err, results) {
            callback(results);
        });
    },
    getCategory: function(id, callback){
        catCollection.findOne({_id:mongo.ObjectID(id)}, function(err, results) {
            callback(results);
        });
    },
    updateCategory: function(id, data, callback){
        if(id){
            catCollection.update({_id:mongo.ObjectID(id)}, {$set: data},function(err, results) {
                callback(results);
            });
        } else {
           catCollection.insert(data,function(err, results) {
                callback(results);
            });
        }
    },
    deleteCategory: function(id, callback){
        catCollection.remove({_id:mongo.ObjectID(id)}, function(err, results) {
            boardCollection.find({category_id:mongo.ObjectID(id)}).toArray(function(err, data) {
                    if(data.length > 0) {
                        data.forEach(function(v){
                            //remove pins on board
                            mongodb.collection('pins').remove({board_id:v._id}, function(){} );
                        });
                    } 
            });
            //delete boards in category
            mongodb.collection('boards').remove({category_id:mongo.ObjectID(id)}, function(){} );
            callback(results);
        });
    },
    
    pinList: function(condition,search,start,end, callback){
        if(condition && search){
            condition = {blocked:1,_id:mongo.ObjectID(search)};
        }
        else if(condition && !search){
              condition = {blocked:1};
        }
        else if(!condition && search){
            condition = {_id:mongo.ObjectID(search)};
        }
        else{
            condition={};
        }
       
        collection.find(condition).skip(start).limit(end).sort({time:-1}).toArray(function(err, data) {  
    
                    if(data.length > 0) {
                        var i = 0,
                        l=0,
                        j=0;
                        data.forEach(function(v){
                            if(v.reported_by) {
                                mongodb.collection('user').findOne({_id:v.reported_by}, function(err, res3){
                                    //console.log(i);
                                    if(res3) {
                                        v.reported_user = res3;
                                    }
                                });  
                                
                            }
                            mongodb.collection('user').findOne({_id:v.user_id}, function(err, res2){
                                i++;
                                //console.log(i);
                                if(res2) {
                                    v.user = res2;

                                    if(data.length == i){
                                       
                                        callback(data);
                                    } 
                                }

                            });  
                        });
                    } else  {
                        callback(data);
                    }
        });
    },
     getPinsAll :function(condition,search,callback){
         if(condition && search){
            condition = {blocked:1,_id:mongo.ObjectID(search)};
        }
        else if(condition && !search){
              condition = {blocked:1};
        }
        else if(!condition && search){
            condition = {_id:mongo.ObjectID(search)};
        }
        else{
            condition={};
        }
       mongodb.collection('pins').count(condition,function(err, res) {
            callback(res);
        });
        
    }
}

module.exports = pinsModel;
