/**
 * Created by wangd on 2016/4/11.
 */
var db = require('./db');

var post = {};

post.insert = function(obj){
    var o = db.genTableObject(obj,['title','meta','content','createtime','posturl']);
    return new Promise(function(resolve,reject){
        db.insert('post',o,function(err,res){
            if(err) return reject(err);
            if(!res.affectedRows) return resolve(null);//insert fail, has same data
            resolve(res);
        });
    })
}
post.update = function(obj){
    var where = db.genTableObject(obj,['id']);
    var o = db.genTableObject(obj,['title','meta','content','edittime','posturl']);
    return new Promise(function(resolve,reject){
        db.update('post',o,where,function(err,res){
            if(err) return reject(err);
            if(!res.changedRows) return resolve(null);//insert fail, has same data
            resolve(res);
        });
    })
}
post.list = function(obj){
    return new Promise(function(resolve,reject){
        var where = {};
        if(obj.id) where.id = obj.id;
        db.findPage('post',where,'createtime',obj,function(err,row){
            if(err) return reject(err);
            resolve(row);
        });
    })
}
post.readCountPlus = function(obj){
    return new Promise(function(resolve,reject){
        if(!obj.id) return reject("post id is null");
        var sql = ' update post set readcount = readcount+1 where id = ? ';
        sql = db.format(sql,obj.id);
        db.once(sql,function(err,res){
            if(err) return reject(err);
            if(!res.changedRows) return resolve(null);//insert fail, has same data
            resolve(res);
        });
    })
}

module.exports = post;