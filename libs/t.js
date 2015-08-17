var libs = require("./libs.js");
var config = require("../config.js");
var pages = require("./pages.js");
var async = require("async");
var conn = require('../mysql.js');
//var u = require("./updates.js");
//
var datas = require("./datas.js");
//
datas.load();
setTimeout(function(){
//
//
//u.teacher(function(e,r){
//    console.log(e,r);
//});
//

var oo = {
    //请求课程列表
    url: config.urls.classroomFreeGet,
    studentId: 2012141442029,
    password: "013991"
};


libs.get(oo,function(e,r){

    if(e){
        console.log(e);
        return;
    }
    var dates = [];
    var k;
    for(var i=1;i<25;i++){
        for(var j=1;j<8;j++){
            if(j==7){
                k=0;
            }else{
                k=j;
            }
            dates.push(
                {
                    weekId:i,
                    week:j,
                    start:datas.firstDay['2015-2016-1-1']+(i-1)*7*24*60*60+(k*24*60*60),
                    end:datas.firstDay['2015-2016-1-1']+(i-1)*7*24*60*60+(k*24*60*60)+(24*60*60)
                }
            )
        }
    }
    


    async.eachSeries(dates, function (date, cbb) {
    libs.rePost({
        url: config.urls.classroomFreePost,
        form:{
            page:1,
                pageSize:"20",
            zxZc:date.weekId,//周
            zxxnxq:"2015-2016-1-1",
            zxxq:date.week//星期几
        },
        j: r.j
    },function(ee,data) {


                var teacherCount = data.data.substring(data.data.lastIndexOf("共") + 1, data.data.indexOf("项", data.data.lastIndexOf("共")));

                var teacherPageCount;
                if((teacherCount % config.params.teacherListPageSize)==0){
                    teacherPageCount = parseInt(teacherCount / config.params.teacherListPageSize);
                }else{
                    teacherPageCount = parseInt(teacherCount / config.params.teacherListPageSize) + 1;
                }
                var urls = [], url = {};
                for (var i = 0; i < teacherPageCount; i++) {
                    url = {
                        url: config.urls.classroomFreePost,
                        form:{
                            page:i+1,
                            pageSize:"300",
                            zxZc:date.weekId,//周
                            zxxnxq:"2015-2016-1-1",
                            zxxq:date.week//星期几
                        },
                        start:date.start,
                        end:date.end,
                        j: r.j
                    };
                    urls.push(url);
                }
                
                async.eachSeries(urls, function (url, cb) {

                    
                    libs.rePost(url, function (eee, rrr) {
                        if (eee) {
                            console.log(eee);
                            return;
                        }
                       var rrrr = {data: pages.classroom(rrr.data)};
                            //console.log('test');
                            var sql;
                            var teacherSql = [];
                            for (var i = 0; i < rrrr.data.length; i++) {
                                teacherSql[i] = "("+url.start+","+url.end+",\"" + rrrr.data[i].campusId+ "\"," + rrrr.data[i].buildId + ",\"" +rrrr.data[i].building + "\",\"" + rrrr.data[i].classroomId+ "\",'"+rrrr.data[i].classroom + "','"+rrrr.data[i].type+"',"+(rrrr.data[i].count?rrrr.data[i].count:80)+")";
                            }
                            sql = "insert into scu_classroom (`start`,`end`,`campusId`,`buildId`,`building`,`classroomId`,`classroom`,`type`,`count`) VALUES " + teacherSql.join(',');
                        conn.query(
                                {
                                    sql: sql
                                }, function (eeeee) {
                                    if (eeeee) {
                                        cb(code.mysqlError);
                                        console.log(eeeee);
                                        return;
                                    }
                                    cb(null);
                                }
                            )
                    });
                }, function (eeeeee) {
                    if (eeeeee) {
                        console.log(eeeeee);
                        return;
                    }
                    cbb(null)
                    console.log('yes.'+new Date(date.start*1000)+teacherCount+"weekId"+date.weekId+"week"+date.week);
                });
        //console.log(classroom);
        
        
    });
    }, function (eeeeeee) {
        if (eeeeeee) {
            console.log(eeeeeee);
            return;
        }
        console.log('ok.');
    });


});

},2000);
