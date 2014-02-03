/**
 * Database functions related to adding pins
 * 
 * LICENSE: MIT
 *
 * @category cubetboard
 * @package pin
 * @copyright Copyright (c) 2007-2014 Cubet Technologies. (http://cubettechnologies.com)
 * @version 2.0
 * @author Rahul P R <rahul.pr@cubettech.com>
 * @date 30-Oct-2013
 */

var imagepinModel = {
    /**
     * insert pins 
     * @author Rahul P R <rahul.pr@cubettech.com >
     * @date 18-Nov-2013
     */
    insert:function(db_data,callback){
        var collection = mongodb.collection('pins');
        collection.insert(db_data,function(err,inserted_data){
            mongodb.collection('board').findOne({_id: inserted_data[0].board_id}, function(err3, res3){
                    inserted_data[0].board_name = res3.board_name ;
                    inserted_data[0].board_image = res3.image ;
                        if (err) return console.error(err);
                            //console.log('Pin inserted !! ');
                        //console.log(inserted_data);
                        callback(inserted_data);
            });
        });
    },
    /**
     * get all pins 
     * @author Rahul P R <rahul.pr@cubettech.com >
     * @date 18-Nov-2013
     */
    Pinlists : function(callback){
        var collection = mongodb.collection('pins');
        collection.find({}, function(err, res){
                res.toArray(function(er, data){
                    callback(data);
                });
        });
    },
    /**
     * get pin corresponding to _id
     * @author Rahul P R <rahul.pr@cubettech.com >
     * @date 18-Nov-2013
     */
    getPinsOne : function(id,callback,loggedUserId,popStatus){
        pop     = popStatus==1 ? 1 : 0;
        mongodb.collection('pins').findOne({_id: mongo.ObjectID(id),blocked:0}, function(err, res){
            //console.log(res);
            if(!res || res.length == 0){
                callback(false);
                return false;
            }
            
            var user_id = res ? res.user_id : '' ;
            if(typeof(user_id) != 'string'){
                var user_id = user_id.toHexString();
            }
            
            var condition = {'pin_id': mongo.ObjectID(id)};
            if(loggedUserId){
                condition.user_id = mongo.ObjectID(loggedUserId);
            }
            
            mongodb.collection('pins')
            .find({'user_id': mongo.ObjectID(user_id)})
            .count(function(err,resCount){
            res.userpinCount = resCount ?  resCount : 0 ; 
            
                mongodb.collection('pin_like')
                .find({pin_id: mongo.ObjectID(id)})
                .count(function(err9, res9){
                    res.likes = res9 ;
                    //console.log(user_id);
                    mongodb.collection('user').findOne({_id: mongo.ObjectID(user_id)}, function(err, res2){
                        //console.log(res2);
                        res.user = res2 ? res2.name :'' ;
                        res.currentTime = new Date().getTime();

                        mongodb.collection('user_profile').findOne({user_id: mongo.ObjectID(user_id)}, function(err, profile){
                        //console.log(res2);
                        res.profile_image = (profile && profile.pic) ? profile.pic :'' ;

                        mongodb.collection('pin_like').findOne(condition, function(errLike, resLike) {

                            if (resLike && resLike.user_id == loggedUserId) {
                                res.liked = 1;
                            } else {
                                res.liked = 0; 
                            }
                            mongodb.collection('board').findOne({_id: res.board_id,'locked':0}, function(err3, res3){
                                //console.log(res3.board_id);
                                if(res3 && res3.board_name){
                                res.board_name = res3.board_name ;
                                res.board_image = res3.image ;
                                res.board_creator = res3.creator ;
                                res.board_locked = res3.locked ;
                                }
                                else{
                                    res.board_name = 'locked Board';
                                    res.board_id = '';
                                    res.board_creator = '';
                                    res.board_locked = 1 ;
                                }
                                mongodb.collection('pins')
                                    .find({board_id: res.board_id, _id:{ $ne: res._id},repin:{ $ne: 1} })
                                    .limit(14, function(err4, res4){
                                        
                                        res4.toArray(function(er5, data){
                                            data.forEach(function(v){
                                                v.popStatus = pop ;
                                            });
                                            res.board_pins = data;
                                            
                                            mongodb.collection('followers')
                                            .findOne({follower_id: res.board_id,type:'board','follow_by':mongo.ObjectID(loggedUserId)}, function(err, res_b) {
                                                res.boardfollow = 0;
                                                if (res_b && res_b.follower_id) {
                                                     res.boardfollow = 1;
                                                }
                                                
                                                if(res.domain) {    
                                                    mongodb.collection('pins').find({domain: res.domain,_id:{ $ne: res._id},repin:{ $ne: 1}})
                                                    .limit(8, function(err5, res5){
                                                        res5.toArray(function(er6, data){
                                                            data.forEach(function(v){
                                                                v.popStatus = pop ;
                                                            });
                                                            res.domainPins = data
                                                            callback(res);
                                                            //console.log(res);
                                                            //console.log('follower id ' + res.board_id);  
                                                            //console.log('follow by ' + mongo.ObjectID(loggedUserId));  
                                                        });
                                                    });
                                                } else {
                                                    callback(res);
                                                    //console.log(res);
                                                }


                                            });

                                            
                                        });
                                });
                            });
                       });
                    });
                });
                });
            });
        });
    }, 
    /**
     * get pin corresponding to user_id
     * @author Rahul P R <rahul.pr@cubettech.com >
     * @date 20-Nov-2013
     */
    getPinsByUserID : function(user_id, neg_pin_id, callback){
       var collection = mongodb.collection('pins');
        //collection.find({user_id: id}, function(err, res){
        collection
        .sort({time: -1})
        .find({ user_id: user_id ,blocked:0, _id: { $ne: mongo.ObjectID(neg_pin_id)} }, function(err, res){
                res.toArray(function(er, data){
                    //console.log(data);
                    callback(data);
                });
        });
    },
    /**
     * get pins corresponding to user_id by start, end limit
     * and ignore current pin
     * @author Rahul P R <rahul.pr@cubettech.com >
     * @date 22-Nov-2013
     */
    moreUserPinlists :function(logged_id,neg_pin_id,start,end,callback,popStatus){
        var collection = mongodb.collection('pins'); 
        end     = parseInt(end);
        start   = parseInt(start);
        pop     = popStatus==1 ? 1 : 0;
        
        mongodb.collection('pins').findOne({_id:mongo.ObjectID(neg_pin_id),blocked:0},{user_id:1},function(e,r){
            //console.log(r.user_id);
            var user_id = r.user_id ;
            mongodb.collection('pins')
            .find({user_id: user_id, _id: { $ne: mongo.ObjectID(neg_pin_id)}})
            .skip(start)
            .limit(end)
            .sort({time:-1}, function(err, res){
                    res.toArray(function(er, data){
                       // console.log(data);
                        if(data.length > 0) {
                            
                            var i=0,j=0,l= 0,m=0,n=0;
                            
                            data.forEach(function(v){
                                    v.popStatus = pop;//to check if it is a popup page
                                    v.currentTime = new Date().getTime();
                                    //v.userpins = 1;
                                    v.loggeduser_id = logged_id;
                                    
                                    var id = v.board_id;
                                    if(typeof(v.board_id) != 'string'){
                                        var id = v.board_id.toHexString();
                                    }
                                    var creator = v.user_id;
                                    if (typeof (v.user_id) != 'string') {
                                        var creator = v.user_id.toHexString();
                                    }
                                    mongodb.collection('board').findOne({_id:mongo.ObjectID(id),locked:0}, function(err, res2){
                                        v.board_name    =   '';
                                        v.board_image   =   '';
                                        if(res2 && res2.board_name) {
                                            v.board_name = res2.board_name;
                                            v.board_image = res2.image;
                                        }
                                        else{
                                             v.board_name = 'locked Board';
                                             v.board_id = '';
                                        }
                                        mongodb.collection('pin_like').findOne({'user_id':user_id ,'pin_id':v._id}, function(err, res3){
                                            v.pinlike = 1;
                                            //console.log(user_id);
                                            //console.log(res3);
                                            if(res3 && res3.user_id) {
                                                v.pinlike = 0;
                                            }
                                            mongodb.collection('pin_like').count({'pin_id': v._id}, function(err, res3) {
                                                v.pinlikecount = 0;
                                                if (res3) {
                                                    v.pinlikecount = res3;
                                                }
                                                mongodb.collection('user').findOne({_id: mongo.ObjectID(creator)}, function(err, pincreator) {
                                                    v.creator_name = '';
                                                    if (pincreator && pincreator.name) {
                                                        v.creator_name = pincreator.name;
                                                    }
                                                    mongodb.collection('user_profile').findOne({user_id: mongo.ObjectID(creator)}, function(err, creator_detail) {
                                                        v.creator_image = '';
                                                        if (creator_detail && creator_detail.pic) {
                                                            v.creator_image = creator_detail.pic;
                                                        }
                                                        callback(data);
                                                    });
                                                }); 
                                                 
                                            });
                                        }); 
                                    });  
                                }); // end foreach
                            } else  {
                                callback(data);
                            }
                    });
            }); 
        });
   
    },
    /**
     * get pins corresponding to board_id
     * @author Rahul P R <rahul.pr@cubettech.com >
     * @date 26-Nov-2013
     */
    getPinsByBoard : function(board_id,callback){
        var collection = mongodb.collection('pins'); 
        collection.find({board_id:board_id}).limit(20).sort({time:-1}, function(err, res){
                res.toArray(function(er, data){
                    var i = 0;
                    data.forEach(function(v){
                        var id = v.board_id;
                        if(typeof(v.board_id) != 'string'){
                            var id = v.board_id.toHexString();
                        }
                        
                        mongodb.collection('board').findOne({_id:mongo.ObjectID(id)}, function(err, res2){
                            i++;
                            //console.log(res2);
                            if(res2 && res2.board_name) {
                                v.board_name = res2.board_name;
                                
                                //console.log(i);
                                if(data.length == i){
                                    //console.log(data);
                                    //callback(data);
                                } 
                            }
                            
                        });  
                    });
                });
        });
    },
    /**
     * get pins corresponding to board_id within start,end limit
     * @author Rahul P R <rahul.pr@cubettech.com >
     * @date 16-Dec-2013
     */
    morePinsByLimit : function(currentPinId,start,end,callback,popStatus){
        pop     = popStatus==1 ? 1 : 0;
        mongodb.collection('pins')
        .findOne({_id:mongo.ObjectID(currentPinId)},{'board_id':1},function(err,res){
             //console.log(res);
             mongodb.collection('pins')
            .find({board_id: res.board_id, _id:{ $ne: mongo.ObjectID(currentPinId)},repin:{ $ne: 1} })
            .skip(parseInt(start))
            .limit(parseInt(end))
            .sort({time:-1}, function(err4, res4){
                res4.toArray(function(er5, data){
                    data.forEach(function(v){
                        v.popStatus = pop;
                    });
                    callback(data);
                    //console.log(data);
                        
                });
            });
        });
    },
    /**
     * get pins corresponding to domain within start,end limit
     * @author Rahul P R <rahul.pr@cubettech.com >
     * @date 17-Dec-2013
     */
    moreDomainPinsByLimit : function(currentPinId,start,end,callback,popStatus){
        pop     = popStatus==1 ? 1 : 0;
        mongodb.collection('pins')
        .findOne({_id:mongo.ObjectID(currentPinId)},{'domain':1},function(err,res){
             //console.log(res);
             mongodb.collection('pins')
            .find({domain: res.domain,_id:{ $ne: res._id},repin:{ $ne: 1}})
            .skip(parseInt(start))
            .limit(parseInt(end))
            .sort({time:-1}, function(err4, res4){
                res4.toArray(function(er5, data){
                    data.forEach(function(v){
                        v.popStatus = pop;
                    });
                    callback(data);
                    //console.log(data);
                });
            });
        });
    }

}

module.exports = imagepinModel ;

