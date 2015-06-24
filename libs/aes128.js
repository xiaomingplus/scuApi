var AES128 = {};
var crypto = require('crypto');

/*
 * 加密数据
 * @param appId 第三方ID，
 * @param appSecret 第三方密钥
 * @param data 原文
 * @return 密文
 * */
AES128.encode = function(appId,appSecret,data){
    var iv = (appId+'0000000000000000').substr(0,16);
    var cryptKey = crypto.createHash('md5').update(appSecret).digest();

    var encipher = crypto.createCipheriv('aes-128-cbc', cryptKey, iv);

    var encoded = encipher.update(data, 'utf8', 'base64');

    encoded += encipher.final( 'base64' );

    return encodeURIComponent(encoded);
};

/*
 * 解密数据
 * @param appId 第三方ID，
 * @param appSecret 第三方密钥
 * @param data 密文
 * @return 原文
 * */
AES128.decode = function(appId,appSecret,data){
    var iv = (appId+'0000000000000000').substr(0,16);
    var cryptKey = crypto.createHash('md5').update(appSecret).digest();
    //console.log(cryptKey);
    var
        decipher = crypto.createDecipheriv('aes-128-cbc', cryptKey, iv);
    var decoded = decipher.update(decodeURIComponent(decodeURIComponent(data)), 'base64', 'utf8');
    try {
        decoded += decipher.final('utf8');
    }catch (ex){
        decoded = '';
    }
    return decoded;
};


/**
 * 生成MD5 hash
 * @params string 原文
 * @return hash
 */
AES128.md5 = function(data){
    var md5sum = crypto.createHash('md5');
    md5sum.update(data);
    data = md5sum.digest('hex');
    return data;
};

AES128.functions = function(){
    return {
        'encode()':'採取AES28加密',
        'decode()':'AES28解密',
        'md5()':'MD5加密'
    };
};

module.exports = AES128;
