//错误码格式 第一位 为错误大类型 ,1为系统级错误,2为业务错误,后三位为具体错误代码
var code={
    'ok':{
        code:200,
        message:"成功"
    },
    'majorUpdateQuerySuccess':{
        code:200,
        message:"成功添加该同学的课表到更新队列中，大约需要3分钟更新完毕，更新成功后会推送到你填写的callback网址中"
    },
    'scoreUpdateQuerySuccess':{
        code:200,
        message:"成功添加该同学的成绩到更新队列中，大约需要3分钟更新完毕，更新成功后会推送到你填写的callback网址中"
    },
    'libraryUpdateQuerySuccess':{
        code:200,
        message:"成功添加该同学的图书列表到更新队列中，大约需要3分钟更新完毕，更新成功后会推送到你填写的callback网址中"
    },
    'examUpdateQuerySuccess':{
        code:200,
        message:"成功添加该同学的考表到更新队列中，大约需要3分钟更新完毕，更新成功后会推送到你填写的callback网址中"
    },
    'renewUpdateQuerySuccess':{
      code:200,
        message:"续借操作提交成功，请勿重复提交"
    },
    'test':{
        code:1001,
            message:"xxx"
    },
    'mysqlError':{
        code:1002,
            message:"数据库访问错误"
    },
    'error500':{
        code:1003,
        message:"内部错误"
    },
    'redisError':{
      code:1004,
        message:"redis错误"
    },
    'loginError':{
        code:2001,
        message:"登录教务处错误"
    },
    'requestError':{
        code:2002,
            message:"教务处暂时无法访问"
    },
    'loadNotFinished':{
        code:2003,
            message:"有一些重要信息还没有载入完成"
    },
    'updateNotChanged':{
        code:2004,
            message:"数据并没有改动"//数据库更新
    },
    'appIdError':{
        code:2005,
        message:"appId错误"

    },
    'appKeyError':{
        code:2006,
        message:"appKey错误"
    },
    'appPermissionError':{
        code:2007,
        message:"该app没有权限调用此接口"
    },
    'lackParamsStudentId':{
        code:2008,
        message:"缺少参数 studentId"
    },
    'lackParamsPassword':{
        code:2009,
        message:"缺少参数 password"
    },
    'scoreInitQuerySuccess':{
        code:2010,
        message:"首次查询成绩,正在拼命获取最新数据，大约需要3分钟，更新成功后会推送到你填写的callback网址中"
    },
    'scorePasswordUpdateQuerySuccess':{
        code:2010,
        message:"密码有更改,正在拼命获取最新数据，大约需要3分钟，更新成功后会推送到你填写的callback网址中"
    },
    'majorInitQuerySuccess':{
        code:2010,
        message:"首次查询课表，正在拼命获取最新数据，大约需要3分钟，更新成功后会推送到你填写的callback网址中"
    },
    'libraryInitQuerySuccess':{
        code:2010,
        message:"首次查询图书列表，正在拼命获取最新数据，大约需要3分钟，更新成功后会推送到你填写的callback网址中"
    },
    'examInitQuerySuccess':{
        code:2010,
        message:"首次查询考表，正在拼命获取最新数据，大约需要3分钟，更新成功后会推送到你填写的callback网址中"
    },
    'libraryUpdatePasswordQuerySuccess':{
        code:2010,
        message:"图书馆密码有更改,正在拼命获取最新数据，大约需要3分钟，更新成功后会推送到你填写的callback网址中"
    },
    'passwordError':{
        code:2012,
        message:"密码错误"
    },
    'noData':{
        code:2013,
        message:"没有数据"
    },
    'requestLibError':{
        code:2014,
        message:"图书馆访问错误"
    },
    'libAccountOrPasswordError':{
        code:2015,
        message:"图书馆账号或密码错误"
    },

    'renewError':{
        code:2019,
        message:"续借图书失败"
    },
    'renewQuerySuccess':{
        code:2020,
        message:"成功"
    },
    'lackParamsXc':{
        code:2021,
        message:"缺少参数 xc"
    },
    'lackParamsBarcode':{
        code:2022,
        message:"缺少参数 barcode"
    },
    'lackParamsBorId':{
        code:2023,
        message:"缺少参数 borId"
    },
    'lackParamsCallback':{
        code:2024,
        message:"缺少参数 callback"
    },
    'requestCallbackError':{
        code:2025,
        message:"callback 无法访问"
    },
    'lackParamsType':{
        code:2026,
        message:"缺少参数 type"
    },
    'paramsError':{
        code:2027,
        message:"参数违法"
    },

    'passwordMustString':{
        code:2030,
        message:"参数 password 必须为String 类型"
    },
    'lackParamsTemplate':{
        code:2031,
        message:"缺少参数 template"
    },

    'lackParamsBookId':{
        code:2034,
        message:"缺少参数 bookId"
    },
    'lackParamsBorrowId':{
        code:2035,
        message:"缺少参数 borrowId"
    },
    'CountZeroLikeTheLastTime':{
        code:2036,
        message:"目前结果与上次更新相比没有任何变化"
    },
    'noUser':{
        code :2037,
        message:"没有该用户"
    }




};

module.exports = code;