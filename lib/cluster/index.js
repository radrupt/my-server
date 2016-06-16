/**
 * Created by wangd on 2016/4/18.
 */
var cluster = require('cluster');
const numCPUs = require('os').cpus().length;

//flag:0：不启用多核，1：启用多核
module.exports = function(cb,flag){
    if(flag){
        if(cluster.isMaster){
            cluster.on('exit',function(){//等待未完成的请求结束
                setTimeout(function(){
                    cluster.fork();
                    console.log('new worker is created');
                },3000);
            });
            for (var i = 0;i < numCPUs;i++){
                cluster.fork();
            }
        }else if(cluster.isWorker){
            cb();
        }
    }else{
        if(cluster.isMaster) {
            cb();
        }
    }
};

