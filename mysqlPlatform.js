var client = require('easymysql');
//mysql conn
var conn = null;
/*
var db_conf = {
	'host':'203.195.164.179',
	'user':'fydev',
	'password':'fyscuhdushjdysh$%#&&&hdgyyty',
	'database':'fyscu_platform'
};

*/
var db_conf = {
	'host':'203.195.164.179',
	'user':'platform',
	'password':'1f0720a757e5c5b936f3ac46eabe250f',
	'database':'fyscu_platform'
};
exports.link = function(){
	if(conn==null){
		conn = client.create({
			'maxconnections':10
		});
		conn.addserver(db_conf);
		
	}else{
		
	}
	return conn;
};
