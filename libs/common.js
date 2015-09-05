/**
 * Created by GuobaoYang on 15/4/7.
 */
var common = {
    name:"js公共函数库"
};
/**
 * 当天0点的时间戳
 * @returns {Number}
 */
common.todayStartTimestamp =function(){
    return parseInt(new Date(new Date().toLocaleDateString()).getTime()/1000);
};


/**
 * 东八区的0点时间戳
 * @returns {Number}
 */

common.todayBeijingStartTimestamp =function(){
    return parseInt(new Date(new Date(new Date().getTime()+8*60*60*1000).toLocaleDateString()).getTime()/1000);
};
//当前时间戳 10位
common.time = function () {
    return parseInt(new Date().getTime()/1000);
};

common.date = function (time) {
    if(time){
        return new Date(time).getFullYear().toString()+"-"+(new Date(time).getMonth()+1).toString()+"-"+new Date(time).getDate(time).toString()+" "+new Date(time).getHours().toString()+":"+new Date(time).getMinutes().toString()

    }
    return new Date().getFullYear().toString()+"-"+(new Date().getMonth()+1).toString()+"-"+new Date().getDate().toString()+" "+new Date().getHours().toString()+":"+new Date().getMinutes().toString()
};

common.currentWeek = function(firstDayTimestamp){
    // ((parseInt(common.todayStartTimestamp()-datas.firstDay[datas.currentTerm.termId])/3600/24/7)+1);


    if((common.todayBeijingStartTimestamp())-firstDayTimestamp<0){
        return (parseInt(((common.todayBeijingStartTimestamp())-firstDayTimestamp)/3600/24/7)-1);
    }else{
        return (parseInt(((common.todayBeijingStartTimestamp())-firstDayTimestamp)/3600/24/7)+1);
    }

};
/**
 * 输出格式化的json
 * @param code
 * @param message
 * @param data
 * @returns Json
 */

common.format = function (code, message, data) {
    var o = {};
    o.code = code;
    if (message) {
        o.message = message;
    }
    if (data) {
        o.data = data;
    }
    return JSON.stringify(o);
};

common.objectLength = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

common.mysqlEscape = function  (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
};
module.exports = common;