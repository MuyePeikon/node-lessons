var superagent = require('superagent');
var request = require('request');
var colors = require('colors');
var async = require('async');
var url = require('url');
var fs = require('fs');

console.log('Start Working...'.cyan);
var baseUrl = 'https://ispip.clang.cn/othernet.html',
    startTime = new Date();
superagent.get(baseUrl).
    end(function(err, res) {
        if(err) {
            console.error(err);
        }
        var ans = res.text,
	    	count = 1,
            ipArr = ans.match(/\d+\.\d+\.\d+\.\d+\/\d+(?=\<br\>)/g);
        async.mapLimit(ipArr, 10, function(item, callback){
            _url = 'http://ip.taobao.com/service/getIpInfo.php?ip=' + item.replace(/\/\d+/, '');
            superagent.get(_url)
                .end(function (err, res) {
					var _ipArea = countIpWithSubnet(item);
                    if(err) {
                        callback(null, {
                            ipArea: _ipArea,
                            isp: "请求出错"
                        });
                    } else {
                        time = getTimeConsume(startTime, new Date());
                        console.log('现在抓取的IP段为：' + item.underline.blue + '，当前已尝试抓取' + count.toString().yellow + '条，总计耗时' + time.green);
			count ++;
                        res = eval('(' + res.text + ')');
                        if(res && res.data) {
                            var sData = {
                                ipArea: _ipArea,
                                isp: res.data.isp == '' ? '未知运营商' : res.data.isp
                            }
                            callback(null, sData);
                        }
                    }
                });
        }, function(err, res) {
            console.log('\n====================================================================================='.rainbow);
	        console.log('Result:'.cyan);
            var allRes = '';
			for(var i = 0, l = res.length; i < l; i ++) {
				console.log(res[i])
                allRes += res[i].ipArea + ' ' + res[i].isp + '\r\n';
        	}
            fs.writeFile('IP.txt', allRes, function (err) {
  				if (err) throw err;
				console.log('写入完成至：IP.txt');
			});
        });
 
    });

function getTimeConsume(start, end) {
    var delay = parseInt((end - start) / 1000);
    if(delay < 60) {
        return delay + '秒';
    } else {
        var ss = delay % 60,
            mm = (delay - ss) / 60;
        return mm + '分' + ss + '秒';
    }
}

function DEC2BIN(dec) {
    var bin = parseInt(dec).toString(2);
    while(bin.length < 8) {
        bin = 0 + bin;
    }
    return bin;
}

function IP2BIN(ip) {
    var Bin = '';
    ip.match(/\d+(?=\.?)/g).forEach(function (val) {
        Bin += DEC2BIN(val);
    })
    return Bin;
}

function BIN2IP(bin) {
    var newIp = parseInt(bin.substr(0, 8), 2) + "." + parseInt(bin.substr(8, 8), 2) + "." + parseInt(bin.substr(16, 8), 2) + "." + parseInt(bin.substr(24, 8), 2);
    return newIp;
}

function changeStr(str, index, newVal) {
    str = str.split('');
    str[index] = newVal;
    str = str.join('');
    return str;
}

function countIpWithSubnet(str) {
	str = str.split(/\//);
    var ipStr = IP2BIN(str[0]),
        ipEd = ipStr;
    for(i = parseInt(str[1]); i < ipStr.length; i ++) {
        ipEd = changeStr(ipEd, i, "1");
    }
    return BIN2IP(ipStr) + '~' + BIN2IP(ipEd);
}

