/* 
 * Pin helper
 * 
 * @package cubetboard
 * @version 2.0
 * @author Arya <arya@cubettech.com>
 * @Date 22-11-2013
 */

/*
 * Send instant notification and mails
 * Log notification details
 */

module.exports = {
          
    socketNotification:function(socketid,fun_id,message,userdata,mail) {
        if(mail){
            var template = system.getCompiledView('email/mail', userdata.mailcontent)
            var mailOptions = {
                from: "CubetboardV2 <info@cubettech.com>", // sender address
                to: userdata.tomail, // list of receivers
                subject: userdata.subject?  userdata.subject:"Cubetboard Pin Notification", // Subject line
                html: template // html content
            }
            //send mail
            sendMail(mailOptions, function(error, response){
                if(error){
                    console.log(error);
                } else{
                    console.log("Message sent: " + response.message);
                }
            });
        } else {
            sio.sockets.socket(socketid).emit(fun_id, {'notify_msg':message});
        }
    
     
    }
    
    
    
}
