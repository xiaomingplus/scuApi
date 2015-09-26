var express = require('express');
var path = require('path');
var datas = require('./libs/datas.js');

var logger = require('morgan');

var routes = require('./routes/index');
var services = require('./libs/system.js');
var app = express();

// view engine set
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.set('env','production');
//app.set('env','development');

//app.use(logger('dev'));
app.use('/', routes);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.dump('error500');
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.dump('error500');
});

app.listen(9231,function(){
    console.log('9231'+new Date());
});

services.flushPermission();

/**
 * 每n分钟自动载入数据
 */
datas.load();
setInterval(function(){
  console.log('查看是否全局数据是否有更新'+new Date());
  datas.load();
},1000*60*600);
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});
module.exports = app;
