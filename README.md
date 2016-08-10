# scuApi
四川大学校园API


本项目旨在为授权开发者提供四川大学本科学生的成绩，课表，个人信息，考表等接口。解决了学校教务处页面经常崩溃的问题，这里提供的接口是从自有的数据库拿数据，数据存放在AWS上，系统维护一套生产者和消费者队列自动从教务处更新相关数据；如果没有最新的数据，采用异步的方法通知调用者，本系统基于nodejs开发。

> 架构方面：

1. 基于node.js重构，事件驱动的，非阻塞的I/O,多并发
2. 系统架构方面：多个独立的模块，相互之间通过http接口来提供服务，降低耦合，容灾能力强
3.  API包括：数据api、推送api、生产者api、消费者api、微博同步系统、微信推送api
4. 数据同步到aws存储、有效预防教务处崩溃，安全性。
5. 维护一套待更新的队列，包括成绩、课表、考表等，每天循环一次。生产者负责生产，消费者负责消费队列中的内容。
6. 最终暴露给开发者的api是拥有完善的权限控制的数据接口，同时数据接口对敏感数据进行了aes128加密。



约定些东西：

**1.返回的数据的格式统一为：**

		{
		"code": 200, //只有成功才是200，其他均为错误代码
		"message":"这里是中文的说明信息",
		"data": []  //也可能是{}
		}

**2.学生密码的加密处理**

本api采用aes128加密，如果你是nodejs开发，请直接引入该文件[https://github.com/dsgygb/scuApi/blob/master/libs/aes128.js](https://github.com/dsgygb/scuApi/blob/master/libs/aes128.js) ,所有的密码字段均需要加密后传参。
        
        var appId="系统给你生成的appId";
        var appSecret="系统给你生成的appSecret";
		var aes128 = require("aes128.js");
		var password = aes.encode(appId,appSecret,_password); //加密后的
		
**3.api网址：http://api.scuinfo.com**
		
下面是接口的文档：
		
### 1.成绩接口

		{
		"method":"GET",
		"url":"/api/score",
		"params":{
		"appId":"系统给你的appId",
		"appSecret":"系统给你的appSecret",
		"studentId":"学号"
		"password":"加密后的密码"
		},
		return:{
    	"code": 200,
    	"message": "成功",
    	"data": {
        "count": 80,  //总课程数
        "updateAt": 1436409550,  //最后更新时间
        "version": 143,  //成绩版本号
        "scores": [
            {
                "term": "2014-2015学年春(两学期)", //学期名
                "current": 0,  //是否是当前学期，0：否，1：是
                "courseId": 304056010, //课程号
                "orderId": "03", //课序号
                "property": "选修", //课程属性
                "credit": 1,    //学分
                "score": 85,  //成绩
                "name": "网络工程课程设计",  //课程中文名
                "EnglishName": "Course Design of Network Engineering", //课程英文名
                "reason": ""  //备注
            },
            {
                "term": "2014-2015学年春(两学期)",
                "current": 0,
                "courseId": 304055030,
                "orderId": "03",
                "property": "选修",
                "credit": 3,
                "score": 86,
                "name": "网络工程",
                "EnglishName": "Network Engineering",
                "reason": ""
            }
        ]
    }
	}
		
		}
		
	
### 2.课程信息接口

		{
		"method":"GET",
		"url":"/api/major",
		"params":{
		"appId":"系统给你的appId",
		"appSecret":"系统给你的appSecret",
		"studentId":"学号"
		"password":"加密后的密码"
		},
		return:{
		
   		"code": 200,
  	  	"message": "成功",
    	"data": {
        "currentWeek": 24, //当前周数
        "count": 6,  //课程数
        "updateAt": 1434868546, //最后更新时间,时间戳  
        "version": 2,  //成绩版本号
        "majors": [
            {
                "term": "2015-2016学年秋(两学期)", //学期名
                "courseId": 888006010,  //课程号
                "orderId": "07", //课序号
                "property": "必修", //课程属性
                "credit": 1,  //学分
                "name": "体育-3", //课程名
                "teacherName": "ty7",  //老师名
                "week": 3,  //星期几
                "weekHasLesson": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17", //上课周次
                "lesson": "3,4", //第几小节
                "building": "体育场", //教学楼
                "classroom": "体育场2号", //教室
                "status": "置入"  //选课状态
            },
            {
                "term": "2015-2016学年秋(两学期)",
                "courseId": 998011000,
                "orderId": "12",
                "property": "必修",
                "credit": 0,
                "name": "形势与政策-3",
                "teacherName": "龙黎明",
                "week": 5,
                "weekHasLesson": "",
                "lesson": "5,6",
                "building": "综合楼C座",
                "classroom": "C503",
                "status": "置入"
            },
            {
                "term": "2015-2016学年秋(两学期)",
                "courseId": 103087030,
                "orderId": "02",
                "property": "必修",
                "credit": 3,
                "name": "知识产权法",
                "teacherName": "李旭",
                "week": 1,
                "weekHasLesson": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17",
                "lesson": "7,8,9",
                "building": "一教B座",
                "classroom": "B102",
                "status": "置入"
            },
            {
                "term": "2015-2016学年秋(两学期)",
                "courseId": 103017030,
                "orderId": "02",
                "property": "必修",
                "credit": 3,
                "name": "国际公法",
                "teacherName": "李浩",
                "week": 2,
                "weekHasLesson": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17",
                "lesson": "7,8,9",
                "building": "一教B座",
                "classroom": "B405",
                "status": "置入"
            },
            {
                "term": "2015-2016学年秋(两学期)",
                "courseId": 103120020,
                "orderId": "03",
                "property": "选修",
                "credit": 2,
                "name": "人格权法",
                "teacherName": "罗蓉",
                "week": 2,
                "weekHasLesson": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17",
                "lesson": "3,4",
                "building": "一教A座",
                "classroom": "A509",
                "status": "置入"
            },
            {
                "term": "2015-2016学年秋(两学期)",
                "courseId": 105395020,
                "orderId": "05",
                "property": "必修",
                "credit": 2,
                "name": "大学英语（创意阅读）-3",
                "teacherName": "吉晋",
                "week": 3,
                "weekHasLesson": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17",
                "lesson": "1,2",
                "building": "二基楼B座",
                "classroom": "语音14",
                "status": "选中"
            }
        ]
    }
	}
		
		
		
### 3.考试信息接口

		{
		"method":"GET",
		"url":"/api/exam",
		"params":{
		"appId":"系统给你的appId",
		"appSecret":"系统给你的appSecret",
		"studentId":"学号"
		"password":"加密后的密码"
		},
		return:{
    	"code": 200,
    	"message": "成功",
    	"data": {
        "currentWeek": 24, //当前周
        "count": 7,  //考试科目
        "updateAt": 1434287978, //最后更新时间
        "version": 1, //版本号
        "exams": [
            {
                "term": "2015-2016学年秋(两学期)", //学期
                "examName": "期中考（5月9、10日）", //考试名
                "start": 1431138600, //考试开始时间
                "end": 1431145800, //考试结束时间
                "name": "大学英语（阅读与翻译）-2-19", //课程名
                "campus": "江安", //校区
                "week": 10, //考试周次
                "building": "一教D座", //考试教学楼
                "classroom": "D103"  //考试教室
            },
            {
                "term": "2015-2016学年秋(两学期)",
                "examName": "期中考（5月9、10日）",
                "start": 1431217800,
                "end": 1431223200,
                "name": "微积分（Ⅲ）-2-06",
                "campus": "江安",
                "week": 11,
                "building": "一教D座",
                "classroom": "D204"
            },
            {
                "term": "2015-2016学年秋(两学期)",
                "examName": "期末考试",
                "start": 1435471200,
                "end": 1435478400,
                "name": "物权法-03",
                "campus": "江安",
                "week": 18,
                "building": "一教C座",
                "classroom": "C106"
            },
            {
                "term": "2015-2016学年秋(两学期)",
                "examName": "期末考试",
                "start": 1435545000,
                "end": 1435552200,
                "name": "大学英语（阅读与翻译）-2-19",
                "campus": "江安",
                "week": 18,
                "building": "综合楼C座",
                "classroom": "C206"
            },
            {
                "term": "2015-2016学年秋(两学期)",
                "examName": "期末考试",
                "start": 1435653000,
                "end": 1435658400,
                "name": "毛泽东思想和中国特色社会主义理论体系概论-44",
                "campus": "江安",
                "week": 18,
                "building": "一教B座",
                "classroom": "B307"
            },
            {
                "term": "2015-2016学年秋(两学期)",
                "examName": "期末考试",
                "start": 1435644000,
                "end": 1435649400,
                "name": "中国近现代史纲要-17",
                "campus": "江安",
                "week": 18,
                "building": "一教D座",
                "classroom": "D103"
            },
            {
                "term": "2015-2016学年秋(两学期)",
                "examName": "期末考试",
                "start": 1435458600,
                "end": 1435465800,
                "name": "微积分（Ⅲ）-2-06",
                "campus": "江安",
                "week": 18,
                "building": "一教A座",
                "classroom": "A503"
            }
        ]
    }
	}


		
		
### 4.图书信息接口

		{
		"method":"GET",
		"url":"/api/book",
		"params":{
		"appId":"系统给你的appId",
		"appSecret":"系统给你的appSecret",
		"studentId":"学号"
		"password":"加密后的密码"
		},
		return:{
    	"code": 200,
    	"message": "成功",
    	"data": {
        "count": 11, //借书总数
        "updateAt": 1434293236, //最后更新时间
        "version": 7999,  //版本号
        "books": [
            {
                "name": "國史大綱",  //书名
                "deadline": 1434499200,  //还书日期
                "author": "钱穆,",  //作者
                "location": "文理馆",  //哪个馆借的
                "index": "K20/2326/1",  //图书索引号
                "bookId": "12246454",  //图书id
                "borrowId": "1141042009" //本次借书的订单id
            },
            {
                "name": "国史大纲 : 修订本",
                "deadline": 1434499200,
                "author": "钱穆",
                "location": "文理馆",
                "index": "K20/8326-W1",
                "bookId": "80070396",
                "borrowId": "1141042009"
            },
            {
                "name": "西方文学概观",
                "deadline": 1435104000,
                "author": "喻天舒,",
                "location": "文理馆",
                "index": "I500.9/6818",
                "bookId": "11851462",
                "borrowId": "1141042009"
            },
            {
                "name": "破门而入 : 美学的问题与历史",
                "deadline": 1435104000,
                "author": "易中天,",
                "location": "文理馆",
                "index": "B83-09/6051",
                "bookId": "11983956",
                "borrowId": "1141042009"
            },
            {
                "name": "红楼梦影 : 吴小如师友回忆录",
                "deadline": 1435104000,
                "author": "吴小如,",
                "location": "文理馆",
                "index": "I267.1/6094",
                "bookId": "12299399",
                "borrowId": "1141042009"
            },
            {
                "name": "逃离",
                "deadline": 1435104000,
                "author": "芒罗",
                "location": "文理馆",
                "index": "I711.45/4460",
                "bookId": "12319132",
                "borrowId": "1141042009"
            },
            {
                "name": "文秘写作指南",
                "deadline": 1435104000,
                "author": "中国法学会",
                "location": "文理馆",
                "index": "H152.3/5639",
                "bookId": "12052608",
                "borrowId": "1141042009"
            },
            {
                "name": "生活和文本中的社会学",
                "deadline": 1435190400,
                "author": "李培林,",
                "location": "文理馆",
                "index": "C91-53/4044",
                "bookId": "12303101",
                "borrowId": "1141042009"
            },
            {
                "name": "魏晋风度及其他",
                "deadline": 1436572800,
                "author": "鲁迅,",
                "location": "文理馆",
                "index": "I210.2/2737-9",
                "bookId": "12221918",
                "borrowId": "1141042009"
            },
            {
                "name": "居士林的阿辽沙 : 小说集",
                "deadline": 1436572800,
                "author": "赵毅衡,",
                "location": "文理馆",
                "index": "I247.7/4402",
                "bookId": "12383495",
                "borrowId": "1141042009"
            },
            {
                "name": "鲁迅小说全集",
                "deadline": 1436572800,
                "author": "鲁迅,",
                "location": "文理馆",
                "index": "I210.6/2737-6",
                "bookId": "12327477",
                "borrowId": "1141042009"
            }
        ]
    }
	}
	
	
### 5.图书续借接口

		{
		"method":"GET",
		"url":"/api/renew",
		"params":{
		"appId":"系统给你的appId",
		"appSecret":"系统给你的appSecret",
		"studentId":"学号",
		"password":"加密后的密码",
		"bookId":"图书的id",
		"borrowId":"借书订单的id"
		},
		return:{
   		"code": 200, //成功则返回200，并在真正成功后回调开发者的填写的callback网址
   		"message": "续借操作提交成功，请勿重复提交"
		}
		
		
### 6.手动更新数据接口
		
		{
		"method":"GET",
		"url":"/api/update",
		"params":{
		"appId":"系统给你的appId",
		"appSecret":"系统给你的appSecret",
		"studentId":"学号",
		"password":"加密后的密码",
		"type":"score" //或者是major,exam,book
		},
		return:{
    	"code": 200,
    	"message": "成功添加该同学的成绩到更新队列中，大约需要3分钟更新完毕，更新成功后会推送到你填写的callback网址中",
    	"data": ""
		}
		
		
### todo
个人信息接口、空教室查询接口




		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
