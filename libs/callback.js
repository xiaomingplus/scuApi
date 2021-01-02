var callback ={

};
var code = require('../code.js');
var common = require('./common.js');
var request = require('request');
var crypto = require('crypto');
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
    //console.log(o);

    if(!o.callback){
        cb(code.lackParamsCallback);
        return;
    }
//
//    signature	微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数。
//timestamp	时间戳
//    nonce	随机数
//    echostr

    var nonce=Math.floor(Math.random()*10000000000000+1);
    var timestamp = parseInt(new Date().getTime()/1000);
    var appSecret = o.appSecret? o.appSecret:"";
    var shasum = crypto.createHash('sha1');
    var arr = [appSecret, timestamp, nonce].sort();
    shasum.update(arr.join(''));
    var signature = shasum.digest('hex');
    console.log({
        url: o.callback+"?nonce="+nonce+"&timestamp="+timestamp+"&signature="+signature,
        form:{
            appId: o.appId? o.appId:0,
            code: o.code? o.code:0,
            message: o.message? o.message:"no Data",
            type: o.action? o.action:"",
            studentId: o.studentId? o.studentId:"",
            time:common.time()
        }
    });
    request.post(
    {
        url: o.callback+"?nonce="+nonce+"&timestamp="+timestamp+"&signature="+signature,
        form:{
            appId: o.appId? o.appId:0,
            code: o.code? o.code:0,
            message: o.message? o.message:"no Data",
            type: o.action? o.action:"",
            studentId: o.studentId? o.studentId:"",
            time:common.time()
        }
    },function(e,r,b){
        //console.log(e,b);
        if(e){
            cb(code.requestCallbackError);
            //console.log(e);
            return;
        }

        cb(null,b);
    }
)
};

callback.p = function(o,cb){
    //console.log(o);

    if(!o.callback){
        cb(code.lackParamsCallback);
        return;
    }
//
//    signature	微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数。
//timestamp	时间戳
//    nonce	随机数
//    echostr

    var nonce=Math.floor(Math.random()*10000000000000+1);
    var timestamp = parseInt(new Date().getTime()/1000);
    var appSecret = o.appSecret? o.appSecret:"";
    var shasum = crypto.createHash('sha1');
    var arr = [appSecret, timestamp, nonce].sort();
    shasum.update(arr.join(''));
    var signature = shasum.digest('hex');
console.log({
            url: o.callback+"?nonce="+nonce+"&timestamp="+timestamp+"&signature="+signature,
            form: o.form
                //appId: o.appId? o.appId:0,
                //code: o.code? o.code:0,
                //message: o.message? o.message:"no Data",
                //type: o.action? o.action:"",
                //studentId: o.studentId? o.studentId:"",
                //time:common.time()

        });
    request.post(
        {
            url: o.callback+"?nonce="+nonce+"&timestamp="+timestamp+"&signature="+signature,
            form: o.form
                //appId: o.appId? o.appId:0,
                //code: o.code? o.code:0,
                //message: o.message? o.message:"no Data",
                //type: o.action? o.action:"",
                //studentId: o.studentId? o.studentId:"",
                //time:common.time()

        },function(e,r,b){
            //console.log(e,b);
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