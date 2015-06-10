

var common= require('./common');
var datas= require('./datas');
var callback= require('./callback.js');
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
//},2000);

callback.post({
    callback:"http://localhost:8120/api/updateCallback",
    appId: 10000,
    code: 200,
    message:'成功',
    action: 'exam',
    studentId: 2012141442029
},function(e,r){
    console.log(e,r);
})