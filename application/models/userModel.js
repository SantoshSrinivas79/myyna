/* functions related to get and update the details of users
 * user Model 
 * *The MIT License (MIT)
 * @category: cubetboard
 * @package :user
 * @version 2.0
 * @author Arya <arya@cubettech.com>
 * @Date 10-11-2013
 */


var userModel = {
    /* 
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     * @return details details of all users
     */
    Userlists: function(callback)
    {
        var collection = mongodb.collection('user');
        collection.find({}, function(err, res) {
            res.toArray(function(er, data) {
                callback(data);
            });
        });


    },
    /* usercheck
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     * @param:json array of username,and password
     * @return:user details if exists else returns 0
     */
    Usercheck: function(form_data, callback)
    {
        var collection = mongodb.collection('user');
        collection.find({
            'username': form_data.username, 
            'password': form_data.password, 
            'blocked': 0, 
            'verified': 1
        }, function(err, res) {
            if (res)
            {

                res.toArray(function(er, data) {

                    callback(data);
                });
            }
            else
            {
                callback(0);
            }
        });
    },
    /* usercheck
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     * @param:useremail
     * @return:user details if exists else returns 0
     */

    UserExistencecheck: function(email, callback)
    {
        var collection = mongodb.collection('user');
        collection.find({
            'email': email
        }, function(err, res) {
            if (res)
            {
                res.toArray(function(er, data) {
                    callback(data);
                });
            }
            else
            {
                callback(0);
            }
        });
    },
    
    /* validate user
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     * @param:username
     * @return:user details if exists 
     */

    UserValidation: function(username, callback)
    {
        var collection = mongodb.collection('user');
        collection.find({
            'username':username
        }, function(err, res) {
            if (res)
            {
                res.toArray(function(er, data) {
                    callback(data);
                });
            }
            
        });
    },
    /* 
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     * @param:details of the user
     * @return:user details of new user
     */

    UserInsertion: function(form_data, callback)

    {

        var collection = mongodb.collection('user');
        collection.insert(form_data, function(err, newuser) {
            if (err)
                console.error(err);
            
            callback(newuser);
        });
    },
    /* 
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     * @param:details of the user
     * @return:user details of new user
     */

    UserProfileInsertion: function(form_data,callback)
    {

        var collection = mongodb.collection('user_profile');
        
        collection.insert(form_data, function(err, newuser) {
            if (err)
                console.error(err);
            
            callback(newuser);
        });
        
    },
    /* user existencecheck 
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     * @param:twitter id of the user
     * @return:user details if exists else returns 0
     */

    TwitterUserExistencecheck:function(twitter_id,callback)
    {
        var collection = mongodb.collection('user');
        collection.find({
            'twitter_id': twitter_id
        }, function(err, res) {
            if (res)
            {
                res.toArray(function(er, data) {
                    callback(data);
                });
            }
            else
            {
                callback(0);
            }
        });
    },
    /* 
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     * @param:twitter id of the user
     * @return:user details 
     */
    UserProfileUpdate: function(form_data,user_id, callback)
    {

        var collection = mongodb.collection('user_profile');
        
        collection.update(
        {
            'user_id': mongo.ObjectID(form_data.user_id)
            },

            {
            $set: {
                'pic': form_data.pic
            }
        },
        function(err, data) {
            if (err)
                return handleError(err);

            callback(data);
        }
        );
        
},
     /* socket id updation
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     * @param:details of user
     * @return:user details 
     */
UserSocketIdUpdate: function(form_data, callback)

{
    var  socket_arr = [];
    userModel.getUserSocketId(form_data.user_id,function(usersocket){
        if(form_data.socket_id)
        {
            if(usersocket[0]&&usersocket[0].socket_id)
            {
                socket_arr = usersocket[0].socket_id;
                socket_arr.push(form_data.socket_id);
            }
            else{
                //console.log(form_data.socket_id);
                socket_arr.push(form_data.socket_id); 
            }
        }
        else{
            socket_arr =""; 
        }
        var collection = mongodb.collection('user');
        collection.update(
        {
            '_id': mongo.ObjectID(form_data.user_id)
            },

            {
            $set: {
                'socket_id': socket_arr
            }
        },
        function(err, data) {
            if (err)
                console.log(err);

            callback(data);
        }
        );
    });
        
},
   
     /* update socket id to empty
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     * @param:details of user
     */ 
UserSocketIdRemove: function(form_data, callback)

{
    var collection = mongodb.collection('user');
    collection.update(
    {
        '_id': mongo.ObjectID(form_data.user_id)
        },

        {
        $set: {
            'socket_id': form_data.socket_id
        }
    },
    function(err, data) {
        if (err)
            return handleError(err);

        callback(data);
    }
    );
},
    /* get the details of a user
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     * @param:userid
     * @return:user details 
     */ 
SelectedUser: function(user_id, callback)
{

    var collection = mongodb.collection('user');

    collection.find({
        _id: {
            $ne: mongo.ObjectID(user_id)
            }
        }, function(err, res) {
        res.toArray(function(er, data) {

            callback(data);
        });
    });

},
/* get the details of a user
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     * @param:userid
     * @return:user details 
     */ 
getUserSocketId: function(user_id, callback)
{

    var collection = mongodb.collection('user');
    collection.find({
        '_id': mongo.ObjectID(user_id)
        }, function(err, res) {
        //console.log(3);
        res.toArray(function(er, data) {

            callback(data);
        });
    });

},
 /* get the user/board followers
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     * @param:userid,followtype(user/board)
     * @return:followers 
     */ 

findFollowers: function(user_id, ftype, callback)
{

    var collection_name = "userfollow_" + user_id;
    var user_map = function() {
        emit(this._id, {
            name: this.name, 
            email: this.email, 
            socket_id: this.socket_id, 
            timestamp: 0
        });
    }

    var userprofile_map = function() {
        if (this.follower_id == user_id && this.type == ftype) {
            emit(this.follow_by, {
                name: 0,
                email: 0,
                socket_id: 0,
                timestamp: this.timestamp,
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
    res = mongodb.collection('followers').mapReduce(userprofile_map, reduce, {
        out: {
            reduce: collection_name
        }, 
        scope: {
            user_id: user_id, 
            ftype: ftype
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
        'value.timestamp': {
            $ne: 0
        }
    }, function(err, res) {
        if (res) {
            res.toArray(function(er, data) {
                //console.log(data);
                callback(data);
            });
        } else {
            callback(0);
        }
        mongodb.collection(collection_name).drop();
    });
});

},
   /* set user settings
     * @author Arya <arya@cubettech.com>
     * @Date 29-10-2013
     * @param:userid
     * @return:user details 
     */ 
InitialSettings: function(user_id,callback)

{
    var collection = mongodb.collection('settings');
    var form_data={
        "user_id": user_id,
        "comment":1,
        "like":1,
        "follow":1
                   
    }
    collection.insert(form_data, function(err, newuser) {
        if (err)
            return console.error(err);
            
        callback(newuser);
    });
},
     /* update user settings
     * @author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * @param:details to update
     * @return:user details 
     */ 
updateSettings:function(form_data,callback){
        
    var collection = mongodb.collection('settings');
    collection.update(
    {
        'user_id': form_data.user_id
        },

        {
        $set: {
            'comment': form_data.comment,
            'like': form_data.like,
            'follow': form_data.follow,
        }
    },
    function(err, data) {
        if (err)
            return handleError(err);

        callback(data);
    }
    );
        
},
     /* get user settings
     * @author Arya <arya@cubettech.com>
     * @Date 28-10-2013
     * @param:userid
     * @return:user details 
     */ 
UserSettings:function(user_id,callback){
        
    var collection = mongodb.collection('settings');
    collection.find({
        'user_id':mongo.ObjectID(user_id)
        }, function(err, res) {
        res.toArray(function(er, data) {
            callback(data);
        });
    });

},
    /* get user details
     * @author Arya <arya@cubettech.com>
     * @Date 28-10-2013
     * @param:userid
     * @return:user details 
     */  
    
userDetails: function(user_id,  callback)
{
        
    var collection = mongodb.collection('user');
    collection.find({
        '_id':mongo.ObjectID(user_id)
        }, function(err, res) {
        res.toArray(function(er, data) {

            if (data.length > 0) {
                var i = 0;
                           
                data.forEach(function(v) {
                        
                    mongodb.collection('user_profile').find({
                        user_id: mongo.ObjectID(user_id)
                        }, function(err, res2) {
                        res2.toArray(function(er, data1) {
                             
                             if(data1 && data1[0].pic)
                                 {
                            v.image=data1[0].pic;
                                 }
                        else{
                             v.image='';
                        }
                               
                                 
                            callback(data);
                               
                        });


                    });
                });
            } else {
                //if admin workaround
                callback([{
                    'image' : ''
                }]);
            }
        });
    });
},
     /* update user
     * @author Arya <arya@cubettech.com>
     * @Date 28-10-2013
     * @param:details to update,userid
     * @return:user details 
     */ 
updateuser:function(form_data,user_id, callback){
    //console.log(form_data);
        
    var collection = mongodb.collection('user');
    collection.update(
    {
        '_id': mongo.ObjectID(user_id)
        },

        {
        $set: form_data
    },
    function(err, data) {
        if (err)
            return handleError(err);

        callback(data);
    }
    );
        
},
    
 /* mail verification
     * @author Arya <arya@cubettech.com>
     * @Date 11-11-2013
     * @param:email
     * 
     */ 
UserMailVerification: function(id,email,callback)

{
    var crypto = require('crypto');      
    var collection = mongodb.collection('user');
    collection.findOne({_id:mongo.ObjectID(id)}, function(err, reslts){
       
        var bef_email = reslts.email+pass_salt;
       var cryptedEmail = crypto.createHash('md5').update(bef_email).digest("hex");
       console.log(email);
       console.log('hi');
       console.log(cryptedEmail);
        if(email == cryptedEmail){
            collection.update(
            {
                '_id': mongo.ObjectID(id)
            },

            {
                $set: {
                    'verified': 1
                }
            },
            function(err, data) {
                if (err)
                    return handleError(err);

                callback(data);
            }
            );
        } else {
            callback(false);
        }
        
   });
},
/**
     * @author Rahul P R <rahul.pr@cubettech.com >
     * @date 05-Dec-2013
     * 
     * get login page image,text and pins
     *
     **/
getLoginPage : function(callback){
    mongodb.collection('loginpage')
    //.sort({order: -1})
    .find({}, function(err, res){
        res.toArray(function(er, data){
            callback(data);
        });
    });
},
    
updateuser2:function(id,data,callback){
    mongodb.collection('user').update({
        '_id': id
    },{
        $set: data
    },function(err, data) {
        if (err)
            return handleError(err);
        callback(data);
    });
},
     /* get user follow details
     * @author Arya <arya@cubettech.com>
     * @Date 20-11-2013
     * @param:looggedid,userid
     * @return:user details 
     */ 
userFollowDetails: function(logged_user,user_id, callback)
{
        

    var collection = mongodb.collection('user');
    collection.find({
        '_id':mongo.ObjectID(user_id)
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
                    var id = user_id;
                                               
                    mongodb.collection('user_profile').findOne({
                        user_id: mongo.ObjectID(user_id)
                        }, function(err, res2) {
                            
                        //console.log(i);
                        if (res2 && res2.pic) {
                            v.image=res2.pic;

                                
                        }
                            

                    });

                    mongodb.collection('followers').findOne({
                        follower_id: mongo.ObjectID(user_id),
                        type:'user',
                        'follow_by':mongo.ObjectID(logged_user)
                        }, function(err, res3) {
                        j++;
                             
                        if (res3 && res3.type) {
                            v.userfollow = 1;

                               
                        }
                        else {
                            v.userfollow = 0;

                                
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
        
        
        
}
    
    
}

module.exports = userModel;
