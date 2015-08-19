var conn = require("../mysql");


conn.query(
    {
        sql:"select * from scu_course where teacher = '胡万华'",
        params:{
            name:'张兵'
        }
    },function(e,r) {
        console.log(e, r);

    });