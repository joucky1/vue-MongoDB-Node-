var fs = require("fs");
var mysql = require('mysql');
var url = require('url');
var util = require('util');

var express = require('express');
var router_admin = express.Router()

var session = require('express-session');
var cookieParser = require("cookie-parser")

// post获取数据模块
var querystring = require("querystring");

//设置跨域访问
router_admin.use(function (req, res, next) {
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

// express中是把session信息存储在内存中,配置session
router_admin.use(session({
    secret: "登录", //设置签名秘钥 内容可以任意填写
    cookie: { maxAge: 3600 * 1000 }, //设置cookie的过期时间，例：3600s后    session和相应的cookie失效过期
    resave: true, //强制保存，如果session没有被修改也要重新保存
    saveUninitialized: false //如果原先没有session那么久设置，否则不设置
}))

// 验证登录
router_admin.post('/admin_login', function (req, res) {
    var aaa
    req.on("data", function (data) {
        aaa = querystring.parse(decodeURIComponent(data))
        req.session.dl = false
    });
    req.on("end", function () {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'xeshop'
        });
        connection.connect();
        connection.query('SELECT * FROM admin', function (err, results) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            var str = JSON.stringify(results)
            var str2 = JSON.parse(str)
            if (req.session.dl == false) {
                for (let i = 0; i < str2.length; i++) {
                    if (str2[i].admin_username == aaa["username"] && str2[i].admin_password == aaa["password"]) {
                        req.session.dl = true
                        return res.redirect(302, "/admin_admin");
                    }
                }
                res.render("login.html", { xxx: "账号或密码错误" })
            }
        });
        connection.end();
    })
})

// admin界面
router_admin.get("/admin_admin", function (req, res) {
    if (req.session.dl == null || req.session.dl == false) {
        res.redirect(302, "/admin_login");
    } else {
        // res.render("admin.html")
        fs.readFile('views/admin.html', function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.writeHead(200, { "Content-Type": "text/html,setchar=utf8" });
            res.end(data)
        });
    }
})

// 登录渲染
router_admin.get('/admin_login', function (req, res) {
    req.session.dl = false
    res.render('login.html', { xxx: "请登录" });
});

module.exports = router_admin