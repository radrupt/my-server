/**
 * Created by wangd on 2016/5/30.
 */
var Canvas = require('canvas');
var text2Image = function(content){
    var canvas = new Canvas(400,200);
    var ctx = canvas.getContext('2d');
    ctx.fillRect();
    ctx.font = '20px Microsoft YaHei';
    ctx.fillText(content, 0, 100);
    return canvas.toDataURL();
}
module.exports = {
    text2Image:text2Image,
}