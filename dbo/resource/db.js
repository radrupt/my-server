/**
 * Created by wangd on 2016/3/24.
 */
var db = require('../../lib/mysql');
module.exports = new db({config:require('../../config/mysql').resource});