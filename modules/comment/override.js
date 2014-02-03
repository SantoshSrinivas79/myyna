/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


exports.data = [
    {view: 'home/index', controller: 'mod', action:'index', mode:'replace', priority:2},
    {view: 'home/index', controller: 'mod', action:'index', mode:'append', priority:3},
    {view: 'home/1', controller: 'mod', action:'ovr' ,mode:'controll'},
];



//controll - end everything & continue to plugins controller
//override - Loads plugin's view in the same path as in main with existing data
//append - Append data processed from controller to the view
//prepend - Prepend data processed from controller to the view
//replace - Replace data processed from controller with view