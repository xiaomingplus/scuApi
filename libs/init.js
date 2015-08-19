var updates = require('./updates.js');

var datas = require('./datas.js');
var move = require('./move.js');


/**
 *
 * 迁移类
 */

/**
 * 迁移scuinfo的用户
 */


//move.user();


/**
 * 迁移scuinfo的用户图书馆帐号
 */


//move.libUser();







/**
 * 更新类
 */

/**
 * 载入更新需要的基本信息
 */
datas.load();


/**
 * 更新学期信息
 */
//

//
//setTimeout(function(){
//    updates.term(function(e,r){
//    });
//},2000);


/**
 * 更新课程类型信息
 */
//setTimeout(function(){
//    updates.type(function(e,r){
//    });
//},3000);


/**
 * 更新学院信息
 */
//setTimeout(function(){
//    updates.college(function(e,r){
//    });
//},3000);


/**
 * 更新教师列表
 */
//setTimeout(function(){
//    updates.teacher(function(e,r){
//    });
//},2000);


/**
 * 根据参数更新课程信息
 * 全部课程
 */
setTimeout(function(){
    updates.updateCourse({
        version:0,
        courseBasePage: 1,
        courseBaseKey:  -1,
        courseDetailPage: 0,
        courseDetailKey: -1
    },function(e,r){
    });
},2000);
