var fs = require("fs");
var mysql = require('mysql');
var url = require('url');
var util = require('util');

var express = require('express');
var router = express.Router()

// post获取数据模块
var querystring = require("querystring");

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

//查询所有商品
router.get('/select_goods', function (req, res) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'xeshop'
    });
    connection.connect();

    connection.query('SELECT * FROM xe_goods', function (err, results) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end(JSON.stringify(results));
    });

    connection.end();
})

//根据ID查询商品
router.get('/select_goods/:goods_id', function (req, res) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'xeshop'
    });
    connection.connect();

    connection.query('SELECT * FROM xe_goods where goods_id=' + req.params.goods_id, function (err, results) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end("ID查询结果：" + JSON.stringify(results));
    });

    connection.end();
})

//添加新商品
router.post('/add_goods', function (req, res) {
    if(req.session.dl == null || req.session.dl == false){
        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end("管理员账号未登录");
        return
    }

    var post=""
    req.on("data", function (chunk) {
        post +=chunk
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
        var addSql = 'INSERT INTO xe_goods(goods_id,goods_name,goods_price,goods_old_price,goods_detail,goods_src,category_id) VALUES(0,?,?,?,?,?,?)';
        var addSqlParams = [post.goods_name, post.goods_price, post.goods_old_price, post.goods_detail, post.goods_src, post.category_id];

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

// goods_id修改商品
router.post('/update_goods', function (req, res) {
    if(req.session.dl == null || req.session.dl == false){
        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end("管理员账号未登录");
        return
    }

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
        var addSql = 'UPDATE xe_goods SET goods_name = ?,goods_price=?,goods_old_price=?,goods_detail=?,goods_src=?,category_id=? WHERE goods_id = ?';
        var addSqlParams = [post.goods_name, post.goods_price, post.goods_old_price, post.goods_detail, post.goods_src, post.category_id, post.goods_id];
        connection.query(addSql, addSqlParams, function (err, results) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
            res.end("修改结果：" + JSON.stringify(results));
        });
        connection.end();
    })
})

//根据ID删除商品
router.get('/delete_goods/:goods_id', function (req, res) {
    if(req.session.dl == null || req.session.dl == false){
        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end("管理员账号未登录");
        return
    }
    
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'xeshop'
    });
    connection.connect();

    var delSql = 'DELETE FROM xe_goods where goods_id=' + req.params.goods_id;

    connection.query(delSql, function (err, result) {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end("修改结果：" + JSON.stringify(result));
    });

    connection.end();
})


module.exports = router