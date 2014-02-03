/* 
 
 * @package Sleek.js
 * @version 1.0
 * 
 * 
 * The MIT License (MIT)

 * Copyright Cubet Techno Labs, Cochin (c) 2013 <info@cubettech.com>

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

//define route functions here
module.exports = {
    setFlashMessage:function(message, type, head) {
        if(! type) {
            type = 'success';
        }
        if(head){
           global.flashMessageHead = head; 
        } else {
           global.flashMessageHead = type;
        }
        
        global.flashMessage = message;
        global.flashMessageClass = 'error-true alert-'+type;
    },
    getFlashMessage: function() {
        if(global.flashMessage) {
            var msg = global.flashMessage;
            global.flashMessage = null;
            return msg;
        } else {
            return false;
        }
    },
    getFlashMessageStatus:function() {
        if(global.flashMessageClass && global.flashMessageClass != '') {
            var msg = global.flashMessageClass;
            global.flashMessageClass = '';
            return msg;
        } else {
            return false;
        }
    },
    getFlashMessageHead:function() {
        if(global.flashMessageHead && global.flashMessageHead != '') {
            var msg = global.flashMessageHead;
            global.flashMessageHead = '';
            return msg;
        } else {
            return false;
        }
    },
    
    getDate:function(timestamp){
        
         if(timestamp == undefined){
        return 'Not logged in yet!';
    } else {
        return new Date(timestamp).toString();
    }
    }
}