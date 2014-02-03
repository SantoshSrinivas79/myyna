/**
 *paypal settings managemnet controller
 * Have functions to manage admin users
 * 
 * @package cubetboard
 * @version 2.0
 * @author Arya <arya@cubettech.com>
 * @Date 28-01-2014
 */

 var settingsModel = system.getPluginModel('admin/settings');
 system.loadHelper('adminHelper');
system.getLibrary('helpRegister');
 
var settingsController = {
    
    boardCost:function(req,res){
        
        res.locals.Breadcrumb = 'Paypal Settings';
        res.locals.BreadcrumbLink = '/admin/paypal-settings';
        res.locals.subBreadcrumb = 'Board';
        
       settingsModel.list(function(settings){
           console.log(settings);
           if(settings.length>0){
           var data ={
                    edit: 1,
                    values: settings[0]
                };
            
            system.loadPluginView(res, 'admin/paypal', data);
           }
           else{
           system.loadPluginView(res, 'admin/paypal', {title: 'Paypal'});
        }
  });
        
        
        
    },
    updatePaypal:function(req,res){
    
      var settings = {
       paypal_host : req.body.PAYPAL_HOST,
       paypal_client_id : req.body.PAYPAL_CLIENT_ID,
       paypal_secret :req.body.PAYPAL_CLIENT_SECRET,
       paypal_cost : req.body.PAYPAL_COST
      }
      
      var cid = req.body.cid ? req.body.cid : false;
      
      settingsModel.updateSettings(cid, settings, function(updated) {
                    if (updated)
                    {
                        if(cid) {
                            HELPER.setFlashMessage('Settings updated');
                        } else {
                            HELPER.setFlashMessage('Settings Added succesfully');
                        }
                        res.redirect('back');
                    } else {
                        HELPER.setFlashMessage('Something went wrong', 'danger', 'Error');
                        res.redirect('back');
                    }

                });
         
    }
}

module.exports = settingsController;