/**
 * Created by wangd on 2016/2/15.
 */

var util = require('../../util');
var errorcode = require('../../errorcode');
var redis = require('../../../redis');
var Router = require('koa-router');
var router = new Router();
var urltable = {};

//权限验证
router.use('/',function (ctx,next){
    if (!(util.checkAuth(ctx.url, ctx.header, ctx.req.body, urltable))) {//路由表权限判断失败，缺少字段
        ctx.body = util.errPackage(300009, errorcode);
    } else {
        if (ctx.header['token']){//判断token是否有效
            return new Promise(function(resolve,reject){
                util.getVByKRedis(redis.token, ctx.header['token']).then(
                    function(res){
                        if(!res){
                            resolve(ctx.body = util.errPackage(300003, errorcode));
                        }else{
                            ctx.user = JSON.parse(res) || {};//当前使用token登陆的用户信息
                            resolve(next());
                        }

                    },function(){
                        resolve(ctx.body = util.errPackage(300003, errorcode));
                    }
                )
            })
        }else {
            return next();
        }
    }
})
router.use('/post',require('./post').router.routes());
urltable = Object.assign(urltable,util.addObjectKeyPrefix(require('./post').urltable,'/post'));

router.use('/gyroscope',require('./gyroscope').router.routes());
urltable = Object.assign(urltable,util.addObjectKeyPrefix(require('./gyroscope').urltable,'/gyroscope'));

urltable = Object.assign(urltable,util.addObjectKeyPrefix(urltable,'/app'));

module.exports = router;
