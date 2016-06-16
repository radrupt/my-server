/**
 * Created by wangd on 2016/3/24.
 */

var dbo = require('../../dbo');

var stdin = require('../../lib/std').stdin;

var cheerio = require('cheerio');
var util = require('../util');

var getDownloadHrefAndInsert = function(In){
    var movie = dbo.resource.movie;
    util.httpGetPromise(In.detail_href).then(
        function(result){
            var $$ = cheerio.load(result,{decodeEntities: false});
            if( $$('#Zoom span table a').text() ){
                In.d_href = $$('#Zoom span table a').text();
                movie.insert(In).then(
                    //function(res){console.log("success one:")},
                    //function(err){console.log("fail one:"+err)}
                )
            }
        },function(err){console.log(err)}
    );
}

var filter = function(data,minscore){
    var $ = cheerio.load(data,{decodeEntities: false});
    var array = $('.co_content8').find('table');
    for( var i = 0; i < array.length; i++ ) {
        var table = cheerio.load(array[i], {decodeEntities: false});
        var title = table('tr td b a').text().replace(/^[^《]*《/,'').replace(/》.*$/,'');
        var detail_href = "http://www.dytt8.net" + table('tr td b a').attr("href");
        var desc = table('tr').last().find('td').text();
        var point = /\d\.\d(?=\/10)/.exec(desc);
        if ( point && point[0] > minscore ){
            getDownloadHrefAndInsert({
                title:title,
                point:point[0],
                d_href:'',
                desc:desc,
                detail_href:detail_href
            });
        }
    }
}

var spideMovie = function(...params){
    params = params[0];
    if(params.length<5){
        console.log('params is error');
        return;
    }
    var sourcehref = params[0];
    var startindex = parseInt(params[1]);
    var total = parseInt(params[2]);
    var minscore = parseInt(params[3]);
    var interaltime = parseInt(params[4]);
    var start = --startindex;
    var interal = setInterval(function(){
        start++;
        if(start>total) clearInterval(interal);
        util.rePrintLine("spide page: "+start);
        if(start==total)util.rePrintLine("spide is finished.");
        var href = sourcehref.replace('{}',start);
        util.httpGetPromise(href).then(
            function(res){
                filter(res,minscore);
            },function(err){console.log(err)}
        );
    }, interaltime);

}
stdin.add("spide",'movie',spideMovie);//cmd: spide--movie
//注意：域名可能会变
//spide--movie--http://www.dytt8.net/html/gndy/dyzz/list_23_{}.html--1--10--7--1000
//http://www.dytt8.net/html/gndy/dyzz/index.html
console.log("spide movie cmd: "+"spide--movie--href(xx{}xx)--startindex--total--minscore--interaltime");