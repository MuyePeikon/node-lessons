var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl)
    .end(function (err, res) {
        if (err) {
            return console.error(err);
        }
        var topicUrls = [];
        var count = 0;
        var $ = cheerio.load(res.text);
        $('#topic_list .topic_title').each(function (idx, element) {
            var $element = $(element);
            var href = url.resolve(cnodeUrl, $element.attr('href'));
            topicUrls.push(href);
        });

        async.mapLimit(topicUrls, 5, function(item, callback){
            superagent.get(item)
                .end(function (err, res) {
                    var delay = parseInt((Math.random() * 10000000) % 5000, 10);
                    count++;
                    console.log('现在的并发数是', count, '，正在抓取的是', item, '，耗时' + delay + '毫秒');
                    setTimeout(function () {
                        count--;
                        var $ = cheerio.load(res.text);
                        var content = {
                            title: $('.topic_full_title').text().trim(),
                            href: item,
                            comment1: $('.reply_content').eq(0).text().trim(),
                            author1: $('.reply_author').eq(0).text().trim()
                        }
                        callback(null, content);
                    }, delay);
                });
        }, function(err, res) {
            console.log('final:');
            console.log(res);
        });

});
