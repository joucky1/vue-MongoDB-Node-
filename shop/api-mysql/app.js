var express = require('express');
var app = express();
var fs = require("fs");
var mysql = require('mysql');

// post数据获取模块
var querystring = require("querystring");

//设置跨域访问
app.use(function (req, res, next) {
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

//一、 查询
app.get('/listUsers', function (req, res) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'test'
    });
    connection.connect();

    connection.query('SELECT * FROM a', function (err, results) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        res.end(JSON.stringify(results));
    });

    connection.end();
})

//二、根据ID查询
// app.get('/listUsers/:id', function (req, res) {
//     var connection = mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: '123456',
//         database: 'test'
//     });
//     connection.connect();

//     connection.query('SELECT * FROM a where id=' + req.params.id, function (err, results) {
//         if (err) {
//             console.log('[SELECT ERROR] - ', err.message);
//             return;
//         }

//         res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
//         res.end("ID查询结果：" + JSON.stringify(results));
//     });

//     connection.end();
// })

//三、添加新用户
app.post('/addUser', function (req, res) {
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
            database: 'test'
        });
        connection.connect();

        var addSql = 'INSERT INTO a(id,name) VALUES(0,?)';
        var addSqlParams = [post.name];

        connection.query(addSql, addSqlParams, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
            res.end(+ JSON.stringify("插入结果 ID：" + result));
        });

        connection.end();
    });
})

// 四、修改
// app.get('/addUser2', function (req, res) {
//     var connection = mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: '123456',
//         database: 'test'
//     });
//     connection.connect();

//     var modSql = 'UPDATE a SET name = ? WHERE Id = ?';
//     var modSqlParams = ['菜鸟移动站abc', 2];

//     connection.query(modSql, modSqlParams, function (err, result) {
//         if (err) {
//             console.log('[UPDATE ERROR] - ', err.message);
//             return;
//         }

//         res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
//         res.end("修改结果：" + JSON.stringify(result));
//     });

//     connection.end();
// })

//四、根据ID删除用户
app.get('/deleteUser:id', function (req, res) {
    var id=req.params.id;
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'test'
    });
    connection.connect();

    var delSql = 'DELETE FROM a where id='+id;

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





var server = app.listen(8080, function () {

    console.log("开启成功")

})