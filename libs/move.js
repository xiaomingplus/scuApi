var move={
    'name':"迁移数据"
};
var conn = require('../mysql.js');
//var conn2 = require('../mysql2.js');
move.user = function(){
conn.query(
    {
        sql:"select * from si_user"
    },function(e,r){
        if(e){
            console.log(e);
            return;
        }
        var value=[];
        for(var i=0;i< r.length;i++){
            if(r[i].student_id && r[i].student_password) {
                
                if(r[i].student_id<3014161442029) {
                    // console.log(r[i].student_id);

                    if(r[i].student_id<3014161442029) {

                        value.push('(' + r[i].student_id + ',"' + r[i].student_password + '")');
                    }
                }
            }
        }
       //// console.log(value);return;
        var sql ="insert into `scu_user` (`id`,`password`) VALUES "+value.join(',');
        //console.log(sql);
        conn.query(
            {
                sql:sql
            },function(ee,rr){
                //console.log(ee,rr);
            }
        )
    }
)

};

//move.user();

move.libUser = function(){
    conn.query(
        {
            sql:"select * from si_user"
        },function(e,r){
            if(e){
                console.log(e);
                return;
            }
            var value=[];
            for(var i=0;i< r.length;i++){
                if(r[i].library_id && r[i].library_password) {
                    value.push('("' + r[i].library_id + '","' + r[i].library_password + '")');
                }
            }
            // console.log(value);return;
            var sql ="insert into `scu_library` (`id`,`password`) VALUES "+value.join(',');
            //console.log(sql);
            conn.query(
                {
                    sql:sql
                },function(ee,rr){
                    //console.log(ee,rr);
                }
            )
        }
    )

};

//move.libUser();

module.exports = move;