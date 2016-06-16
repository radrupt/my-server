/**
 * Created by wangd on 2016/2/15.
 */
var trans = function(o){
    o = JSON.parse(JSON.stringify(o));
    if(o == 'null' || o == 'undefined') return '';
    else if(o instanceof String) return o;
    else if( o instanceof Array){
        for(var i = 0; i<o.length;i++){
            o[i] = trans(o[i]);
        }
    }else if( o instanceof Object && !( o instanceof Date)){
        for(var k in o){
            o[k] = trans(o[k]);
        }
    }else if( o instanceof Object &&  o instanceof Date){
        o = o.toString();
    }else if(!isNaN(o)) return ''+o;
    return o;
}
module.exports = {
    checkErrFormat:     function(err){
        if(err.errcode&&err.errmessage&&err.status)  return err;
        return null;
    },
    errPackage :        function(code,errc){
        return {
            errcode:code == 'err' ? '311111' : code.toString(),
            errmessage:errc[code],
            status:'fail'
        };
    },
    successPackage :    function(data){
        data = data || {};
        data = trans(data);
        return {
            data:data,
            status:'success'
        };
    },
    checkAuth :         function(url,header,params,table){//ĿǰȨ���жϵ��ֶζ�Ĭ��������ͷ�������ϸ�������
        if( !table.hasOwnProperty(url) ) return true;//��·�ɲ���·�ɱ���
        var headerkeys = table[url].header || [];
        for( var v of headerkeys ){
            if( !header[v] ) return false;//����ͻ�������ͷ�ﲻ������Ҫ����ֶΣ���Ȩ��ʧ��
        }
        var postkeys = table[url].post || [];
        for( var v of postkeys ){
            if( !params[v] ) return false;//����ͻ���post�����ﲻ������Ҫ����ֶΣ���Ȩ��ʧ��
        }
        return true ;
    },
    checkMobile :       function(mobile) {//����ֻ���ʽ�Ƿ���ȷ
        var mobilereg = /^(13|15|17|18|14)[0-9]{9}$/;
        if( !mobile || !mobilereg.test(mobile) ) {
            return false;
        }
        return true;
    },
    httpGetPromise :    function(href) {
        var http = require('http');
        return new Promise(function(resolve,reject) {
            http.get(href, function(res) {
                var size = 0;
                var chunks = [];
                res.on('data', function(chunk) {
                    size += chunk.length;
                    chunks.push(chunk);
                });
                res.on('end', function() {
                    var data = Buffer.concat(chunks, size);
                    resolve(data);
                });
            }).on('error', function(e){ reject(e.message)});
        });
    },
    pbkdf2Sync :        function(text,salt,iterations,keylen){
        return new Promise(function(resolve,reject){
            var crypto = require('crypto');
            crypto.pbkdf2(text,salt,iterations,keylen,function(err,key){
                if( err ){
                    reject(err);
                }else{
                    resolve(key.toString());
                }
            })
        })
    },
    md5 :               function(s){
        var crypto = require('crypto');
        return crypto.createHash('md5').update(new Date().getTime() + s.toString(), 'utf-8').digest('hex').toUpperCase();
    },
    readFile :          function(path) {
        return new Promise(function(resolve,reject){
            var fs = require('fs');
            fs.readFile(path, function (err, data) {
                if (err) reject(err);
                resolve(data)
            });
        })
    },
    writeFile :         function(path,data) {
        return new Promise(function(resolve,reject){
            var fs = require('fs');
            fs.writeFile(path,data, function (err, data) {
                if (err) {
                    reject(err);
                }else resolve(data)
            });
        })
    },
    logger :            function(main,filepath,filename,line) {
        var CRLF = '\r\n';
        var data = "filename: "+filename+", line number: "+line;
        data += CRLF;
        data += "TIME:" + new Date();
        data += CRLF;
        data += main.stack || main;
        data += CRLF;
        data += CRLF;
        data += CRLF;
        var fs = require('fs');
        fs.appendFile(filepath,data.toString(),'utf-8',function(err){
            if(err) console.log(err);
        });
    },
    undefined2String :  function(s) {
        if( s == undefined ) s ='';
        if( typeof s == 'object' ) {
            for( var k in s ) if( s[k] == undefined ) s[k] = '';
        }
        return s;
    },
    existRedisKey   :   function(redis,key) {
        return new Promise(function(resolve,reject) {
            redis.get(key,function(err,res){
                if(err) reject(err);
                else if(!res) reject();
                else resolve();
            })
        })
    },
    getVByKRedis  :     function(redis,key){
        return new Promise(function(resolve,reject) {
            redis.get(key,function(err,res){
                if(err) reject(err);
                else resolve(res);
            })
        })
    },
    genNumber   :       function(len){
        len = len || 4;
        var s1 = '123456789';
        var s2 = '0123456789';
        var code = '';
        code += s1.substr(parseInt(Math.random() * 9), 1);
        for (var i = 0; i < len-1; i++) {
            code += s2.substr(parseInt(Math.random() * 10), 1);
        }
        return code;
    },
    updateToken:      function(redis,uid,token,value){
        return new Promise(function(resolve,reject){
            redis.get(uid,function(err,res){
                if(err) reject(err);
                else{
                    redis.del(res);
                    redis.set(uid,token);
                    redis.set(token,value);
                    resolve();
                }
            });
        })
    },
    addObjectKeyPrefix: function(obj,prefix){
        var o = {};
        for(var k in obj){
            o[prefix+k] = obj[k];
        }
        return o;
    },
    getClientIp(req) {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    },
    dateFormat(input){
        var date = new Date(parseInt(input));
        return date.getFullYear()+"年"+(date.getMonth()+1)+"月"+date.getDate()+"日";
    },
    //ob:{id,createtime,edittime,title,html}
    genPost: function(ob,path){
        var templateHtml = '<!DOCTYPE html> <html lang="en"> <head>' +
            '<META HTTP-EQUIV="Window-target" CONTENT="_top">' +
            '<META name="AUTHOR" content="radrupt">' +
            '<META NAME="description" CONTENT="@description">' +
            '<META NAME ="keywords" CONTENT="@keywords">' +
            '<meta charset="UTF-8"> ' +
            '<meta name="viewport" content="width=device-width, initial-scale=1">' +
            ' <title>@title</title> ' +
            '<link href="../css/style.css" rel="stylesheet" type="text/css">' +
            '<script src="../js/lib.js"></script>' +
            '</head>' +
            '<body><div class="single-post">@content</div>' +

            '<span id="mysqlid" style="display:none">@id</span>' +
            '<script>ajax({ url: "http://radrupt.com:3000/app/post/add/readcount", type: "POST", data: {id:document.getElementById("mysqlid").innerText}, dataType: "json" });</script>' +
            '<div id="disqus_thread"></div>' +
            '<script>/*' +
            'var disqus_config = function () { this.page.url = "http://radrupt.com";  this.page.identifier = "radrupt"; }; */ ' +
            '(function() {  var d = document, s = d.createElement("script"); ' +
            's.src = "//radrupt.disqus.com/embed.js"; s.setAttribute("data-timestamp", +new Date()); ' +
            '(d.head || d.body).appendChild(s); })(); ' +
            '</script> ' +
            '<noscript>Please enable JavaScript to view the ' +
            '<a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a>' +
            '</noscript>' +
            '<footer class="footer">' +
            '<a href="http://www.miitbeian.gov.cn/" target="_blank" class="putOnRecord">' +
            '苏ICP备16015602号</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Copyright © 2016-2092' +
            '</footer>' +
            '</body>' +
            '</html>';
        var self = this;
        templateHtml = templateHtml.replace(/@title/,ob.title)
                                .replace(/@content/,ob.html)
                                .replace(/@keywords/,ob.meta)
                                .replace(/@description/,ob.title)
                                .replace(/@id/,ob.id);
        var titleHtml = templateHtml.match(/<h1>.*<\/h1>/)[0];
        var timeHtml = '<div class="post-time">创建：@createtime&nbsp;&nbsp;修改：@edittime</div>';
        timeHtml = timeHtml.replace(/@createtime/,self.dateFormat(ob.createtime))
                   .replace(/@edittime/,self.dateFormat(ob.edittime));
        templateHtml = templateHtml.replace(titleHtml,titleHtml+timeHtml);
        return new Promise(function(resolve,reject){
            self.writeFile(path,templateHtml).then(
                function(res){
                    resolve();
                },function(err){
                    reject(err);
                }
            )
        })
    }
}