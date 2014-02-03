
/*
 * GET pin listing.
 */

var PostModel = system.getModel('webpin');

system.getLibrary('helpRegister');


exports.list = function(req, res) {

    //console.log(req.params);
    //exports.test();
    PostModel.Pinlists(function(person) {
        var data = {'data': person, 'pagetitle': 'Pins'};
        system.loadView(res, 'pins/pin', data);
        system.setPartial('pins/imagePinView', 'pinviewimage');
        system.setPartial('pins/videoPinView', 'pinviewvideo');
        system.setPartial('pins/videoPinView', 'pinviewaudio');
        system.setPartial('pins/pinheader', 'pinheader');

    });
};

/**
 
 
 *loads the html page of pin operation
 * @author Arya <arya@cubettech.com>
 * @Date 29-10-2013
 */
exports.webpin = function(req, res) {
    // load the module
    var youtube = require('youtube-feeds')

// search parkour videos
    youtube.feeds.videos({q: 'http://www.youtube.com/watch?v=UK7lX6PD_oc'}, function(err, data) {
        if (err instanceof Error) {
            console.log(err)
        } else {
           // console.log(data);
            var type = "youtube";
           var imagename = 'http://img.youtube.com/vi/UK7lX6PD_oc/0.jpg';
           var dt = new Date();
            var time = dt.getTime();
           var url = 'http://www.youtube.com/watch?v=UK7lX6PD_oc';
          
            var insert_data = {
            "board_id" : "2",
            "imagename" : imagename,
            "pin_type_id" : "526a52769840fdb5048b4567", // videotype
            "pin_url" : url,
            "source_url" : url,
            "time" : time ,
            "user_id" : "526a51b59840fdb2048b4567", //logged user_id
            "video_type": "youtube",                //type of video now youtube
        };
           
           PostModel.PinCreation(insert_data, function(ress) {

                sio.sockets.emit('pageview', {'id': ress._id, 'image': imagename});
                res.redirect('/pins');
            });
        }
    });
}

/*       
 
 *screenshot creation (webshot) and resizing(imagemagick)
 * @author Arya <arya@cubettech.com>
 * @Date 29-10-2013
 
 */

module.exports.pins = function(req, res)
{
    var webshot = require('webshot');
    var im = require('imagemagick');
    var dt = new Date();
    var time = dt.getTime();
    var url = req.body.url;
    var board = req.body.board;
    var imagename = time + '.png';
    var options = {
        screenSize: {
            width: 'all'
            , height: 'all'
        }
    }
    webshot(url, webpagepath + '/' + time + '.png', options, function(err) {

        im.resize({
            srcPath: webpagepath + '/' + time + '.png',
            dstPath: webpagepath + '/small/' + time + '.png',
            width: '50%'
        }, function(err, stdout, stderr) {
            if (err)
                throw err;
            // console.log('resized');
        });

        im.resize({
            srcPath: webpagepath + '/' + time + '.png',
            dstPath: webpagepath + '/thumb/' + time + '.png',
            width: '20%'
        }, function(err, stdout, stderr) {
            if (err)
                throw err;
            //console.log('resized');
            PostModel.PinCreation(imagename, url, time, function(ress) {

                sio.sockets.emit('pageview', {'id': ress._id, 'image': imagename});
                res.redirect('/pins');
            });

        });

    });

}