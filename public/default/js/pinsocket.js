 var socket = io.connect('http://192.168.1.65:3000');

            $(function() {
               
                socket.on('connect', function() {

                    socket.on('pageview', function(msg) {

                        if (msg.pin_type == '526a52a19840fdc70b8b4567')
                        {
                         
                           // $('.custom_styling').append('<div id="post-' + msg.id + '" class="post-' + msg.id + ' post type-post status-publish format-standard hentry category-web-design post twocols infinite removeonceloaded masonry-brick" style="opacity: 1; position: absolute; top: 0px; left: 0px; background: none repeat scroll 0% 0% rgb(255, 255, 255);"><div><div class="post-header"><img src="/webpages/small/' + msg.image + '"></div></div></div>');
                           $('.custom_styling').append(msg.template);
                            pin_arrange();
                        }
                        if (msg.pin_type == '526a52769840fdb5048b4567')
                        {
                          
                            //$('.custom_styling').append('<div class="post-' + msg.id + ' post type-post status-publish format-standard hentry category-animation post twocols infinite removeonceloaded" id="post-' + msg.id + '"><div><div class="post-header"><iframe src="http://www.youtube.com/embed/' + msg.image + '" width="415" height="340" frameborder="0"></iframe></div></div></div>');
                            $('.custom_styling').append(msg.template);
                            pin_arrange();
                        }

                    });
                });
            });
