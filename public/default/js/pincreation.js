$(document).ready(function() {
// var tpe =  window.location.pathname;
//     arr =  tpe.split('/');
//     alert(arr[0]);
//     alert(arr[1]);
//     alert(arr[2]);
    /* to clear pop up contents */    
    $('body').on('hidden.bs.modal', '.modal', function () {
        //$(this).html('');
    });
    
    //$('.social_image').hide();
    $('.sharegr').hover(function() {
        $('.share_popup').hide();
        $('.popup_share').show();
    }, function() {
        $('.popup_share').hide();
        $('.share_popup').show();
    });

    $('#user_valid').hide();
    $('#email_valid').hide();


    //make notification are in read status
    $('#comment_display').click(function() {


        $.ajax({
            url: '/removeNotification',
            dataType: 'json',
            success: function(data) {

                $('#comment_section').addClass('glyphicon-comment');
                $("#comment_section").text('');
            //$(".notifi_li").empty();
            },
            error: function(jqxhr, status, error) {
            //                        alert('e' + error);
            }
        });
    }
    );

    //sign up operation

    $('#signupButton').click(function() {
        if ($('#signupform').valid()) {
            var name = $('#signupname').val();
            var email = $('#signup_email').val();
            var username = $('#signup_username').val();
            var userpass = $('#userpass').val();
            $.ajax({
                url: '/usersignup',
                data: {
                    "name": name, 
                    "email": email, 
                    "username": username, 
                    "userpass": userpass
                },
                type: 'post',
                dataType: 'json',
                success: function(response) {
                    if (response.res == 1) {
                        window.localStorage.setItem('cubetSharepinId', $('#referer_url').val());
                        //window.location.href = "/login";
                        $('#signupform .msg')
                        .css({'color':'green'})
                        .html('Success, please check email to verify the email account');
                        setTimeout(function(){
                            $("#myModal").modal('hide');
                        }, 4000);
                    } else if (response.res == 0){
                        $('#signupform .msg')
                        .css({'color':'red'})
                        .html('Problem on creating account.');
                    }
                },
                error: function(jqxhr, status, error) {
                        //alert('e' + error);
                }
            });
        }
    })


    //login operation
    $('#loginButton').click(function() {
        if ($('#loginform').valid()) {
            window.localStorage.setItem('cubetSharepinId', $('#referer_url').val());

            var username = $('#loginusername').val();
            var password = $('#loginpass').val();
            $.ajax({
                url: '/logincheck',
                data: {
                    "username": username, 
                    "userpass": password
                },
                type: 'post',
                dataType: 'json',
                success: function(response) {
                    if (response.data == 1)
                    {
                        window.localStorage.setItem('cubet_user_id', response.user_id);
                        var id = window.localStorage.getItem('cubetSharepinId');
                        if(id && id != 'undefined')
                        {
                            window.localStorage.removeItem('cubetSharepinId');
                            window.location.href = "/loadPins/"+ id;  
                        }
                        else{
                            window.location.href = '/pins';
                        }
                    }
                    if (response.data == 0)
                    {
                        $('div.error_message').html('Sorry! Wrong Credentials or You may be blocked');
                        $('div.error_message').addClass('error-true alert-danger');
                    }

                },
                error: function(jqxhr, status, error) {
                //                        alert('e' + error);
                }
            });
        }
    });

    //username existance check 
    $('#signup_username').blur(function() {

        var username = $('#signup_username').val();
        if (username != '')
        {
            $.ajax({
                url: '/uservalidation',
                data: {
                    "username": username
                },
                type: 'post',
                dataType: 'json',
                success: function(response) {
                    if (response.res == 1)
                    {
                        $('#user_valid').show();
                        $('#signup_username').addClass('error');
                        $('#signupButton').addClass('button_disable');
                    }
                    if (response.res == 0)
                    {
                        $('#user_valid').hide();
                        $('#signupButton').removeClass('button_disable');
                    }
                },
                error: function(jqxhr, status, error) {
                // alert('e' + error);
                }
            });

        }
    });
    
    
    
    //Email Validation
    
   
    $('#signup_email').blur(function() {
        var email = $('#signup_email').val();
        if (email != '')
        {
            $.ajax({
                url: '/emailvalidation',
                data: {
                    "email": email
                },
                type: 'post',
                dataType: 'json',
                success: function(response) {
                    if (response.res == 1)
                    {
                        $('#email_valid').show();
                        $('#signup_email').addClass('error');
                        $('#signupButton').addClass('button_disable');
                    }
                    if (response.res == 0)
                    {
                        $('#email_valid').hide();
                        $('#signupButton').removeClass('button_disable');
                    }
                },
                error: function(jqxhr, status, error) {
                //                        alert('e' + error);
                }
            });

        }
    });

    $('#logoutButton').click(function() {
        window.localStorage.removeItem('cubet_user_id');
    });

    $('.loader').hide();
    $('#loader').hide();
    $('#signup_block').hide();
    $('#signin_block').show();
    $('#signupshow').click(function() {
        $('#signup_block').toggle();
        $('#signin_block').toggle();
    });
    $('#signinshow').click(function() {
        $('#signup_block').toggle();
        $('#signin_block').toggle();
    })
    var next_scroll = true;
    $('#preview_id').hide();
    $('#video_upld').hide();
    $('#webpage').hide();

    $("#pinform").validate();
    $("#loginform").validate();
    $("#userform").validate();        
    $("#signupform").validate({
        rules: {
            email: "email",
            reemail: "email",
            reemail: {
                equalTo: "#email"
            }

        }
    });



    $("#forgotSubmit").click(function(e){
        e.preventDefault();
        if($("#forgotform").valid()){
            var email = $("#forgotform").find("input[name=email]" ).val();
            $.post('/forgotaction', {
                'email': email
            }, function(data) {
                if (data.status == 0) {
                    $("input[name=email]").addClass('error');
                    $("#forgotform .msg")
                    .css({'color': 'red','font-size':'12px'})
                    .text(data.msg);
                } else {
                    $("input,button").hide();
                    //$("input[name=email]").removeClass('error');
                    $("#forgotform .msg")
                     .css({ 'color': 'green','font-size':'12px'})
                     .text(data.msg);
                    setTimeout(function(){
                        $('#Forgot').modal('hide');
                        $("input,button").show();
                    }, 4000);
                }
            });
        }
        
    });
    //    $("#board_form").click(function(){
    //        $('#board_form').validate();
    //    });
    $('#settingsform').validate({
        rules: {
            pword: "required",
            password_r: "required",
            password_r: {
                equalTo: "#pword"
            }

        }
    });
    
    if ($('#video_select').length !== 0) {
        $('#video_select').click(function() {
            $('#url').toggle();
            $('#video_upld').toggle();
            $('#video_select').val('Other Upload');
        });
    }

    if ($('#url').length !== 0) {
        $('#url').focusout(function() {
            screenshot_preview();
        });
    }
    
    if ($('#pin_cat').length !== 0) {
        $('#pin_cat').change(function() {
            screenshot_preview();
        });
    }



    function screenshot_preview()
    {
        var url = $('#url').val();

        if (url != '')
        {

            var matches = url.match(/^http:\/\/(?:www\.)?youtube.com\/watch\?(?=.*v=\w+)(?:\S+)?$/);

            if (matches)
            {

                $('#webpage').hide();
                $('#pin_cat').val('2');
                var split_url = url.split("v=");
                var url_id = split_url[1];
                $('#preview_id').show();
                $("#preview_id").attr("src", 'http://www.youtube.com/embed/' + url_id);
            }

            else
            {
                $.ajax({
                    url: '/screenshot',
                    data: {
                        "pageurl": url
                    },
                    type: 'post',
                    dataType: 'json',
                    success: function(data) {

                        $('#preview_id').hide();
                        $('#webpage').show();
                        //$("#webpage").attr("src", "data:image/png;base64,"+data.image);
                        $("#webpage").attr("src", "/pins/images/temp/" + data.image);
                        $('#pin_cat').val('1');
                    },
                    error: function(jqxhr, status, error) {
                    //                        alert('e' + error);
                    }
                });


                return false;

            }
        }
    }



    if ($('#container').length !== 0) {

        $(window).scroll(function() {


            var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height();

            if ($(window).scrollTop() > $(document).height() - ($(window).height() + 1000)) {

                if (next_scroll) {

                    next_scroll = false;

                    //$('div#loadmoreajaxloader').show();
                    var start = $('#endlimit').val();
                    var end = parseInt(start) + parseInt(5);
                   
                    $('#endlimit').val(end);
                    var type = $('#listtype').val();

                    var data = {
                                "startlimit": start,
                                "endlimit": 5
                    };
                    if (type=='board') {
                        data.type_id = $('#list_id').val();
                    }
                    else if (type=='category') {
                        data.type_id = $('#list_id').val();
                    }
                    else if (type=='user') {
                        data.type_id = $('#list_id').val();
                    }
                    $.ajax({
                        url: "/nextpage/" + type,
                        data: data,
                        type: 'post',
                        success: function(html)
                        {

                            if (html)
                            {
                                //$('div#loadmoreajaxloader').hide();
                                $("#container").append(html);

                                $(".youtubeClass").unbind('click').bind('click', function() {
                                    // alert(2);
                                    var vUrl = $(this).children('img.youtube').attr('data-src');
                                    $(this).children('iframe').attr('src', vUrl).show();
                                    $(this).children('img').hide();
                                });

                                imagesLoaded(document.querySelector('#container'), function(instance) {
                                    $('#container').masonry('reload');
                                    next_scroll = true;
                                });
                                
                                $('audio').mediaelementplayer();


                            }

                            else
                            {
                        //$('div#loadmoreajaxloader').html('<center>No more posts to show.</center>');
                        }
                        },
                        error: function(jqxhr, status, error) {
                        // alert('e' + error);
                        //$('div#loadmoreajaxloader').html('<center>No more posts to show.</center>');
                        }
                    });
                }

            }
        });
    }

    $(".youtubeClass").unbind('click').bind('click', function() {
        var vUrl = $(this).children('img.youtube').attr('data-src');
        $(this).children('iframe').attr('src', vUrl).show();
        $(this).children('img').hide();
    });
/*
     $(".scloudDiv").unbind('click').bind('click',function(){
     var vUrl = $(this).children('img').attr('data-src'); 
     $(this).find('.scloud').attr('src', vUrl).show();
     $(this).children('img').hide();
     });
     */


});



function changepintype()
{

    $('#listtype').val('pinlike');
}

function follow_user(user_id)
{
    $.ajax({
        url: '/followuser',
        data: {
            "user_id": user_id
        },
        type: 'post',
        dataType: 'json',
        success: function(data) {


        },
        error: function(jqxhr, status, error) {
            alert('e' + error);
        }
    });
}



function boardFollow(board_id, user_id)
{

    $.ajax({
        url: '/followboard',
        data: {
            "board_id": board_id, 
            "user_id": user_id
        },
        type: 'post',
        dataType: 'json',
        success: function(data) {

            $("#follow_" + board_id).attr("onClick", "boardUnfollow(" + "'" + board_id + "'" + "," + "'" + user_id + "'" + ")");
            $("#follow_" + board_id).text('Unfollow');
             $("#follow_" + board_id).addClass('cubt_un_folw');
            $("#follow_" + board_id).attr('id', "unfollow_" + board_id);
           
               var incount = $('.boardfollowecount').text();
               
                var finalcount = parseInt(incount) + parseInt(1);
                $('.boardfollowecount').text(finalcount);
           
        },
        error: function(jqxhr, status, error) {
            alert('e' + error);
        }
    });
}

function boardUnfollow(board_id, user_id)
{

    $.ajax({
        url: '/unFollowBoard',
        data: {
            "board_id": board_id, 
            "user_id": user_id
        },
        type: 'post',
        dataType: 'json',
        success: function(data) {

            $("#unfollow_" + board_id).attr("onClick", "boardFollow(" + "'" + board_id + "'" + "," + "'" + user_id + "'" + ")");
            $("#unfollow_" + board_id).text('Follow');
             $("#unfollow_" + board_id).removeClass('cubt_un_folw');
            $("#unfollow_" + board_id).attr('id', "follow_" + board_id);
           
               var incount = $('.boardfollowecount').text();
               
                var finalcount = parseInt(incount) - parseInt(1);
                $('.boardfollowecount').text(finalcount);
          
        },
        error: function(jqxhr, status, error) {
            alert('e' + error);
        }
    });
}

function pinlike(pin_id, elem, pop)
{
    if(pop){
        var clickFunction = "pinUnlike('" + pin_id + "', this, 'pop')";
    } else {
        var clickFunction = "pinUnlike('" + pin_id + "', this)";
    }
    
    
    $.ajax({
        url: '/pinlike',
        data: {
            "pin_id": pin_id
        },
        type: 'post',
        dataType: 'json',
        success: function(response) {
            if (response.data) {

                $(elem).attr("onClick", clickFunction);
                $(elem).addClass("active");
              //  $(elem).addClass("disable-like");
                // $("#like_" + pop + pin_id).attr('id', "unlike_" + pop + pin_id);
                if(pop){
                    var count_elem = $(elem).children('span');
                } else {
                    var count_elem = $(elem).parent().children('span.text').children('.pincount');
                }
                
                var incount = count_elem.text();
                var finalcount = parseInt(incount) + parseInt(1);
                count_elem.text(finalcount);
            }
        },
        error: function(jqxhr, status, error) {
        //alert('e' + error);
        }
    });
}

function pinUnlike(pin_id, elem, pop) {
    
    if(pop){
        var clickFunction = "pinlike('" + pin_id + "', this, 'pop')";
    } else {
        var clickFunction = "pinlike('" + pin_id + "', this)";
    }
    

    $.ajax({
        url: '/pinunlike',
        data: {
            "pin_id": pin_id
        },
        type: 'post',
        dataType: 'json',
        success: function(data) {
            $(elem).attr("onClick", clickFunction);
            $(elem).removeClass("active");

     //$(elem).addClass("disable-like");
            if(pop){
                var count_elem = $(elem).children('span');
            } else {
                var count_elem = $(elem).parent().children('span.text').children('.pincount');
            }
            var incount = count_elem.text();
            var finalcount = parseInt(incount) - parseInt(1);
            count_elem.text(finalcount);
        },
        error: function(jqxhr, status, error) {
        // alert('e' + error);
        }
    });

}

/*
 function pinlike(pin_id)
 {
 
 // $("#like_"+pin_id).text('Unlike');
 
 
 $.ajax({
 url: '/pinlike',
 data: {"pin_id": pin_id},
 type: 'post',
 dataType: 'json',
 success: function(data) {
 $("#like_" + pin_id).attr("onClick", "pinUnlike(" + "'" + pin_id + "'" + ")");
 $("#like_" + pin_id).addClass("active");
 $("#like_" + pin_id).attr('id', "unlike_" + pin_id);
 var incount = $('#pincount_' + pin_id).text();
 var finalcount = parseInt(incount) + parseInt(1);
 $('#pincount_' + pin_id).text(finalcount);
 },
 error: function(jqxhr, status, error) {
 alert('e' + error);
 }
 });
 }
 
 function pinUnlike(pin_id) {
 
 
 $.ajax({
 url: '/pinunlike',
 data: {"pin_id": pin_id},
 type: 'post',
 dataType: 'json',
 success: function(data) {
 $("#unlike_" + pin_id).attr("onClick", "pinlike(" + "'" + pin_id + "'" + ")");
 $("#unlike_" + pin_id).removeClass("active");
 $("#unlike_" + pin_id).attr('id', "like_" + pin_id);
 
 var incount = $('#pincount_' + pin_id).text();
 var finalcount = parseInt(incount) - parseInt(1);
 $('#pincount_' + pin_id).text(finalcount);
 },
 error: function(jqxhr, status, error) {
 alert('e' + error);
 }
 });
 
 }
 */

function createComment(pin_id)
{
    alert('hello');
    $.ajax({
        url: '/createcomment',
        data: {
            "pin_id": pin_id
        },
        type: 'post',
        dataType: 'json',
        success: function(data) {


        },
        error: function(jqxhr, status, error) {
            alert('e' + error);
        }
    });
}

function repin(pin_id)
{


    $.ajax({
        url: '/repin',
        data: {
            "pin_id": pin_id
        },
        type: 'post',
        dataType: 'json',
        success: function(data) {
            $(".youtubeClass").unbind('click').bind('click', function() {
                //alert(2);
                var vUrl = $(this).children('img.youtube').attr('data-src');
                $(this).children('iframe').attr('src', vUrl).show();
                $(this).children('img').hide();
            });
        },
        error: function(jqxhr, status, error) {
        //alert('e' + error);
        }
    });
}



//social share

function socialShare(service, link)
{

    window.open('/socialshare?service=' + service + '&url=' + link + '', 'fshare', 'width=400,height=250');

}

//get the cookies for share pin

function getCookie(c_name)
{
    
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1)
        {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start == -1)
        {
            c_value = null;
        }
        else
        {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1)
            {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start,c_end));
        }
   
        if(c_value && c_value!='')
        {
            c_value = c_value.replace(/(^")|("$)/g, '');
            var c_value = c_value.replace('j:"',""); 
 }
        return c_value;
    
    
}

//clear cookie
function setCookie()
{
    var now = new Date();
    var time = now.getTime();
    time -= 3600000 ;
    now.setTime(time);
    var c_value=escape(1) + "; expires="+now.toGMTString();
    document.cookie='Cubet_share_pin' + "=" + c_value;
}


function userFollow(user_id, logged_id)
{

    $.ajax({
        url: '/followuser',
        data: {
            "board_id": user_id, 
            "user_id": logged_id
        },
        type: 'post',
        dataType: 'json',
        success: function(data) {

            $("#user_follow_" + user_id).attr("onClick", "userUnfollow(" + "'" + user_id + "'" + "," + "'" + logged_id + "'" + ")");
            $("#user_follow_" + user_id).text('Unfollow');
             $("#user_follow_" + user_id).addClass('cubt_un_folw');
            $("#user_follow_" + user_id).attr('id', "user_unfollow_" + user_id);
            
               var incount = $('.userfollowercount').text();
                var finalcount = parseInt(incount) + parseInt(1);
                $('.userfollowercount').text(finalcount);
            
        },
        error: function(jqxhr, status, error) {
            alert('e' + error);
        }
    });
}

function userUnfollow(user_id, logged_id)
{
   

    $.ajax({
        url: '/unFollowuser',
        data: {
            "board_id": user_id, 
            "user_id": logged_id
        },
        type: 'post',
        dataType: 'json',
        success: function(data) {

            $("#user_unfollow_" + user_id).attr("onClick", "userFollow(" + "'" + user_id + "'" + "," + "'" + logged_id + "'" + ")");
            $("#user_unfollow_" + user_id).text('Follow');
            $("#user_unfollow_" + user_id).removeClass('cubt_un_folw');
            $("#user_unfollow_" + user_id).attr('id', "user_follow_" + user_id);
            
            var incount = $('.userfollowercount').text();
                var finalcount = parseInt(incount) - parseInt(1);
                $('.userfollowercount').text(finalcount);
          
        },
        error: function(jqxhr, status, error) {
            alert('e' + error);
        }
    });
}