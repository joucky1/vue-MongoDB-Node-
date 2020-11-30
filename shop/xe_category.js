var fs = require("fs");
var mysql = require('mysql');
var url = require('url');
var util = require('util');

var express = require('express');
var router = express.Router()

var session = require('express-session');
var cookieParser = require("cookie-parser")

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

//一、 查询所有类别
router.get('/select_category', function (req, res) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'xeshop'
    });
    connection.connect();

    connection.query('SELECT * FROM xe_category', function (err, results) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end(JSON.stringify(results));
    });

    connection.end();
})

//二、根据ID查询类别
router.get('/select_category/:category_id', function (req, res) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'xeshop'
    });
    connection.connect();

    connection.query('SELECT * FROM xe_category where category_id=' + req.params.category_id, function (err, results) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end("ID查询结果：" + JSON.stringify(results));
    });

    connection.end();
})

//三、添加新类别
router.post('/add_category', function (req, res) {
    if(req.session.dl == null || req.session.dl == false){
        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end("管理员账号未登录");
        return
    }

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

        var addSql = 'INSERT INTO xe_category(category_id,category_name) VALUES(0,?)';
        var addSqlParams = [post.category_name];

        connection.query(addSql, addSqlParams, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
            res.end(JSON.stringify("插入结果 ID：" + result));
        });

        connection.end();
    });
})

// 四、根据id修改类别
router.post('/update_category', function (req, res) {
    if(req.session.dl == null || req.session.dl == false){
        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end("管理员账号未登录");
        return
    }

    var post
    req.on("data", function (data) {
        post = querystring.parse(decodeURIComponent(data))
    })
    req.on("end", function () {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'xeshop'
        });
        connection.connect();

        var modSql = 'UPDATE xe_category SET category_name = ? WHERE category_id = ?';
        var modSqlParams = [post.category_name, post.category_id];

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

//四、根据ID删除分类
router.get('/delete_category/:category_id', function (req, res) {
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

    var delSql = 'DELETE FROM xe_category where category_id=' + req.params.category_id;

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