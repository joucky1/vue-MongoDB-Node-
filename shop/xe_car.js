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

//指定user_id查询购物车
router.get('/select_car/:user_id', function (req, res) {
    post = querystring.parse(post);

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'xeshop'
    });
    connection.connect();

    var addSql = 'select * from xe_car where user_id=?' + req.params.user_id;

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

//添加购物车商品
router.post('/add_car', function (req, res) {
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
        var addSql = 'INSERT INTO xe_car(user_id,goods_id,car_goods_num) VALUES(0,?,?,?)';
        var addSqlParams = [post.user_id, post.goods_id, post.car_goods_num];

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

// 根据car_id修改商品购买数量
router.post('/update_car_goods_num', function (req, res) {
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

        var modSql = 'UPDATE xe_car SET car_goods_num = ? WHERE car_id = ?';
        var modSqlParams = [post.car_goods_num, post.car_id];

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

// 根据car_id删除用户名
router.get("/delete_car/:car_id", function (req, res) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'xeshop'
    })
    connection.connect()
    var modSql = 'DELETE FROM xe_car where car_id='+req.params.car_id
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