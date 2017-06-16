var superagent = require('superagent');
var request = require('request');
var colors = require('colors');
var async = require('async');
var url = require('url');
var fs = require('fs');

console.log('Start Working...'.cyan);
var baseUrl = 'https://ispip.clang.cn/othernet.html';
superagent.get(baseUrl).
    end(function(err, res) {
        if(err) {
            console.error(err);
        }
        var ans = res.text,
            ipArr = ans.match(/\d+\.\d+\.\d+\.\d+(?=\/\d+)/g);
//        ipArr = ipArr.slice(0, 3);
        async.mapLimit(ipArr, 10, function(item, callback){
            item = 'http://ip.taobao.com/service/getIpInfo.php?ip=' + item;
            superagent.get(item)
                .end(function (err, res) {
                    if(err) {
                        callback(null, "error IP");
                    } else {
                        console.log('现在抓取的IP段为：' + item.yellow);
                        res = eval('(' + res.text + ')');
                        if(res && res.data) {
                            callback(null, res.data);
                        }
                    }
                });
        }, function(err, res) {
            console.log('final:');
            console.log(res);
        });
 
    });

