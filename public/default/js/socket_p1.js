var socket = io.connect();
jQuery(function() {
    socket.on('connect', function() {
        var user_id = window.localStorage.getItem('cubet_user_id');
        socket.emit('socket_data', user_id);
        var pathname = window.location.pathname;
       // var tpe =  window.location.pathname.replace(/\//g, '');
       var extract = pathname.split('/');
       var tpe = extract[1];
        var id =  extract[2];
        if (tpe == 'pins' || tpe == 'board' || tpe == 'category' || tpe == 'user') {
            socket.on('pageview', function(msg) {
                //for all pins

                if ((msg.pin_type == 'image' ||
                    msg.pin_type == 'audio' ||
                    msg.pin_type == 'webaudio' ||
                    msg.pin_type == 'url_image' ||
                    msg.pin_type == 'web_page' ||
                    msg.pin_type == 'video') && (tpe == 'pins' || (tpe == 'user' && id==msg.data.user_id) || (tpe == 'category' && id==msg.data.category_id) || (tpe == 'board' && id==msg.data.board_id)))
                {

                    if($('#container').find('#myCarousel2_'+msg.data._id).length <= 0){

                        $('#container')
                                .prepend(msg.str)
                                .masonry('reload');
                        $('#pop_up_container')
                                .prepend(msg.str)
                                .masonry('reload');
                        $('audio').mediaelementplayer();

                        setTimeout(function() {
                            $('#container').masonry('reload');
                        }, 500);

                        setTimeout(function() {
                            $('#container').masonry('reload');
                        }, 1000);
                    
                    }
                }
            });
        }


        socket.on('notification', function(msg) {
          
            var htm = '<li><a class="notifi_li" href="javascript:void(0);">'+msg.notify_msg+'</a></li>'
            $('.cubet_comment_sub').prepend(htm);
            $('.cubet_commment').addClass('select');
            $('#new_notify').parent('li').remove();
            $('#comment_section').removeClass('glyphicon-comment');   
            var comment_count = $("#comment_section").text();
            if(!comment_count)
            {
                comment_count =0;
            }
            
            var newcount = parseInt(comment_count)+parseInt(1);
            $("#comment_section").text(newcount);
        });
    });
});
