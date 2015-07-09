var express = require('express');
var router = express.Router();
var api = require('../controller/api.js');
var code = require('../code.js');
var check = require('../libs/check.js');
/**
 * api
 */

router.use(function (req,res,next) {
  //console.log(req.body);
  res.dump = function (name,obj,message) {
    res.end(JSON.stringify({
      'code':code[name].code,
      'message':message?message:code[name].message,
      'data':obj?obj:""
    }));
    return;
  };
  next();
});


router.get('/',function(req,res,next){
  res.dump('ok',null,"欢迎使用飞扬开放平台四川大学校园api,请访问 http://open.fyscu.com 查看详细文档");
});

router.all('/api/*',function(req,res,next){
  api.apiPermission(req,res,next);
});

router.get('/api/update',function(req,res){
  api.update(req,res);
});

router.get('/api/score/latest',function(req,res){

  api.currentScore(req,res);

});


router.get('/api/score',function(req,res){
  api.score(req,res);
});

router.get('/api/exam',function(req,res){
  api.exam(req,res);
});

router.get('/api/book',function(req,res){
  api.book(req,res);
});


router.get('/api/renew',function(req,res){
  api.renew(req,res);
});

router.get('/api/major',function(req,res){
  api.major(req,res);
});

router.get('/api/news/teaching',function(req,res){
api.newsTeaching(req,res);
});




router.get('/version',function(req,res){
  //todo
  //手动更新版本
});

router.get('/t',function(req,res){
  //test
  res.render('t');
});

router.post('/t',function(req,res){
  //console.log(req.body);
});



module.exports = router;
