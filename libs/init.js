var updates = require('./updates.js');


var move = require('./move.js');


/**
 * 迁移scuinfo的用户
 */


//move.user();


/**
 * 迁移scuinfo的用户图书馆帐号
 */


move.libUser();


/**
 * 更新学期信息
 */
//
//datas.load();
//setTimeout(function(){
//    updates.term(function(e,r){
//
//    });
//},2000);