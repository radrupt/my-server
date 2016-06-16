/**
 * Created by wangd on 2016/2/15.
 */
require('../lib/exception');//全局异常捕获
require('../redis');//preload redis sever
require('../lib/sms');//preload sms server
require('../lib/qiniu');//preload qiniu server
var boot = require('../routers');
require('../lib/cluster')(//网络业务启用多核，在worker里处理
    function(){
        boot();//start app main server
    },
1);
require('../lib/cluster')(//单机业务只在master里处理
    function(){
        require('../scripts');//load scripts,hotupdate:update--update--scripts,
        require('../cron');//定时任务
    },
0);


