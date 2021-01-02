var db=require('./dbs.js');

var datas={
    app:{},
    version:{

    },
    status:{
        //各部门初始化载入状态
        status:false,
        accountStatus:false,
        versionStatus:false,
        campusStatus:false,
        propertyStatus:false,
        collegeStatus:false,
        termStatus:false,
        typeStatus:false,
        appStatus:false,
        firstDayStatus:false
    },
    update:{
        //各部门是否有更新
        accountUpdate:false,
        campusUpdate:false,
        propertyUpdate:false,
        collegeUpdate:false,
        termUpdate:false,
        typeUpdate:false,
        firstDayStatus:false
    },
    account:{
        studentId:"2015141011021",
        password:"136641"
    },
    campus:{

    },
    campusById:{

    },
    college:{

    },
    collegeById:{

    },
    property:{

    },
    propertyById:{

    },
    term:{

    },
    termById:{

    },
    firstDay:{

    },
    currentTerm:{

    },
    type:{

    },
    typeById:{

    }
};



datas.loadApp = function(){

    db.getAppInfo(function(e,r){
        if(e){
            console.log(e);return;
        }

        if(r.length>0){
            for(var i=0;i< r.length;i++){
                datas.app[r[i].id]={
                    callback:r[i].callback,
                    appSecret:r[i].appkey
                }
            }
            console.log(datas.app);
            datas.status.appStatus=true;
        }else{
            console.log('no App ');
        }
    })

};

datas.loadFirstDay = function(){

    db.getFirstDay(function(e,r){
        if(e){
            console.log(e);return;
        }

        if(r.length>0){
            for(var i=0;i< r.length;i++){
                datas.firstDay[r[i].termId]=r[i].date;
            }
            datas.status.firstDayStatus=true;
            console.log('first day load');
        }else{
            console.log('no first date data ');
        }
    })

};

datas.updateAccountVersion = function(){
    datas.version.accountVersion=true;
};

/**
 * 载入版本信息
 */
datas.loadVersion = function(cb){
    db.getVersion(function(e,r){
        if(e){
            cb(e);
            return;
        }
        datas.version.collegeVersion = r.collegeVersion;
        datas.version.courseVersion = r.courseVersion;
        datas.version.teacherVersion = r.teacherVersion;
        datas.version.campusVersion = r.campusVersion;
        datas.version.propertyVersion = r.propertyVersion;
        datas.version.accountVersion = r.accountVersion;
        datas.version.termVersion = r.termVersion;
        datas.version.typeVersion = r.typeVersion;
        datas.version.collegeLatestVersion = r.collegeLatestVersion;
        datas.version.courseLatestVersion = r.courseLatestVersion;
        datas.version.teacherLatestVersion = r.teacherLatestVersion;
        datas.version.campusLatestVersion = r.campusLatestVersion;
        datas.version.propertyLatestVersion = r.propertyLatestVersion;
        datas.version.accountLatestVersion = r.accountLatestVersion;
        datas.version.termLatestVersion = r.termLatestVersion;
        datas.version.typeLatestVersion = r.typeLatestVersion;

        datas.status.versionStatus = true;
        console.log('version信息载入完成');
        cb(null);
        //console.log(datas);
    });
};

/**
 * 载入抓取帐号信息
 */
datas.loadAccount = function(){
  if(datas.status.versionStatus){
      db.getAccount({version:datas.version.accountVersion},function(e,r){
         if(e){
             return;
         }
          datas.account = r;
          datas.status.accountStatus = true;
          datas.update.accountUpdate = false;
          console.log('账户信息已载入');
      });
  }
};

/**
 * 载入校区信息
 */
datas.loadCampus = function(){
  if(datas.status.versionStatus){
      db.getCampus({version:datas.version.campusVersion},function(e,r){
          if(e){
              return;
          }

          for(var i=0;i< r.length;i++) {
              datas.campus[r[i].name]= r[i];
          }
          for(var i=0;i< r.length;i++){
              datas.campusById[r[i].campusId]=r[i];
          }
          //console.log(datas.campus);

          datas.version.campusVersion = r.version;
          datas.status.campusStatus = true;
          datas.update.campusUpdate = false;
          console.log('校区信息已载入');
      });
     return;
  }
    console.log('版本信息还未载入,正在等待版本信息载入');
};



/**
 * 载入学院信息
 */
datas.loadCollege = function(){
    if(datas.status.versionStatus) {
        db.getCollege({version:datas.version.collegeVersion},function (e, r) {
            if (e) {
                console.log(e);
                return;
            }
            for(var i=0;i< r.length;i++) {
                datas.college[r[i].name]= r[i];
            }
            for(var i=0;i< r.length;i++){
               datas.collegeById[r[i].collegeId]=r[i];
            }
            //console.log(datas.college);
            datas.version.collegeVersion = r.version;
            datas.status.collegeStatus = true;
            datas.update.collegeUpdate = false;
            console.log('学院信息已载入');

        });

    }
};




/**
 * 载入属性信息
 */
datas.loadProperty = function(){
    if(datas.status.versionStatus){
        db.getProperty({version:datas.version.propertyVersion},function(e,r){
           if(e){
               return;
           }
            for(var i=0;i< r.length;i++) {
                datas.property[r[i].name]= r[i];
            }
            for(var i=0;i< r.length;i++){
                datas.propertyById[r[i].propertyId]=r[i];
            }
            //console.log(datas.property);
            datas.version.propertyVersion = r.version;
            datas.status.propertyStatus = true;
            datas.update.propertyUpdate = false;
            console.log('课程属性信息已载入');
        });
    }
};


/**
 * 载入学期信息
 */
datas.loadTerm = function(){
    if(datas.status.versionStatus){
        db.getTerm({version:datas.version.termVersion},function(e,r){

            if(e){
                console.log(e);
                return;
            }
            for(var i=0;i< r.length;i++) {
                datas.term[r[i].name]= r[i];

                if(r[i].current==1){
                    datas.currentTerm={
                      'termId':r[i].termId,
                        'name':r[i].name
                    };
                }
            }
            for(var i=0;i< r.length;i++){
                datas.termById[r[i].termId]=r[i];
            }
            datas.version.termVersion = r.version;
            datas.status.termStatus = true;
            datas.update.termUpdate = false;
            //console.log(datas);
            console.log('学期信息已载入');
        });
    }
};

/**
 * 载入课程类别信息
 */
datas.loadType = function(){
    if(datas.status.versionStatus){
        db.getType({version:datas.version.typeVersion},function(e,r){

            if(e){
                console.log(e);
                return;
            }
            //console.log(r);
            for(var i=0;i< r.length;i++) {
                datas.type[r[i].name]= r[i];
            }
            for(var i=0;i< r.length;i++){
                datas.typeById[r[i].typeId]=r[i];
            }
            datas.version.typeVersion = r.version;
            datas.status.typeStatus = true;
            datas.update.typeUpdate = false;
            console.log('课程类别信息已载入');
        });
    }
};

/**
 * 查看该载入的是否已载入
 */
datas.load = function(){
if(!datas.status.status){
    if(!datas.status.versionStatus){
        datas.loadVersion(function(e){
            if(e){
                console.log(e);
                return;
            }


            if(!datas.status.accountStatus){
                datas.loadAccount();
            }

            if(!datas.status.campusStatus){
                datas.loadCampus();
            }

            if(!datas.status.collegeStatus){
                datas.loadCollege();
            }

            if(!datas.status.propertyStatus){
                datas.loadProperty();
            }

            if(!datas.status.termStatus){
                datas.loadTerm();
            }


            if(!datas.status.typeStatus){
                datas.loadType();
            }
            if(!datas.status.appStatus){
                datas.loadApp();
            }

            if(!datas.status.firstDayStatus){
                datas.loadFirstDay();
            }

        });

    }else{


        if(!datas.status.accountStatus){
            datas.loadAccount();
        }

        if(!datas.status.campusStatus){
            datas.loadCampus();
        }

        if(!datas.status.collegeStatus){
            datas.loadCollege();
        }

        if(!datas.status.propertyStatus){
            datas.loadProperty();
        }

        if(!datas.status.termStatus){
            datas.loadTerm();
        }


        if(!datas.status.typeStatus){
            datas.loadType();
        }

        if(!datas.status.appStatus){
            datas.loadApp();
        }


        if(!datas.status.firstDayStatus){
            datas.loadFirstDay();
        }

        if(datas.status.firstDayStatus && datas.status.appStatus && datas.status.campusStatus && datas.status.collegeStatus && datas.status.propertyStatus && datas.status.accountStatus && datas.status.termStatus && datas.status.typeStatus){
            datas.status.status = true;

            //console.log(datas);
        }

    }
    return;
}
    if(!datas.update.accountUpdate){
        datas.loadAccount();
    }

    if(datas.update.campusUpdate){
        datas.loadCampus();
    }

    if(datas.update.collegeUpdate){
        datas.loadCollege();
    }

    if(datas.update.propertyUpdate){
        datas.loadProperty();
    }
    if(!datas.update.termUpdate){
        datas.loadTerm();
    }
    if(!datas.update.typeUpdate){
        datas.loadType();
    }


};

datas.getStatus = function(){
  return datas.status['versionStatus'];
};

datas.getAccount = function(){
    return datas.account;
};



module.exports = datas;
