/* 
 * jquery functions
 * 
 * @package cubetboard
 * @version 2.0
 * @author Rahul P R <rahul.pr@cubettech.com>
 * @Date 14-11-2013
 */
$(function(){
    $("#get_img").click(function(){
        var str = $("#urltitle").val(); 
        if($("#urltitle").val()==''){
            $("#urltitle").css({'border':'1px solid red'});
            return false;
        } else  if(str.substr(0,4)!='http') {
            $("#urltitle").css({'border':'1px solid red'});
            alert('Enter a valid URL.');
            return false;
        } else {
           // alert($("#urltitle").val());
            $.post('/post_url',
                    {'urltitle' : $("#urltitle").val() },
                    function(data){
                        $(".modal_pou_up").html(data);
                        
                        //alert('success');
            });
        }
    });
    $("#sel_img").click(function(){
        //if atleast one checkbox exist
        //alert(234324234);
        if($("#select_form input:checkbox").length!=0){
            if ($("#select_form input:checkbox:checked").length > 0){
                // any one is checked
                if ($("#select_form input:checkbox:checked").length > 4){
                    alert('Maximum 4 images.');
                    return false;
                }
                else{
                     alert($(".img_chkbox").val());
                    $.post('/select_action',
                            {'img_chkbox' : $(".img_chkbox").val() },
                            function(data){
                                $(".modal_pou_up").html(data);
                                alert('success');
                    });
                }
            } else {
               // nothing checked
               alert('You must select atleast one image.');
               return false;
            }
        }
    });
    $("#upload_img,#pin_sub").click(function(){
        if( $("#board_id").val()==''){
            $("#board_id").css({'border':'1px solid red'});
            return false;
        } else {
            $("#board_id").css({'border':'none'});
        }
        if($("#upload").val()==''){
            $("#upload").css({'border':'1px solid red'});
            return false;
        } else {
            $("#upload").css({'border':'none'});
        }
        if($("#description").val()=='') {
            $("#description").css({'border':'1px solid red'});
            return false;
        } else {
            $("#description").css({'border':'none'});
        }
    });
    



 
});

