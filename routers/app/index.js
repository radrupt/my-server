/**
 * Created by wangd on 2016/2/15.
 */


const Router = require('koa-router');
var router = new Router();
var config = require('../../config').app;
var process = require('process');

router.use('/', require('./genrouter').routes());//gengeral route
router.use('/app', require('./mainrouter').routes());//mobile app route
var boot = function() {
    const Koa = require('koa');
    var server = new Koa();
    server.use(router.routes());
    server.listen(config.mainport);
    console.log('app listen port: ' + config.mainport+',worker process id is '+process.pid);
}
module.exports = boot;
