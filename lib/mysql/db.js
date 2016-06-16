/**
 * Created by wangd on 2016/2/18.
 */
var mysql = require('mysql');

var db = function(ob){
    this.pool =  mysql.createPool(ob.config);
    this.conn = null;
}
db.prototype.format = mysql.format;
db.prototype.err = function(code,errcode){
    var object = {};
    if(!errcode[code]) return {999:"dbo operate error"};
    object[code] = errcode[code];
    return object;
}
//获取对象里属性的个数
db.prototype.objectLength = function(object){
    var array = [];
    object = object || {};
    for(var k in object){array.push(k)};
    return array.length;
}
//根据对象生成set语句
db.prototype.produceSet = function(object){
    var stri = " set";
    for(var i = 0; i < this.objectLength(object); i++){
        stri += " ?? = ?,";
    }
    stri = stri.replace(/,$/,'');
    stri = stri.replace(/set$/,'');
    stri = this.format(stri,this.object2Array(object));
    return stri;
}
//根据对象生成where语句，只支持单值查询,范围查询，between,in 之类的命令直接使用字符串
db.prototype.produceWhere = function(where){
    if(typeof where == 'string') return where;
    var stri = " where";
    for(var i = 0; i < this.objectLength(where); i++){
        stri += " ?? = ? and";
    }
    stri = stri.replace(/and$/,'');
    stri = stri.replace(/where$/,'');
    stri = this.format(stri,this.object2Array(where));
    return stri;
}
//根据对象生成排序语句，如“xx,yy”
db.prototype.produceOrder = function(orderby){
    return orderby && (" order by "+orderby) || '';
}
//根据对象里的page和pagesize属性生成分页查询语句
db.prototype.produceLimit = function(limit){
    limit = limit || {};
    limit.page = parseInt(limit.page) || 1;
    limit.pagesize = parseInt(limit.pagesize) || 15;
    var stri = " limit ?,? ";
    stri = stri.replace(/,$/,'');
    stri = this.format(stri,[(limit.page-1)*limit.pagesize,limit.pagesize]);
    return stri;
}
//对象转数组
db.prototype.object2Array = function(object){
    var array = [];
    object = object || {};
    for(var k in object){
        array.push(k);
        array.push(object[k]);
    }
    return array;
}
//筛选出对象里的指定字段
db.prototype.genTableObject = function(obj,keyarr){
    var o = {};
    for(var v of keyarr){
        if(obj.hasOwnProperty(v)) o[v] = obj[v];
    }
    return o;
}
//基础指令封装 -- start

//where:object or string,orderby:string,limit:{page:x,pagesize:x}
db.prototype.findPage = function(tablename,where,orderby,limit,cb){
    if(!tablename) return cb("tablename is null");
    var sql = " select * from ?? ";
    sql = this.format(sql,[tablename]);
    sql += this.produceWhere(where);
    sql += this.produceOrder(orderby);
    sql += this.produceLimit(limit);
    this.once(sql,cb);
}
db.prototype.findOne = function(tablename,where,cb){
    if(!tablename) return cb("tablename is null");
    var sql = " select * from ?? ";
    sql = this.format(sql,[tablename]);
    sql += this.produceWhere(where);
    sql += ' limit 1';
    this.once(sql,cb);
};
db.prototype.find = function(tablename,where,orderby,cb){
    if(!tablename) return cb("tablename is null");
    var sql = " select * from ?? ";
    sql = this.format(sql,[tablename]);
    sql += this.produceWhere(where);
    sql += this.produceOrder(orderby);
    this.once(sql,cb);
};
db.prototype.insert = function(tablename,obj,cb){
    if(!tablename) return cb("tablename is null");
    var sql = " insert into ?? ";
    sql = this.format(sql,[tablename]);
    sql += this.produceSet(obj);
    this.once(sql,cb);
}
db.prototype.update = function(tablename,obj,where,cb){
    if(!tablename) return cb("tablename is null");
    var sql = " update ?? ";
    sql = this.format(sql,[tablename]);
    sql += this.produceSet(obj);
    sql += this.produceWhere(where);
    this.once(sql,cb);
}
db.prototype.delete = function(tablename,where,cb){
    if(!tablename) return cb("tablename is null");
    var sql = " delete from ?? ";
    sql = this.format(sql,[tablename]);
    sql += this.produceWhere(where);
    this.once(sql,cb);
}
//基础指令封装 -- end

//执行请求
db.prototype.once = function(sql,cb){
    var self = this;
    if(self.conn){
        conn.query(sql,function(err,result){
            if(err){
                conn.rollback(function () {
                    if(cb) cb(err);
                });
            }
            if(cb) {
                cb(null,result);
            }
        })
    }else {
        this.pool.getConnection(function (err, con) {
            if (err) {
                throw err;
            } else {
                if (con) {
                    con.query(sql, function (err, result) {
                        con.release();
                        if (err) {
                            cb(err);
                        } else if (cb) {
                            result = JSON.parse(JSON.stringify(result))
                            cb(null, result);
                        }
                    })
                } else {
                    throw 'mysqlsql:Failed to getConnection!';
                }
            }
        });
    }
}
//事务处理
db.prototype.trans = function(cb){
    var self = this;
    this.pool.getConnection(function(err,con){
        if(err){
            throw err;
        }else{
            if(con){
                con.beginTransaction(function (err) {
                    if (err) {
                        cb(err);
                    }else{
                        self.conn = con;
                        cb(null);
                    }
                })
            }else{
                throw 'mysqlsql:Failed to getConnection!';
            }
        }
    });
}
db.prototype.commit = function(cb){
    var self = this;
    self.conn.commit(function (err) {
        if (err) {
            self.conn.rollback(function () {
                try {
                    self.conn.release();
                    self.conn = null;
                } catch (err) {
                    throw err;
                }
                if(cb)cb(err);
            });
        }else{
            try {
                self.conn.release();
                self.conn = null;
            } catch (err) {
                throw err;
            }
            if(cb)cb(null);
        }
    });
}
db.prototype.rollback = function(cb) {
    var self = this;
    self.conn.rollback(function () {
        try{
            self.conn.release();
            self.conn = null;
        } catch(err) {
            throw err;
        }
        if(cb)cb();
    });
}
module.exports = db;