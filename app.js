var http = require("http"),
    url = require("url"),
    superagent = require("superagent"),
    express = require('express'),
    cheerio = require("cheerio"),
    async = require("async"),
    eventproxy = require('eventproxy');

var ep = new eventproxy(),
    app = express(),
    arrUrl = [],    //存放爬取网址
    pageUrls = [],  //存放收集文章页面网站
    pageNum = 200;  //要爬取文章的页数

for(var i=1 ; i<= 3 ; i++){
    arrUrl.push('http://www.cnblogs.com/#p'+i 

);
}

//after，第一个参数是事件名，第二个参数是事件的数量，回调函数的参数是list集合，
ep.after('subscribe', arrUrl.length, function(results) {
    app.get('/', function(req, res) {
        res.send(results);

    }).listen('3000',function () {
        console.log('listening at 3000');
    });
    //console.log('done');
});

arrUrl.forEach(function(item, index) {
    http.get(item, function (res) {
        var html = '';
        console.log(item);
        res.on('data', function (data) {
            html += data;
        });

        res.on('end', function () {
            var $ = cheerio.load(html);
            //console.log(html);
            var uList = [];
            $("#post_list>.post_item").each(function(){
                uList.push({
                    "文章名称": $(this).children(".post_item_body").children("h3").text()+'\n'
                });
            });

            console.log(uList);
            pageUrls = pageUrls.concat(uList);
            console.log("-----------------------------------------------------------");
            //通知ep的subscribe事件，ep监测执行完的事件数量等于arrUrl.length,如果等于 执行回到函数。
            ep.emit('subscribe', pageUrls);

        });
    });
});
