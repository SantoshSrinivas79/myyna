
exports.PinCreation = function(insert_data, callback){

    var newpin = new PostModel( 
          { board_id: insert_data.board_id, pin_type_id: insert_data.pin_type_id, pin_url: insert_data.pin_url,source_url:insert_data.source_url,
      time:insert_data.time,user_id: insert_data.user_id,image_name:insert_data.imagename,video_type: insert_data.video_type
  } );
  
   
   newpin.save(function(err, new_data){
      
       callback(new_data._id);
   });
  
   
}

