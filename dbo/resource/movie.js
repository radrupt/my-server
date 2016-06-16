/**
 * Created by wangd on 2016/3/24.
 */
var db = require('./db');

var movie = {};

movie.list = function(obj){
    return new Promise(function(resolve,reject){
        var where = " where";
        if(obj.lowpoint) {
            where+=" point > ? and";
            db.format(where,[obj.lowpoint])
        }
        if(obj.highpoint) {
            where+=" point <= ? and";
            db.format(where,[obj.highpoint])
        }
        where = stri.replace(/and$/,'');
        where = stri.replace(/where$/,'');
        db.findPage('movie',where,' point desc',obj,function(err,row){
            if(err) return reject(err);
            resolve(row);
        });
    })
}

movie.insert = function(obj){
    var o = db.genTableObject(obj,['title','point','d_href','desc','detail_href']);
    return new Promise(function(resolve,reject){
        db.insert('movie',o,function(err,res){
            if(err) return reject(err);
            if(!res.affectedRows) return resolve(null);//insert fail, has same data
            resolve(res);
        });
    })
}

module.exports = movie;