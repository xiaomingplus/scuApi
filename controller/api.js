var api={
name:"api"
};
var config= require('../config.js');
var aes128 = require('../libs/aes128.js');
var check = require('../libs/check.js');
var conn = require('../mysql.js');
var services = require('../libs/system.js');
var datas = require('../libs/datas.js');
var request = require('request');
var libs = require('../libs/libs.js');
var common =require('../libs/common.js');
var pages = require('../libs/pages.js');
api.apiPermission = function(req,res,next){
    res.setHeader('content-type','application/json; charset=UTF-8');
    var id = req.query.appId?req.query.appId:req.query.appid;
    //console.log(id);
    //根据appid读取app权限信息
    services.app_permission_model.findOne({appid:id},function(err,app_permission){
        //console.log(err,app_permission);

        if(err){
            console.log(err);
            res.dump('redisError');
            return;
        }
        if(app_permission==null){
            res.dump('appIdError');
        }else{
            //判断appkey是否正确
            var key = req.query.appSecret?req.query.appSecret:req.query.appsecret;
            if(key!=app_permission.appkey){
                res.dump('appKeyError');
            }else{
                //console.log(req.params);
                //console.log(req.params[0]);
                var func = req.params[0];
                //判断app是否有权限调用当前接口
                if(app_permission.p_list.indexOf(func)==-1){
                    res.dump('appPermissionError');
                }else{
                    //console.log('permission ok');
                    next();
                }

            }
        }
    });
};

/**
 * 手动更新
 * @param req
 * @param res
 */
api.update = function(req,res){

    if(!req.query.type){
        res.dump('lackParamsType');
        return;
    }

    switch(req.query.type){

        case 'score':
            req.query.field = 'score';

            check.student(req.query,function(e,r){
        if(e){
            res.end(JSON.stringify(e));
            return;
        }

                    request(config.queryUrl+'/?name=score&opt=put&data='+encodeURIComponent('{"studentId":' + req.query.studentId + ',"password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,r.password) + '","appId":'+req.query.appId+'}'), function (eee, rrr) {

                            if (eee) {
                                res.dump('requestError');
                                console.log(eee);
                                return;
                            }
                            res.dump('scoreUpdateQuerySuccess');
                            return;
                        }
                    );
    });


            break;

        case 'major':
            req.query.field = 'major';
            check.student(req.query,function(e,r){
                if(e){
                    res.end(JSON.stringify(e));
                    return;
                }
                            request(config.queryUrl+'/?name=major&opt=put&data='+encodeURIComponent('{"studentId":' + req.query.studentId + ',"password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,r.password) + '","appId":'+req.query.appId+'}'), function (eee) {

                                    if (eee) {
                                        res.dump('requestError');
                                        console.log(eee);
                                        return;
                                    }
                                    res.dump('majorUpdateQuerySuccess');
                                    return;
                                }
                            );


            });

            break;
        case 'book':
            req.query.field = 'book';
            check.library(req.query,function(e,r){
                if(e){
                    res.end(JSON.stringify(e));
                    return;
                }

                            request(config.queryUrl+'/?name=book&opt=put&data='+encodeURIComponent('{"studentId":"' + req.query.studentId + '","password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,r.password) + '","appId":'+req.query.appId+'}'), function (eee) {

                                    if (eee) {
                                        res.dump('requestError');
                                        console.log(eee);
                                        return;
                                    }
                                    res.dump('libraryUpdateQuerySuccess');
                                    return;
                                }
                            );


            });
            break;


        case 'exam':
            req.query.field = 'exam';
            check.student(req.query,function(e,r){
                if(e){
                    res.end(JSON.stringify(e));
                    return;
                }
                request(config.queryUrl+'/?name=exam&opt=put&data='+encodeURIComponent('{"studentId":' + req.query.studentId + ',"password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,r.password) + '","appId":'+req.query.appId+'}'), function (eee) {

                        if (eee) {
                            res.dump('requestError');
                            console.log(eee);
                            return;
                        }
                        res.dump('examUpdateQuerySuccess');
                        return;
                    }
                );


            });

            break;

        default:
            res.dump('paramsError');
            break;
    }
};

//输出成绩
api.score = function(req,res){
    
    //console.log(req.query);
    
req.query.field = 'score';
check.student(req.query,function(e,r){
   if(e){
       res.end(JSON.stringify(e));
       return;
   }
    //console.log(r);
    //console.log("select termId,courseId,orderId,propertyId,credit,score,name,EnglishName,reason from scu_score where studentId="+ req.query.studentId+" and version="+ r.scoreVersion);
    conn.query(
        {
            sql:"select termId,courseId,orderId,propertyId,credit,score,name,EnglishName,reason from scu_score where studentId="+ req.query.studentId+" and version="+ r.scoreVersion+" order by id desc"
        },function(ee,rr){
            if(ee){
                res.dump('mysqlError');
               return;
            }
            //console.log(rr);
            //console.log(datas.propertyById);

            if(rr.length>0) {

                var scores = [];
                for (var i = 0; i < rr.length; i++) {
                    scores[i] = {
                        term: datas.termById[rr[i].termId].name,
                        current:datas.currentTerm.termId==rr[i].termId?1:0,
                        courseId:rr[i].courseId,
                        orderId:rr[i].orderId,
                        property:datas.propertyById[rr[i].propertyId]?datas.propertyById[rr[i].propertyId].name:"未知",
                        credit:rr[i].credit,
                        score:rr[i].score,
                        name:rr[i].name,
                        EnglishName:rr[i].EnglishName,
                        reason:rr[i].reason
                    }

                }

                res.dump('ok',{
                    count: r.scoreCount,
                    updateAt: r.scoreUpdateAt,
                    version: r.scoreVersion,
                    scores:scores

                });
            }else{

                if(r.scoreVersion > 0){
                    res.dump('ok',{
                        count: r.scoreCount,
                        updateAt: r.scoreUpdateAt,
                        version: r.scoreVersion,
                        scores:[]

                    });
                    return;
                }
                request(config.queryUrl+'/?name=score&opt=put&data='+encodeURIComponent('{"studentId":' + req.query.studentId + ',"password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,r.password) + '","appId":'+req.query.appId+'}'), function (eee, rrr) {

                        if (eee) {
                            res.dump('requestError');
                            console.log(eee);
                            return;
                        }
                        res.dump('scoreInitQuerySuccess');
                        return;
                    }
                );
            }
        }
    )

});

};

api.exam = function(req,res){

    req.query.field = 'exam';
    check.student(req.query,function(e,r){
        if(e){
            res.end(JSON.stringify(e));
            return;
        }
        //console.log(r);

        conn.query(
            {
                sql:"select * from scu_exam where studentId="+ req.query.studentId+" and version="+ r.examVersion
            },function(ee,rr){

                if(ee){
                    res.dump('mysqlError');
                    return;
                }
                //console.log(rr);

                //console.log(datas.termById);
                if(rr.length>0) {
                    var list = [];
                    for (var i = 0; i < rr.length; i++) {
                        //console.log(datas.termById[rr[i].termId]);
                        list[i] = {
                            term: datas.termById[rr[i].termId].name,
                            examName:rr[i].examName,
                            start:rr[i].start?(rr[i].start-8*60*60):0,
                            end:rr[i].end?(rr[i].end-8*60*60):0,
                            credit:rr[i].credit,
                            name:rr[i].name,
                            campus:rr[i].campusId?datas.campusById[rr[i].campusId].name:"",
                            week:rr[i].week,
                            building:rr[i].building,
                            classroom:rr[i].classroom,
                        }

                    }
                    //console.log(r);

                    res.dump('ok',{
                        currentWeek:common.currentWeek(datas.firstDay[datas.currentTerm.termId]),
                        count: r.examCount,
                        updateAt: r.examUpdateAt,
                        version: r.examVersion,
                        exams:list

                    });
                }else{
                    if(r.examVersion > 0){
                        res.dump('ok',{
                            count: r.examCount,
                            updateAt: r.examUpdateAt,
                            version: r.examVersion,
                            exams:[]
                        });
                        return;
                    }



                    request(config.queryUrl+'/?name=exam&opt=put&data='+encodeURIComponent('{"studentId":' + req.query.studentId + ',"password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,r.password) + '","appId":"'+req.query.appId+'"}'), function (eee) {

                            if (eee) {
                                res.dump('requestError');
                                console.log(eee);
                                return;
                            }
                            res.dump('examInitQuerySuccess');
                            return;
                        }
                    );
                    //加入生产者

                }
            }
        )

    });
};



//补考信息
api.examAgain = function(req,res){

    req.query.field = 'exam';
    check.student(req.query,function(e,r){
        if(e){
            res.end(JSON.stringify(e));
            return;
        }
        //console.log(r);


        if(!req.query.termId){

            termId = datas.currentTerm.termId;
        }else{
            termId = req.query.termId;
        }
        
        conn.query(
            {
                sql:"select * from scu_exam_again where studentId="+ req.query.studentId+" and termId='"+termId+"'"
            },function(ee,rr){

                if(ee){
                    res.dump('mysqlError');
                    return;
                }
                //console.log(rr);

                //console.log(datas.termById);
                if(rr.length>0) {
                    var list = [];
                    for (var i = 0; i < rr.length; i++) {
                        //console.log(datas.termById[rr[i].termId]);
                        list[i] = {
                            term: datas.termById[rr[i].termId].name,
                            examName:rr[i].examName,
                            start:rr[i].start?(rr[i].start):0,
                            end:rr[i].end?(rr[i].end):0,
                            name:rr[i].name,
                            campus:rr[i].campusId?datas.campusById[rr[i].campusId].name:"",
                            username:rr[i].username,
                            building:rr[i].building,
                            classroom:rr[i].classroom
                        }

                    }
                    //console.log(r);

                    res.dump('ok',{
                        currentWeek:common.currentWeek(datas.firstDay[datas.currentTerm.termId]),
                        count: list.length,
                        updateAt: 1440578923,
                        version: 1,
                        exams:list

                    });
                }else{
                        res.dump('ok',{
                            count: 0,
                            updateAt: 1440578923,
                            version: 1,
                            exams:[]
                        });
                        return;

                }
            }
        )

    });
};


//输出课表
api.major = function(req,res){
    //console.log(req.query);
req.query.field = 'major';
    check.student(req.query,function(e,r){
        if(e){
            res.end(JSON.stringify(e));
            return;
        }
        //console.log(r);

        conn.query(
            {
                sql:"select * from scu_major where studentId="+ req.query.studentId+" and version="+ r.majorVersion
            },function(ee,rr){

                if(ee){
                    res.dump('mysqlError');
                    return;
                }
                //console.log(rr);

                if(rr.length>0) {

                    var list = [];
                    for (var i = 0; i < rr.length; i++) {
                        list[i] = {
                            term: datas.termById[rr[i].termId].name,
                            courseId:rr[i].courseId,
                            orderId:rr[i].orderId,
                            property:rr[i].propertyId?datas.propertyById[rr[i].propertyId].name:"",
                            credit:rr[i].credit,
                            name:rr[i].name,
                            teacherName:rr[i].teacherName,
                            week:rr[i].week,
                            weekHasLesson:rr[i].weekHasLesson,
                            lesson:rr[i].lesson,
                            building:rr[i].building,
                            classroom:rr[i].classroom,
                            status:rr[i].status
                        }

                    }
                    
                    res.dump('ok',{
                        currentWeek:common.currentWeek(datas.firstDay[datas.currentTerm.termId]),
                        count: r.majorCount,
                        updateAt: r.majorUpdateAt,
                        version: r.majorVersion,
                        majors:list

                    });
                }else{

                    if(r.majorVersion > 0){

                        console.log(datas.firstDay[datas.currentTerm.termId]);

                        res.dump('ok',{
                            currentWeek:common.currentWeek(datas.firstDay[datas.currentTerm.termId]),
                            count: r.majorCount,
                            updateAt: r.majorUpdateAt,
                            version: r.majorVersion,
                            majors:[]
                        });
                        return;
                    }



                    request(config.queryUrl+'/?name=major&opt=put&data='+encodeURIComponent('{"studentId":' + req.query.studentId + ',"password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,r.password) + '","appId":'+req.query.appId+'}'), function (eee) {

                            if (eee) {
                                res.dump('requestError');
                                console.log(eee);
                                return;
                            }
                            res.dump('majorInitQuerySuccess');
                            return;
                        }
                    );
                    //加入生产者

                }
            }
        )

    });

};


//输出我的图书列表
api.book = function(req,res){
    req.query.field = 'book';
    check.library(req.query,function(e,r){
        if(e){
            res.end(JSON.stringify(e));
            return;
        }
        //console.log(r);
//console.log("select * from scu_book where studentId='"+ req.query.studentId+"' and version="+ r.version);
        conn.query(
            {
                sql:"select * from scu_book where studentId="+ req.query.studentId+" and version="+ r.version
            },function(ee,rr){
                if(ee){
                    console.log(ee);
                    res.dump('mysqlError');
                    return;
                }
                //console.log(rr);

                if(rr.length>0) {

                    var list = [];
                    var location={
                        'J':"江安馆",
                        'W':"文理馆",
                        'Y':"医学馆",
                        'G':"工学馆"


                    };
                    for (var i = 0; i < rr.length; i++) {
                        list[i] = {
                            name:rr[i].name,
                            deadline:rr[i].deadline,
                            author:rr[i].author,//作者
                            location:location[rr[i].location.substr(0,1)]?location[rr[i].location.substr(0,1)]:"图书馆",//借书地点
                            index:rr[i].index,//索引号
                            bookId:rr[i].barcode,//图书id
                            borrowId:rr[i].borId

                        }

                    }

                    res.dump('ok',{
                        count: r.count,
                        updateAt: r.updateAt,
                        version: r.version,
                        books:list

                    });
                }else{


                    if(r.version > 0){
                        res.dump('ok',{
                            count: r.count,
                            updateAt: r.updateAt,
                            version: r.version,
                            books:[]
                        });
                        return;
                    }



                    request(config.queryUrl+'/?name=book&opt=put&data='+encodeURIComponent('{"studentId":"' + req.query.studentId + '","password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,r.password) + '","appId":'+req.query.appId+'}'), function (eee) {

                            if (eee) {
                                res.dump('requestError');
                                console.log(eee);
                                return;
                            }
                            res.dump('libraryInitQuerySuccess');
                            return;
                        }
                    );
                    //加入生产者

                }
            }
        )

    });

};


/**
 *续借图书
 * @type {{name: string}}
 */

api.renew = function(req,res){
    check.renew(req.query,function(e,r){

        if(e){
            res.end(JSON.stringify(e));
            return;
        }
        console.log(config.queryUrl+'/?name=renew&opt=put&data='+encodeURIComponent('{"studentId":"' + req.query.studentId + '","password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,r.password) + '","barcode":"'+ req.query.bookId+'","borId":"'+ req.query.borrowId+'","appId":'+req.query.appId+'}'));
        request(config.queryUrl+'/?name=renew&opt=put&data='+encodeURIComponent('{"studentId":"' + req.query.studentId + '","password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,r.password) + '","barcode":"'+ req.query.bookId+'","borId":"'+ req.query.borrowId+'","appId":'+req.query.appId+'}'), function (eee, rrr) {
                if (eee) {
                    res.dump('requestLibError');
                    console.log(eee);
                    return;
                }
                res.end(JSON.stringify({
                    code:200,
                    message:"续借操作提交成功，请勿重复提交"
                }))
                return;
            }
        );



    });

};


api.currentScore = function(req,res){


    if(!req.query.studentId){
        res.dump('lackParamsStudentId');
        return;
    }

    if(!req.query.password){
        res.dump('lackParamsPassword');
     return;
    }

    if(req.query.debug){
        var password = req.query.password;
    }else {
        var password = aes128.decode(req.query.appId, req.query.appSecret, "" + req.query.password + "");
    }


        libs.get(
            {
                studentId: req.query.studentId,
                password: password,
                url: "http://202.115.47.141/bxqcjcxAction.do?totalrows=16&pageSize=300"
            }, function (e, r) {
                if (e) {

                    res.end(JSON.stringify(e));
                    return;
                    //libs.rePost(
                    //    {
                    //        url: 'http://202.115.47.141/logout.do',
                    //        form: {
                    //            'loginType': "platformLogin"
                    //        },
                    //        j: e.j
                    //    }, function (ee, rr) {
                    //        res.end(JSON.stringify(e));
                    //        return;
                    //    });
                } else {
                    var scores = pages.currentScore(r.data);
                    res.dump('ok', {scores:scores});

                    //
                    //libs.rePost(
                    //    {
                    //        url: 'http://202.115.47.141/logout.do?totalrows=300&pageSize=300',
                    //        form: {
                    //            'loginType': "platformLogin"
                    //        },
                    //        j: r.j
                    //    }, function (ee, rr) {
                    //        var scores = pages.currentScore(r.data);
                    //        res.dump('ok', scores);
                    //    });

                }


            }
        );



};


api.building = function(req,res){

    conn.query(
        {
            sql:"select * from scu_building where version=1"
        },function(e,r){
            if(e){
                console.log(e);
                res.dump('mysqlError');
                return;
            }


            var data = {

                "01":{
                    name:"望江",
                    buildings:[

                    ]
                },
                "02":{
                    name:"华西",
                    buildings:[
                    ]
                },
                "03":{
                    name:"江安",
                    buildings:[
                    ]
                }
            };


            if(r.length==0){
                res.dump('ok',[]);
            }else{


                for(var i=0;i< r.length;i++){
                    if(r[i].campusId=='01'){
                        data['01'].buildings.push({
                            id:r[i].buildingId,
                            name:r[i].name
                        })

                    }else if(r[i].campusId=='02'){
                        data['02'].buildings.push({
                            id:r[i].buildingId,
                            name:r[i].name
                        })
                    }else{
                        data['03'].buildings.push({
                            id:r[i].buildingId,
                            name:r[i].name
                        })
                    }
                }


                res.dump('ok',data)
            }



        }
    )
};


api.classroom = function(req,res){


    if(!req.query.start){
        req.query.start = common.todayStartTimestamp();
    }

    if(!req.query.end){
        req.query.end = common.todayStartTimestamp()+24*60*60
    }


    var page,pageSize,sql,start,end;

    if(!req.query.page){
        page = 1;
    }else{
        page = req.query.page;
    }

    if(!req.query.pageSize){
        pageSize = 15;
    }else{
        pageSize=req.query.pageSize;
    }

    start = (page-1)*pageSize;

    end = pageSize;


    if(!req.query.campusId){
        sql="select * from scu_classroom where start>="+req.query.start+" and end<="+req.query.end+" limit "+start+","+end;
    }else if(!req.query.buildingId){
        sql="select * from scu_classroom where campusId='"+req.query.campusId+"' and start>="+req.query.start+" and end<="+req.query.end+" limit "+start+","+end;

    }else if(!req.query.classroomId){
        sql="select * from scu_classroom where campusId='"+req.query.campusId+"' and buildingId='"+req.query.buildingId+"' and start>="+req.query.start+" and end<="+req.query.end+" limit "+start+","+end;

    }else{
        sql="select * from scu_classroom where campusId='"+req.query.campusId+"' and buildingId='"+req.query.buildingId+"' and classroomId='"+req.query.classroomId+"' and start>="+req.query.start+" and end<="+req.query.end+" limit "+start+","+end;

    }
  conn.query(
      {
          sql:sql
      },function(e,r){

          if(e){
              console.log(e);
              res.dump('mysqlError');
              return;
          }
res.dump('ok',r);
      }
  )
};


api.course = function(req,res){




    var page,pageSize,sql,start,end;

    if(!req.query.page){
        page = 1;
    }else{
        page = req.query.page;
    }

    if(!req.query.pageSize){
        pageSize = 15;
    }else{
        pageSize=req.query.pageSize;
    }

    start = (page-1)*pageSize;

    end = pageSize;

    if(!req.query.name && !req.query.collegeId){
        sql = "select * from scu_course limit "+start+","+end;

    }else if(!req.query.name && req.query.collegeId){
        sql = "select * from scu_course where collegeId ="+req.query.collegeId+" limit "+start+","+end;

    }else if(req.query.name && !req.query.collegeId) {
        sql = "select * from scu_course where teacher = '"+req.query.name+"' limit "+start+","+end;

    }
    else{
        sql = "select * from scu_course where teacher = '"+req.query.name+"' and collegeId="+req.query.collegeId+" limit "+start+","+end;


    }
console.log(sql);
    conn.query(
        {
            sql:sql
        },function(e,r) {
            console.log(e,r);
            
            res.dump('ok',r);
        });

};

module.exports = api;
