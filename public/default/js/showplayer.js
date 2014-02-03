function show_player(){
     if($("#audio_link").val()!==''){
        var str = '<object height="100" width="100%" id="yourPlayerId" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">'
                  +'<embed allowscriptaccess="always" src="http://player.soundcloud.com/player.swf?url='+$("#audio_link").val()
                  +'&enable_api=true&sharing=false&show_comments=false&show_user=false&buying=false&download=false&show_artwork=false&liking=false" type="application/x-shockwave-flash" height="100" width="100%" name="scloud_id"></embed>'
                  +'</object>';
         $("#show_song").html(str);
     }
}
$(function(){
    $("#get_song").click(function(){
       show_player();
    });
    $("#audio_link").change(function(){
       show_player();
    });
});
