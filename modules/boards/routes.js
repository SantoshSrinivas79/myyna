/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


exports.routes = [
 
 {route: '/paypalload', controller: 'board', action: 'paypalLoad',type: 'POST'},
 {route: '/paypalredirect', controller: 'board', action: 'paypalRedirect',params: [':bid']},
 {route: '/paypal', controller: 'board', action: 'paypal'},
 {route: '/cancel', controller: 'board', action: 'cancel'},
 {route: '/admin/boardcostPaypal', controller: 'admin/settings', action: 'boardCost', fn: 'adminLoginCheck'},
 {route: '/admin/update-paypal-settings', controller: 'admin/settings', action: 'updatePaypal', fn: 'adminLoginCheck',type:"POST"},
 
 
];