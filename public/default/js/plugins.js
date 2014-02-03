// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function() {
    };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

$(document).ready(function()
{
    var ml, mr, mrb, mlb, mlp, mrp;
    $(".close").css("display", "none");

    var isMenuOpen = false;

    $('.menu_btn').click(function()
    {
        if (isMenuOpen == false)
        {
            if ($.browser.mozilla && (!ml || !mr)) {
                if ($('#container').length > 0)
                {
                    mr = ml = $("#container").position().left;
                }
                if ($('.leftmenu_adjst').length > 0)
                {
                    mrb = mlb = $(".leftmenu_adjst").position().left;
                }
                if ($('#pop_container').length > 0)
                {
                    mrp = mlp = $("#pop_container").position().left;
                }

            } else {
                ml = $("#container").css('margin-left');
                mr = $("#container").css('margin-right');
                if ($('.leftmenu_adjst').length > 0)
                {
                    mlb = $(".leftmenu_adjst").css('margin-left');
                    mrb = $(".leftmenu_adjst").css('margin-right');
                }
                if ($('#pop_container').length > 0)
                {
                    mlp = $("#pop_container").css('margin-left');
                    mrp = $("#pop_container").css('margin-right');
                }

            }
            //alert('je suis dans le bon cas')
            $("#menu").clearQueue().animate({
                left: '0'
            })
            $("#container").clearQueue().animate({
                "margin-left": '290px',
                "margin-right": '-290px'
            })
            if ($('.leftmenu_adjst').length > 0)
            {
                $(".leftmenu_adjst").clearQueue().animate({
                    "margin-left": '290px',
                    "margin-right": '-290px'
                })
            }
            if ($('#pop_container').length > 0)
            {
                $("#pop_container").clearQueue().animate({
                    "margin-left": '290px',
                    "margin-right": '-290px'
                })
            }

            $(this).fadeOut(200);
            $(".close").fadeIn(300);

            isMenuOpen = true;
        }
    });

    $('.close').click(function()
    {
        if (isMenuOpen == true)
        {
            $("#menu").clearQueue().animate({
                left: '-240px'
            })
            $("#container").clearQueue().animate({
                "margin-right": mr,
                "margin-left": ml
            })
            $(".leftmenu_adjst").clearQueue().animate({
                "margin-right": mrb,
                "margin-left": mlb
            })
            $("#pop_container").clearQueue().animate({
                "margin-right": mrp,
                "margin-left": mlp
            })


            $(this).fadeOut(200);
            $(".menu_btn").fadeIn(300);
            setTimeout(function() {
                $("#container").css({"margin": "0 auto"});
                $(".leftmenu_adjst").css({"margin": "0 1%"});
                $("#pop_container").css({"margin": "0 1%"});
                ml = mr = false;
            }, 500);
            isMenuOpen = false;
        }
    });

});




$(document).ready(function()
{
    $(".close").css("display", "none");

    var isMenuOpen = false;

    $('.menu_btn').click(function()
    {
        if (isMenuOpen == false)
        {
            //alert('je suis dans le bon cas')
            $("#menu").clearQueue().animate({
                left: '0'
            })
            $(".leftmenu_adjst").clearQueue().animate({
                "margin-left": '290px',
                "margin-right": '-290px'
            })
            $("#pop_container").clearQueue().animate({
                "margin-left": '290px',
                "margin-right": '-290px'
            })

            $(this).fadeOut(200);
            $(".close").fadeIn(300);

            isMenuOpen = true;
        }
    });

    $('.close').click(function()
    {
        if (isMenuOpen == true)
        {
            $("#menu").clearQueue().animate({
                left: '-240px'
            })
            $(".row_min").clearQueue().animate({
                "margin-left": '0%',
                "margin-right": '0%'
            })

            $(this).fadeOut(200);
            $(".menu_btn").fadeIn(300);

            isMenuOpen = false;
        }
    });

});


$(document).ready(function()
{
    $(".close").css("display", "none");

    var isMenuOpen = false;

    $('.menu_btn').click(function()
    {
        if (isMenuOpen == false)
        {
            //alert('je suis dans le bon cas')
            $("#menu").clearQueue().animate({
                left: '0'
            })
            $(".row_min").clearQueue().animate({
                "margin-left": '240px',
                "margin-right": '-290px'
            })

            $(this).fadeOut(200);
            $(".close").fadeIn(300);

            isMenuOpen = true;
        }
    });

    $('.close').click(function()
    {
        if (isMenuOpen == true)
        {
            $("#menu").clearQueue().animate({
                left: '-240px'
            })
            $(".leftmenu_adjst").clearQueue().animate({
                "margin-left": '0%',
                "margin-right": '0%'
            })
            $("#pop_container").clearQueue().animate({
                "margin-left": '0%',
                "margin-right": '0%'
            })

            $(this).fadeOut(200);
            $(".menu_btn").fadeIn(300);

            isMenuOpen = false;
        }
    });

});


//---------------------------//
//**** mplayer start  ****//
//---------------------------//

var mySound;
/*
 soundManager.setup({
 
 // location: path to SWF files, as needed (SWF file name is appended later.)
 
 url: 'js/soundmanager/swf/',
 
 onready: function() {
 
 // SM2 has started - now you can create and play sounds!
 
 mySound = soundManager.createSound({
 id: 'aSound'
 });
 
 },
 
 onfinish: function () {
 alert("Finished");
 },
 
 ontimeout: function() {
 
 // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
 // See the flashblock demo when you want to start getting fancy.
 
 }
 
 });
 
 */


function play() {

    soundManager.play('mySound', {
        url: 'placeholders/mp3/adg3com_coreissues.mp3',
        onPlay: function() {
            alert('The sound ' + this.id + ' finished playing.');
        },
        onfinish: function() {
            alert('The sound ' + this.id + ' finished playing.');
        }
    });

}

//---------------------------//
//**** mplayer end  ****//
//---------------------------//
