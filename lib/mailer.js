/* 
 * Mail sender lib
 * Have functions to manage admin users
 * 
 * @package cubetboard
 * @version 2.0
 * @author Robin <robin@cubettech.com>
 * @Date 20-11-2013
 */

/*Node mailer*/
var nodemailer = require("nodemailer");
// create reusable transport method (opens pool of SMTP connections)

/**
 * Mail initialisation
 *
 * @author Robin <robin@cubettech.com>
 * @Date 20-11-2013
 */
mailer_init = function(){
    global.mailer = nodemailer.createTransport("SMTP",{
        host: 'localhost'
//        auth: {
//            user: "qamailtest1@gmail.com",
//            pass: "cubet321"
//        }
    });
};

/**
 *Send mail function
 *
 * @author Robin <robin@cubettech.com>
 * @Date 21-11-2013
 */
global.sendMail = function(mailOptions, callback){
    if(! callback){
        callback = function(){};
    }
    mailer_init();
    mailer.sendMail(mailOptions, callback);
    mailer.close();
}

/*Node mailer ends*/