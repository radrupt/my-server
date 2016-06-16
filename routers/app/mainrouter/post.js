/**
 * Created by wangd on 2016/4/6.
 */

var util = require('../../util');
var redis = require('../../../redis');
var config = require('../../../config');
var post = require('../../../dbo').resource.post;
var dirpath = require('../../../config').dirpath;
var Router = require('koa-router');
var router = new Router();
var urltable = {};

router.use('/',function(ctx,next){
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'POST');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    return next();
})
//管理员登录
urltable['/manager/login'] = {post:['username','password']};
router.post('/manager/login',function(ctx){
    if(ctx.req.body.username == 'radrupt'&&ctx.req.body.password=='369369369') {
        var token = util.md5('');
        redis.token.set('radrupt',token);
        ctx.body = util.successPackage({token:token});
    }else ctx.body = util.errPackage(1001,{1001:"username or password有误"})
})
//管理员添加文章
urltable['/manager/add'] = {post:['username','token']};
router.post('/manager/add',function(ctx){
    if(ctx.req.body.username == 'radrupt') {
        return new Promise(function(resolve,reject) {
            util.getVByKRedis(redis.token, ctx.req.body.username).then(//验证token
                function (res) {
                    if (res == ctx.req.body.token) {
                        var In = {
                            title: decodeURIComponent(ctx.req.body.title),
                            meta: decodeURIComponent(ctx.req.body.meta) || '',//标签
                            content: decodeURIComponent(ctx.req.body.content),
                            html:decodeURIComponent(ctx.req.body.html),
                            createtime: new Date().getTime(),
                        };
                        var posturl = dirpath.postes+"/"+In.createtime+".html";
                        In.posturl = config.server.postes+In.createtime+".html";
                        post.insert(In).then(
                            function (res) {
                                In.id = res.insertId;
                                In.edittime = In.createtime;
                                util.genPost(In,posturl).then(
                                    function(){
                                        resolve(ctx.body = util.successPackage({id: res.insertId}));
                                    },function(err){
                                        resolve(ctx.body = util.errPackage(1001, {1001: "保存失败"}));
                                    }
                                );
                            }, function (err) {
                                resolve(ctx.body = util.errPackage(1001, {1001: "数据库查询错误"}))
                            }
                        )
                    } else resolve(ctx.body = util.errPackage(1001, {1001: "token有误"}))
                }, function (err) {
                    resolve(ctx.body = util.errPackage(1001, {1001: "token有误"}))
                }
            )
        })
    }else ctx.body = util.errPackage(1001,{1001:"username有误"})
})

//管理员更新文章
urltable['/manager/update'] = {post:['username','token']};
router.post('/manager/update',function(ctx){
    if(ctx.req.body.username == 'radrupt') {
        return new Promise(function(resolve,reject) {
            util.getVByKRedis(redis.token, ctx.req.body.username).then(
                function (res) {
                    if (res == ctx.req.body.token) {
                        var In = {
                            id:ctx.req.body.id,
                            title:decodeURIComponent(ctx.req.body.title),
                            meta:decodeURIComponent(ctx.req.body.meta),//标签
                            content:decodeURIComponent(ctx.req.body.content),
                            html:decodeURIComponent(ctx.req.body.html),
                            edittime:new Date().getTime(),
                        };
                        post.list({id:parseInt(ctx.req.body.id)}).then(
                            function(res){
                                var _post = res[0];
                                var posturl =  dirpath.postes+_post.posturl.match(/[0-9]{13}/)[0]+".html";
                                In.posturl = _post.posturl;
                                In.createtime = _post.createtime;
                                util.genPost(In,posturl).then(
                                    function(){
                                        post.update(In).then(
                                            function(res){
                                                resolve(ctx.body = util.successPackage({url: _post.posturl}));
                                            },function(){
                                                resolve(ctx.body = util.errPackage(1001,{1001:"数据库查询错误"}))
                                            }
                                        )
                                    },function(){
                                        resolve(ctx.body = util.errPackage(1001, {1001: "保存失败"}));
                                    }
                                )
                            },function(err){
                                resolve(ctx.body = util.errPackage(1001, {1001: "数据库查询错误"}))
                            }
                        )
                    }else resolve(ctx.body = util.errPackage(1001,{1001:"token有误"}))
                }, function (err) {
                    resolve(ctx.body = util.errPackage(1001,{1001:"token有误"}))
                }
            )
        })
    }else ctx.body = util.errPackage(1001,{1001:"username有误"})
})
//添加浏览量
urltable['/add/readcount'] = {post:['id']};
router.post('/add/readcount',function(ctx){
    return new Promise(function(resolve,reject) {
        var ip = util.getClientIp(ctx.req);
        util.getVByKRedis(redis.util, ip + ctx.req.body.id).then(
            function (res) {
                if (res) {
                    resolve(ctx.body = util.errPackage(1001, {1001: "无效增量"}));
                }
                else {
                    redis.util.set(ip + ctx.req.body.id, true);
                    redis.util.expire(ip + ctx.req.body.id,1000*60*60*24*365);//一天内有效
                    post.readCountPlus({id: ctx.req.body.id}).then(
                        function (res) {
                            resolve(ctx.body = util.successPackage());
                        }, function (err) {
                            resolve(ctx.body = util.errPackage(1001, {1001: "数据库查询错误"}))
                        }
                    )
                }
            }, function (err) {
                resolve(ctx.body = util.errPackage(1001, {1001: "无效增量"}))
            }
        )
    })
})
//文章列表
urltable['/list'] = {post:[]};
router.post('/list',function(ctx){
    return new Promise(function(resolve,reject) {
        post.list({id:ctx.req.body.id,page:ctx.req.body.page}).then(
            function(res){
                for(var k in res){
                    delete res[k].content;
                }
                resolve(ctx.body = util.successPackage(res));
            },function(err){
                resolve(ctx.body = util.errPackage(1001, {1001: "数据库查询错误"}))
            }
        )
    })
})
//文章列表
urltable['/manager/list'] = {post:[]};
router.post('/manager/list',function(ctx){
    return new Promise(function(resolve,reject) {
        post.list({id:ctx.req.body.id,page:ctx.req.body.page}).then(
            function(res){
                resolve(ctx.body = util.successPackage(res));
            },function(err){
                resolve(ctx.body = util.errPackage(1001, {1001: "数据库查询错误"}))
            }
        )
    })
})

module.exports = {
    router:router,
    urltable:urltable,
};