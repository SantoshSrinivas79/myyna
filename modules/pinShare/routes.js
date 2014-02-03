/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


exports.routes = [
    {route: '/plug', controller: 'mod', action:'index'},
    {route: '/sharepinload', controller: 'pin', action:'sharePinLoad'},
    {route: '/sharepin', controller: 'pin', action:'InitialshareSave', type:'POST'},
    {route: '/imagelist', controller: 'pin', action:'imageList', type:'POST'},
    {route: '/videolist', controller: 'pin', action:'videoList', type:'POST'},
    {route: '/audiolist', controller: 'pin', action:'audioList', type:'POST'},
    {route: '/screenshot', controller: 'pin', action:'screenshot', type:'POST'},
    {route: '/loadPins', controller: 'pin', action:'loadThirdpartyShare',fn:'login_validate',params:[':share_id']},
    {route: '/sharer', controller: 'pin', action: 'sharejs'},
];