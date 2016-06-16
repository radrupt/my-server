/**
 * Created by wangd on 2016/3/24.
 */
var db = require('./db');

var car = {};

car.insert = function(obj){
    var o = db.genTableObject(obj,['number','name','desc','source','price','kucun','fenku','cartypename','brand']);
    return new Promise(function(resolve,reject){
        db.insert('car',o,function(err,res){
            if(err) return reject(err);
            if(!res.affectedRows) return resolve(null);//insert fail, has same data
            resolve(res);
        });
    })
}

module.exports = car;