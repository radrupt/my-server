/**
 * Created by wangd on 2016/3/24.
 */
var db = require('./db');

var text2Image = require('../../lib/genImage').text2Image;

var gyroscope = {};

gyroscope.list = function(obj){
    return new Promise(function(resolve,reject){
        var where = " where";
        if(obj.direct == 'left') {
            where+=' (';
            if(obj.x<=1){
                resolve({
                    cd_x:0,cd_y:obj.y,cd_z:obj.z,src:''
                })
                return;
            }
            for(var i = 1; i < obj.x;i++){
                where+=" x = ? or";
                where = db.format(where,[i])
            }
            where = where.replace(/or$/,'');
            where+= ')';
            where = where.replace('()','');
            where+=" and y = ? and z = ?";
            where = db.format(where,[obj.y,obj.z]);
            db.findPage('mj_gyroscope_touch_info',where,' x desc',obj,function(err,row){
                if(err) return reject(err);
                if(!row.length){
                    resolve({
                        cd_x:0,cd_y:obj.y,cd_z:obj.z,src:''
                    })
                }else{
                    var array = [];
                    for(var i= 0; i < row.length; i++){
                        if(row[i].x == row[0].x) {
                            array.push({
                                cd_x: row[i].x, cd_y: row[i].y, cd_z: row[i].z, cd_name: row[i].name
                                ,src:text2Image(row[i].code+'-'+row[i].number+'-'+row[i].name+'-'+row[i].x+'-'+row[i].y+'-'+row[i].z)
                            })
                        }
                    }
                    resolve({partInfo:array});
                }
            });
        }else if(obj.direct == 'right'){
            if(obj.x>=9){
                resolve({
                    cd_x:10,cd_y:obj.y,cd_z:obj.z,src:''
                })
                return;
            }
            where+=' (';
            for(var i = obj.x + 1; i < 10;i++){
                where+=" x = ? or";
                where = db.format(where,[i])
            }
            where = where.replace(/or$/,'');
            where+= ')';
            where = where.replace('()','');
            where+=" and y = ? and z = ?";
            where = db.format(where,[obj.y,obj.z]);
            db.findPage('mj_gyroscope_touch_info',where,' x asc',obj,function(err,row){
                if(err) return reject(err);
                if(!row.length){
                    resolve({
                        cd_x:10,cd_y:obj.y,cd_z:obj.z,src:''
                    })
                }else{
                    var array = [];
                    for(var i= 0; i < row.length; i++){
                        if(row[i].x == row[0].x) {
                            array.push({
                                cd_x: row[i].x, cd_y: row[i].y, cd_z: row[i].z, cd_name: row[i].name
                                ,src:text2Image(row[i].code+'-'+row[i].number+'-'+row[i].name+'-'+row[i].x+'-'+row[i].y+'-'+row[i].z)
                            })
                        }
                    }
                    resolve({partInfo:array});
                }
            });
        }else if(obj.direct == 'bottom') {
            if(obj.z<=1){
                resolve({
                    cd_x:obj.x,cd_y:obj.y,cd_z:0,src:''
                })
                return;
            }
            where+=' (';
            for(var i = 1; i < obj.z;i++){
                where+=" z = ? or";
                where = db.format(where,[i])
            }
            where = where.replace(/or$/,'');
            where+= ')';
            where = where.replace('()','');
            where+=" and x = ? and y = ?";
            where = db.format(where,[obj.x,obj.y]);
            db.findPage('mj_gyroscope_touch_info',where,' z desc',obj,function(err,row){
                if(err) return reject(err);
                if(!row.length){
                    resolve({
                        cd_x:obj.x,cd_y:obj.y,cd_z:0,src:''
                    })
                }else{
                    var array = [];
                    for(var i= 0; i < row.length; i++){
                        if(row[i].z == row[0].z) {
                            array.push({
                                cd_x: row[i].x, cd_y: row[i].y, cd_z: row[i].z, cd_name: row[i].name
                                ,src:text2Image(row[i].code+'-'+row[i].number+'-'+row[i].name+'-'+row[i].x+'-'+row[i].y+'-'+row[i].z)
                            })
                        }
                    }
                    resolve({partInfo:array});
                }
            });
        }else if(obj.direct == 'top'){
            if(obj.z>=3){
                resolve({
                    cd_x:obj.x,cd_y:obj.y,cd_z:4,src:''
                })
                return;
            }
            where+=' (';
            for(var i = obj.z+1; i < 4;i++){
                where+=" z = ? or";
                where = db.format(where,[i])
            }
            where = where.replace(/or$/,'');
            where+= ')';
            where = where.replace('()','');
            where+=" and x = ? and y = ?";
            where = db.format(where,[obj.x,obj.y]);
            db.findPage('mj_gyroscope_touch_info',where,' z asc',obj,function(err,row){
                if(err) return reject(err);
                if(!row.length){
                    resolve({
                        cd_x:obj.x,cd_y:obj.y,cd_z:4,src:''
                    })
                }else{
                    var array = [];
                    for(var i= 0; i < row.length; i++){
                        if(row[i].z == row[0].z) {
                            array.push({
                                cd_x: row[i].x, cd_y: row[i].y, cd_z: row[i].z, cd_name: row[i].name
                                ,src:text2Image(row[i].code+'-'+row[i].number+'-'+row[i].name+'-'+row[i].x+'-'+row[i].y+'-'+row[i].z)
                            })
                        }
                    }
                    resolve({partInfo:array});
                }
            });
        }else if(obj.direct == 'out') {
            if(obj.y<=1){
                resolve({
                    cd_x:obj.x,cd_y:0,cd_z:obj.z,src:''
                })
                return;
            }
            where+=' (';
            for(var i = 1; i < obj.y;i++){
                where+=" y = ? or";
                where = db.format(where,[i])
            }
            where = where.replace(/or$/,'');
            where+= ')';
            where = where.replace('()','');
            where+=" and x = ? and z = ?";
            where = db.format(where,[obj.x,obj.z]);
            db.findPage('mj_gyroscope_touch_info',where,' y desc',obj,function(err,row){
                if(err) return reject(err);
                if(!row.length){
                    resolve({
                        cd_x:obj.x,cd_y:0,cd_z:obj.z,src:''
                    })
                }else{
                    var array = [];
                    for(var i= 0; i < row.length; i++){
                        if(row[i].y == row[0].y) {
                            array.push({
                                cd_x: row[i].x, cd_y: row[i].y, cd_z: row[i].z, cd_name: row[i].name
                                ,src:text2Image(row[i].code+'-'+row[i].number+'-'+row[i].name+'-'+row[i].x+'-'+row[i].y+'-'+row[i].z)
                            })
                        }
                    }
                    resolve({partInfo:array});
                }
            });
        }else if(obj.direct == 'in'){
            if(obj.y>=12){
                resolve({
                    cd_x:obj.x,cd_y:13,cd_z:obj.z,src:''
                })
                return;
            }
            where+=' (';
            for(var i = obj.y + 1; i < 13;i++){
                where+=" y = ? or";
                where = db.format(where,[i])
            }
            where = where.replace(/or$/,'');
            where+= ')';
            where = where.replace('()','');
            where+=" and x = ? and z = ?";
            where = db.format(where,[obj.x,obj.z]);
            db.findPage('mj_gyroscope_touch_info',where,' y asc',obj,function(err,row){
                if(err) return reject(err);
                if(!row.length){
                    resolve({
                        cd_x:obj.x,cd_y:13,cd_z:obj.z,src:''
                    })
                }else{
                    var array = [];
                    for(var i= 0; i < row.length; i++){
                        if(row[i].y == row[0].y) {
                            array.push({
                                cd_x: row[i].x, cd_y: row[i].y, cd_z: row[i].z, cd_name: row[i].name
                                ,src:text2Image(row[i].code+'-'+row[i].number+'-'+row[i].name+'-'+row[i].x+'-'+row[i].y+'-'+row[i].z)
                            })
                        }
                    }
                    resolve({partInfo:array});
                }
            });
        }
    })
}

gyroscope.likeList = function(obj){
    return new Promise(function(resolve,reject) {
        if(!obj.name){
            resolve({partInfo:[]})
            return;
        }
        var where = " where name like '%"+decodeURIComponent(obj.name)+"%'";
        db.findPage('mj_gyroscope_touch_info',where,'',obj,function(err,row){
            if(err) return reject(err);
            if(!row.length){
                resolve({partInfo:[]})
            }else{
                var array = [];
                for(var i= 0; i < row.length; i++){
                    if(row[i].x == row[0].x) {
                        array.push({
                            cd_x: row[i].x, cd_y: row[i].y, cd_z: row[i].z, cd_name: row[i].name
                            ,src:text2Image(row[i].code+'-'+row[i].number+'-'+row[i].name+'-'+row[i].x+'-'+row[i].y+'-'+row[i].z)
                        })
                    }
                }
                resolve({partInfo:array});
            }
        });
    })
}

module.exports = gyroscope;