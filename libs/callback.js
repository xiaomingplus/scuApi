var callback ={

};
var code = require('../code.js');
var common = require('./common.js');
var request = require('request');

var form = {
    // message为事件内容
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359125022',
    // MsgType: 'event',
    // Event: 'LOCATION',
    // Latitude: '23.137466',
    // Longitude: '113.352425',
    // Precision: '119.385040',
    // MsgId: '5837397520665436492' }
    appId:10000,
    code:200,
    message:"成绩查询成功",
    action:"score",
    studentId:'2012141442029',//如果与个人相关则有
    time:13523131431
};



callback.post = function(o,cb){
    if(!o.callback){
        cb(code.lackParamsCallback);
        return;
    }
request.post(
    {
        url: o.callback,
        form:{
            appId: o.appId? o.appId:0,
            code: o.code? o.code:0,
            message: o.message? o.message:"no Data",
            type: o.action? o.action:"",
            studentId: o.studentId? o.studentId:"",
            time:common.time()
        }
    },function(e,r,b){
        if(e){
            cb(code.requestCallbackError);
            //console.log(e);
            return;
        }

        cb(null,b);
    }
)
};



module.exports = callback;