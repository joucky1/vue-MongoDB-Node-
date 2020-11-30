var express = require('express');
var app = express();

// 引入mongoDB模块
var MongoClient = require('mongodb').MongoClient;


// 开放包
app.use('/public', express.static('./public/'));
// monogoDB连接字符串
var DB_CONN_STR=' mongodb://127.0.0.1:27017/'

// 解决跨域问题
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Method", "*");
    res.header("Access-Control-Allow-Headers","Content-Type");
    res.header("Access-Control-Max-Age", "3600");
    next();
});

// 用来临时的存数据
var _xxObj = {
    arrs:[{
        id:'n1',
        name:'倚天屠龙记',
        vals:'倚天'
    },{
        id:'n2',
        name:'三国演义',
        vals:'三国'
    },{
        id:'n3',
        name:'红楼梦',
        vals:'红楼'
    }]
}

// 保存过滤的结果，因为现在没有db
var _filterResult = null;

// 过滤方法
function filter( _val ){
	return _xxObj.arrs.filter( _g =>{
		return _g.vals === _val
	})
}

// 第一个nodeJs接口，接收
app.get('/node_a', function(req, res){
	console.log( req.query.v_data );

	let _result = filter( req.query.v_data );

	_filterResult = _result.length !== 0 ? _result : [{id:'xxx', name:'没有结果'}]

	res.end();
});

// 第二个接口，发送
app.get('/node_b', function(req, res){
return res.send( _filterResult )
});

// 用户注册信息
app.post('/register_post',function(req,res){
    let _allData = ''
    req.on('data',function(_d){
        _allData += _d

    })
    req.on('end',function(){
        console.log(_allData)
        // 将提交的类转化为json格式
        let _registertMsg = JSON.parse(_allData);
        // 查重
        findSameNameFn(_registertMsg,res)
        
    })

})
// 查询注册重复封装
function findSameNameFn(_registertMsg,res){
    // 连接数据库
    MongoClient.connect(DB_CONN_STR,function(err,db){
        var _dbo = db.db('bookShop');
        var _collection =_dbo.collection('userInfo');
        _collection.findOne({"username":_registertMsg.username},{},function(err,result){
            if(err)throw err;
            if(result ===null){
                //判断没有重名后添加用户数据
                insertNewUserName(_registertMsg,res)
            }else if(result.username ===_registertMsg.username){
               return res.send({
                    regInfo:'用户名已存在',
                     reg_code:2
                 })
            } 
            db.close();
        })
        
    })
}
// 插入新用户数据封装
function insertNewUserName(_registertMsg,res){
    MongoClient.connect(DB_CONN_STR,function(err,db){
        // 数据库信息
        var _dbo = db.db('bookShop');
        var _collection =_dbo.collection('userInfo');
        _collection.insertOne(_registertMsg,function(err,result){
            if(err)throw err;
            console.log('注册成功')
          return res.send({
                regInfo:'注册成功!',
                reg_code:1
            })
        })
        db.close();
        
    })
}
// 登录功能
    //后台拿到前台数据
app.post('/userLogin_post',function(req,res){
    var _loginData='';
    req.on('data',function(_d){
        _loginData +=_d;
    });
    req.on('end',function(_d){
        // console.log(JSON.parse(_loginData));验证是否拿到数据
    let _tem = JSON.parse(_loginData)
        // 连接数据库判断数据库信息是否存在实现登录
    MongoClient.connect(DB_CONN_STR,function(err,db){
        var _dbo = db.db('bookShop');
        var _collection =_dbo.collection('userInfo');
        _collection.findOne({"username":_tem.u},{},function(err,result){
            if(err)throw err;
           
            if(result === null){
                console.log('用户不存在')
               return res.send({
                    regInfo:'用户不存在',
                    reg_code:5
                    })
            }else if(_tem.p !==result.password){
                console.log('密码不对')
               return res.send({
                    regInfo:'输入的密码不正确',
                    reg_code:4
                    })
            }else if(result!==null && _tem.p == result.password){
                console.log('登录成功')
               return res.send({
                    regInfo:result,
                    reg_code:3
                    })
            }          
            db.close();
            })
        })
    })
    
    
})
 //批量录入商品
 app.post('/insertGoods',function(req,res){
     var _dataObj = ''
     req.on('data',function(_d){
        _dataObj += _d
     })
     req.on('end',function(_d){
        let _insertGoodsArrsObj = JSON.parse(_dataObj)
        // console.log(_insertGoodsArrsObj)
        MongoClient.connect( DB_CONN_STR ,function(err,db){
            // 数据库信息
            var _dbo = db.db('bookShop');
            //商品栏目goodsCategory
            var _collection =_dbo.collection('goodsCategory');
            _collection.insertMany(_insertGoodsArrsObj,function(err,result){
                if(err)throw err;
                
              return res.send({
                    regInfo:'商品录入成功!',
                    reg_code:5
                })
                
            })
            db.close();
        })
     })
 })
//  获得商品列表-大类
app.get('/getGoodsCategory',function(req,res){
    
    MongoClient.connect( DB_CONN_STR ,function(err,db){
        // 数据库信息
        var _dbo = db.db('bookShop');
        //商品栏目goodsCategory
        var _collection =_dbo.collection('goodsCategory');
        _collection.aggregate([
            {
            $lookup:{
                localField:'d',
                from:'goodsList_a',
                foreignField:'category',
                as:'goodsList_aa'
            }
        },
        {
            $lookup:{
                localField:'d',
                from:'goodsList_b',
                foreignField:'category',
                as:'goodsList_bb'
            }
        },
        {
            $lookup:{
                localField:'d',
                from:'goodsList_c',
                foreignField:'category',
                as:'goodsList_cc'
            }
        },
        {
            $lookup:{
                localField:'d',
                from:'goodsList_d',
                foreignField:'category',
                as:'goodsList_dd'
            }
        }
    ]).toArray(function(err,result){
            if(err)throw err;
            
          return res.send( result );
          db.close();
        });
        
    })

})
// 批量插入商品到数据库
function inserTemGoodsList(){

//     let TempGoodListObj = [
//    {
//         name:'黑黑',
//         price:22,
//         category:'goodsList_d',
//         img:'https://tse4-mm.cn.bing.net/th/id/OIP.x7EBpvMeYqCypkkO5nvI1AHaKv?w=206&h=300&c=7&o=5&dpr=1.25&pid=1.7'
//     },
//     {
//         name:'花花',
//         price:28,
//         category:'goodsList_d',
//         img:'https://tse4-mm.cn.bing.net/th/id/OIP.OWiCaFk2-6CHxaBHMRhSdQHaLH?w=204&h=306&c=7&o=5&dpr=1.25&pid=1.7'
//     },
//     {
//         name:'七七',
//         price:92,
//         category:'goodsList_d',
//         img:'https://tse1-mm.cn.bing.net/th/id/OIP.UrEcQE4eAW8VsaeFISSEUgHaLH?w=204&h=306&c=7&o=5&dpr=1.25&pid=1.7'
//     },
//     {
//         name:'豆豆',
//         price:192,
//         category:'goodsList_d',
//         img:'https://tse1-mm.cn.bing.net/th/id/OIP.Op-UrUvI-MfYjoCrQ7Ib_AHaLH?w=204&h=306&c=7&o=5&dpr=1.25&pid=1.7'
//     },
    

//     ];


    MongoClient.connect( DB_CONN_STR ,function(err,db){
        // 数据库信息
        var _dbo = db.db('bookShop');
        //商品栏目goodsCategory
        var _collection =_dbo.collection('goodsList_d');
        _collection.insertMany(TempGoodListObj,function(err,result){
            if(err)throw err;
            db.close();
        });
        
    })

}
// 加数据用的一次行手动添加
// inserTemGoodsList()

// 更据id获取对应商品信息
app.get('/getGoodsInfo',function(req,res){
    var _findId = req.query._id
    var _c = req.query._c

    // 引入MonogoDb的id对象
    var ObjectID = require('mongodb').ObjectID;
	var _findObjId = ObjectID.createFromHexString( _findId );
    MongoClient.connect( DB_CONN_STR, function(err, db){
		// 数据库名：bookShop
		var _dbo = db.db('bookShop');
		// 商品栏目集合名：_c
		var _collection = _dbo.collection( _c );
		// 这里一定是双引号
		_collection.findOne({"_id":_findObjId},{}, function(err, result){
			if(err) throw err;

			return res.send(result);
			db.close();
		});
	});

})
 // 查询栏目的商品  这个有BUG还没改好
 app.get('/getCategoryGoodsList',function(req, res){
	// 这是各个集合，什么。。。goodsList_a，goodsList_b...
	var _c = req.query.categoryId;

	MongoClient.connect( DB_CONN_STR, function(err, db){
		// 数据库名：proShopCart
		var _dbo = db.db('bookShop');
		// 商品栏目集合名：goodsCategory
		var _collection = _dbo.collection( _c );
		// 这里一定是双引号
		_collection.find().toArray(function(err, result){
			if(err) throw err;

			return res.send(result);
			db.close();
		});
	});
});
// 分页接口
app.get('/getPageChange',function(req, res){
	var _s = req.query.startNum;
	var _c = req.query.c;

	MongoClient.connect( DB_CONN_STR, function(err, db){
		// 数据库名：proShopCart
		var _dbo = db.db('bookShop');
		// 商品栏目集合名：goodsCategory
		var _collection = _dbo.collection( _c );
		// 这里一定是双引号
		// .limit()，限制
		_collection.find().limit(8).skip(Number(_s))
			.toArray(function(err, result){
				if(err) throw err;

				return res.send(result);
			
            });
            db.close();
	});
});
// 轮播图
app.get('/getImgUrls',function(req,res){
    let imgObj = {
        urls:[
            'http://seopic.699pic.com/photo/50079/2232.jpg_wh1200.jpg',
            'https://nd.natureasia.com/figure/7144/102688/phone/1',
            'https://tse2-mm.cn.bing.net/th/id/OIP._L1LzutxT5j-zvg-0xC8XwHaE8?w=249&h=180&c=7&o=5&dpr=1.25&pid=1.7',
            'https://tse1-mm.cn.bing.net/th/id/OIP.936qvWrYSfnlI8BkwLxZTgHaE8?w=242&h=180&c=7&o=5&dpr=1.25&pid=1.7'
        ]
    }
    return res.send(imgObj);
})
app.listen( 5678,function(){
	console.log( '5678，后台启动！' )
});