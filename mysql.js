/**
 * mysql模块，只负责连接数据库，
 */
var client = require('easymysql');
//mysql conn
var config = require('./config.js');
var conn = null;
//
var db_conf = config.mysql;

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
