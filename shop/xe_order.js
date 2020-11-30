// var fs = require("fs");
var mysql = require('mysql');
// var url = require('url');
// var util = require('util');

var express = require('express');
var router = express.Router()

// var session = require('express-session');
// var cookieParser = require("cookie-parser")

// post获取数据模块
var querystring = require("querystring");
const { post } = require('./admin');

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

//指定user_id查询订单
router.get('/select_order/:user_id', function (req, res) {
    post = querystring.parse(post);

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'xeshop'
    });
    connection.connect();

    var addSql = 'select * from xe_order where user_id=?' + req.params.user_id;

    connection.query(addSql, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end(JSON.stringify("插入结果 ID：" + result));
    });

    connection.end();

})

//添加订单
router.post('/add_order', function (req, res) {
    var post
    req.on("data", function (data) {
        post = querystring.parse(decodeURIComponent(data))
    });
    req.on("end", function () {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'xeshop'
        });
        connection.connect();
        var addSql = 'INSERT INTO xe_order(user_id,goods_id,order_goods_num) VALUES(0,?,?,?)';
        var addSqlParams = [post.user_id, post.goods_id, post.order_goods_num];

        connection.query(addSql, addSqlParams, function (err, results) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
            res.end("注册结果：" + JSON.stringify(results));
        });
        connection.end();
    })
})

// 根据order_id修改商品购买数量
router.post('/update_order_goods_num', function (req, res) {
    var post = "";

    req.on("data", function (chunk) {
        post += chunk;
    });
    req.on("end", function () {
        post = querystring.parse(post);

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'xeshop'
        });
        connection.connect();

        var modSql = 'UPDATE xe_order SET order_goods_num = ? WHERE order_id = ?';
        var modSqlParams = [post.order_goods_num, post.order_id];

        connection.query(modSql, modSqlParams, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
            res.end("修改结果：" + JSON.stringify(result));
        });
        connection.end();
    })
})

// 根据order_id删除用户名
router.get("/delete_car/:order_id", function (req, res) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'xeshop'
    })
    connection.connect()
    var modSql = 'DELETE FROM xe_order where order_id=' + req.params.order_id
    connection.query(modSql, function (err, result) {
        if (err) {
            console.log('[UPDATE ERROR] - ', err.message)
            return
        }
        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end("修改结果：" + JSON.stringify(result));
    })
    connection.end()
})

module.exports = router