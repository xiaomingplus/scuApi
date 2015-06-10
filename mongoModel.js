var mongoose = require('mongoose');
mongo = mongoose.createConnection('203.195.164.179','open');
mongo.on('error',console.error.bind(console,'conn error\n'));
mongo.once('open',function(){
	console.log('conn open\n');
});


//定义app模型
var app_permission = new mongoose.Schema({
        appid:Number,
        appkey:String,
        p_list:String,
        callback:String
});
exports.app_permission_model = mongo.model('app_permission',app_permission);      