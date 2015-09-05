var async = require('async');
/**
 * 系统统一行为集合
 * Created by lanhao on 15/3/23.
 */
var system = {};

//芒果DB存储的数据模型
system.app_permission_model = require('../mongoModel.js').app_permission_model;

//mysql 连接
system.db = require('../mysql.js');


/**
 * 刷新芒果DB里应用权限
 */
system.flushPermission = function(){
    console.log('flush');
    var sql = 'SELECT t1.*,t2.* from scu_app_info t1 LEFT JOIN scu_app_permission t2 on t1.id=t2.appid';
    system.db.query(sql,function(err,result){
        if(err)console.log(err);
        else{
            console.log(result);
            var len = result.length;
            for(var i=0;i<len;i++){
                var item= result[i];
                var condition = {appid:result[i].appid};
                system.app_permission_model.remove(condition,function(e,r){
                    if(e){
                        console.log(e);
                    }else {
                        system.app_permission_model.create({
                            appid: item.appid,
                            appkey: item.appkey,
                            p_list: item.p_list,
                            callback: item.callback
                        });
                        console.log('load permission ok:'+(new Date().toLocaleString()));

                    }


                }).exec();

            }
        }
        setTimeout(function(){
            system.flushPermission();
        },1000*60*10);
    });
};
module.exports = system;