
var request = require('request');
var common= require('./common');
var datas= require('./datas');
var callback= require('./callback.js');
var aes = require('./aes128.js');
var libs= require('./libs.js');
var config= require('../config.js');
var crypto = require('crypto');
/// /var t = {
//appid:"IZqpBTVRmWL0phxNtAxWA64PlVwNMJN1",
//    appkey:"K6davkJJTazmXOTH1P3N",
//    appId:"1013",
//    appSecret:"scuinfo"
//};
//var aes128 = require('./aes128.js');
//var request = require('request');
//var config=require('../config.js');
//
//t.bind = function(){
//    request(
//        {
//            url:"https://api.yangcong.com/v1/GetLoginCode",
//            form:{
//                appid: t.appid,
//                appkey: t.appkey
//            }
//        },function(e,r){
//            console.log(e, r.body);
//        }
//    )
//};
//
//
//t.encode = function(o){
//    return aes128.encode(t.appId, t.appSecret,o);
//};
//
//t.score = function(o){
//
//    request.get({
//        url:"http://localhost:9231/api/score?appId="+ t.appId+"&appSecret="+ t.appSecret+"&studentId=2012141442029&password="+'013991&debug=1'
//    },function(e,r,b){
//        console.log(e,b);
//    })
//};
//var user={
//    id:2012141442029,
//    password:"013991",
//    scoreVersion:1,
//
//}
//
//request(config.queryUrl+'/?name=score&opt=put&data={"appId":"10000","studentId":' + user.id + ',"password":"' + user.password + '","version":' + user.scoreVersion + '}', function (eee, rrr) {
//
//        if(eee){
//            console.log(eee);
//            return;
//        }
//        console.log(user.id+'已加入成绩队列');
//        return;
//    }
//);


//t.score();

//t.bind();



//datas.load();
//
//setTimeout(function(){
//
//    console.log(common.todayStartTimestamp());
//
//    console.log(datas.firstDay);
//
//    console.log(datas.firstDay[datas.currentTerm.termId]);
//
//    var week =  (parseInt((common.todayStartTimestamp()-datas.firstDay[datas.currentTerm.termId])/3600/24/7)+1);
//    console.log(week);
////},2000);
//
//callback.post({
//    callback:"http://localhost:8120/api/updateCallback",
//    appId: 10000,
//    code: 200,
//    message:'成功',
//    action: 'exam',
//    studentId: 2012141442029
//},function(e,r){
//    //console.log(e,r);
//})

//libs.getBookId({
//    studentId: '1141047034',
//    password: '888'
//}, function (e, r) {
//    console.log(e,r);
//});


//request(
//    'http://localhost:9231/api/update?type=score&appId=10000&appSecret=scuinfo&studentId=2012141442026&password='+aes.encode('10000','scuinfo','lxy21..++'),function(e,r,b){
//        console.log(e,b);
//    });
//    signature	微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数。
//timestamp	时间戳
//    nonce	随机数
//    echostr
//加密/校验流程如下：
//1. 将token、timestamp、nonce三个参数进行字典序排序
//2. 将三个参数字符串拼接成一个字符串进行sha1加密
//3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
//
//
//
//console.log(timestamp);
//
//console.log(nonce);
//
//console.log(signature);

var q=encodeURIComponent('{"studentId":2013141091031,"password":"n2HlchNmH%2BFW%2FWAbezlUfw%3D%3D","appId":10000}');

console.log(decodeURIComponent(q));
var p=decodeURIComponent(q);

var xx=JSON.parse(p);

var x=aes.encode(config.querySecret.appId,config.querySecret.appSecret,'202119');

console.log(x);

var z='n2HlchNmH%20FW%2FWAbezlUfw%3D%3D'
var y=aes.decode(config.querySecret.appId,config.querySecret.appSecret, xx.password);

console.log(y);


