## 四川大学校园API文档


### 1.成绩接口

    {
    
    uri:"/api/score",
    params:{
    
    appId:"APPID", //你在开放平台申请的appid
    appSecret:"APPSECRET", //开放平台给你的appSecret,
    studentId:"201410100212",   //需要查询的学号
    password:"asbsdfasdfadskdsfajkl",   //使用aes128加密的密码
    //updateNow:1, //是否立即更新1是立即去请求最新数据,0是不去请求
    
    }
    
    return:{
    
    code:200,  //成功的code
    message:"说明",
    data:{
    
    count:35 //当前总科目
    scores:[
    {
    term:"2014-2015年第1学期",
    current:1 , //是否是当前学期,是：1，否：0
    updateAt:1412321234, //成绩最后更新时间
    version:132 //成绩版本
    data:[
    {
    name:"课程名",
    EnglishName:"英文课程名"
    
    }
    
    ]
    
    }
    ]
    
    }
    
    }