/**
 * Created by wangd on 2016/3/24.
 */
var iconv = require('iconv-lite');
var httpGetPromise = function(href){
    var http = require('http');
    return new Promise(function(resolve,reject){
        http.get(href, function (res) {
            var size = 0;
            var chunks = [];
            res.on('data', function (chunk) {
                size += chunk.length;
                chunks.push(chunk);
            });
            res.on('end', function () {
                var data = Buffer.concat(chunks, size);
                data = iconv.decode(data, 'GBK');
                resolve(data);
            });
        }).on('error', function (e) {
            reject(e.message);
        });
    });
};
var rePrintLine = function(content){
    var process = require('process');
    process.stdout.clearLine();  // clear current text
    process.stdout.cursorTo(0);  // move cursor to beginning of line
    process.stdout.write(content);  // write text
}
var  writeFile =  function(path,data,op) {
    op = op ||{};
    return new Promise(function(resolve,reject){
        var fs = require('fs');
        fs.writeFile(path,data,op, function (err, data) {
            if (err) {
                reject(err);
            }else resolve(data)
        });
    })
}
var readFile = function(path) {
    return new Promise(function(resolve,reject){
        var fs = require('fs');
        fs.readFile(path, function (err, data) {
            if (err) reject(err);
            resolve(data)
        });
    })
};
module.exports = {
    httpGetPromise:httpGetPromise,
    rePrintLine:rePrintLine,
    writeFile:writeFile,
    readFile:readFile,
};