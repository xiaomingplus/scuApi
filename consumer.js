var updates = require('./libs/updates.js');
var async = require('async');
var request = require('request');
var config= require('./config.js');
var datas= require('./libs/datas.js');
var callback=require('./libs/callback.js');
var aes128 = require('./libs/aes128.js');
var consumer = {
    name:"消费者"
};
consumer.scoreQuery= function(){
     //console.log('update score');
    setTimeout(function(){
        request(config.queryUrl+'/?name=score&opt=get',function(err,response,body) {
            if (err) {
                console.log(err);
                setTimeout(function(){
                    consumer.scoreQuery();
                },1000);
                return;
            }

            //console.log(body);

            try {
                var user = JSON.parse(decodeURIComponent(body));

            }catch(e){
                var user = {}
            }


            if(Object.keys(user).length>0) {
                user.password=aes128.decode(config.querySecret.appId,config.querySecret.appSecret,user.password);
                //console.log('队列开始第一项了');
                //console.log(encodeURIComponent(user.password));

                //console.log(user);

                updates.score(user, function (ee) {
                    //console.log(ee);
                    if (ee) {
                        console.log('更新成绩错误'+user.studentId);
                        console.log({
                            callback:user.appId?datas.app[user.appId].callback:"",
                            appId: user.appId,
                            code: ee.code,
                            message:ee.message,
                            action: 'score',
                            studentId: user.studentId

                        });


                        callback.post({
                            callback:user.appId?datas.app[user.appId].callback:"",
                            appSecret:user.appId?datas.app[user.appId].appSecret:"",
                            appId: user.appId,
                            code: ee.code,
                            message:ee.message,
                            action: 'score',
                            studentId: user.studentId

                        },function(e,r){
                            console.log(e,r);
                        });

                    }else{
                        console.log({
    callback:user.appId?datas.app[user.appId].callback:"",
    appId: user.appId,
    code: 200,
    message:user.studentId+'的成绩已更新到最新版',
    action: 'score',
    studentId: user.studentId

});
callback.post({
    callback:user.appId?datas.app[user.appId].callback:"",
    appSecret:user.appId?datas.app[user.appId].appSecret:"",
    appId: user.appId,
    code: 200,
    message:user.studentId+'的成绩已更新到最新版',
    action: 'score',
    studentId: user.studentId

},function(e,r){
    // console.log(e,r);
});
                    }

                });

                setTimeout(function(){
                    consumer.scoreQuery();
                },1000);
            }else{
                setTimeout(function(){
                    consumer.scoreQuery();
                },1000*60);
                //console.log('队列为空');
            }
        });

    },1000);
};


/**
 * 课表消费
 */
consumer.majorQuery= function(){
    setTimeout(function(){
        request(config.queryUrl+'/?name=major&opt=get',function(err,response,body) {
            console.log(body);
            if (err) {
                console.log(err);
                setTimeout(function(){
                    consumer.majorQuery();
                },1000);
                return;
            }
            try {
                var user = JSON.parse(decodeURIComponent(body));

            }catch(e){
                var user = {}
            }
            console.log(user);
            if(Object.keys(user).length>0) {
                user.password = aes128.decode(config.querySecret.appId,config.querySecret.appSecret,user.password);
                updates.curriculum(user, function (ee) {
                    if (ee) {
                        console.log(ee);
                        callback.post({
                            callback:user.appId?datas.app[user.appId].callback:"",
                            appSecret:user.appId?datas.app[user.appId].appSecret:"",
                            appId: user.appId,
                            code: ee.code,
                            message:ee.message,
                            action: 'major',
                            studentId: user.studentId

                        },function(e,r){
                            //console.log(e,r);
                        })
                    }else{
                        callback.post({
                            callback:user.appId?datas.app[user.appId].callback:"",
                            appSecret:user.appId?datas.app[user.appId].appSecret:"",
                            appId: user.appId,
                            code: 200,
                            message:user.studentId+'的课表已更新到最新版',
                            action: 'major',
                            studentId: user.studentId

                        },function(e,r){
                            ////console.log(e,r);
                        });
                    }
                });

                setTimeout(function(){
                    consumer.majorQuery();
                },1000);
            }else{
                setTimeout(function(){
                    consumer.majorQuery();
                },1000*60);
                //console.log('队列为空');
            }
        });

    },1000);
};


/**
 * 考表消费
 */
consumer.examQuery= function(){
    setTimeout(function(){
        request(config.queryUrl+'/?name=exam&opt=get',function(err,response,body) {
            if (err) {
                console.log(err);
                setTimeout(function(){
                    consumer.examQuery();
                },1000);
                return;
            }
            //console.log(body);
            try {
                var user = JSON.parse(decodeURIComponent(body));

            }catch(e){
                var user = {}
            }
            //console.log(user);

            if(Object.keys(user).length>0) {
                user.password=aes128.decode(config.querySecret.appId,config.querySecret.appSecret,user.password);
                updates.exam(user, function (ee) {
                    if (ee) {
                        console.log(ee);
                        callback.post({
                            callback:user.appId?datas.app[user.appId].callback:"",
                            appSecret:user.appId?datas.app[user.appId].appSecret:"",
                            appId: user.appId,
                            code: ee.code,
                            message:ee.message,
                            action: 'exam',
                            studentId: user.studentId
                        },function(e,r){
                            //console.log(e,r);
                        })
                    }else{
                        callback.post({
                            callback:user.appId?datas.app[user.appId].callback:"",
                            appSecret:user.appId?datas.app[user.appId].appSecret:"",
                            appId: user.appId,
                            code: 200,
                            message:user.studentId+'的考表已更新到最新版',
                            action: 'exam',
                            studentId: user.studentId

                        },function(e,r){
                            //console.log(e,r);
                        });
                    }
                });

                setTimeout(function(){
                    consumer.examQuery();
                },1000);
            }else{
                setTimeout(function(){
                    consumer.examQuery();
                },1000*60);
                //console.log('队列为空');
            }
        });

    },1000);
};


consumer.bookQuery= function(){
    setTimeout(function(){
        //console.log(config.queryUrl+'/?name=book&opt=get');
        request(config.queryUrl+'/?name=book&opt=get',function(err,response,body) {
            if (err) {
                console.log(err);
                setTimeout(function(){
                    consumer.bookQuery();
                },1000);
                return;
            }

            try {
                var user = JSON.parse(decodeURIComponent(body));

            }catch(e){
                var user = {}
            }


             if(typeof(user)!='object'){

                 setTimeout(function(){
                     consumer.bookQuery();
                 },1000);
             }else if(Object.keys(user).length>0) {

                //console.log('队列开始第一项了');
                user.password=aes128.decode(config.querySecret.appId,config.querySecret.appSecret,user.password);

                updates.library(user, function (ee) {
                    if (ee) {
                        console.log(ee);
                        //console.log('2222');
                        callback.post({
                            callback:user.appId?datas.app[user.appId].callback:"",
                            appSecret:user.appId?datas.app[user.appId].appSecret:"",
                            appId: user.appId,
                            code: ee.code,
                            message:ee.message,
                            action: 'book',
                            studentId: user.studentId

                        },function(e,r){
                            console.log(e,r);
                        })
                    }else{
                        callback.post({
                            callback:user.appId?datas.app[user.appId].callback:"",
                            appSecret:user.appId?datas.app[user.appId].appSecret:"",
                            appId: user.appId,
                            code: 200,
                            message:user.studentId+'借的图书列表已更新到最新版',
                            action: 'book',
                            studentId: user.studentId

                        },function(e,r){
                            //console.log(e,r);
                        });

                    }
                });

                setTimeout(function(){
                    consumer.bookQuery();
                },1000);
            }else{
                setTimeout(function(){
                    consumer.bookQuery();
                },1000*60);
                //console.log('队列为空');
            }
        });

    },1000);
};

consumer.renewQuery= function(){
    setTimeout(function(){
        request(config.queryUrl+'/?name=renew&opt=get',function(err,response,body) {
            //console.log(err,body);
            if (err) {
                console.log(err);
                setTimeout(function(){
                    consumer.renewQuery();
                },1000);
                return;
            }
            try {
                var user = JSON.parse(decodeURIComponent(body));

            }catch(e){
                var user = {};
            }


            if(Object.keys(user).length>0) {
                user.password=aes128.decode(config.querySecret.appId,config.querySecret.appSecret,user.password);
                //console.log(user);

                //console.log('队列开始第一项了');
                updates.renew(user, function (ee) {
                    //console.log(ee);
                    if (ee) {
                        console.log(ee);
                        callback.post({
                            callback:user.appId?datas.app[user.appId].callback:"",
                            appSecret:user.appId?datas.app[user.appId].appSecret:"",
                            appId: user.appId,
                            code: ee.code,
                            message:ee.message,
                            action: 'renew',
                            studentId: user.studentId

                        },function(e,r){
                            //console.log(e,r);

                            setTimeout(function(){
                                consumer.renewQuery();
                            },1000);
                        });
                    }else{


                        callback.post({
                            callback:user.appId?datas.app[user.appId].callback:"",
                            appSecret:user.appId?datas.app[user.appId].appSecret:"",
                            appId: user.appId,
                            code: 200,
                            message:user.studentId+'的续借操作已成功',
                            action: 'renew',
                            studentId: user.studentId

                        },function(e,r){
                            //console.log(e,r);
                        });

                        request(config.queryUrl+'/?name=book&opt=put&data='+encodeURIComponent('{"studentId":"' + user.studentId + '","password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,user.password) + '","appId":'+user.appId+'}'), function (eee) {

                            }
                        );
                        setTimeout(function(){
                            consumer.renewQuery();
                        },1000);
                        return;
                    }
                    //console.log(user.studentId+'续借成功');
                });


            }else{
                setTimeout(function(){
                    consumer.renewQuery();
                },1000*60);
                //console.log('队列为空');
            }
        });

    },1000);
};

consumer.init = function(){
    if(datas.status.appStatus) {
        consumer.scoreQuery();
         consumer.bookQuery();
        consumer.majorQuery();
        consumer.renewQuery();
        consumer.examQuery();
    }else{
        setTimeout(function(){
            consumer.init()
        },6000);

    }
};

consumer.init();



process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});
/**
 * 每n分钟自动载入数据
 */
datas.load();



setInterval(function(){
    console.log('查看是否全局数据是否有更新');
    datas.load();
},1000*60*600);
module.exports = consumer;
