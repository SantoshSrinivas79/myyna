
/*
 * GET home page.
 */

//get models
//var PostModel = system.getModel('user');
//system.registerPartial('header', 'ind');


//system.getLibrary('');

exports.index = function(req, res){
    console.log(req.params);
//    res.render('index', { title: 'Express' });
//    new PostModel({title: 'title', author: 'name'}).save();)
//    
//    var user = system.getController('user');
//    user.list(req, res);
//    return;
//
    
    
    var data = {
//        layout: 'main',
        title: "Sleek.js",
        home: "An MVC for Node js.. combining handlebars, express & mongodb together"
    }
    
    system.loadView(res,'home/index', data);
};

exports.userlist = function(db) {
    return function(req, res) {
        var collection = db.get('usercollection');
        collection.find({},{},function(e,docs){
            res.render('userlist', {
                "userlist" : docs
            });
        });
    };
};
