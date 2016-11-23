var express = require('express');
var utility = require('utility');
var app = express();

app.get('/', function (req, res) {
    var q = req.query.q,
        p = req.query.p;
    if(q) {
        res.send(utility.md5(q));
    } else if(p) {
        res.send(utility.sha1(p));
    } else {
        res.send('Hello World');
    }
});

app.listen(3000, function () {
    console.log('app is listening at port 3000');
});
