var cheerio = require('cheerio');
var datas = require('./datas.js');
var config = require('../config.js');
var common = require('./common.js');
var code = require('../code.js');
var pages = {
    name:"页面处理"
};

pages.teacherList = function(html,cb){
    var list =[];
    var $ = cheerio.load(html);
    var trs = $(html).find("table.titleTop2 table#user tbody tr");
    var item =null;
    var teacherIdTd;

    console.log(trs);

    trs.each(function(i,v){
    teacherIdTd=$($(v).find('td')[4]).find("img").attr('onclick');
        item = {
            id:teacherIdTd.substring(teacherIdTd.indexOf('xjsh=')+5,teacherIdTd.indexOf('&xjsm')),
            name: common.mysqlEscape($($(v).find('td')[1]).text().trim()),
            collegeId:datas.college[$($(v).find('td')[2]).text().trim()].collegeId,
            college: $($(v).find('td')[2]).text().trim(),
            level: $($(v).find('td')[3]).text().trim()
        };
        list.push(item);
    });
    cb(null,{code:0,data:list});
};


pages.courseList = function(html,key){
    var list =[];
    var $ = cheerio.load(html);
    var trs = $(html).find("table.titleTop2 table#user tbody tr");
    var item =null;
    if(!key){
        key=0;
    }
    trs.each(function(i,v){
        if(i>key) {
            var college=$($(v).find('td')[3]).text().trim();
            var collegeId;
            if(college){

                collegeId=datas.college[$($(v).find('td')[3]).text().trim()].collegeId;

            }else{
                collegeId=0;
            }

            item = {
                key:i,
                courseId:$($(v).find('td')[1]).text().trim(),
                type: $($(v).find('td')[4]).text().trim(),
                name: common.mysqlEscape($($(v).find('td')[2]).text().trim()),
                college: college,
                collegeId: collegeId
            };
            list.push(item);
        }
    });
    return list;
    //cb(null,{code:0,data:list});
};

pages.courseInfo = function(html,key){
   // console.log(html);
    var $ = cheerio.load(html);
    var list =[];
    var trs = $(html).find("tr.odd");
    var item =null;
    var teacher,weekHasLessonStr,weekHasLessonStart,weekHasLessonEnd,lessonStr,lessonStart,lessonEnd,limitStr,limit;
    trs.each(function(i,v){
      //  console.log(v);

        if(i>key) {
            var weekHasLesson = [];
            teacher = $($(v).find('td')[6]).text().trim().split(' ');
            for (var i = 0; i < teacher.length; i++) {
                teacher[i] = teacher[i].replace("*", "");
            }
            weekHasLessonStr = $($(v).find('td')[7]).text().trim();
            //console.log(weekHasLessonStr);
            if (!weekHasLessonStr) {
                weekHasLesson = [];
            } else {
                if (weekHasLessonStr == '单周') {
                    for (var i = 1; i < 18; i += 2) {
                        weekHasLesson.push(i);
                    }

                } else if (weekHasLessonStr == '双周') {
                    for (var i = 2; i < 18; i += 2) {
                        weekHasLesson.push(i);
                    }
                } else {
                    weekHasLessonStart = parseInt(weekHasLessonStr.substring(0, weekHasLessonStr.indexOf("-")));
                    weekHasLessonEnd = parseInt(weekHasLessonStr.substring(weekHasLessonStr.indexOf("-") + 1, weekHasLessonStr.indexOf("周")));

                    // console.log(weekHasLessonStart);console.log(weekHasLessonEnd);
                    for (var i = weekHasLessonStart; i <= weekHasLessonEnd; i++) {
                        weekHasLesson.push(parseInt(i));
                    }
                    //console.log(weekHasLesson);
                }
            }
            lessonStr = $($(v).find('td')[9]).text().trim();
            var lesson = [];
            if (!lessonStr) {
                lesson = [];
            } else {
                lessonStart = parseInt(lessonStr.substring(0, lessonStr.indexOf("~")));
                lessonEnd = parseInt(lessonStr.substring((lessonStr.indexOf("~") + 1)));
                //console.log(lessonStart);
                //console.log(lessonEnd);
                if (lessonStart == 0 && lessonEnd == 0) {
                    lesson = [];
                } else {

                    for (var i = lessonStart; i <= lessonEnd; i++) {
                        lesson.push(parseInt(i));
                    }
                }
            }
            limitStr = $($(v).find('td')[15]).text().trim();
            if (limitStr == ";" || !limitStr) {
                limit = "";

            } else {
                limit = limitStr.replace(/\r\n/g, "");
            }
            var week = $($(v).find('td')[8]).text().trim();
            if (week) {
                week = parseInt(week);

            } else {
                week = parseInt(0);
            }

            var max = $($(v).find('td')[13]).text().trim();
            if (max) {
                max = parseInt(max);
            } else {
                max = 0;
            }

            var count = $($(v).find('td')[14]).text().trim();
            if (count) {
                count = parseInt(count);
            } else {
                count = 0;
            }

            var credit = $($(v).find('td')[4]).text().trim();
            if (credit) {
                credit = parseFloat(credit);
            } else {
                credit = 0;
            }
            //console.log(weekHasLesson);
            item = {
                courseId: $($(v).find('td')[1]).text().trim(),
                name: $($(v).find('td')[2]).text().trim(),
                collegeId: parseInt(datas.college[$($(v).find('td')[0]).text().trim()].collegeId),
                orderId: $($(v).find('td')[3]).text().trim(),
                credit: credit,
                examType: $($(v).find('td')[5]).text().trim(),
                teacher: teacher,
                weekHasLesson: weekHasLesson,
                week: week,
                lesson: lesson,
                campusId: $($(v).find('td')[10]).text().trim(),
                building: $($(v).find('td')[11]).text().trim(),
                classroom: $($(v).find('td')[12]).text().trim(),
                termId:datas.currentTerm.termId,
                max: max,
                count: count,
                limit: limit
            };
            list.push(item);
        }
    });
    return list;
};

/**
 * 课程信息列表生成要抓取的网址
 * @param html
 */
pages.courseBase = function(html,page,j){
    var courseCount = html.substring(html.lastIndexOf("共") + 1, html.indexOf("项", html.lastIndexOf("共")));
    var coursePageCount;
    if((courseCount % config.params.courseListPageSize)==0){
        coursePageCount = parseInt(courseCount / config.params.courseListPageSize);
    }else{
        coursePageCount = parseInt(courseCount / config.params.courseListPageSize) + 1;
    }

    var urls = [], url = {};
    if(page){
        page = page;
    }else{
        page=1;
    }
    for (var i = page; i < coursePageCount; i++) {
        url = {
            url: config.urls.coursePost,
            form: {
                pageSize: config.params.courseListPageSize,
                page: i
            },
            j:j
        };
        urls.push(url);
    }
    return urls;
};

pages.courseDetail = function(html,id,page,j){
    var courseDetailPageCount = parseInt(html.substring(html.lastIndexOf("共") + 1, html.indexOf("页", html.lastIndexOf("共"))));
    var courseDetailUrls = [], courseDetailUrl = {};
    if(page){
        page = page;
    }else{
        page=0;
    }
    for (var i = page; i < courseDetailPageCount; i++) {
        courseDetailUrl = {
            page:i,
            url: config.urls.courseDetail+"&pageSize="+config.params.currentCoursePageSize+"&pageNumber="+i+"&kch="+id,
            j:j
        };
        courseDetailUrls.push(courseDetailUrl);
    }
    return courseDetailUrls;
    //console.log(courseDetailUrls);
    //console.log('已生成'+courseBase.courseId+'的所有课的获取网址');

};

pages.scoreList = function(html){
    //console.log(html);
    var $ = cheerio.load(html);
    var term = [];
    var data={};
    for(var i= 1,k=0;i<$("table.title").length;i=i+3,k++){
        term[k] = $($($($($("table.title")[i])).find("table")[0]).find("tr td")[1]).text().trim().substr(0,17);
        data[term[k]]=[];
    }
   // console.log(term);
    var item0={},item1={};
    for(var i= 2,k=0;i<$("table.displayTag").length;i+=3,k++){

        for(var m = 1;m<$($("table.displayTag")[i]).find('tr').length-1;m++){
            var propertyId=$($($($("table.displayTag")[i]).find('tr')[m]).find('td')[2]).text().trim();

            item0={
                'termId':datas.term[term[k]].termId,
                'courseId':$($($($("table.displayTag")[i]).find('tr')[m]).find('td')[0]).text().trim(),
                'propertyId':propertyId?datas.property[propertyId].propertyId:"未知",
                'score':$($($($("table.displayTag")[i]).find('tr')[m]).find('td')[3]).text().trim(),
                'date':$($($($("table.displayTag")[i]).find('tr')[m]).find('td')[4]).text().trim(),
                'name':common.mysqlEscape($($($($("table.displayTag")[i]).find('tr')[m]).find('td')[1]).text().trim())
            };
            data[term[k]].push(item0);
        }

        for(var n = 1;n<$($("table.displayTag")[i+1]).find('tr').length;n++){
            item1={
                'termId':datas.term[term[k]].termId,
                'courseId':$($($($("table.displayTag")[i+1]).find('tr')[n]).find('td')[0]).text().trim(),
                'propertyId':datas.property[$($($($("table.displayTag")[i+1]).find('tr')[n]).find('td')[2]).text().trim()].propertyId,
                'score':$($($($("table.displayTag")[i+1]).find('tr')[n]).find('td')[3]).text().trim(),
                'date':$($($($("table.displayTag")[i+1]).find('tr')[n]).find('td')[4]).text().trim(),
                'name':common.mysqlEscape($($($($("table.displayTag")[i+1]).find('tr')[n]).find('td')[1]).text().trim())
            };
            data[term[k]].push(item1);
        }
    }

    var flag=false;
    for(var i in data){
        if(data[i].length>0){
            flag=true;
        }
    }

    if(flag){
        return data;

    }else{
        data={};
        return data;
    }
    //console.log(data);

};

pages.scorePass = function(html){
    var $ = cheerio.load(html);
    var item={};
    var term = [],data={};
    //console.log($("table.title").length);
    for(var i= 0,k=0;i<$("table.title").length;i++,k++){
        term[i] = $($($($($("table.title")[i])).find("table")[0]).find("tr td")[1]).text().trim();
        data[term[i]]={};
    }


    for(var i= 0,k=0;i<$("table.displayTag").length;i++,k++) {
        term[i] = $($($($($("table.title")[i])).find("table")[0]).find("tr td")[1]).text().trim();
        for(var m = 1;m<$($("table.displayTag")[i]).find('tr').length;m++){
            item={
                orderId:$($($($("table.displayTag")[i]).find('tr')[m]).find('td')[1]).text().trim(),
                englishName:common.mysqlEscape($($($($("table.displayTag")[i]).find('tr')[m]).find('td')[3]).text().trim()),
                credit:$($($($("table.displayTag")[i]).find('tr')[m]).find('td')[4]).text().trim()
            };
            data[term[i]][$($($($("table.displayTag")[i]).find('tr')[m]).find('td')[0]).text().trim()]=item;
        }

    }
    //console.log(data);
return data;
  //  var t=$($($($("table.displayTag")[0]).find('tr')[1]).find('td')[0]).text().trim()
//console.log(t);
};

pages.scorePassDetail = function(html,id){
    var $ = cheerio.load(html);

var item={};

    for(var i= 0,k=0;i<$("table.displayTag").length;i++,k++) {

        for(var m = 1;m<$($("table.displayTag")[i]).find('tr').length;m++){
            var courseId=$($($($("table.displayTag")[i]).find('tr')[m]).find('td')[0]).text().trim();

            if(courseId==id){

                item={
                    orderId:$($($($("table.displayTag")[i]).find('tr')[m]).find('td')[1]).text().trim(),
                    englishName:common.mysqlEscape($($($($("table.displayTag")[i]).find('tr')[m]).find('td')[3]).text().trim()),
                    credit:$($($($("table.displayTag")[i]).find('tr')[m]).find('td')[4]).text().trim()
                };
            }
        }

    }
    //console.log(data);
return item;
    //  var t=$($($($("table.displayTag")[0]).find('tr')[1]).find('td')[0]).text().trim()
//console.log(t);
};

pages.scoreFail = function(html){
    var $ = cheerio.load(html);
    var item={};
    var data=[];

    for(var i= 0,k=0;i<$("table.displayTag").length;i++,k++) {
        for(var m = 1;m<$($("table.displayTag")[i]).find('tr').length;m++){

            //console.log($($($($("table.displayTag")[i]).find('tr')[m]).find('td')[3]).text().trim());

            item={
                'courseId':$($($($("table.displayTag")[i]).find('tr')[m]).find('td')[0]).text().trim(),
                'orderId':$($($($("table.displayTag")[i]).find('tr')[m]).find('td')[1]).text().trim(),
                'date':$($($($("table.displayTag")[i]).find('tr')[m]).find('td')[7]).text().trim(),
                'englishName':common.mysqlEscape($($($($("table.displayTag")[i]).find('tr')[m]).find('td')[3]).text().trim()),
                'credit':$($($($("table.displayTag")[i]).find('tr')[m]).find('td')[4]).text().trim(),
                'reason':$($($($("table.displayTag")[i]).find('tr')[m]).find('td')[8]).text().trim()
            };
            data.push(item);

        }

    }
    //console.log(data);

    return data;

    //
    //  var t=$($($($("table.displayTag")[0]).find('tr')[1]).find('td')[0]).text().trim()
//console.log(t);
};

pages.scoreCount = function(html){
    //console.log(html);
    var $ = cheerio.load(html);
   var count=0;
    for(var i= 2,k=0;i<$("table.displayTag").length;i+=3,k++){

        for(var m = 1;m<$($("table.displayTag")[i]).find('tr').length-1;m++){

            count++;
        }

        for(var n = 1;n<$($("table.displayTag")[i+1]).find('tr').length;n++){
            count++
        }
    }
    //console.log(data);
    return count;

};

pages.curriculum = function(html){
    var $ = cheerio.load(html);
    var item={};
    var data=[];
    var teacher,weekHasLessonStr,weekHasLessonStart,weekHasLessonEnd,lessonStr,lessonStart,lessonEnd;
    for(var i= 0,k=1;i<$($("table.displayTag")[1]).find("tr").length-1;i++,k++) {
        var tr = $($("table.displayTag")[1]).find("tr");
        if(k>1 && $($(tr[k]).find('td')[0]).text().trim()!=$($(tr[1]).find('td')[0]).text().trim()){
            var weekHasLesson = [];


            weekHasLessonStr = $($(tr[k]).find('td')[0]).text().trim();
            if (!weekHasLessonStr) {
                weekHasLesson = [];
            } else {
                if (weekHasLessonStr == '单周') {
                    for (var l = 1; l < 18; l += 2) {
                        weekHasLesson.push(l);
                    }

                } else if (weekHasLessonStr == '双周') {
                    for (var l = 2; l < 18; l += 2) {
                        weekHasLesson.push(l);
                    }
                } else {
                    weekHasLessonStart = parseInt(weekHasLessonStr.substring(0, weekHasLessonStr.indexOf("-")));
                    weekHasLessonEnd = parseInt(weekHasLessonStr.substring(weekHasLessonStr.indexOf("-") + 1, weekHasLessonStr.indexOf("周")));

                     //console.log(weekHasLessonStart);console.log(weekHasLessonEnd);
                    for (var l = weekHasLessonStart; l <= weekHasLessonEnd; l++) {
                        weekHasLesson.push(parseInt(l));
                    }
                    //console.log(weekHasLesson);
                }
            }
            lessonStr = $($(tr[k]).find('td')[2]).text().trim();
            var lesson = [];
            if (!lessonStr) {
                lesson = [];
            } else {
                lessonStart = parseInt(lessonStr.substring(0, lessonStr.indexOf("~")));
                lessonEnd = parseInt(lessonStr.substring((lessonStr.indexOf("~") + 1)));
                //console.log(lessonStart);
                //console.log(lessonEnd);
                if (lessonStart == 0 && lessonEnd == 0) {
                    lesson = [];
                } else {

                    for (var p = lessonStart; p <= lessonEnd; p++) {
                        lesson.push(parseInt(p));
                    }
                }
            }

            var week = $($(tr[k]).find('td')[1]).text().trim();
            //console.log(week);
            if (week) {
                week = parseInt(week);

            } else {
                week = parseInt(0);
            }

            item={
                courseId:data[i-1].courseId,
                orderId:data[i-1].orderId,
                name:data[i-1].name,
                propertyId:data[i-1].propertyId,
                status:data[i-1].status,
                credit:data[i-1].credit,
                weekHasLesson:weekHasLesson.join(','),
                teacher:data[i-1].teacher,
                week:week,
                lesson:lesson.join(','),
                campusId:$($(tr[k]).find('td')[3]).text().trim()?datas.campus[$($(tr[k]).find('td')[3]).text().trim()].campusId:"",
                building:$($(tr[k]).find('td')[4]).text().trim(),
                classroom:$($(tr[k]).find('td')[5]).text().trim()

            };
            data[i]=item;
        }else {
            var weekHasLesson = [];
            teacher = [];
            teacher = $($(tr[k]).find('td')[7]).text().trim().split(" ");

            for (var n = 0; n < teacher.length; n++) {
                teacher[n] = teacher[n].replace("*", "");
            }


            weekHasLessonStr = $($(tr[k]).find('td')[11]).text().trim();
            if (!weekHasLessonStr) {
                weekHasLesson = [];
            } else {
                if (weekHasLessonStr == '单周') {
                    for (var l = 1; l < 18; l += 2) {
                        weekHasLesson.push(l);
                    }

                } else if (weekHasLessonStr == '双周') {
                    for (var l = 2; l < 18; l += 2) {
                        weekHasLesson.push(l);
                    }
                } else {
                    weekHasLessonStart = parseInt(weekHasLessonStr.substring(0, weekHasLessonStr.indexOf("-")));
                    weekHasLessonEnd = parseInt(weekHasLessonStr.substring(weekHasLessonStr.indexOf("-") + 1, weekHasLessonStr.indexOf("周")));

                    for (var l = weekHasLessonStart; l <= weekHasLessonEnd; l++) {
                        weekHasLesson.push(parseInt(l));
                    }
                }
            }
            lessonStr = $($(tr[k]).find('td')[13]).text().trim();
            var lesson = [];
            if (!lessonStr) {
                lesson = [];
            } else {
                lessonStart = parseInt(lessonStr.substring(0, lessonStr.indexOf("~")));
                lessonEnd = parseInt(lessonStr.substring((lessonStr.indexOf("~") + 1)));
                if (lessonStart == 0 && lessonEnd == 0) {
                    lesson = [];
                } else {

                    for (var p = lessonStart; p <= lessonEnd; p++) {
                        lesson.push(parseInt(p));
                    }
                }
            }

            var week = $($(tr[k]).find('td')[12]).text().trim();
            if (week) {
                week = parseInt(week);

            } else {
                week = parseInt(0);
            }


            var credit = $($(tr[k]).find('td')[4]).text().trim();
            if (credit) {
                credit = parseFloat(credit);
            } else {
                credit = 0;
            }

            var property = $($(tr[k]).find('td')[5]).text().trim();


            item = {
                courseId: $($(tr[k]).find('td')[1]).text().trim(),
                orderId: $($(tr[k]).find('td')[3]).text().trim(),
                name: $($(tr[k]).find('td')[2]).text().trim(),
                propertyId: property ? datas.property[property].propertyId : "",
                status: $($(tr[k]).find('td')[10]).text().trim(),
                credit: credit,
                weekHasLesson: weekHasLesson.join(','),
                teacher: teacher.join(','),
                week: week,
                lesson: lesson.join(','),
                campusId: $($(tr[k]).find('td')[14]).text().trim() ? datas.campus[$($(tr[k]).find('td')[14]).text().trim()].campusId : "",
                building: $($(tr[k]).find('td')[15]).text().trim(),
                classroom: $($(tr[k]).find('td')[16]).text().trim()

            };
            data[i] = item;
        }
        }
    return data;
};

/**
 * 考表
 * @param html
 * @returns {Array}
 */
pages.exam = function(html){
    var $ = cheerio.load(html);
    var item={};
    var data=[];
    var tr=$($("table.displayTag")[1]).find('tr');
        for(var m = 1;m<tr.length;m++){
            item={
                'examName':common.mysqlEscape($($(tr[m]).find('td')[0]).text().trim()),
                'campusId':$($(tr[m]).find('td')[1]).text().trim()?datas.campus[$($(tr[m]).find('td')[1]).text().trim()].campusId:"",
                'teamId':datas.currentTerm.termId,
                'start':$($(tr[m]).find('td')[7]).text().trim()?(parseInt((Date.parse($($(tr[m]).find('td')[7]).text().trim()+" "+$($(tr[m]).find('td')[8]).text().trim().substring(0,$($(tr[m]).find('td')[8]).text().trim().indexOf('-'))))/1000)):0,
                'end':$($(tr[m]).find('td')[7]).text().trim()?(parseInt((Date.parse($($(tr[m]).find('td')[7]).text().trim()+" "+$($(tr[m]).find('td')[8]).text().trim().substr(($($(tr[m]).find('td')[8]).text().trim().indexOf('-')+1)))/1000))):0,
                'week':$($(tr[m]).find('td')[5]).text().trim()?parseInt($($(tr[m]).find('td')[5]).text().trim()):0,
                'name':common.mysqlEscape($($(tr[m]).find('td')[4]).text().trim()),
                'building':$($(tr[m]).find('td')[2]).text().trim()?$($(tr[m]).find('td')[2]).text().trim():"",
                'classroom':$($(tr[m]).find('td')[3]).text().trim()?$($(tr[m]).find('td')[3]).text().trim():"",
                'seat':$($(tr[m]).find('td')[9]).text().trim()?$($(tr[m]).find('td')[9]).text().trim():""
            };
            data.push(item);



    }
    return data;
};

/**
 * 获取课表课程总数
 * @param html
 * @returns {Array}
 */
pages.majorCount = function(html){
    //console.log(html);
    var $ = cheerio.load(html);
return $($("table.displayTag")[1]).find("tr").length-1;
};



pages.library = function(html){
    var $ = cheerio.load(html);

    var table = $(".sheet");
    var data = [],item={};
    //console.log(table.text());

    for(var i=0;i<table.length;i++){
        var date =$($(table[i]).find("table tr td")[2]).text().trim();
         item = {
             name:common.mysqlEscape($($(table[i]).find("table tr td")[1]).text().trim()),
             deadline:parseInt(new Date(date.substr(0,4)+'-'+date.substr(4,2)+'-'+date.substr(6,2)+" 0:0:0:0").getTime()/1000),
             author:common.mysqlEscape($($(table[i]).find("table tr td")[0]).text().trim()),
             location:$($(table[i]).find("table tr td")[3]).text().trim(),
             index:$($(table[i]).find("table tr td")[4]).text().trim(),
             barcode:$($(table[i]).find("table tr td")[5]).find("input[name=barcode]").val(),
             borId:$($(table[i]).find("table tr td")[5]).find("input[name=bor_id]").val()
         };
        data[i] = item;
    }
    return data;

};



pages.bookIds = function(html){
    var $ = cheerio.load(html);

    var table = $(".sheet");
    var data = [];
    for(var i=0;i<table.length;i++){
        var date =$($(table[i]).find("table tr td")[2]).text().trim();
        data[i] = {
            barcode:  $($(table[i]).find("table tr td")[5]).find("input[name=barcode]").val() ,
            deadline: parseInt(new Date(date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2) + " 0:0:0:0").getTime() / 1000)
        }
        }
    return data;

};


pages.currentScore = function(html){
    var $ = cheerio.load(html);
    var item={};
    var data=[];

        for(var m = 1;m<($("table.displayTag").find('tr').length);m++){
            item={
                'courseId':$($($($("table.displayTag")).find('tr')[m]).find('td')[0]).text().trim(),
                'orderId':$($($($("table.displayTag")).find('tr')[m]).find('td')[1]).text().trim(),
                'score':$($($($("table.displayTag")).find('tr')[m]).find('td')[6]).text().trim(),
                'englishName':common.mysqlEscape($($($($("table.displayTag")).find('tr')[m]).find('td')[3]).text().trim()),
                'property':$($($($("table.displayTag")).find('tr')[m]).find('td')[5]).text().trim(),
                'credit':$($($($("table.displayTag")).find('tr')[m]).find('td')[4]).text().trim(),
                "name":common.mysqlEscape($($($($("table.displayTag")).find('tr')[m]).find('td')[2]).text().trim())
            };
            data.push(item);
    }
    return data;


};


pages.classroom = function(html){
    var data =[];
    var $ = cheerio.load(html);
    var trs = $(html).find("table.titleTop2 table#user tbody tr");
    var item =null;
    var link = undefined;
    trs.each(function(i,v){
        link=$($(v).find('td')[6]).find("img").attr('onclick');
item = {
    campusId:datas.campus[$($(v).find('td')[1]).text().trim()].campusId,
    buildId:link.substring(link.indexOf('jxlh=')+5,link.indexOf('&jxlm')),
    building: $($(v).find('td')[2]).text().trim(),
    classroom:$($(v).find('td')[3]).text().trim(),
    classroomId:link.substring(link.indexOf('jash=')+5,link.indexOf('&jasm')),
    type:$($(v).find('td')[4]).text().trim(),
    count:$($(v).find('td')[5]).text().trim()
};
        data.push(item);
    });
    return data;
};

module.exports = pages;
