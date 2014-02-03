
/*
 * Sample Welcome page Controller
 * 
 * @package Sleek.js
 * @version 1.0
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

//index function
var indexController = {
    index:function(clb){
        var M = system.getPluginModel('sample');
        M.list(function(resl){
           var data = {
            title: "Comment Plugin"
            }
            clb(system.getCompiledPluginView('home/index', data));
        });
    },
    index1:function(res, data){
        var M = system.getPluginModel('sample');
        M.list(function(resl){
           // console.log(resl);
        });
        var data = {
            title: "Comment Plugin"
        }
        //load index.html from home directory
        //return system.getCompiledPluginView('index', data);
        system.loadPluginView(res,'index', data);
    },
    ovr:function(data, call){
       // data.title= "Overrides";
        var M = system.getPluginModel('sample');
        //load index.html from home directory
        M.list(function(resl){
            data.title = 'tt';
            call(data);
        });
        
        
        //system.loadPluginView(res,'index', data);
    }
}

module.exports = indexController;