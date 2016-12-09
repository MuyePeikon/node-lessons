var superagent = require('superagent');
var request = require('request');
var colors = require('colors');
var async = require('async');
var url = require('url');
var fs = require('fs');

fs.readFile('in.txt', 'utf8', function(err, res){
    console.log('Start Working...'.cyan);
    var baseUrl = 'http://cgi.kg.qq.com/fcgi-bin/kg_ugc_getdetail?callback=jsopgetsonginfo&inCharset=GB2312&outCharset=utf-8&format=&g_tk=519603570&g_tk_openkey=519603570&v=4&shareid=';
    var songUrls = res.replace(/.+\?s=(\w+?)&.+/g, baseUrl + '$1').split('\n').slice(0, -1);
    var count = 0;
    async.mapLimit(songUrls, 2, function(item, callback){
        superagent.get(item).buffer(true)
            .end(function (err, res) {
                var delay = parseInt((Math.random() * 10000000) % 5000, 10);
                count++;
                console.log('    现在的并发数是 ' + count.toString().red + '，正在抓取的是 ' + item.underline.grey + '，耗时 ' + delay.toString().yellow + ' 毫秒');
                setTimeout(function () {
                    count--;
                    var rData = JSON.parse(res.text.slice(16, -1)).data;
                    var sData = {
                        songName: rData.song_name.replace(' ','_'),
                        songAddr: rData.playurl,
                        singer: rData.nick.replace(' ','_')
                    }
                    callback(null, sData);
                }, delay);
            });
    }, function(err, res) {
        console.log('\n====================================================================================='.rainbow);
        console.log('Result:'.cyan);
        for(var i = 0, l = res.length; i < l; i ++) {
            (function () {
                var _name = res[i].songName + '-' + res[i].singer + '.mp3';
                downloadFile(res[i].songAddr, _name, function() {
                    console.log('    ' + _name.blue + ' -> 下载完毕'.green);
                });
            })();
        }
    });
})

function downloadFile(uri,filename,callback){
    var stream = fs.createWriteStream('./Download/' + filename);
    request(uri).pipe(stream).on('close', callback); 
}
