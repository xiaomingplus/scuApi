var r = require('request');

var callback = require('./callback.js');

//r.get({
//    url:'http://scuinfo.com',
//    timeout:3000,
//
//
//},function(e,r,b){
//    console.log(e,b);
//});


callback.post({
    callback:'http://localhost:8120/api/updateCallback/',
    appSecret:'scuinfo',
    appId: 10000,
    code: 200,
    message:'test的续借操作已成功',
    action: 'renew',
    studentId: '2012141442029'

},function(e,r){
    console.log(e,r);
});