/**
 * mysql模块，只负责连接数据库，
 */
var client = require('easymysql');
//mysql conn
var conn = null;
//
//var db_conf = {
//    'host':'127.0.0.1',
//    'user':'root',
//    'password':'123456',
//    'database':'secret'
//};
var db_conf = {
    'host':'scuinfo.cojlxhdpe4yp.ap-northeast-1.rds.amazonaws.com',
    'user':'dsgygb',
    'password':'www.scuinfo.com',
    'database':'scuinfo'
};


var link = function(){

    if(conn==null){
        conn = client.create({
            'maxConnections':10
        });
        conn.addserver(db_conf);

    }else{

    }

   // console.log(conn);
    return conn;
};

module.exports = link();
