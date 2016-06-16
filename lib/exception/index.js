/**
 * Created by wangd on 2016/4/18.
 * 捕获大部分启动期间出现的异常
 */

var process = require('process');
var config = require('../../config/log');

process.on('uncaughtException',function(err){
    var CRLF = '\r\n';
    var data = '';
    //var data = "filename: "+filename+", line number: "+line;
    data += CRLF;
    data += "TIME:" + new Date();
    data += CRLF;
    data += err.stack || err;
    data += CRLF;
    data += CRLF;
    data += CRLF;
    var fs = require('fs');
    fs.appendFile(config.path,data.toString(),'utf-8',function(err){
        if(err) console.log(err);
        process.exit(1);
    });
});