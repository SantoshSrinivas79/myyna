/**
 * Cost controller
 * 
 * LICENSE: MIT
 *
 * @category cubetboard
 * @package cost
 * @copyright Copyright (c) 2007-2014 Cubet Technologies. (http://cubettechnologies.com)
 * @version 2.0
 * @author Rahul P R <rahul.pr@cubettech.com>
 * @Date 18-Nov-2013
 */

var costModel = system.getModel('cost');
var costController = {
    /**
     * shows a form to add cost
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @Date 18-Nov-2013
     */
    cost_form:function(req, res){
       var data = {
            layout  : 'urlfetch_layout',
            msg     : ''
       }
       system.loadView(res,'pin_image/cost_form', data);
    },
    /**
     * insert details to db
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @Date 18-Nov-2013
     */
    cost_action:function(req, res){
        if(isNaN(req.body.cost))
        {
            var data = {
                layout  : 'urlfetch_layout',
                msg     : 'Cost must be a numeric value.'
            }
            system.loadView(res,'pin_image/cost_form', data);
        } else { 
            var db_data = { cost  :  req.body.cost };
            costModel.insert(db_data,function(inserted_data){
                res.redirect('/success');
            });
        }
    },
    /**
     * get all costs
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @Date 18-Nov-2013
     */
    getcost:function(req, res){
        costModel.getCostAll(function(costs){
            var data = {
                layout: 'urlfetch_layout',
                cost : costs
            }
            system.loadView(res,'pin_image/view_cost',data);
        });   
    },
    /**
     *  delete cost
     *  @author Rahul P R <rahul.pr@cubettech.com>
     *  @Date 18-Nov-2013
     */
    delete_cost:function(req, res){
        var _id = req.params.id ;
        costModel.deleteCost(_id,function(flag){
            if(flag===1){
                res.redirect('/get_cost');
            }else {
                // not deleted
            }
        });
    },
    /**
     * update cost
     * @author Rahul P R <rahul.pr@cubettech.com>
     * @Date 18-Nov-2013
     */
    cost_update:function(req, res){
        var con     = { '_id'   : req.body._id    };
        var db_data = { 'cost'  : req.body.cost   };
        costModel.update(con,db_data,function(updated_data){
            res.redirect('/success');
        });
    }
};

module.exports = costController ;