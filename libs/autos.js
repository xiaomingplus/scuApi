/**
 * 自动运行
 * 初始化
 */
var request = require('request');
var libs = require('./libs.js');
var conn = require('../mysql.js');
var config = require('../config.js');
var common=require('./common.js');
var aes128 = require('./aes128.js');
var autos={
name:"自动"
};

//删除无效user信息
autos.delete = function(o){
//console.log(o);
    conn.query(
        {
            sql:"select `id`,`scoreVersion`,`majorVersion`,`examVersion`,`extendVersion` from scu_user order by ai desc limit "+ o.start+",1 "
        },function(eee,rrr) {
//console.log(rrr);
            if (eee) {
                autos.delete({start:o.start+1});
                console.log(eee);
                return;
            }


            //console.log(rrr.length);return;
            if (rrr.length > 0) {
                var user = rrr[0];
                user.order = o.start;
                console.log(user);


                if(user.scoreVersion<2 && user.examVersion<2 && user.majorVersion<2 && user.extendVersion<2){
                    autos.delete(
                        {
                            start: o.start+1
                        }
                    );
                    return;
                }


                // if(user.scoreVersion>1){
                //
                //     console.log("delete from `scu_score` where studentId="+user.id+" and version<" + user.scoreVersion);
                //     conn.query({
                //             sql: "delete from `scu_score` where studentId="+user.id+" and version<" + user.scoreVersion
                //         }, function (eeee, rrrr) {
                //             console.log(eeee,rrrr);
                //         }
                //     );
                // }
                //
                //
                // if(user.majorVersion>1){
                //     console.log("delete from `scu_major` where studentId="+user.id+" and version<" + user.majorVersion);
                //
                //     conn.query({
                //             sql: "delete from `scu_major` where studentId="+user.id+" and version<" + user.majorVersion
                //         }, function (eeee, rrrr) {
                //             console.log(eeee,rrrr);
                //         }
                //     );
                // }


                if(user.examVersion>1){

                    console.log("delete from `scu_exam` where studentId="+user.id+" and version<" + user.examVersion);

                    conn.query({
                            sql: "delete from `scu_exam` where studentId="+user.id+" and version<" + user.examVersion
                        }, function (eeee, rrrr) {
                            console.log(eeee,rrrr);
                        }
                    );
                }



                // if(user.extendVersion>1){
                //
                //     console.log("delete from `scu_extend` where studentId="+user.id+" and version<" + user.extendVersion);
                //
                //
                //     conn.query({
                //             sql: "delete from `scu_extend` where studentId="+user.id+" and version<" + user.extendVersion
                //         }, function (eeee, rrrr) {
                //             console.log(eeee,rrrr);
                //         }
                //     );
                // }


                setTimeout(
                    function(){
                        autos.delete({start:o.start+1})
                    },1000
                );


                return;


            }else{
                console.log('已走完一遍');

            }
        });

};

//删除无效图书信息
autos.deleteBook = function(o) {
//console.log(o);
//    console.log("select `id`,`version` from scu_library where error=0 order by ai desc limit " + o.start + ",1 ");
    //return;
    conn.query(
        {
            sql: "select `id`,`version` from scu_library order by ai desc limit " + o.start + ",1 "
        }, function (eee, rrr) {
            if (eee) {
                autos.deleteBook({start: o.start + 1});
                console.log(eee);
                return;
            }

            //console.log(rrr.length);return;
            if (rrr.length > 0) {
                var user = rrr[0];
                user.order = o.start;
                console.log(user);

                if (user.version > 1) {

                    console.log("delete from `scu_book` where studentId='" + user.id + "' and version<" + user.version);
                    conn.query({
                            sql: "delete from `scu_book` where studentId='" + user.id + "' and version<" + user.version
                        }, function (eeee, rrrr) {
                            console.log(eeee, rrrr);

                            autos.deleteBook({
                                start: o.start+1
                            })

                        }
                    );
                }else{
                    //console.log('此人版本为0');
                    autos.deleteBook({
                        start: o.start+1
                    })
                }

            } else {

                console.log('已走完一遍');

            }
        }
    );
};


//添加到成绩队列生产者，根据scoreCount字段
autos.queryScoreProducer = function(o){
//console.log(o);
    conn.query(
        {
            sql:"select `id`,`password`,`scoreVersion`,`scoreCount` from scu_user where error=0 order by ai desc limit "+ o.start+",1 "
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
                //console.log(user);
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
                                //console.log(user.id+'的帐号密码有问题');
                                autos.queryScoreProducer({start:o.start+1});
                                return;
                            }
                        );

                        return;


                    }

                    if (r != user.scoreCount) {
                        request(config.queryUrl+'/?name=score&opt=put&data='+encodeURIComponent('{"studentId":' + user.id + ',"password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,user.password) + '","appId":"10000"}'), function (eee, rrr) {

                                if(eee){
                                    autos.queryScoreProducer({start:o.start+1});
                                    console.log(eee);
                                    return;
                                }
                                console.log(user.id+'已加入成绩队列'+new Date());
                                autos.queryScoreProducer({start:o.start+1});
                                return;
                            }
                        );

                        return;

                    } else {
                        //console.log(user.id+'的成绩貌似没有变化');
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

    //console.log('major',o);
    conn.query(
        {
            sql:"select `id`,`password`,`majorVersion`,`majorCount` from scu_user where error=0 order by ai  limit "+ o.start+",1"
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
                        request(config.queryUrl+'/?name=major&opt=put&data='+encodeURIComponent('{"studentId":' + user.id + ',"password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,user.password) + '"}'), function (eee, rrr) {

                                if(eee){
                                    autos.queryMajorProducer({start:o.start+1});
                                    console.log(eee);
                                    return;
                                }
                                console.log(user.id+'已加入课表队列'+new Date());
                                autos.queryMajorProducer({start:o.start+1});
                                return;
                            }
                        );

                        return;

                    } else {
                        //console.log(user.id+'的课表貌似没有变化');
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
    //console.log('book',o);
    console.log("select `id`,`password`,`version` from scu_library where error=0 order by ai limit "+ o.start+",1");
    conn.query(
        {
            sql:"select `id`,`password`,`version` from scu_library where error=0 order by ai limit "+ o.start+",1"
        },function(eee,rrr) {
console.log(JSON.stringify(rrr[0])+new Date());
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
                                //console.log(user.id+'的帐号密码有问题');
                                autos.queryBookProducer({start:o.start+1});
                                return;
                            }
                        );

                        return;


                    }
                    //console.log('2');
                    //console.log(r);

                    if(r.length==0){

                        //console.log('没有借书');

                        if(user.version==0){

                            request(config.queryUrl+'/?name=book&opt=put&data='+encodeURIComponent('{"studentId":"' + user.id + '","password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,user.password) + '"}'), function (eee, rrr) {

                                    if (eee) {
                                        autos.queryBookProducer({start: o.start + 1});
                                        console.log(eee);
                                        return;
                                    }
                                    console.log(user.id + '已加入首次图书队列'+new Date());
                                    autos.queryBookProducer({start: o.start + 1});
                                    return;
                                }
                            );
                            return;
                        }


                        conn.query(
                            {
                                sql:"select id from scu_book where studentId='"+user.id+"' and version = "+user.version
                            },function(err,rows) {

                                if (err) {
                                    autos.queryBookProducer({start: o.start + 1});
                                    console.log(err);
                                    return;
                                }


                                if(rows.length == 0){
                                    console.log(user.id+'没有变化为0');
                                    autos.queryBookProducer({start: o.start + 1});
                                    return;
                                }
                                request(config.queryUrl+'/?name=book&opt=put&data='+encodeURIComponent('{"studentId":"' + user.id + '","password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,user.password) + '"}'), function (eee, rrr) {

                                        if (eee) {
                                            autos.queryBookProducer({start: o.start + 1});
                                            console.log(eee);
                                            return;
                                        }
                                        console.log(user.id + '已加入图书队列'+new Date());
                                        autos.queryBookProducer({start: o.start + 1});
                                        return;
                                    }
                                );
                                return;


                            });

                        return;
                    }


                    var barcode=[];

                    for(var i=0;i< r.length;i++){
                        barcode[i]="'"+r[i].barcode+"'";
                    }
//console.log("select id from scu_book where barcode in ("+ r.join(',')+") and version = "+user.version);
//                    console.log("select * from scu_book where studentId='"+user.id+"' and barcode in ("+ barcode.join(',')+") and version = "+user.version);
                    conn.query(
                        {
                            sql:"select * from scu_book where studentId='"+user.id+"' and barcode in ("+ barcode.join(',')+") and version = "+user.version
                        },function(err,rows) {

                            if(err){
                                autos.queryBookProducer({start: o.start + 1});
                                console.log(err);
                                return;
                            }


                            if (r.length != rows.length) {




                                request(config.queryUrl+'/?name=book&opt=put&data='+encodeURIComponent('{"studentId":"' + user.id + '","password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,user.password) + '"}'), function (eee, rrr) {

                                        if (eee) {
                                            autos.queryBookProducer({start: o.start + 1});
                                            console.log(eee);

                                            return;
                                        }
                                        //console.log(user.id + '已加入图书队列');

                                        for(var i=0;i< rows.length;i++){
                                            if((rows[i].deadline-common.time()>0) && ((rows[i].deadline-common.time())<36*60*60) && (rows[i].deadline>common.time())){
                                                request(config.queryUrl+'/?name=renew&opt=put&data='+encodeURIComponent('{"studentId":"' + user.id + '","password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,user.password) + '","barcode":"'+ rows[i].barcode+'","borId":"'+ rows[i].borId+'","appId":"10000"}'), function (eee, rrr) {
                                                        if (eee) {
                                                            console.log(eee);
                                                            return;
                                                        }
                                                        //console.log('续借成功');
                                                        return;
                                                    }
                                                );


                                            }


                                        }
                                        autos.queryBookProducer({start: o.start + 1});

                                        return;
                                    }
                                );




                                return;

                            } else {

                                var flag=false;//图书是否有更新

                                var newBooks ={};
                                for(var i=0;i< r.length;i++){
                                    newBooks[r[i].barcode]=r[i].deadline
                                }

                                //console.log(newBooks);
                                //console.log(rows);


                                for(var i=0;i< rows.length;i++){

                                    if(rows[i].deadline!=newBooks[rows[i].barcode]){
                                        flag=true;
                                    }
                                }
//console.log(flag);
                                if(flag){
                                    request(config.queryUrl+'/?name=book&opt=put&data='+encodeURIComponent('{"studentId":"' + user.id + '","password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,user.password) + '"}'), function (eee, rrr) {
                                            if (eee) {
                                                autos.queryBookProducer({start: o.start + 1});
                                                console.log(eee);
                                                return;
                                            }

                                            console.log('插入图书队列');
                                            for(var i=0;i< rows.length;i++){
                                                if((rows[i].deadline-common.time()>0) && ((rows[i].deadline-common.time())<36*60*60) && (rows[i].deadline>common.time())){
                                                    request(config.queryUrl+'/?name=renew&opt=put&data='+encodeURIComponent('{"studentId":"' + user.id + '","password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,user.password) + '","barcode":"'+ rows[i].barcode+'","borId":"'+ rows[i].borId+'","appId":"10000"}'), function (eee, rrr) {
                                                            if (eee) {
                                                                console.log(eee);
                                                                return;
                                                            }
                                                            console.log('续借成功=---');
                                                            return;
                                                        }
                                                    );


                                                }


                                            }

                                            autos.queryBookProducer({start: o.start + 1});
                                            return;
                                        }
                                    );
                                }else{
                                    autos.queryBookProducer({start: o.start + 1});
                                    console.log(user.id + '的图书没有变化'+new Date());

                                }







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
    //console.log('exam',o);
    conn.query(
        {
            sql:"select `id`,`password`,`examVersion`,`examCount` from scu_user  where error=0 order by ai  limit "+ o.start+",1"
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
                        request(config.queryUrl+'/?name=exam&opt=put&data='+encodeURIComponent('{"studentId":' + user.id + ',"password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,user.password) + '"}'), function (eee, rrr) {
                                if(eee){
                                    autos.queryExamProducer({start:o.start+1});
                                    console.log(eee);
                                    return;
                                }
                                //console.log(user.id+'已加入考表队列');
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





setTimeout(function(){


    autos.queryBookProducer(
        {
            start: 0
        }
    );
    // autos.queryExamProducer(
    //    {
    //        start: 0
    //    }
    // );

    autos.queryMajorProducer(
        {
            start:0
        }
    );
    autos.queryScoreProducer(
        {
            start:0
        }
    );

    // autos.delete(
    //    {
    //        start:6706
    //    }
    // )



},3*1000);


setInterval(function() {

autos.queryBookProducer(
    {
        start: 0
    }
);
    autos.queryMajorProducer(
        {
            start:0
        }
    );
    autos.queryScoreProducer(
        {
            start:0
        }
    );
    // autos.queryExamProducer(
    //    {
    //        start: 0
    //    }
    // );


    },12*60*60*1000);


module.exports = autos;
