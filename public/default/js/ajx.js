$(function(){
    $(".time_1").click(function(){
        //alert($(this).attr("pid"));
        $.post( "/test",{
                    'pid' : $(this).attr("pid"),
                    'uid' : $("#uid"+$(this).attr("pid")).val()
                },function(data,status){
                    $("#myModal .modal-body").html(data);
                    $("#cubet_prfl")
                    .isotope('reloadItems')
                    .isotope({sortBy: 'original-order'});

//                            var $container2 = $('#cubet_prfl');
//                            $container2.isotope({
//                              itemSelector : '.element',
//                              masonry : {
//                               columnWidth :20,
//                               gutterWidth : 2
//                              }
//                            });
                });
    });
});

