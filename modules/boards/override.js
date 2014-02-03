/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


exports.data = [
      {view: 'pin_image/board_form', controller: 'board', action:'limitcheck', mode:'replace', priority:1},
      {view: 'admin/sideBar', mode:'append'}
];



//controll - end everything & continue to plugins controller
//override - Loads plugin's view in the same path as in main with existing data
//append - Append data processed from controller to the view
//prepend - Prepend data processed from controller to the view
//replace - Replace data processed from controller with view