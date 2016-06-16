/**
 * Created by wangd on 2016/3/28.
 */
var dbo = require('../../dbo');
var stdin = require('../../lib/std').stdin;
var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var util = require('../util');
var cardata = require('./cardata');
var car = dbo.resource.car;

var successnum = 0,failnum = 0;
var process = require('process');
process.on('uncaughtException',function(err){
    console.log(err);
    //readStart();
});
var readStart = function(start,end,filename){
    util.readFile(filename).then(
        function(res){
            downloadCar(parseInt(res) || start,end,filename,'',null);
        },function(err){
            downloadCar(start,end,filename,'',null);
        }
    )
}
var insertData = function(In){
    car.insert(In).then(
        function(res){
            successnum++;
            util.rePrintLine("已成功插入数据库："+successnum+"条，数据库插入失败："+failnum+"条");
        },
        function(err){
            failnum++;
            util.rePrintLine("已成功插入数据库："+successnum+"条，数据库插入失败："+failnum+"条");
        }
    )
}
var downloadCar = function(index,end,filename,viewstate,cooki){

    var solve = function(ob){
        var tem = '';
        for(var k in ob){
            if(!ob[k]) tem+=k+'=&';
            else tem+=k+'='+ob[k].toString()+'&';
        }
        tem = tem.replace(/&$/,'');
        return tem;
    }

    var postData = solve({
        __EVENTTARGET:null,
        __EVENTARGUMENT:null,
        __VIEWSTATE:viewstate,
        __VIEWSTATEGENERATOR:'3D3D4E5E',
        TextBox_code:index>-1?cardata[index]:'',
        TextBox_name:null,
        'Img_Query.x':5,
        'Img_Query.y':3,
        T_pagecount: null,
        //B_gopage:'GO'
    });

    if(!cooki) postData='';

    var opt = {
        method: "POST",
        host:'e3sp.dongfeng-nissan.com',
        port: 80,
        path: '/fscrm/D5/PubPage/PubSelectPart.aspx?type=B1&code=18',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            "Content-Length": postData.length
        }
    };
    if (cooki) opt.Cookie = cooki;
    var req = http.request(opt, function (res) {
        if (res.headers['set-cookie']) cooki = res.headers['set-cookie'][0].replace(/;.*$/g, '');

        var body = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {

            var $$ = cheerio.load(body,{decodeEntities: false});
            delete body;
            delete viewstate;
            viewstate = $$("input[name='__VIEWSTATE']").val();
            viewstate = encodeURIComponent(viewstate);
            var trdataes = $$('.tbg1');

            for(var i = 0; i < trdataes.length; i++){
                var trdata = cheerio.load(trdataes[i], {decodeEntities: false});
                var tddataes = trdata('td');
                var ob = {
                    number:tddataes[1].children[0].children[0].data,
                    name:tddataes[2].children[0].children[0].data,
                    desc:tddataes[3].children[0].children[0].data,
                    source:tddataes[4].children[0].children[0].data,
                    price:tddataes[5].children[0].children[0].data,
                    kucun:tddataes[6].children[0].children[0].data,
                    fenku:tddataes[7].children[0].children[0].data,
                    cartypename:tddataes[8].children[0].children[0].data,
                    brand:tddataes[9].children[0].children[0].data,
                };

                insertData(ob);
                util.writeFile(filename,index);
                delete ob;
                delete tddataes;
                delete trdata;
            }
            delete trdataes;
            delete $$;

            if( index<end &&index<cardata.length-1 ){
                downloadCar(index+1,end,filename,viewstate,cooki);
            }else{
                console.log("car已处理："+index+"条，已成功插入数据库："+successnum+"条，数据库插入失败："+failnum+"条");
            }
        })
    });
    req.on('error', function (e) {
        console.log(`problem with request: ${e.message}`);
    });
    req.write(postData);
    req.end();
    delete opt;
    delete postData;
    delete req;
}
function start(...params){
    readStart(-1,5000,'./scripts/spider/1');
    readStart(5000,10000,'./scripts/spider/2');
    readStart(15000,20000,'./scripts/spider/3');
    readStart(20000,25000,'./scripts/spider/4');
    readStart(25000,30000,'./scripts/spider/5');
    readStart(30000,35000,'./scripts/spider/6');
    readStart(35000,40000,'./scripts/spider/7');
    readStart(40000,45000,'./scripts/spider/8');
    readStart(45000,50000,'./scripts/spider/9');
    readStart(50000,55000,'./scripts/spider/10');
    readStart(55000,60000,'./scripts/spider/11');
    readStart(60000,65000,'./scripts/spider/12');
    readStart(65000,70000,'./scripts/spider/13');
}
stdin.add("spide",'car',start);//cmd: spide--movie
console.log("spide car cmd: "+"spide--car");