var conn = require('../mysql.js');
var common = require('./common.js');
var code = require('../code.js');
var dbs = {
    name:"读取数据库业务"
};

/**
 * 读取appInfo
 * @param cb
 */
dbs.getAppInfo = function(cb){
    var sql = 'SELECT id,callback,appkey from scu_app_info';
    conn.query(
        {
            sql:sql
        },function(e,r){
            if(e){
                console.log(e);
                cb(e);
                return;
            }
                cb(null,r);
                return;


        }
    )
};

/**
 * 获取开学第一天
 * @param cb
 */
dbs.getFirstDay = function(cb){
    var sql = 'SELECT date,termId from scu_first_day_school';
    conn.query(
        {
            sql:sql
        },function(e,r){
            if(e){
                console.log(e);
                cb(e);
                return;
            }
            cb(null,r);
            return;


        }
    )
};

/**
 * 获取当前学院,校区,课程属性,老师，课程的版本号
 * @param cb
 */
dbs.getVersion = function(cb){
    conn.query(
        {
            sql:"select `typeVersion`,`typeLatestVersion`,`termVersion`,`termLatestVersion`,`accountVersion`,`campusVersion`,`propertyVersion`,`collegeVersion`,`courseVersion`,`teacherVersion`,`accountLatestVersion`,`campusLatestVersion`,`propertyLatestVersion`,`collegeLatestVersion`,`courseLatestVersion`,`teacherLatestVersion` from scu_version where id=1"
        },function(err,rows){
            //console.log(err,rows);
            if(err){
                console.log(err);
                cb(err);
                return;
            }
            //console.log(rows[0]);
            cb(null,{
                    termLatestVersion:rows[0].termLatestVersion,
                    collegeLatestVersion:rows[0].collegeLatestVersion,
                    courseLatestVersion:rows[0].courseLatestVersion,
                    teacherLatestVersion:rows[0].teacherLatestVersion,
                    campusLatestVersion:rows[0].campusLatestVersion,
                    propertyLatestVersion:rows[0].propertyLatestVersion,
                    accountLatestVersion:rows[0].accountLatestVersion,
                    typeLatestVersion:rows[0].typeLatestVersion,
                    typeVersion:rows[0].typeVersion,
                    collegeVersion:rows[0].collegeVersion,
                    courseVersion:rows[0].courseVersion,
                    teacherVersion:rows[0].teacherVersion,
                    campusVersion:rows[0].campusVersion,
                    propertyVersion:rows[0].propertyVersion,
                    accountVersion:rows[0].accountVersion,
                    termVersion:rows[0].termVersion,
                }
            );
        }
    )
};

/**
 * 获取某个版本的校区信息
 * @param v
 * @param cb
 */
dbs.getCampus = function(o,cb){
    conn.query(
        {
            sql: 'select `campusId`,`name` from scu_campus where version=' + o.version
        }, function (e, r) {
            if (e) {
                cb(e);
                return;
            }
            cb(null,r)
        }
    )
};

/**
 * 获取某个版本的学期信息
 * @param o
 * @param cb
 */
dbs.getTerm = function(o,cb){
    conn.query(
        {
            sql: 'select `termId`,`name`,`current` from scu_term where version=' + o.version
        }, function (e, r) {
            if (e) {
                cb(e);
                return;
            }
            cb(null,r)
        }
    )
};


/**
 * 获取某个版本的课程类别信息
 * @param o
 * @param cb
 */
dbs.getType = function(o,cb){
   // console.log(o);
    conn.query(
        {
            sql: 'select `typeId`,`name` from scu_type where version=' + o.version
        }, function (e, r) {
            if (e) {
                cb(e);
                return;
            }
           // console.log(r);
            cb(null,r)
        }
    )
};

/**
 * 获取某个版本的课程属性信息
 * @param v
 * @param cb
 */
dbs.getProperty = function(o,cb){
    conn.query(
        {
            sql: 'select `propertyId`,`name` from scu_property where version=' + o.version
        }, function (e, r) {
            if (e) {
                cb(e);
                return;
            }
            // console.log(r);
            cb(null,r)
        }
    )

};


/**
 * 获取某个版本的学院信息
 * @param v
 * @param cb
 */

dbs.getCollege = function(o,cb){
    conn.query(
        {
            sql: 'select `collegeId`,`name` from scu_college where version=' + o.version
        }, function (e, r) {
            if (e) {
                cb(e);
                return;
            }
            cb(null,r)
        }
    )
};

/**
 * 获取某个版本的学号信息
 * @param v
 * @param cb
 */

dbs.getAccount = function(o,cb){

        conn.query(
            {
                sql: 'select `studentId`,`password` from scu_account where version=' + o.version
            }, function (e, r) {
                if (e) {
                    cb(e);
                    return;
                }

                cb(null, {
                    studentId: r[0].studentId,
                    password: r[0].password
                })
            }
        )

};

/**
 *
 * @param o
 * @param cb
 */
dbs.updateVersion = function(o,cb){
    conn.query({
        sql:'update `scu_version` set '+ o.field+' = '+ o.field+'+1,'+ o.fieldName+'UpdateAt='+common.time()+' where id=1'
    },function(e,r){
        if(e){
            console.log(e);
            cb(code.mysqlError);
            return;
        }
        if(r.affectedRows > 0){
            cb(null);
            return;
        }
        cb(code.updateNotChanged);
    });
};

module.exports = dbs;