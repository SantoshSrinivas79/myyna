window.onpDynamicTheme = '';
        window.onpDynamicThemeEvent = '';
        

jQuery.noConflict();

$(document).ready(function() {
    
    jQuery("#pinform").validate();
    jQuery("#loginform").validate();
    jQuery("#userform").validate();
    jQuery("#signupform").validate();
    
     jQuery('#postwrapper').masonry({
            columnWidth: 10,
            itemSelector: '.post',
            isAnimated: true,
            animationOptions: {
                duration: 500,
                easing: 'linear',
                queue: false
            }
        });
});
  
function pin_arrange()
    {
        //alert('hello');
    jQuery('#postwrapper').masonry({
            columnWidth: 10,
            itemSelector: '.post',
            isAnimated: true,
            animationOptions: {
                duration: 500,
                easing: 'linear',
                queue: false
            }
        });
        
}  

jQuery(window).load(function() {
    
  
    function ismobileft() {
        jQuery('.post').fitVids();
    }


    if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i))
    {
        ismobileft();
    }
    else {
        jQuery('#postwrapper').masonry({
            columnWidth: 10,
            itemSelector: '.post',
            isAnimated: true,
            animationOptions: {
                duration: 500,
                easing: 'linear',
                queue: false
            }
        });
    }


});

//var dropdown = document.getElementById("cat");
//function onCatChange() {
//    if (dropdown.options[dropdown.selectedIndex].value > 0) {
//        location.href = "http://foliogridpro.frogsthemes.com/?cat=" + dropdown.options[dropdown.selectedIndex].value;
//    }
//}
//dropdown.onchange = onCatChange;

(function($) {
    if (window.onp_create_sociallcoker) {
        $(".onp-sociallocker-call").each(function() {
            onp_create_sociallcoker($(this));
        });
    } else {
        $(function() {
            $(".onp-sociallocker-call").each(function() {
                onp_create_sociallcoker($(this));
            });
        })
    }
})(jQuery);

