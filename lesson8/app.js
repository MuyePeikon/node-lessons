var express = require('express');
var app = express();

var fibonacci = function(n) {
    if(n > 40) {
        throw new Error('EXCEEDS LIMIT!');
    } else if(n > 1) {
        return fibonacci(n-1) + fibonacci(n-2);
    } else if(n == 1){
        return 1;
    } else if(n == 0){
        return 0;
    } else {
        throw new Error('Invalid n!');
    }
}

app.get('/fib', function (req, res) {
    // http 传来的东西默认都是没有类型的，都是 String，所以我们要手动转换类型
    var n = Number(req.query.n);
    try {
        // 为何使用 String 做类型转换，是因为如果你直接给个数字给 res.send 的话，
        // 它会当成是你给了它一个 http 状态码，所以我们明确给 String
        res.send(String(fibonacci(n)));
    } catch (e) {
        // 如果 fibonacci 抛错的话，错误信息会记录在 err 对象的 .message 属性中。
        // 拓展阅读：https://www.joyent.com/developers/node/design/errors
        console.log(e.message);
        res.status(500)
            .send(e.message);
    }
});

//module.exports 初始值为一个空对象 {}, exports 是对 module.exports 的引用。只有要改变 module.exports 的类型时才用 module.exports
module.exports = app;

app.listen(3000, function () {
  console.log('app is listening at port 3000');
});
