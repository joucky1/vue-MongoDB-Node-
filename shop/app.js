var express = require('express');
var app = express();

//导入模块
var router_admin = require('./admin');
var router_user = require("./xe_user")
var router_goods = require('./xe_goods');
var router_category = require('./xe_category');
var router_car = require('./xe_car');
var router_order = require('./xe_order');
var router_photo = require('./photo');
const router = require('./photo');

//设置跨域访问
router.use(function (req, res, next) {
    if (req.method === "OPTIONS") {
        let headers = {};
        headers["Access-Control-Allow-Origin"] = "*";

        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";

        headers["Access-Control-Allow-Credentials"] = false;

        headers["Access-Control-Max-Age"] = '86400'; // 24 hours

        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";

        res.writeHead(200, headers);

        res.end();
    } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        next();
    }
});

app.use('/public', express.static('./public/'));

app.engine('html', require('express-art-template'));

// 调用模块
app.use(router_admin)
app.use(router_user)
app.use(router_goods)
app.use(router_category)
app.use(router_car)
app.use(router_order)
app.use(router_photo)

var server = app.listen(5678, function () {

    console.log("开启成功")

})