/**
 * Created by wangd on 2016/2/24.
 */
var hotupdate = require('../lib/hotupdate');
hotupdate.add('scripts',__filename);//添加到热更新列表里去,update--update--scripts,
console.log("update scripts cmd: "+'update--update--scripts');
require('./spider');//加载爬虫脚本
require('./util')
