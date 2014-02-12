/**
 * Database functions for board
 * 
 * LICENSE: MIT
 *
 * @category cubetboard
 * @package Board
 * @copyright Copyright (c) 2007-2014 Cubet Technologies. (http://cubettechnologies.com)
 * @version 2.0
 * @author Rahul P R <rahul.pr@cubettech.com>
 * @date 18-Nov-2013
 */

var boardModel = {
    /**
     * insert board details
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    insert:function(db_data,callback){
        var collection = mongodb.collection('board');  
        collection.insert(db_data,function(err,inserted_data) {
            if (err) return console.error(err);
                console.log('Board inserted !! ');
            callback(inserted_data);
        });
    },
    /**
     * get all boards
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    getBoardAll :function(callback){
        var collection = mongodb.collection('board');  
        collection.find({'locked':0}).sort({ timestamp: -1}, function(err, res){
                res.toArray(function(er, data){
                    callback(data);
                });
        });
    },
    /**
     * delete board
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    deleteBoard :function(id,callback){
        var collection = mongodb.collection('board');  
        collection.remove({'_id':mongo.ObjectID(zid) },function (err, data) {
                //console.log(3);
                if (err) return handleError(err);
                callback(1);
            });
    },
    /**
     * get selected boards
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    getSelectedBoardsBoardOne :function(id,callback){
        var collection = mongodb.collection('board');  
        collection.find({'_id':mongo.ObjectID(id),'locked':0 },function (err,res) {
            res.toArray(function(er, data){
                    callback(data);
            });
        });
    },
    /**
     * update board
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    updateBoard :function(post_data,callback){
        var collection = mongodb.collection('board');  
        collection.update(
                            {   '_id' : post_data._id   },
                            {'$set':{
                                'board_name' : post_data.board_name
                            }},
                            function (err,data) {
                                if (err) return handleError(err);
                                callback(data);
         });
    
    },
    
  /** @author Arya <arya@cubettech.com>
   * @Date 22-11-2013
   * 
   * list the details of creator of board by joining user and board collection
   */
    
    boardCreator:function(user_id,id,callback){
    var collection_name ="board_"+user_id;
    var user_map = function() {
        emit(this._id, {
            name: this.name, 
            email: this.email, 
            socket_id:this.socket_id, 
            cost:0
        });
    }

    var board_map = function() {
        if (this._id == id) {
            emit(this.creator, {
                name:0,
                email:0,
                socket_id:0,
                cost: this.cost
            });
        }
    }

    var reduce = function(key, values) {
        var outs = {
            name: 0, 
            email: 0, 
            socket_id:0, 
            cost: 0
        };
        values.forEach(function(v){
            if (v.email ) {
                outs.email = v.email;
            }
            if (v.cost ) {
                outs.cost = v.cost;
            }
            if(v.socket_id){
                outs.socket_id = v.socket_id;
            }
            if (v.name ) {
                outs.name = v.name;
            }
        });
        return outs;
    },

    res = mongodb.collection('board').mapReduce(board_map, reduce, {out: {reduce: collection_name}, scope: {id:id}}, function(err, results){
        if(err) console.log(err);

    });


    res = mongodb.collection('user').mapReduce(user_map, reduce, {out: {reduce: collection_name}}, function(err, results) {
            if (err)
                    console.log(err);

            mongodb.collection(collection_name).find({ 'value.cost':{$ne:0} },function (err,res) {
                   
                    if(res) {
                         //console.log('0'+res);
                        res.toArray(function(er, data){
                            //console.log('1' + data);
                                callback(data);
                        });
                    } else {
                        //console.log('2');
                        callback(0);
                    }
                    mongodb.collection(collection_name).drop();
            });
    });
        
        
        
    },
    /**
     * get board by id
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 18-Nov-2013
     */
    getBoardOne :function(id,callback){
       var collection = mongodb.collection('board');  
       collection.find({'_id':mongo.ObjectID(id),'locked':0 },function (err,res) {
           res.toArray(function(er, data){
                   callback(data);
           });
       });
   },
    
    SelectedBoards :function(uid,callback){
       var collection = mongodb.collection('board');  
       collection.find({'locked':0}).sort({timestamp:-1},function (err, res) {
                 res.toArray(function(er, data){
                   
                  if (data.length > 0) {
                    var i = 0,
                            l = 0,
                            j = 0;
                    data.forEach(function(v) {
                        var id = v._id;
                        if (typeof (v._id) != 'string') {
                            var id = v._id.toHexString();
                        }
                           v.loggeduser_id = uid;
                        mongodb.collection('followers').findOne({follower_id: mongo.ObjectID(id),type:'board','follow_by':mongo.ObjectID(uid)}, function(err, res2) {
                            i++;
                            //console.log(i);
                            if (res2 && res2.follower_id) {
                                v.boardfollow = 1;

                                if (data.length == i) {
                                    callback(data);
                                }
                            }
                            else {
                                v.boardfollow = 0;

                                if (data.length == i) {
                                    callback(data);
                                }
                            }
                        });
                    });
                    }
                });
            });
    
    },
    /**
     * get boards corresponding to category
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @date 03-Jan-2014
     */
    getBoardsByCategory:function(id,callback){
     var collection = mongodb.collection('board');
     var boards=[];
        collection.find({'category_id':mongo.ObjectID(id)},{_id:1},function (err,res) {
            
            res.toArray(function(er, data){
                
                if(data.length>0)
                    {
               var i = 0;
                
                data.forEach(function(id){
                    boards.push(id._id);
                i++;
                if(data.length==i)
                   {
                        
                    callback(boards);
                    }
                });
                    }
                    else{
                        callback(data);
                    }
            });
        });


},

getCategoryByBoardId:function(id,callback){
var collection = mongodb.collection('board');  
       collection.findOne({'_id':mongo.ObjectID(id) },function (err,res) {
          
                   callback(res);
         
       });

},

 getAdminUsers:function(callback){
     var collection = mongodb.collection('adminuser');
     var adminusers=[];
        collection.find({},{_id:1},function (err,res) {
            
            res.toArray(function(er, data){
                
                if(data.length>0)
                    {
               var i = 0;
                
                data.forEach(function(id){
                    adminusers.push(id._id);
                i++;
                if(data.length==i)
                   {
                        
                    callback(adminusers);
                    }
                });
                    }
                    else{
                        callback(data);
                    }
            });
        });


},

getBoardPincreation:function(adminusers,callback){
    
    var collection = mongodb.collection('board');
    collection.find({
                    creator: {
                        '$in':adminusers
                    },
                    'locked':0
                },function(err, res) {
                    
                    res.toArray(function(er, data) {
                        callback(data)
                    });
                   
                });
                
             
}
}

module.exports = boardModel;






