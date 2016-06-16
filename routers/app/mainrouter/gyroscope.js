/**
 * Created by wangd on 2016/4/6.
 */

var util = require('../../util');
var redis = require('../../../redis');
var config = require('../../../config');
var gyroscope = require('../../../dbo').resource.gyroscope;
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
//文章列表
urltable['/list'] = {post:[]};
router.post('/list',function(ctx){
    return new Promise(function(resolve,reject) {
        gyroscope.list({
            x:parseInt(ctx.req.body.cd_x),
            y:parseInt(ctx.req.body.cd_y),
            z:parseInt(ctx.req.body.cd_z),
            direct:ctx.req.body.direct
        }).then(
            function(res){
                resolve(ctx.body = util.successPackage(res));
            },function(err){
                resolve(ctx.body = util.errPackage(1001, {1001: "数据库查询错误"}))
            }
        )
    })
})
//文章列表
urltable['/likeList'] = {post:[]};
router.post('/likeList',function(ctx){
    return new Promise(function(resolve,reject) {
        gyroscope.likeList({name:ctx.req.body.cd_name}).then(
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