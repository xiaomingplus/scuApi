var check = {
    name:"检测"
};
var code = require('../code.js');
var conn = require('../mysql.js');
var aes128 = require('./aes128.js');
var libs = require('./libs.js');
var request = require('request');
var config= require('../config.js');
check.password = function(o,cb,debug){

    if(debug){
        var password = o.password;
    }else {
        var password = aes128.decode(o.appId, o.appSecret, "" + o.password + "");
        o.password=aes128.decode(o.appId, o.appSecret, "" + o.password + "");
    }
    //console.log(password);
    //console.log("select password,error,"+ o.field+"UpdateAt,"+ o.field+"Count,"+ o.field+"Version from scu_user where id="+ o.studentId);
  conn.query({
      sql:"select password,error,"+ o.field+"UpdateAt,"+ o.field+"Count,"+ o.field+"Version from scu_user where id="+ o.studentId
  },function(e,r){
// console.log(e,r);
      if(e){
          console.log(e);
         cb(code.mysqlError);
          return;
      }else{
          //console.log(r);
          if(r.length==0) {

              //cb(code.notFoundStudentId);
              //加入生产者
              libs.check(o, function (ee) {
                  if (ee) {
                      cb(ee);
                      return;
                  }
                  conn.query({
                      sql:"insert into scu_user (id,password) values (:id,:password)",
                      params:{
                          id: o.studentId,
                          password:password
                  }},function(e5){
                      if(e5){
                          cb(code.mysqlError);
                          return;
                      }


                  request(config.queryUrl+'/?name='+o.field+'&opt=put&data='+encodeURIComponent('{"studentId":' + o.studentId + ',"password":"' +aes128.encode(config.querySecret.appId,config.querySecret.appSecret,password) + '","appId":' + o.appId + '}'), function (eee, rrr) {

                          if (eee) {
                              cb(code.requestError);
                              console.log(eee);
                              return;
                          }
                          cb(code.scorePasswordUpdateQuerySuccess);
                          return;
                      }
                  );

                  });
                  return;
              })
          }else{
              if(r[0].error==1){
                  //o.timeout=3000;
                  libs.check(o, function (ee) {
                      if (ee) {
                          cb(ee);
                          return;
                      }

                      conn.query({
                          sql: "update scu_user set password =:password,error=0 where id = :id",
                          params: {
                              id: o.studentId,
                              password: password
                          }
                      }, function (e5) {
                          if (e5) {
                              cb(code.mysqlError);
                              return;
                          }

                          request(config.queryUrl+'/?name=' + o.field + '&opt=put&data='+encodeURIComponent('{"studentId":' + o.studentId + ',"password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,password) + '","appId":' + o.appId + '}'), function (eee, rrr) {

                                  if (eee) {
                                      cb(code.requestError);
                                      console.log(eee);
                                      return;
                                  }
                                  cb(code.scorePasswordUpdateQuerySuccess);
                                  return;
                              }
                          );


                      });
                      return;
                  });
              }else{




               if(password==r[0].password){

                   //成功
                   cb(null,{
                       password: password,
                       examCount:r[0].examCount,
                       examUpdateAt:r[0].examUpdateAt,
                       examVersion:r[0].examVersion,
                       scoreCount:r[0].scoreCount,
                       majorCount:r[0].majorCount,
                       scoreUpdateAt:r[0].scoreUpdateAt,
                       majorUpdateAt:r[0].majorUpdateAt,
                       scoreVersion:r[0].scoreVersion,
                       majorVersion:r[0].majorVersion

                   });



               }else{
                   cb(code.passwordError);
               }




              }
          }
      }
  })
};
check.student = function(o,cb){

  if(!o.studentId){
      cb(code.lackParamsStudentId);
      return;
  }

    if(!o.password){
        cb(code.lackParamsPassword);
        return;
    }
    check.password(o,function(e,r){
        cb(e,r);
    }, o.debug)


};
check.libraryPassword = function(o,cb,debug){
    if(debug){
        var password = o.password;
    }else {
        var password = aes128.decode(o.appId, o.appSecret, "" + o.password + "");
        o.password=aes128.decode(o.appId, o.appSecret, "" + o.password + "");
    }
    conn.query({
        sql:"select password,error,updateAt,count,version from scu_library where id="+ o.studentId
    },function(e,r){

        if(e){
            console.log(e);
            cb(code.mysqlError);
            return;
        }else{
            if(r.length==0) {
                //cb(code.notFoundStudentId);
                //加入生产者
                libs.checkLib(o, function (ee) {
                    if (ee) {
                        cb(ee);
                        return;
                    }
                    conn.query({
                        sql:"insert into scu_library (id,password) values (:id,:password)",
                        params:{
                            id: o.studentId,
                            password:password
                        }},function(e5){
                        if(e5){
                            cb(code.mysqlError);
                            return;
                        }


                        request(config.queryUrl+'/?name=book&opt=put&data='+encodeURIComponent('{"studentId":' + o.studentId + ',"password":"' +aes128.encode(config.querySecret.appId,config.querySecret.appSecret,password) + '","appId":"'+ o.appId? o.appId:0+'"}'), function (eee, rrr) {

                                if (eee) {
                                    cb(code.requestError);
                                    console.log(eee);
                                    return;
                                }
                                cb(code.libraryInitQuerySuccess);
                                return;
                            }
                        );

                    });
                    return;
                })
            }else{
                if(r[0].error==1){
                    o.timeout=10000;

                    libs.checkLib(o, function (ee) {
                        if (ee) {
                            cb(ee);
                            return;
                        }

                        conn.query({
                            sql: "update scu_library set password =:password,error=0 where id = :id",
                            params: {
                                id: o.studentId,
                                password: password
                            }
                        }, function (e5) {
                            if (e5) {
                                cb(code.mysqlError);
                                return;
                            }

                            request(config.queryUrl+'/?name=book&opt=put&data='+encodeURIComponent('{"studentId":' + o.studentId + ',"password":"' + aes128.encode(config.querySecret.appId,config.querySecret.appSecret,password) + '","appId":"' + o.appId? o.appId:0+ '"}'), function (eee, rrr) {

                                    if (eee) {
                                        cb(code.requestError);
                                        console.log(eee);
                                        return;
                                    }
                                    cb(code.libraryUpdatePasswordQuerySuccess);
                                    return;
                                }
                            );


                        });
                        return;
                    });
                }else{


                    if(password==r[0].password){

                        //成功
                        cb(null,{
                            count:r[0].count,
                            updateAt:r[0].updateAt,
                            version:r[0].version,
                            password:password
                        });



                    }else{
                        cb(code.passwordError);
                    }




                }
            }
        }
    })


};

check.library = function (o,cb){

    if(!o.studentId){
        cb(code.lackParamsStudentId);
        return;
    }

    if(!o.password){
        cb(code.lackParamsPassword);
        return;
    }
    check.libraryPassword(o,function(e,r){
        cb(e,r);
    }, o.debug)

};
check.renewPassword = function(o,cb,debug){

    if(debug){
        var password = o.password;
    }else {
        var password = aes128.decode(o.appId, o.appSecret, "" + o.password + "");
        o.password=aes128.decode(o.appId, o.appSecret, "" + o.password + "");
    }
    conn.query({
        sql:"select password,error,updateAt,count,version from scu_library where id="+ o.studentId
    },function(e,r){

        if(e){
            console.log(e);
            cb(code.mysqlError);
            return;
        }else{
            if(r.length==0) {
                //cb(code.notFoundStudentId);
                //加入生产者
                libs.checkLib(o, function (ee) {
                    if (ee) {
                        cb(ee);
                        return;
                    }
                    conn.query({
                        sql:"insert into scu_library (id,password) values (:id,:password)",
                        params:{
                            id: o.studentId,
                            password:password
                        }},function(e5){
                        if(e5){
                            cb(code.mysqlError);
                            return;
                        }

                        cb(null,{
                            password:password
                        })



                    });
                    return;
                })
            }else{
                if(r[0].error==1){
                    o.timeout = 3000;
                    libs.checkLib(o, function (ee) {
                        if (ee) {
                            cb(ee);
                            return;
                        }

                        conn.query({
                            sql: "update scu_library set password =:password,error=0 where id = :id",
                            params: {
                                id: o.studentId,
                                password: password
                            }
                        }, function (e5) {
                            if (e5) {
                                cb(code.mysqlError);
                                return;
                            }

                            cb(null);



                        });
                        return;
                    });
                }else{


                    if(password==r[0].password){

                        //成功
                        cb(null,{
                            password: password

                        });



                    }else{
                        cb(code.passwordError);
                    }




                }
            }
        }
    })


};


check.renew = function (o,cb){
//console.log(o);
    if(!o.studentId){
        cb(code.lackParamsStudentId);
        return;
    }

    if(!o.password){
        cb(code.lackParamsPassword);
        return;
    }


    if(!o.bookId){
        cb(code.lackParamsBookId);
        return;
    }
    if(!o.borrowId){
        cb(code.lackParamsBorrowId);
        return;
    }



    check.renewPassword(o,function(e,r){
        cb(e,r);
    }, o.debug)

};
module.exports = check;
