/**
 * Created by GuobaoYang on 15/3/8.
 */
var request=require('request');
var iconv= require('iconv-lite');
var Buffer = require('buffer').Buffer;
var config = require('../config.js');
var cheerio = require('cheerio');
var common = require('./common.js');
var datas = require('./datas.js');
var pages = require('./pages.js');
var code = require('../code.js');
var lib={
    name:"本项目公共函数库"
};


/**
 * 检查用户名和密码是否正确
 * @param options{studentId,password}
 *
 */
lib.check = function (o,cb){
    if(typeof(o.password)!='string'){
        cb(code.passwordMustString);
        return;
    }

    o=o||{
        studentId:datas.account.studentId,
        password:""+datas.account.password+""
    };
    var j = request.jar();
    var options = {
        method:"post",
        url: 'http://202.115.47.141/loginAction.do?zjh='+ o.studentId+'&mm='+o.password,
        encoding: 'binary',
        form:{zjh: o.studentId,mm: ""+o.password+""},
        jar:j
    };
   // console.log(options);
    request(options,function(err,response){
        if(err){

            cb({code:code.requestError.code,message:code.requestError.message});
            console.log(err+new Date());
            return;
        }
        if(response.statusCode!=200){
            cb({code:code.requestError.code,message:code.requestError.message});
            return;
        }
        var loginCallback = iconv.decode(new Buffer(response.body, 'binary'), 'GBK');//登录返回页面
        var $ = cheerio.load(loginCallback);
        if($('title').text().trim()=="学分制综合教务"){
            cb(null,j);
        }else{
            //console.log('222');
           // console.log(loginCallback);
            cb({
                code:code.loginError.code,
                message:$('.errorTop').text().trim()
            });
        }
    });
};

/**
 *
 * @get {options}
 */
lib.get = function (o,cb){

    lib.check(o,function(err,j){
        if(err) {
            cb(err);
            return;
        }
        var opts={
            method:"get",
            url: o.url,
            encoding:"binary",
            jar:j
        };
        request(opts,function(err,r){
            if(err){
                cb({code:code.requestError.code,message:code.requestError.message});
                console.log(err);
                return;
            }

            if(r.statusCode!=200){
                cb({code:code.requestError.code,message:code.requestError.message});
                return;
            }
            cb(null, {code:0,j:j, data:iconv.decode(new Buffer(r.body, 'binary'), 'GBK')});
        });
    });



};


/**
 *
 * @post {options}
 */
lib.post = function (o,cb){
    //test url : http://202.115.47.141/xkAction.do?actionType=6
    //test id:2012141442029
    //test password:013991

    lib.check(o,function(err,j){
       // console.log(o);
        if(err) {
            cb(err);
            return;
        }



        var opts={
            method:"post",
            url: o.url,
            encoding:"binary",
            //form: o.form,
            jar:j
        };

            request(opts,function(err,r){
                if(err){
                    console.log(err);
                    cb({code:code.requestError.code,message:code.requestError.message});
                    return;
                }
                if(r.statusCode!=200){
                    cb({code:code.requestError.code,message:code.requestError.message});
                    return;
                }
                cb(null, {code:0, j:j,data:iconv.decode(new Buffer(r.body, 'binary'), 'GBK')});
            });

    });
};

//再次请求
lib.reGet = function (o,cb){
    var opts={
        method:"get",
        url: o.url,
        encoding:"binary",
        jar: o.j
    };
    request(opts,function(err,r){
        if(err){
            cb({code:code.requestError.code,message:code.requestError.message});
            console.log(err);
            return;
        }
        if(r.statusCode!=200){
            cb({code:code.requestError.code,message:code.requestError.message});
            return;
        }
        cb(null, {code:0, data:iconv.decode(new Buffer(r.body, 'binary'), 'GBK')});
    });

};

//再次请求
lib.rePost = function (o,cb){
    var opts={
        method:"post",
        url: o.url,
        form: o.form,
        encoding:"binary",
        jar: o.j
    };
    //console.log(opts);
    request(opts,function(err,r){
        //console.log(err, r.body);
        if(err){
            cb({code:code.requestError.code,message:code.requestError.message});
            console.log(err);
            return;
        }
        if(r.statusCode!=200){
            cb({code:code.requestError.code,message:code.requestError.message});
            return;
        }
        cb(null, {code:0, data:iconv.decode(new Buffer(r.body, 'binary'), 'GBK')});
    });

};

/**
 * 获取成绩的总数量
 * @param o
 * @param cb
 */
lib.getScoreCount = function(o,cb){
    lib.get({
        studentId:o.studentId,
        password:o.password,
        url: config.urls.scoreAll
    },function(e,r) {
        if (e) {
            cb(e);

            return;
        }
        var scoreCount = pages.scoreCount(r.data);
        lib.rePost({
            url:config.urls.logout,
            j: r.j,
            form:{
                loginType:"platformLogin"
            }
        },function(ee,rr){
                cb(null, scoreCount);
        });
    });

};

/**
 * 获取课程的总数量
 * @param o
 * @param cb
 */
lib.getMajorCount = function(o,cb){
    lib.get({
        studentId:o.studentId,
        password:o.password,
        url: config.urls.major
    },function(e,r) {
        if (e) {
            cb(e);

            return;
        }
        var count = pages.majorCount(r.data);
        lib.rePost({
            url:config.urls.logout,
            j: r.j,
            form:{
                loginType:"platformLogin"
            }
        },function(ee,rr){
            cb(null, count);
        });
    });

};


/**
 * 检测图书馆登录
 * @param o
 * @param cb
 */
lib.checkLib = function(o,cb){
    var j = request.jar();
    request.get({
        url:"http://m.5read.com/395",
        jar:j
    },function(e1,r1,b1){

   if(e1){
console.log(e1);
       cb(code.requestLibError);
       return;
   }
    var options = {
        uri: 'http://mc.m.5read.com/irdUser/login/opac/opacLogin.jspx',
        form:{
            schoolid:395,
            username: o.studentId,
            password: ""+o.password+"",
            userType:0},
        jar:j
    };
    request.post(options,function(err,response,body){
        
        //console.log(err,body);
        if(err){

            cb(code.requestLibError);
            console.log(code.requestLibError.message+err+new Date());
            return;
        }
        if(response.statusCode ==200){
            cb(code.libAccountOrPasswordError);
            return;
        }

        if(response.statusCode == 302){
            cb(null,j);
            return;
        }
        cb(code.requestLibError);
        console.log(err,body);
        return;
    });
    });
};

/**
 * 获取图书id
 * @param o
 * @param cb
 */
lib.getBookId = function(o,cb){
    lib.checkLib(o,function(e,r){
        request.get({
            url:"http://mc.m.5read.com/cmpt/opac/opacLink.jspx?stype=1",
            jar:r
        },function(ee,rr,bb){
            //console.log(ee,bb);

            if(ee){
                console.log(ee);
                cb(code.requestLibError);
                return;
            }
                cb(null,pages.bookIds(bb));

        });

    });


};
module.exports = lib;