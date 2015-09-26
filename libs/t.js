var r = require('request');



r.get({
    url:'http://scuinfo.com',
    timeout:3000,


},function(e,r,b){
    console.log(e,b);
});