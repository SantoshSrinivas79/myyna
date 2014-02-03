/*functions related to get and update the details of pins
 * pin Model 
 * The MIT License (MIT)
 * @category: cubetboard
 * @package :pin
 * @version 2.0
 * @author Arya <arya@cubettech.com>
 * @Date 20-11-2013
 */

var pinModel = {
    /* 
     * @author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * @return details details of all pins
     */
    Pinlists: function(user_id, callback) {
        var collection = mongodb.collection('pins');
        collection.find({
            'blocked':0
        }).limit(15).sort({
            time: -1
        }, function(err, res) {
            res.toArray(function(er, data) {

                if (data.length > 0) {
                    var i = 0,
                    l = 0,
                    j = 0,
                    m = 0,
                    n = 0;
                    data.forEach(function(v) {
                        i++;
                        var id = v.board_id;
                        v.popStatus = 1 ;//pop up
                      
                        if (typeof (v.board_id) != 'string') {
                            var id = v.board_id.toHexString();
                        }
                        var creator = res.user_id;
                        if (typeof (v.user_id) != 'string') {
                            var creator =v.user_id.toHexString();
                        }
                        v.loggeduser_id = user_id;
                        mongodb.collection('board').findOne({
                            _id: mongo.ObjectID(id),
                            'locked':0
                        }, function(err, res2) {
                            
                            //console.log(i);
                            if (res2 && res2.board_name) {
                                v.board_name = res2.board_name;
                                v.board_image = res2.image;

                                
                            }
                            else{
                                v.board_name = 'locked Board';
                                v.board_id = ''
                            }

                        });

                        mongodb.collection('pin_like').findOne({
                            'user_id': mongo.ObjectID(user_id), 
                            'pin_id': v._id
                        }, function(err, res3) {
                            j++;

                            if (res3) {
                                v.pinlike = 0;

                               
                            }
                            else {
                                v.pinlike = 1;

                                
                            }

                        });

                        mongodb.collection('pin_like').count({
                            'pin_id': v._id
                        }, function(err, res3) {
                            l++;

                            if (res3) {
                                v.pinlikecount = res3;

                                
                            }
                            else {
                                v.pinlikecount = 0;

                               
                            }

                        });
                        mongodb.collection('user').findOne({
                            _id: mongo.ObjectID(creator)
                        }, function(err, pincreator) {
                            m++;
                            //console.log(i);
                            if (pincreator && pincreator.name) {
                                v.creator_name = pincreator.name;
                            // v.board_image = res2.image;

                               
                            }

                        });
                        mongodb.collection('user_profile').findOne({
                            user_id: mongo.ObjectID(creator)
                        }, function(err, creator_detail) {
                            n++;
                            //console.log(i);
                            if (creator_detail && creator_detail.pic) {

                                v.creator_image = creator_detail.pic;

                               
                            }

                        });
                        if(data.length==i){
                            callback(data);
                        }
                    });
                // } else {
                // callback(data);
                }
                else{
             
                    callback(data);
          
                }
            });
           
        });
    },
   
     /* 
     * @author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * @param board id
     * @return details details of the board
     */
    getAllpinsbyBoard: function(board_id, callback) {
       
        var collection = mongodb.collection('pins');
        collection.find({
            'board_id': mongo.ObjectID(board_id),
            'blocked':0
        }), function(err, res) {
            res.toArray(function(er, data) {
                //console.log(data);
                callback(data);
            });
        }
    },
    /* 
     * @author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * @param userid
     * @return most liked pins with details
     */
    PinMostLiked: function(user_id, callback) {

        var collection = mongodb.collection('pin_like');
        collection.aggregate([
        {
            $project: {
                "pin_id": 1
            }
        },

        {
            $group: {
                "_id": "$pin_id", 
                total: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                "total": -1
            }
        },
        {
            $skip: 0
        },
        {
            $limit: 15
        }
        ], function(err, data) {
            if (err)
                console.log(err);

            var i = 0,
            j = 0,
            m=0,
            n=0;

            if (!data || data.length == 0) {
                callback(0);
                return;
            }
            data.forEach(function(v) {
                i++;
                v.popStatus = 1 ;//pop up
                var pin_id = v._id;
                if (typeof (v._id) != 'string') {
                    var id = v._id.toHexString();
                }
                 
                v.loggeduser_id = user_id;
                mongodb.collection('pins').findOne({
                    _id: mongo.ObjectID(id),
                    'blocked':0
                }, function(err, res2) {
                   
                    //console.log(i);
                    if (res2 && res2.board_id) {
                        pinModel.getBoardName(res2.board_id, function(boardname) {
                            v.time = res2.time;
                            v.board_id = res2.board_id;
                            v.image_name = res2.image_name;
                            v.pin_type = res2.pin_type;
                            v.source_url = res2.source_url;
                            v.video_type = res2.video_type;
                            v.tmb_image_name = res2.tmb_image_name;
                            v.video_id = res2.video_id;
                            if(boardname && boardname.board_name){
                                v.board_name = boardname.board_name;
                                v.board_image = boardname.image;
                            }
                            else{
                                v.board_name = 'locked Board';
                                v.board_id = '';
                            }
                            v.description = res2.description;
                            v.pinlikecount = v.total;
                            var creator = v.user_id;
                            if (typeof (res2.user_id) != 'string') {
                                var creator = res2.user_id.toHexString();
                            }
                            pinModel.pinLikeCheck(id, user_id, function(likecheck) {
                                if (likecheck.length > 0)
                                    v.pinlike = 0;
                                else
                                    v.pinlike = 1;
                                var board_id = res2.board_id
                               
                            });
                            mongodb.collection('user').findOne({
                                _id: mongo.ObjectID(creator)
                            }, function(err, pincreator) {
                                m++;
                                //console.log(i);
                                if (pincreator && pincreator.name) {
                                    v.creator_name = pincreator.name;
                                // v.board_image = res2.image;

                               
                                }

                            });
                            mongodb.collection('user_profile').findOne({
                                user_id: mongo.ObjectID(creator)
                            }, function(err, creator_detail) {
                                n++;
                                //console.log(i);
                                if (creator_detail && creator_detail.pic) {

                                    v.creator_image = creator_detail.pic;

                                
                                }

                            });

                        });
                    }

                });
                if(data.length==i)
                {
                    callback(data);
                }
            });
        // });
        });

    },
    /* 
     * @author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * @param user id
     * @return most repinned pins
     */
    PinMostRepinned: function(user_id, callback) {


        var collection = mongodb.collection('repin');
        collection.aggregate([
        {
            $project: {
                "source_pin_id": 1
            }
        },

        {
            $group: {
                "_id": "$source_pin_id", 
                total: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                "total": -1
            }
        },
        {
            $skip: 0
        },
        {
            $limit: 15
        }
        ], function(err, data) {
            if (err)
                console.log(err);

            var i = 0,
            j = 0,
            m=0,
            n=0;
            if (!data || data.length == 0) {
                callback(0);
                return;
            }
            data.forEach(function(v) {
                i++;
                v.popStatus = 1 ;//pop up
                var pin_id = v._id;
                if (typeof (v._id) != 'string') {
                    var id = v._id.toHexString();
                }
               
                v.loggeduser_id = user_id;
                mongodb.collection('pins').findOne({
                    _id: mongo.ObjectID(id),
                    'blocked':0
                }, function(err, res2) {
                   
                    //console.log(i);
                    if (res2 && res2.board_id) {
                        pinModel.getBoardName(res2.board_id, function(boardname) {
                            v.time = res2.time;
                            v.board_id = res2.board_id;
                            v.image_name = res2.image_name;
                            v.pin_type = res2.pin_type;
                            v.source_url = res2.source_url;
                            v.video_type = res2.video_type;
                            v.video_id = res2.video_id;
                            
                            v.tmb_image_name = res2.tmb_image_name;
                            if(boardname && boardname.board_name){
                                v.board_name = boardname.board_name;
                                v.board_image = boardname.image;
                            }
                            else{
                                v.board_name = 'locked Board';
                                v.board_id = '';
                            }
                            v.description = res2.description;
                            if (typeof (res2.user_id) != 'string') {
                                var creator = res2.user_id.toHexString();
                            }
                            pinModel.pinLikeCheck(id, user_id, function(likecheck) {
                                if (likecheck.length > 0)
                                    v.pinlike = 0;
                                else
                                    v.pinlike = 1;
                                var board_id = res2.board_id
                               
                            });
                            mongodb.collection('user').findOne({
                                _id: mongo.ObjectID(creator)
                            }, function(err, pincreator) {
                                m++;
                                //console.log(i);
                                if (pincreator && pincreator.name) {
                                    v.creator_name = pincreator.name;
                                // v.board_image = res2.image;

                               
                                }

                            });
                            mongodb.collection('user_profile').findOne({
                                user_id: mongo.ObjectID(creator)
                            }, function(err, creator_detail) {
                                n++;
                                //console.log(i);
                                if (creator_detail && creator_detail.pic) {

                                    v.creator_image = creator_detail.pic;

                                
                                }

                            });

                            pinModel.pinLikeCount(id, function(likecount) {

                                v.pinlikecount = likecount;

                                pinModel.pinLikeCheck(id, user_id, function(likecheck) {
                                    if (likecheck.length > 0)
                                        v.pinlike = 0;
                                    else
                                        v.pinlike = 1;
                                    
                                });
                            });
                        });
                    }

                });

                if(data.length==i)
                {
                    callback(data);
                }


            });
        });


    },
   /* 
     * @author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * @param userid,startlimit,endlimit,type of listing,listing id
     * @return pins
     */
    morePinlists: function(user_id, start, end, list,list_id, callback) {

        end = parseInt(end);
        start = parseInt(start);

        if (list == 'like')
        {
            var collection = mongodb.collection('pin_like');
            collection.aggregate([
            {
                $project: {
                    "pin_id": 1
                }
            },

            {
                $group: {
                    "_id": "$pin_id", 
                    total: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "total": -1
                }
            },
            {
                $skip: start
            },
            {
                $limit: 15
            }
            ], function(err, data) {
                if (err)
                    console.log(err);

                var i = 0,
                j = 0,
                m=0,
                n=0;
                data.forEach(function(v) {
                    v.popStatus = 1 ;//pop up            
                    var pin_id = v._id;
                    if (typeof (v._id) != 'string') {
                        var id = v._id.toHexString();
                    }
                    v.loggeduser_id = user_id;
                    mongodb.collection('pins').findOne({
                        _id: mongo.ObjectID(id),
                        'blocked':0
                    }, function(err, res2) {
                        i++;
                        //console.log(i);
                        if (res2 && res2.board_id) {
                            pinModel.getBoardName(res2.board_id, function(boardname) {
                                v.time = res2.time;
                                v.board_id = res2.board_id;
                                v.image_name = res2.image_name;
                                v.pin_type = res2.pin_type;
                                v.source_url = res2.source_url;
                                v.video_type = res2.video_type;
                                v.video_id = res2.video_id;
                                v.tmb_image_name = res2.tmb_image_name;
                                if(boardname && boardname.board_name){
                                    v.board_name = boardname.board_name;
                                    v.board_image = boardname.image;
                                }
                                else{
                                    v.board_name = 'locked Board';
                                    v.board_id = '';
                                }
                                v.pinlikecount = v.total;
                                v.description = res2.description;
                                var creator = v.user_id;
                                if (typeof (res2.user_id) != 'string') {
                                    var creator = res2.user_id.toHexString();
                                }
                                pinModel.pinLikeCheck(id, user_id, function(likecheck) {
                                    if (likecheck.length > 0)
                                        v.pinlike = 0;
                                    else
                                        v.pinlike = 1;
                                    var board_id = res2.board_id
                                    if (data.length == i) {
                                        callback(data);
                                    }
                                });
                                mongodb.collection('user').findOne({
                                    _id: mongo.ObjectID(creator)
                                }, function(err, pincreator) {
                                    m++;
                                    //console.log(i);
                                    if (pincreator && pincreator.name) {
                                        v.creator_name = pincreator.name;
                                        // v.board_image = res2.image;

                                        if (data.length == m) {
                                            callback(data);
                                        }
                                    }

                                });
                                mongodb.collection('user_profile').findOne({
                                    user_id: mongo.ObjectID(creator)
                                }, function(err, creator_detail) {
                                    n++;
                                    //console.log(i);
                                    if (creator_detail && creator_detail.pic) {

                                        v.creator_image = creator_detail.pic;

                                        if (data.length == n) {
                                            callback(data);
                                        }
                                    }

                                });
                                pinModel.pinLikeCheck(id, user_id, function(likecheck) {
                                    if (likecheck.length > 0)
                                        v.pinlike = 0;
                                    else
                                        v.pinlike = 1;
                                    var board_id = res2.board_id
                                    if (data.length == i) {
                                        callback(data);
                                    }
                                });
                            });
                        }

                    });


                });
            // });
            });
        }
        else if (list == 'repin')
        {

            var collection = mongodb.collection('repin');
            collection.aggregate([
            {
                $project: {
                    "source_pin_id": 1
                }
            },

            {
                $group: {
                    "_id": "$source_pin_id", 
                    total: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "total": -1
                }
            },
            {
                $skip: start
            },
            {
                $limit: 15
            }
            ], function(err, data) {
                if (err)
                    console.log(err);
                //console.log(data);
                var i = 0,
                j = 0,
                m=0,
                n=0;
                ;
                data.forEach(function(v) {
                    v.popStatus = 1 ;//pop up
                    var pin_id = v._id;
                    if (typeof (v._id) != 'string') {
                        var id = v._id.toHexString();
                    }
                    v.loggeduser_id = user_id;
                    mongodb.collection('pins').findOne({
                        _id: mongo.ObjectID(id),
                        'blocked':0
                    }, function(err, res2) {
                        i++;
                        //console.log(i);
                        if (res2 && res2.board_id) {
                            pinModel.getBoardName(res2.board_id, function(boardname) {
                                v.time = res2.time;
                                v.board_id = res2.board_id;
                                v.image_name = res2.image_name;
                                v.pin_type = res2.pin_type;
                                v.source_url = res2.source_url;
                                v.video_type = res2.video_type;
                                v.video_id = res2.video_id;
                                if(boardname && boardname.board_name){
                                    v.board_name = boardname.board_name;
                                    v.board_image = boardname.image;
                                }
                                else{
                                    v.board_name = 'locked Board';
                                    v.board_id = '';
                                }
                                v.tmb_image_name = res2.tmb_image_name;
                                v.description = res2.description;
                                if (typeof (res2.user_id) != 'string') {
                                    var creator = res2.user_id.toHexString();
                                }
                                pinModel.pinLikeCheck(id, user_id, function(likecheck) {
                                    if (likecheck.length > 0)
                                        v.pinlike = 0;
                                    else
                                        v.pinlike = 1;
                                    var board_id = res2.board_id
                                    if (data.length == i) {
                                        callback(data);
                                    }
                                });
                                mongodb.collection('user').findOne({
                                    _id: mongo.ObjectID(creator)
                                }, function(err, pincreator) {
                                    m++;
                                    //console.log(i);
                                    if (pincreator && pincreator.name) {
                                        v.creator_name = pincreator.name;
                                        // v.board_image = res2.image;

                                        if (data.length == m) {
                                            callback(data);
                                        }
                                    }

                                });
                                mongodb.collection('user_profile').findOne({
                                    user_id: mongo.ObjectID(creator)
                                }, function(err, creator_detail) {
                                    n++;
                                    //console.log(i);
                                    if (creator_detail && creator_detail.pic) {

                                        v.creator_image = creator_detail.pic;

                                        if (data.length == n) {
                                            callback(data);
                                        }
                                    }

                                });
                                
                                pinModel.pinLikeCount(id, function(likecount) {

                                    v.pinlikecount = likecount;

                                    pinModel.pinLikeCheck(id, user_id, function(likecheck) {
                                        if (likecheck.length > 0)
                                            v.pinlike = 0;
                                        else
                                            v.pinlike = 1;
                                        if (data.length == i) {
                                            //  console.log(data);
                                            callback(data);
                                        }
                                    });
                                });
                            });
                        }

                    });



                });
            });
        }

        else if (list == "list")
        {
            var condition = {
                'blocked':0
            }

            var collection = mongodb.collection('pins');
            collection.find(condition).skip(start).limit(end).sort({
                time: -1
            }, function(err, res) {
                res.toArray(function(er, data) {
                    var i = 0,
                    l = 0,
                    j = 0,
                    m = 0,
                    n = 0;
                    data.forEach(function(v) {
                        v.popStatus = 1;
                        var id = v.board_id;
                        var creator = v.user_id;
                        if (typeof (v.board_id) != 'string') {
                            var id = v.board_id.toHexString();
                        }

                        if (typeof (v.user_id) != 'string') {
                            var creator = v.user_id.toHexString();
                        }
                        v.loggeduser_id = user_id;
                        mongodb.collection('board').findOne({
                            _id: mongo.ObjectID(id),
                            'locked':0
                        }, function(err, res2) {
                            i++;
                            //console.log(i);
                            if (res2 && res2.board_name) {
                                v.board_name = res2.board_name;
                                v.board_image = res2.image;
                                if (data.length == i) {
                                    callback(data);
                                }
                            }
                    
                            else{
                                v.board_name = 'locked Board';
                                v.board_id = ''
                                if (data.length == i) {
                                    callback(data);
                                }
                            }

                        });

                        mongodb.collection('pin_like').findOne({
                            'user_id': mongo.ObjectID(user_id), 
                            'pin_id': v._id
                        }, function(err, res3) {
                            j++;

                            if (res3) {
                                v.pinlike = 0;

                                if (data.length == j) {

                                    callback(data);
                                }
                            }
                            else {
                                v.pinlike = 1;

                                if (data.length == j) {

                                    callback(data);
                                }
                            }

                        });

                        mongodb.collection('pin_like').count({
                            'pin_id': v._id
                        }, function(err, res3) {
                            l++;

                            if (res3) {
                                v.pinlikecount = res3;

                                if (data.length == j) {

                                    callback(data);
                                }
                            }
                            else {
                                v.pinlikecount = 0;

                                if (data.length == j) {

                                    callback(data);
                                }
                            }

                        });

                        mongodb.collection('user').findOne({
                            _id: mongo.ObjectID(creator)
                        }, function(err, pincreator) {
                            m++;
                            //console.log(i);
                            if (pincreator && pincreator.name) {
                                v.creator_name = pincreator.name;
                                // v.board_image = res2.image;

                                if (data.length == m) {
                                    callback(data);
                                }
                            }

                        });
                        mongodb.collection('user_profile').findOne({
                            user_id: mongo.ObjectID(creator)
                        }, function(err, creator_detail) {
                            n++;
                            //console.log(i);
                            if (creator_detail && creator_detail.pic) {

                                v.creator_image = creator_detail.pic;

                                if (data.length == n) {
                                    callback(data);
                                }
                            }

                        });
                    });
                });
            });
        }
        else if (list == "user")
        {
            var creator_id = list_id;
            var collection = mongodb.collection('pins');
            collection.find({
                user_id: mongo.ObjectID(creator_id),
                'blocked':0/*,repin:{$ne:1}*/
            }).skip(start).limit(end).sort({
                time: -1
            }, function(err, res) {
                res.toArray(function(er, data) {
                    if (data.length > 0)
                    {
                        var i = 0;
                        var j = 0;
                        var k=0;
                        var l=0;
                        data.forEach(function(v) {
                            v.popStatus = 1 ;//pop up
                            var id = v.board_id;
                            if (typeof (v.board_id) != 'string') {
                                var id = v.board_id.toHexString();
                            }
                            var creator_id = v.user_id;
                            if (typeof (v.user_id) != 'string') {
                                var creator_id = v.user_id.toHexString();
                            }
                            v.loggeduser_id = user_id;
                                               
                            mongodb.collection('board').findOne({
                                _id: mongo.ObjectID(id)
                            }, function(err, res2) {
                                i++;
                                //console.log(res2);
                                if (res2 && res2.board_name) {
                                    v.board_name = res2.board_name;
                                    v.board_image = res2.image;

                                    //console.log(i);
                                    if (data.length == i) {
                                        //console.log(data);
                                        callback(data);
                                    }
                                }
                                
                                else{
                                    v.board_name = 'locked Board';
                                    v.board_id = '';
                                    if (data.length == i) {
                                        //console.log(data);
                                        callback(data);
                                    }
                                }

                            });
                            mongodb.collection('pin_like').findOne({
                                'user_id': mongo.ObjectID(user_id), 
                                'pin_id': v._id
                            }, function(err, res3) {
                                j++;

                                if (res3) {
                                    v.pinlike = 0;
                                    v.pinlikecount = 1;
                                    if (data.length == j) {
                                        //console.log(data);    
                                        callback(data);
                                    }
                                }
                                else {
                                    v.pinlike = 1;
                                    v.pinlikecount = 0;
                                    if (data.length == j) {
                                        //console.log(data);   
                                        callback(data);
                                    }
                                }

                            });
                        
                            mongodb.collection('user').findOne({
                                _id: mongo.ObjectID(creator_id)
                            }, function(err, res3) {
                                l++;
                                //console.log(res2);
                                if (res3 && res3.name) {
                                    v.creator_name = res3.name;
                                    //console.log(i);
                                    if (data.length == l) {
                                        //console.log(data);
                                        callback(data);
                                    }
                                }

                            });
                        
                            mongodb.collection('user_profile').findOne({
                                user_id: mongo.ObjectID(creator_id)
                            }, function(err, res4) {
                                k++;
                                //console.log(res2);
                                if (res4 && res4.pic) {
                                    v.creator_image = res4.pic;
                                    //console.log(i);
                                    if (data.length == k) {
                                        //console.log(data);
                                        callback(data);
                                    }
                                }

                            });

                        //                        mongodb.collection('pin_like').find({'pin_id': v._id}, function(err, res4) {
                        //                            j++;
                        //
                        //                            if (res4 && res4.pin_id) {
                        //                                v.pinlike = 0;
                        //
                        //                                if (data.length == j) {
                        //
                        //                                    callback(data);
                        //                                }
                        //                            }
                        //                            else {
                        //                                v.pinlike = 1;
                        //
                        //                                if (data.length == j) {
                        //
                        //                                    callback(data);
                        //                                }
                        //                            }
                        //
                        //                        });
                        });
                    }
                    else {

                        callback(data);
                    }
                });

            });
        }

        else if(list=='category')
        {
            var cat_id = list_id;
   
            pinModel.getBoardsByCategory(cat_id,function(boards){
    
                var collection = mongodb.collection('pins');

                //console.log(board_id);
                collection.find({
                    board_id: {
                        '$in':boards
                    },
                    'blocked':0// board_id/*,repin:{$ne:1}*/
                }).skip(start).limit(end).sort({
                    time: -1
                }, function(err, res) {
                    res.toArray(function(er, data) {
                        if (data.length > 0)
                        {
                            var i = 0;
                            var j = 0;
                            var m=0;
                            var n=0;
                            data.forEach(function(v) {
                                i++;
                                var id = v.board_id;
                                v.popStatus = 1;
                                if (typeof (v.board_id) != 'string') {
                                    var id = v.board_id.toHexString();
                                }
                        
                                var creator = v.user_id;
                                if (typeof (v.user_id) != 'string') {
                                    var creator = v.user_id.toHexString();
                                }
                                v.loggeduser_id = user_id;
                                mongodb.collection('board').findOne({
                                    _id: mongo.ObjectID(id),
                                    locked:0
                                }, function(err, res2) {
                            
                                    //console.log(res2);
                                    if (res2 && res2.board_name) {
                                        v.board_name = res2.board_name;
                                        v.board_image = res2.image;
                                    }
                            
                                    else{
                                        v.board_name = 'locked Board'; 
                                        v.board_id ='';
                                    }
                            
                            
                                });
                                mongodb.collection('pin_like').findOne({
                                    'user_id': mongo.ObjectID(user_id), 
                                    'pin_id': v._id
                                }, function(err, res3) {
                                    j++;
                            
                                    if (res3) {
                                        v.pinlike = 0;
                                        v.pinlikecount = 1;
                                
                                    }
                                    else {
                                        v.pinlike = 1;
                                        v.pinlikecount = 0;
                                
                                    }
                            
                                });
                                mongodb.collection('user').findOne({
                                    _id: mongo.ObjectID(creator)
                                }, function(err, pincreator) {
                                    m++;
                                    //console.log(i);
                                    if (pincreator && pincreator.name) {
                                        v.creator_name = pincreator.name;
                                    // v.board_image = res2.image;
                                
                                    }
                            
                                });
                                mongodb.collection('user_profile').findOne({
                                    user_id: mongo.ObjectID(creator)
                                }, function(err, creator_detail) {
                                    n++;
                                    //console.log(i);
                                    if (creator_detail && creator_detail.pic) {
                                
                                        v.creator_image = creator_detail.pic;
                                
                                
                                    }
                            
                                });
                        
                                //                        console.log(boards.length + '--' + a);
                                //                        console.log(data.length + '===' + i);

                                if(data.length==i) {
                                    callback(data);
                                }
                            });
                        }
                        else {
                    
                            callback(data);
                        }
                    //                
                    //                if(boards.length==parseInt(a-1))
                    //            {
                    //                callback(data);
                    //            }
                    //
                    //            else {
                    //
                    //                callback(data);
                    //            }
            
            
                    });
                });
        
            });
        } 
    
        else if(list=='board')
        {
            var board_id = list_id;
            var collection = mongodb.collection('pins');
            collection.find({
                board_id: mongo.ObjectID(board_id),
                'blocked':0/*,repin:{$ne:1}*/
            }).skip(start).limit(end).sort({
                time: -1
            }, function(err, res) {
                res.toArray(function(er, data) {
                    if (data.length > 0)
                    {
                        var i = 0;
                        var j = 0;
                        var m=0;
                        var n=0;
                        data.forEach(function(v) {
                            i++;
                            var id = v.board_id;
                            v.popStatus = 1;
                            if (typeof (v.board_id) != 'string') {
                                var id = v.board_id.toHexString();
                            }
                        
                            var creator = v.user_id;
                            if (typeof (v.user_id) != 'string') {
                                var creator = v.user_id.toHexString();
                            }
                            v.loggeduser_id = user_id;
                            mongodb.collection('board').findOne({
                                _id: mongo.ObjectID(id)
                            }, function(err, res2) {
                           
                                //console.log(res2);
                                if (res2 && res2.board_name) {
                                    v.board_name = res2.board_name;
                                    v.board_image = res2.image;
                                }
                            
                           

                            });
                            mongodb.collection('pin_like').findOne({
                                'user_id': mongo.ObjectID(user_id), 
                                'pin_id': v._id
                            }, function(err, res3) {
                                j++;

                                if (res3) {
                                    v.pinlike = 0;
                                    v.pinlikecount = 1;
                                
                                }
                                else {
                                    v.pinlike = 1;
                                    v.pinlikecount = 0;
                               
                                }

                            });
                            mongodb.collection('user').findOne({
                                _id: mongo.ObjectID(creator)
                            }, function(err, pincreator) {
                                m++;
                                //console.log(i);
                                if (pincreator && pincreator.name) {
                                    v.creator_name = pincreator.name;
                                // v.board_image = res2.image;

                                }

                            });
                            mongodb.collection('user_profile').findOne({
                                user_id: mongo.ObjectID(creator)
                            }, function(err, creator_detail) {
                                n++;
                                //console.log(i);
                                if (creator_detail && creator_detail.pic) {

                                    v.creator_image = creator_detail.pic;

                                
                                }

                            });

                            //                        mongodb.collection('pin_like').find({'pin_id': v._id}, function(err, res4) {
                            //                            j++;
                            //
                            //                            if (res4 && res4.pin_id) {
                            //                                v.pinlike = 0;
                            //
                            //                                if (data.length == j) {
                            //
                            //                                    callback(data);
                            //                                }
                            //                            }
                            //                            else {
                            //                                v.pinlike = 1;
                            //
                            //                                if (data.length == j) {
                            //
                            //                                    callback(data);
                            //                                }
                            //                            }
                            //
                            //                        });

                            if(data.length==i)
                            {
                                callback(data);
                            }
                        });
                    }
                    else {

                        callback(data);
                    }
                });

            });
        }  
    

    },
    /**
     
     
     /* 
     * @author Arya <arya@cubettech.com>
     * @Date 29-11-2013
     * @param pin details
     * @return details of new pin
     */
    PinCreation: function(insert_data, callback) {
        var collection = mongodb.collection('pins');
        collection.insert(insert_data, function(err, new_data) {
            mongodb.collection('board').findOne({
                _id: new_data[0].board_id
            }, function(err3, res3) {
                new_data[0].board_name = res3.board_name;
                new_data[0].board_image = res3.image;
                if (err)
                    return console.error(err);
                callback(new_data);
            });
        });
    },
    /* 
     * @author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * @param board id
     * @return pin details
     */

    getPinsByBoard_not: function(board_id, callback) {

        if (typeof (board_id) != 'string') {
            board_id.toHexString();
        }
        var collection = mongodb.collection('pins');
        collection.find({
            'board_id': mongo.ObjectID(board_id),
            'blocked':0
        }, function(err, res) {
            res.toArray(function(er, data) {
                callback(data);
            });
        });
    },
    /* 
     * @author Arya <arya@cubettech.com>
     * @Date 11-11-2013
     * @param pin id
     * @return pin details
     */
    getPinDetails: function(pin_id, callback) {


        var collection = mongodb.collection('pins');
        collection.find({
            '_id': mongo.ObjectID(pin_id),
            'blocked':0
        }, function(err, res) {
            res.toArray(function(er, data) {
                callback(data);
            });
        });
    },
    //pinlists with join not using
    Pinlists1: function(callback) {
        //    var collection = mongodb.collection('pins'); 
        //    collection.find().limit(20).sort({time:-1}, function(err, res){
        //            res.toArray(function(er, data){
        //              callback(data);
        //            });
        //    });
        //    
        var collection_name = "temp_11";
        var boardMap = function() {

            emit(this._id, {
                board_name: this.board_name,
                board_id: 0,
                image_name: 0,
                pin_type_id: 0,
                pin_url: 0,
                source_url: 0,
                time: 0,
                user_id: 0
            });

        }

        var pinMap = function() {
            if (this.board_id == '528c79656a1167e117000001')
            {
                emit(this._id, {
                    board_name: 0,
                    board_id: this.board_id,
                    image_name: this.image_name,
                    pin_type_id: this.pin_type_id,
                    pin_url: this.pin_url,
                    source_url: this.source_url,
                    time: this.time,
                    user_id: this.user_id
                });
            }
        }

        var reduce = function(key, values) {
            var outs = {
                board_name: 0,
                time: 0
            };
            values.forEach(function(v) {
                if (v.board_name) {
                    outs.board_name = v.board_name;
                }
                if (v.time) {
                    outs.time = v.time;
                }
            //            outs.board_name = v.board_name ? v.board_name : 0;
            //            outs.board_id = v.board_id ? v.board_id : 0;
            //            outs.image_name = v.image_name ? v.image_name : 0;
            //            outs.pin_type_id = v.pin_type_id ? v.pin_type_id : 0;
            //            outs.pin_url = v.pin_url ? v.pin_url : 0;
            //            outs.source_url = v.source_url ? v.source_url : 0;
            //            outs.time = v.time ? v.time : 0;
            //            outs.user_id = v.user_id ? v.user_id : 0;
            });
            return outs;
        },
        res = mongodb.collection('pins').mapReduce(pinMap, reduce, {
            out: {
                reduce: collection_name
            }
        }, function(err, results) {
            if (err)
                console.log(err);
        //console.log('1'+results);

        });


        res = mongodb.collection('board').mapReduce(boardMap, reduce, {
            out: {
                reduce: collection_name
            }
        }, function(err, results) {
            if (err)
                console.log(err);
        // console.log('2'+results);


        });

    //   mongodb.collection(collection_name).find({},function (err,res) {
    //                   if(res) {
    //                        res.toArray(function(er, data){
    ////                              //  console.log(data);
    //                               callback(data);
    //                       });
    //                   } else {
    //                      callback(0);
    //                   }
    //                   
    //////                    mongodb.collection(collection_name).drop();
    //          });
    },
    /**
     * @author Rahul P R <rahul.pr@cubettech.com >
     * @date 26-Nov-2013
     * 
     * get pins corresponding to board_id
     *
     **/
    getPinsByBoard: function(user_id, board_id, callback) {

        var collection = mongodb.collection('pins');
        collection.find({
            board_id: mongo.ObjectID(board_id),
            'blocked':0/*,repin:{$ne:1}*/
        }).limit(15).sort({
            time: -1
        }, function(err, res) {
            res.toArray(function(er, data) {
                if (data.length > 0)
                {
                    var i = 0;
                    var j = 0;
                    var m=0;
                    var n=0;
                    data.forEach(function(v) {
                        i++;
                        var id = v.board_id;
                        v.popStatus = 1;
                        if (typeof (v.board_id) != 'string') {
                            var id = v.board_id.toHexString();
                        }
                        
                        var creator = v.user_id;
                        if (typeof (v.user_id) != 'string') {
                            var creator = v.user_id.toHexString();
                        }
                        v.loggeduser_id = user_id;
                        mongodb.collection('board').findOne({
                            _id: mongo.ObjectID(id)
                        }, function(err, res2) {
                           
                            //console.log(res2);
                            if (res2 && res2.board_name) {
                                v.board_name = res2.board_name;
                                v.board_image = res2.image;
                            }
                            
                           

                        });
                        mongodb.collection('pin_like').findOne({
                            'user_id': mongo.ObjectID(user_id), 
                            'pin_id': v._id
                        }, function(err, res3) {
                            j++;

                            if (res3) {
                                v.pinlike = 0;
                                v.pinlikecount = 1;
                                
                            }
                            else {
                                v.pinlike = 1;
                                v.pinlikecount = 0;
                               
                            }

                        });
                        mongodb.collection('user').findOne({
                            _id: mongo.ObjectID(creator)
                        }, function(err, pincreator) {
                            m++;
                            //console.log(i);
                            if (pincreator && pincreator.name) {
                                v.creator_name = pincreator.name;
                            // v.board_image = res2.image;

                            }

                        });
                        mongodb.collection('user_profile').findOne({
                            user_id: mongo.ObjectID(creator)
                        }, function(err, creator_detail) {
                            n++;
                            //console.log(i);
                            if (creator_detail && creator_detail.pic) {

                                v.creator_image = creator_detail.pic;

                                
                            }

                        });

                        //                        mongodb.collection('pin_like').find({'pin_id': v._id}, function(err, res4) {
                        //                            j++;
                        //
                        //                            if (res4 && res4.pin_id) {
                        //                                v.pinlike = 0;
                        //
                        //                                if (data.length == j) {
                        //
                        //                                    callback(data);
                        //                                }
                        //                            }
                        //                            else {
                        //                                v.pinlike = 1;
                        //
                        //                                if (data.length == j) {
                        //
                        //                                    callback(data);
                        //                                }
                        //                            }
                        //
                        //                        });

                        if(data.length==i)
                        {
                            callback(data);
                        }
                    });
                }
                else {

                    callback(data);
                }
            });

        });
    },
    /* 
     * @author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * @param insert pin like details
     * @return details of pin like
     */
    insertPinLike: function(insert_data, callback) {
        var collection = mongodb.collection('pin_like');
        collection.insert(insert_data, function(err, new_data) {
            if (err)
                return console.error(err);

            callback(new_data);
        });
    },
    insertComment: function(insert_data, callback) {
        var collection = mongodb.collection('pin_comment');
        collection.insert(insert_data, function(err, new_data) {
            if (err)
                return console.error(err);

            callback(new_data);
        });
    },
    pinLikeCheck1: function(user_id, pin_id, callback) {


        var collection = mongodb.collection('pin_like');
        collection.find({
            'user_id': mongo.ObjectID(user_id), 
            'pin_id': mongo.ObjectID(pin_id)
        }, function(err, res) {
            res.toArray(function(er, data) {
                if (data.length > 0) {
                    callback(1);
                } else {
                    callback(0);
                }
            });
        });
    },
    /* 
     * @author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * @param pin details
     * @return remove pin like
     */
    removePinLike: function(data, callback) {


        var collection = mongodb.collection('pin_like');
        collection.remove({
            'pin_id': data.pin_id, 
            'user_id': data.user_id
        }, function(err, data) {

            if (err)
                return handleError(err);
            callback(1);
        });
    },
    /* 
     * @author Arya <arya@cubettech.com>
     * @Date 22-11-2013
     * @param pinid
     * @return return repin details
     */
    checkRepin: function(source_pin_id, callback)
    {
        var collection = mongodb.collection('repin');
        collection.find({
            'source_pin_id': mongo.ObjectID(source_pin_id)
        }, function(err, res) {
            res.toArray(function(er, data) {

                callback(data);
            });
        });
    },
    /* 
     * @author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * @param pin id
     * @return details of the pin creator
     */
    getPinCreator: function(pin_id, callback)
    {

        var collection_name = "pin_" + pin_id;
        var user_map = function() {
            emit(this._id, {
                name: this.name, 
                email: this.email, 
                socket_id: this.socket_id, 
                time: 0
            });
        }

        var pin_map = function() {
            if (this._id == pin_id) {
                emit(this.user_id, {
                    name: 0,
                    email: 0,
                    socket_id: 0,
                    time: this.time
                });
            }
        }

        var reduce = function(key, values) {
            var outs = {
                name: 0, 
                email: 0, 
                socket_id: 0, 
                timestamp: 0
            };
            values.forEach(function(v) {
                if (v.email) {
                    outs.email = v.email;
                }
                if (v.timestamp) {
                    outs.timestamp = v.timestamp;
                }
                if (v.socket_id) {
                    outs.socket_id = v.socket_id;
                }
                if (v.name) {
                    outs.name = v.name;
                }
            });
            return outs;
        },
        res = mongodb.collection('pins').mapReduce(pin_map, reduce, {
            out: {
                reduce: collection_name
            }, 
            scope: {
                pin_id: pin_id
            }
        }, function(err, results) {
            if (err)
                console.log(err);

        });


        res = mongodb.collection('user').mapReduce(user_map, reduce, {
            out: {
                reduce: collection_name
            }
        }, function(err, results) {
            if (err)
                console.log(err);

            mongodb.collection(collection_name).find({
                'value.time': {
                    $ne: 0
                }
            }, function(err, res) {
                if (res) {
                    res.toArray(function(er, data) {

                        callback(data);
                    });
                } else {
                    callback(0);
                }
                mongodb.collection(collection_name).drop();
            });
        });

    },
    rePinCreation: function(insert_data, callback) {


        var collection = mongodb.collection('repin');
        collection.insert(insert_data, function(err, new_data) {
            if (err)
                return console.error(err);

            callback(new_data);
        });
    },
    getBoardName: function(id, callback) {
        var collection = mongodb.collection('board');
        collection.find({
            '_id': id,
            'locked':0
        }, function(err, res) {
            res.toArray(function(er, data) {
                callback(data[0]);
            });
        });

    },
    pinLikeCheck: function(pinid, userid, callback) {
        var collection = mongodb.collection('pin_like');
        collection.find({
            'pin_id': mongo.ObjectID(pinid), 
            "user_id": mongo.ObjectID(userid)
        }, function(err, res) {
            res.toArray(function(er, data) {
                callback(data);
            });
        });

    },
    pinLikeCount: function(id, callback)
    {
        var collection = mongodb.collection('pin_like');
        collection.find({
            'pin_id': mongo.ObjectID(id)
        }, function(err, res) {
            res.toArray(function(er, data) {
                callback(data.length);
            });
        });

    },
    /**
     * @author Arya s a <arya@cubettech.com >
     * @date 13-12-2013
     * @param details to report
     * @return new details inserted
     * report pin
     *
     **/
    reportPin: function(report_data, callback)
    {
        var collection = mongodb.collection('pins');
        collection.update(
        {
            '_id': mongo.ObjectID(report_data.pin_id)
        },

        {
            '$set': {
                'reported': 1,
                "report_msg": report_data.rept_message,
                "report_by": mongo.ObjectID(report_data.report_by),
                "report_reason": report_data.report_reason
            }
        },
        function(err, data) {
            if (err)
                return handleError(err);
            callback(data);
        });
    },
    /**
     * @author Arya s a <arya@cubettech.com >
     * @date 13-12-2013
     * @param userid,creatorid,
     * @return pin details
     * get pins of a user
     *
     **/
    getPinsByUser: function(user_id, creator_id, user, callback) {

        var collection = mongodb.collection('pins');
        collection.find({
            user_id: mongo.ObjectID(creator_id)/*,repin:{$ne:1}*/
        }).limit(15).sort({
            time: -1
        }, function(err, res) {
            res.toArray(function(er, data) {
                if (data.length > 0)
                {
                    var i = 0;
                    var j = 0;
                    var k=0;
                    var l=0;
                    data.forEach(function(v) {
                        var id = v.board_id;
                        v.popStatus = 1;
                        if (typeof (v.board_id) != 'string') {
                            var id = v.board_id.toHexString();
                        }
                        var creator_id = v.user_id;
                        if (typeof (v.user_id) != 'string') {
                            var creator_id = v.user_id.toHexString();
                        }
                        v.loggeduser_id = user_id;
                                               
                        mongodb.collection('board').findOne({
                            _id: mongo.ObjectID(id)
                        }, function(err, res2) {
                            i++;
                            //console.log(res2);
                            if (res2 && res2.board_name) {
                                v.board_name = res2.board_name;
                                v.board_image = res2.image;

                                //console.log(i);
                                if (data.length == i) {
                                    //console.log(data);
                                    callback(data);
                                }
                            }
                            
                            else{
                                v.board_name = 'locked Board';
                                v.board_id = '';
                                if (data.length == i) {
                                    //console.log(data);
                                    callback(data);
                                }
                            }

                        });
                        mongodb.collection('pin_like').findOne({
                            'user_id': mongo.ObjectID(user_id), 
                            'pin_id': v._id
                        }, function(err, res3) {
                            j++;

                            if (res3) {
                                v.pinlike = 0;
                                v.pinlikecount = 1;
                                if (data.length == j) {
                                    //console.log(data);    
                                    callback(data);
                                }
                            }
                            else {
                                v.pinlike = 1;
                                v.pinlikecount = 0;
                                if (data.length == j) {
                                    //console.log(data);   
                                    callback(data);
                                }
                            }

                        });
                        
                        mongodb.collection('user').findOne({
                            _id: mongo.ObjectID(creator_id)
                        }, function(err, res3) {
                            l++;
                            //console.log(res2);
                            if (res3 && res3.name) {
                                v.creator_name = res3.name;
                                //console.log(i);
                                if (data.length == l) {
                                    //console.log(data);
                                    callback(data);
                                }
                            }

                        });
                        
                        mongodb.collection('user_profile').findOne({
                            user_id: mongo.ObjectID(creator_id)
                        }, function(err, res4) {
                            k++;
                            //console.log(res2);
                            if (res4 && res4.pic) {
                                v.creator_image = res4.pic;
                                //console.log(i);
                                if (data.length == k) {
                                    //console.log(data);
                                    callback(data);
                                }
                            }

                        });

                    //                        mongodb.collection('pin_like').find({'pin_id': v._id}, function(err, res4) {
                    //                            j++;
                    //
                    //                            if (res4 && res4.pin_id) {
                    //                                v.pinlike = 0;
                    //
                    //                                if (data.length == j) {
                    //
                    //                                    callback(data);
                    //                                }
                    //                            }
                    //                            else {
                    //                                v.pinlike = 1;
                    //
                    //                                if (data.length == j) {
                    //
                    //                                    callback(data);
                    //                                }
                    //                            }
                    //
                    //                        });
                    });
                }
                else {

                    callback(data);
                }
            });

        });
    },
    
    
    /**
     * @author ARYA S A <arya@cubettech.com >
     * @date 3/1/2014
     * @param userid,board id(s)
     * @return pin details
     * get pins corresponding to multiple board_id
     *
     **/
    getPinsFromMultipleBoard: function(user_id, boards, callback) {
    
        var collection = mongodb.collection('pins');    
        //    var a=1; 
        //    boards.forEach(function(details) { 
        //var board_id = details._id;
     
        collection.find({
            board_id:{
                '$in':boards
            },
            'blocked':0/*,repin:{$ne:1}*/
        }).limit(15).sort({
            time: -1
        }, function(err, res) {
            res.toArray(function(er, data) {
                //console.log(data);
                if (data.length > 0)
                {
                    var i = 0;
                    var j = 0;
                    var m=0;
                    var n=0;
                    data.forEach(function(v) {
                        i++;
                        var id = v.board_id;
                        v.popStatus = 1;
                        if (typeof (v.board_id) != 'string') {
                            var id = v.board_id.toHexString();
                        }
                        
                        var creator = v.user_id;
                        if (typeof (v.user_id) != 'string') {
                            var creator = v.user_id.toHexString();
                        }
                        v.loggeduser_id = user_id;
                        mongodb.collection('board').findOne({
                            _id: mongo.ObjectID(id),
                            locked:0
                        }, function(err, res2) {
                            
                            //console.log(res2);
                            if (res2 && res2.board_name) {
                                v.board_name = res2.board_name;
                                v.board_image = res2.image;
                            }
                            
                            else{
                                v.board_name = 'locked Board'; 
                                v.board_id ='';
                            }
                            
                            
                            
                        });
                        mongodb.collection('pin_like').findOne({
                            'user_id': mongo.ObjectID(user_id), 
                            'pin_id': v._id
                        }, function(err, res3) {
                            j++;
                            
                            if (res3) {
                                v.pinlike = 0;
                                v.pinlikecount = 1;
                                
                            }
                            else {
                                v.pinlike = 1;
                                v.pinlikecount = 0;
                                
                            }
                            
                        });
                        mongodb.collection('user').findOne({
                            _id: mongo.ObjectID(creator)
                        }, function(err, pincreator) {
                            m++;
                            //console.log(i);
                            if (pincreator && pincreator.name) {
                                v.creator_name = pincreator.name;
                            // v.board_image = res2.image;
                                
                            }
                            
                        });
                        mongodb.collection('user_profile').findOne({
                            user_id: mongo.ObjectID(creator)
                        }, function(err, creator_detail) {
                            n++;
                            //console.log(i);
                            if (creator_detail && creator_detail.pic) {
                                
                                v.creator_image = creator_detail.pic;
                                
                                
                            }
                            
                        });
                                              
                        
                       
                        
                        if(data.length==i) {
                             
                            callback(data);
                        }
                    });
                }
                else {
                    
                    callback(data);
                }
            //                
            //                if(boards.length==parseInt(a-1))
            //            {
            //                callback(data);
            //            }
            //
            //            else {
            //
            //                callback(data);
            //            }
            
            
            });
        });
        
    // });
   

    },
     /**
     * @author ARYA S A <arya@cubettech.com >
     * @date 3/1/2014
     * @param category id
     * @return array of board id(s)
     * 
     *
     **/

    getBoardsByCategory:function(id,callback){
        var collection = mongodb.collection('board');
        var boards=[];
        collection.find({
            'category_id':mongo.ObjectID(id)
            
        },{
            _id:1
        },function (err,res) {
            
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
    /**
     * @author ARYA S A <arya@cubettech.com >
     * @date 28/11/2013
     * @param user id
     * @return pincount
     * 
     *
     **/

    getUserPincount:function(user_id,callback){
      
       
        var collection = mongodb.collection('pins');
        collection.find({
            'user_id': mongo.ObjectID(user_id),
            'blocked':0
        }, function(err, res) {
            res.toArray(function(er, data) {
              
                callback(data);
            });
        });
       
    },
     /**
     * @author ARYA S A <arya@cubettech.com >
     * @date 28/11/2013
     * @param user id
     * @return followercount
     *
     *
     **/
    UserFollowerCount :function(id,callback){
        var collection = mongodb.collection('followers');  
        collection.find({
            'follower_id': mongo.ObjectID(id),
            'type':'user'
        },function (err, res) {
            res.toArray(function(er, data){
                //console.log(data);
                callback(data);
            });
        });
    
    }
    
}

module.exports = pinModel;
