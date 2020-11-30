// var fs = require("fs");
var mysql = require('mysql');
// var url = require('url');
// var util = require('util');

var express = require('express');
var router = express.Router()

// var session = require('express-session');
// var cookieParser = require("cookie-parser");

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

// 查找所有的用户
router.get("/select_user_list", function (req, res) {
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

    var addSql = 'select * from xe_user';

    connection.query(addSql, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end(JSON.stringify(result));
    });

    connection.end();
})

// user_id删除用户
router.get("/delete_user/:user_id", function (req, res) {
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

    var delSql = 'DELETE FROM xe_user where user_id=' + req.params.user_id;

    connection.query(delSql, function (err, result) {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end("删除结果：" + JSON.stringify(result));
    });

    connection.end();
})

//指定user_username查询用户
router.post('/select_user', function (req, res) {
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

        var addSql = 'select * from xe_user where user_username=?';
        var addSqlParams = [post.user_username];

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

//注册新用户
router.post('/add_user', function (req, res) {
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
        var addSql = 'INSERT INTO xe_user(user_id,user_username,user_password,user_name,user_address,user_phone) VALUES(0,?,?,?,?)';
        var addSqlParams = [post.user_username, post.user_password, post.user_name, user_address, post.user_phone];

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

// 根据id修改密码
router.post('/update_user_password', function (req, res) {
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

        var modSql = 'UPDATE xe_user SET user_password = ? WHERE user_id = ?';
        var modSqlParams = [post.user_password, post.user_id];

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

// 根据id修改用户名
router.post('/update_user_name', function (req, res) {
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
        var addSql2 = 'UPDATE xe_user SET user_name = ? WHERE user_id = ?';
        var addSqlParams = [post.user_name, post.user_id];

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

// 根据id修改地址
router.post('/update_user_address', function (req, res) {
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

        var modSql = 'UPDATE xe_user SET user_address = ? WHERE user_id = ?';
        var modSqlParams = [post.user_address, post.user_id];

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

// 根据id修改电话
router.post('/update_user_phone', function (req, res) {
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

        var modSql = 'UPDATE xe_user SET user_phone = ? WHERE user_id = ?';
        var modSqlParams = [post.user_phone, post.user_id];

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

module.exports = router