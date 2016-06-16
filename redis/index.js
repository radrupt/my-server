/**
 * Created by wangd on 2016/2/19.
 */
var redis = require('../lib/redis');

module.exports = {
    token:redis(0),//用户登录的token
    util:redis(10),//随便用
}