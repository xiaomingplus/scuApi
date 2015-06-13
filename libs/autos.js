/**
 * 自动运行
 * 初始化
 */
var request = require('request');
var libs = require('./libs.js');
var conn = require('../mysql.js');
var config = require('../config.js');
var autos={
name:"自动"
};



//添加到成绩队列生产者，根据scoreCount字段
autos.queryScoreProducer = function(o){
//console.log(o);
    conn.query(
        {
            sql:"select `id`,`password`,`scoreVersion`,`scoreCount` from scu_user where error=0 limit "+ o.start+",1 "
        },function(eee,rrr) {
//console.log(rrr);
            if (eee) {
                autos.queryScoreProducer({start:o.start+1});
                console.log(eee);
                return;
            }


            //console.log(rrr.length);return;
            if (rrr.length > 0) {
                var user = rrr[0];
                user.order = o.start;
                console.log(user);
                libs.getScoreCount({
                    studentId: user.id,
                    password: user.password
                }, function (e, r) {
                    if (e) {
                        //todo 更新数据库的error字段

                        conn.query({
                                sql: "update `scu_user` set error=1 where id=" + user.id
                            }, function (eeee, rrrr) {
                                if (eeee) {
                                    console.log(eeee);
                                    autos.queryScoreProducer({start:o.start+1});
                                    return;
                                }
                                console.log(user.id+'的帐号密码有问题');
                                autos.queryScoreProducer({start:o.start+1});
                                return;
                            }
                        );

                        return;


                    }

                    if (r != user.scoreCount) {
                        request(config.queryUrl+'/?name=score&opt=put&data={"studentId":' + user.id + ',"password":"' + user.password + '","appId":"10000"}', function (eee, rrr) {

                                if(eee){
                                    autos.queryScoreProducer({start:o.start+1});
                                    console.log(eee);
                                    return;
                                }
                                console.log(user.id+'已加入成绩队列');
                                autos.queryScoreProducer({start:o.start+1});
                                return;
                            }
                        );

                        return;

                    } else {
                        console.log(user.id+'的成绩貌似没有变化');
                        autos.queryScoreProducer({start:o.start+1});
                        return;
                    }
                    //cb(null);
                    return;

                });
                return;


            }else{
                console.log('已走完一遍');

            }
        });

};

//添加到课表队列生产者
autos.queryMajorProducer = function(o){
    conn.query(
        {
            sql:"select `id`,`password`,`majorVersion`,`majorCount` from scu_user where error=0 limit "+ o.start+",1"
        },function(eee,rrr) {
//console.log(rrr);
            if (eee) {
                autos.queryMajorProducer({start:o.start+1});
                console.log(eee);
                return;
            }


            //console.log(rrr);//return;
            if (rrr.length > 0) {
                var user = rrr[0];
                user.order = o.start;
                //console.log(user);
                libs.getMajorCount({
                    studentId: user.id,
                    password: user.password
                }, function (e, r) {
                    if (e) {
                        //todo 更新数据库的error字段
                        conn.query({
                                sql: "update `scu_user` set error=1 where id=" + user.id
                            }, function (eeee, rrrr) {
                                if (eeee) {
                                    console.log(eeee);
                                    autos.queryMajorProducer({start:o.start+1});
                                    return;
                                }
                                console.log(user.id+'的帐号密码有问题');
                                autos.queryMajorProducer({start:o.start+1});
                                return;
                            }
                        );

                        return;


                    }
                    //console.log('2');
                    //console.log(r);

                    if (r != user.majorCount) {
                        request(config.queryUrl+'/?name=major&opt=put&data={"studentId":' + user.id + ',"password":"' + user.password + '"}', function (eee, rrr) {

                                if(eee){
                                    autos.queryMajorProducer({start:o.start+1});
                                    console.log(eee);
                                    return;
                                }
                                console.log(user.id+'已加入课表队列');
                                autos.queryMajorProducer({start:o.start+1});
                                return;
                            }
                        );

                        return;

                    } else {
                        console.log(user.id+'的课表貌似没有变化');
                        autos.queryMajorProducer({start:o.start+1});
                        return;
                    }
                    //cb(null);
                    return;

                });
                return;


            }else{
                console.log('已走完一遍');

            }
        });

};

//添加到图书信息队列生产者
autos.queryBookProducer = function(o){
    console.log(o);
    conn.query(
        {
            sql:"select `id`,`password`,`version` from scu_library where error=0 limit "+ o.start+",1"
        },function(eee,rrr) {
//console.log(rrr);
            if (eee) {
                autos.queryBookProducer({start:o.start+1});
                console.log(eee);
                return;
            }
            if (rrr.length > 0) {
                var user = rrr[0];
                user.order = o.start;
                //console.log(user);
                libs.getBookId({
                    studentId: user.id,
                    password: user.password
                }, function (e, r) {
                    if (e) {
                        //todo 更新数据库的error字段
                        conn.query({
                                sql: "update `scu_library` set error=1 where id='" + user.id+"'"
                            }, function (eeee, rrrr) {
                                if (eeee) {
                                    console.log(eeee);
                                    autos.queryBookProducer({start:o.start+1});
                                    return;
                                }
                                console.log(user.id+'的帐号密码有问题');
                                autos.queryBookProducer({start:o.start+1});
                                return;
                            }
                        );

                        return;


                    }
                    //console.log('2');
                    //console.log(r);
                    
                    if(r.length==0){

                        console.log('没有借书');
                        conn.query(
                            {
                                sql:"select id from scu_book where version = "+user.version
                            },function(err,rows) {

                                if (err) {
                                    autos.queryBookProducer({start: o.start + 1});
                                    console.log(err);
                                    return;
                                }
                                
                                if(rows.length == 0){
                                    console.log('没有变化');
                                    autos.queryBookProducer({start: o.start + 1});
                                    return;
                                }
                                request(config.queryUrl+'/?name=book&opt=put&data={"studentId":' + user.id + ',"password":"' + user.password + '"}', function (eee, rrr) {

                                        if (eee) {
                                            autos.queryBookProducer({start: o.start + 1});
                                            console.log(eee);
                                            return;
                                        }
                                        console.log(user.id + '已加入图书队列');
                                        autos.queryBookProducer({start: o.start + 1});
                                        return;
                                    }
                                );


                            });

                        return;
                    }
//console.log("select id from scu_book where barcode in ("+ r.join(',')+") and version = "+user.version);
                    
                    conn.query(
                        {
                            sql:"select id from scu_book where barcode in ("+ r.join(',')+") and version = "+user.version
                        },function(err,rows) {

                            if(err){
                                autos.queryBookProducer({start: o.start + 1});
                                console.log(err);
                                return;
                            }

                            //todo 不能只根据这个来做是否更新的判断，还需要有每一个书的续借时间的变化

                            if (r.length != rows.length) {
                                request(config.queryUrl+'/?name=book&opt=put&data={"studentId":"' + user.id + '","password":"' + user.password + '"}', function (eee, rrr) {

                                        if (eee) {
                                            autos.queryBookProducer({start: o.start + 1});
                                            console.log(eee);
                                            return;
                                        }
                                        console.log(user.id + '已加入图书队列');
                                        autos.queryBookProducer({start: o.start + 1});
                                        return;
                                    }
                                );

                                return;

                            } else {


                                request(config.queryUrl+'/?name=book&opt=put&data={"studentId":"' + user.id + '","password":"' + user.password + '"}', function (eee, rrr) {
                                        if (eee) {
                                            autos.queryBookProducer({start: o.start + 1});
                                            console.log(eee);
                                            return;
                                        }
                                        console.log(user.id + '的图书貌似没有变化，然而也加入了队列');

                                        autos.queryBookProducer({start: o.start + 1});
                                        return;
                                    }
                                );
                                autos.queryBookProducer({start: o.start + 1});
                                return;
                            }
                            //cb(null);
                            return;
                        });

                });
                return;


            }else{
                console.log('已走完一遍');

            }
        });

};


//添加到考表队列生产者
autos.queryExamProducer = function(o){
    console.log(o);
    conn.query(
        {
            sql:"select `id`,`password`,`examVersion`,`examCount` from scu_user  where error=0 limit "+ o.start+",1"
        },function(eee,rrr) {
            if (eee) {
                autos.queryExamProducer({start:o.start+1});
                console.log(eee);
                return;
            }


            //console.log(rrr);//return;
            if (rrr.length > 0) {
                var user = rrr[0];
                user.order = o.start;
                        request(config.queryUrl+'/?name=exam&opt=put&data={"studentId":' + user.id + ',"password":"' + user.password + '"}', function (eee, rrr) {
                                if(eee){
                                    autos.queryExamProducer({start:o.start+1});
                                    console.log(eee);
                                    return;
                                }
                                console.log(user.id+'已加入考表队列');
                                autos.queryExamProducer({start:o.start+1});
                                return;
                            }
                        );

                        return;


            }else{
                console.log('已走完一遍');

            }
        });

};

//autos.queryExamProducer(
//    {
//        start: 0
//    }
//);

autos.queryMajorProducer(
    {start: 0});
//
//autos.queryScoreProducer({
//    start: 10655
//});



autos.queryBookProducer(
    {
        start: 0
    }
);
setInterval(function() {

    autos.queryBookProducer(
        {
            start: 0
        }
    );

    autos.queryMajorProducer(
        {start: 0});

},24*3600*1000);

module.exports = autos;
