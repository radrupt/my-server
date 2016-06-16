/**
 * Created by wangd on 2016/4/19.
 */
const exec = require('child_process').exec;
const fs = require('fs');
const qiniu = require('../lib/qiniu');
setInterval(
    function(){
        if(new Date().getHours() == 3) {
            exec("sh /home/bash/dumpmysql.sh",
                function (error, stdout, stderr) {
                    if (!error) {
                        console.log(new Date()+"：本地数据库备份成功");
                        fs.readdir('/home/mysqlback',(err,files)=>{
                            if(err){
                                console.log('异地备份失败');
                            }else{
                                if(files.length>0){
                                    fs.readFile('/home/mysqlback/'+files[files.length-1],(err,data)=>{
                                        if(err){
                                            console.log('异地备份失败'+err);
                                        }else{
                                            qiniu.uploadBuf(data,files[files.length-1],'','').then(
                                                (res)=>{
                                                    console.log('异地备份成功');
                                                },(err)=>{
                                                    console.log('异地备份失败'+err);
                                                }
                                            )
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        console.log("本地数据库备份失败。" + stderr);
                    }
                }
            )
        }
    },60*60*1000
);
(function(){



})()