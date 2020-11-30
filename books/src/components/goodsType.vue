<template>
  <div>
    <van-button v-if="isLogin" type="warning" @click="entryGoodToDb" class="inlandBtn" size="mini">录入商品</van-button>
   <!-- 横行导行栏 -->
   <div class="wrapDiv cle">
      <van-tabs @click="headColumnFn" v-model="tabActive" animated class="shopNav">
        <van-tab v-for="(item,inx) in goodsCategoryData" :key="inx" :title= item.n class="nav-top">
          <img :src= item.i>
        </van-tab>
    </van-tabs>
  </div>
  <!-- 竖向分类栏 -->
  <div class="sideBarFn">
    <van-sidebar v-model="activeBadgeKey" @change="onBadgeChange">
    <van-sidebar-item v-for="(item,inx) in goodsCategoryData" 
    :key="inx"
    :title= item.n
    class="sideBarFnItem"
     />
 </van-sidebar>
  </div>
  <!-- 商品展示在分类栏展示 -->
  <div class="columnData">
    <ul v-for="(item,inx) in goodsListData" :key="inx" @click="goToGoodsProduct(item)" >
				<li> <img :src="item.img" /> </li>
				<li> {{item.name}} </li>
				<li> ￥{{item.price}} </li>
				<li> {{item.describe}} </li>
			</ul>
  </div>
  

   <!-- 商品录入框 -->
  <div v-if="isEntryGoods" class="goodsEntry cle">
    <i class="close" @click="closeShop">×</i>
      <div v-for="(item,index) in emptyGoodsDomArr" :key="index">
        <entryGood 
          @pushGoodsInfo = 'pushGoodsInfo'
          @isVoidFalse = 'isVoidFalse'
        />
      </div>
        
    <van-button type="info" @click="addGoodsInputBtn" >+</van-button>
    <van-button type="info" @click="submitBtn">提交新的商品</van-button>
  </div>
  <div class="entryGoodsDivBg" v-if="isEntryGoodDivBg"></div>

   <!-- 分页按钮 -->
  <div class="pageChange">
    <van-pagination 
      v-model="currentPage"
			:total-items=totalItems
			:items-per-page=3
			mode="simple" 
			@change="pageChangeFn"
    />
  </div>
   <footerBar />
  </div>
  
</template>

<script>
import axios from 'axios'
import API_LIST from '@/apiList'
import entryGood from './entryGood'
import footerBar from './footerBar'
export default {
  name: 'goodsType',
  data () {
    return {

      currentPage:1,
      totalItems:0,
      msg: '商品分类也',
      isLogin:false,
      tabActive:'',
      isEntryGoods:false,
      // 判断四个数据填写没
      isGoodsInfoWriter:false,
      //商品名是否重复
      isNameRepeat:true,
      // 空白的录入框
      emptyGoodsDomArr:[{}],
      isEntryGoodDivBg :false,
      // 接收录入商品
      entryGoodObj:[],
      //  获得商品列表-大类
      goodsCategoryData:'',
      // 竖向分类栏
      activeBadgeKey:0,
      // 竖向栏目
      goodsListData:[]
      
    }
  },
  components:{
    footerBar,
     entryGood
  },
  created(){
    if(localStorage.username){
       let _str = JSON.parse(localStorage.username)
     this.msg ='用户名：'+_str.username
     console.log(_str._id)
     let _n = _str._id
     //设置管理员信息 给定特定ID
     if(localStorage.username && _n==="5fa95248f561f62cecc18df5"){
       this.isLogin=true;
     }
      
    
    }
     //获得商品大类
	  this.getGoodsCategoryFn();
    //查询栏目所属商品
    this.getCategoryGoodsListFn('goodsList_a')
    
    // 分页
		 this.pageChangeFn();
  },
  watch:{
    //监听数据发生索引发生变化时调用数据更新函数
    activeBadgeKey(_inx){
      let _c = this.goodsCategoryData[_inx].d
      this.getCategoryGoodsListFn( _c )
      // 分页
     this.currentPage=1,
		 this.pageChangeFn();
    }
  },
  methods:{
    // 点击商品进入商品详情页
    goToGoodsProduct( _item){
      this.$router.push({
        name:'goodsProduct',
        query:{
          _goodsObjId:_item._id,
          _collectionName : _item.category
          }
      })

    },
    // 分页栏改变时发生
    pageChangeFn(){
      let _c  = ''
      if( !this.goodsCategoryData ){
				_c = 'goodsList_a';
			} else {
				_c = this.goodsCategoryData[this.activeBadgeKey].d;
			}
      
      axios.get( API_LIST.getPageChange,{
						params:{
							startNum:(this.currentPage-1)*3,
							c: _c
						}
					})
        	.then( _d=>{
						// console.log( _d.data );
						this.goodsListData = _d.data;
					});

    },
    // 横行分类栏
    headColumnFn(_inx){
      // 竖向索引绑定横行索引
      this.activeBadgeKey = _inx;
    },
    // 侧边栏的改变
    onBadgeChange( _key ){
			// console.log( _key )
      this.activeBadgeKey = _key;
      // console.log(this.goodsCategoryData[_key].d)
      let _c = this.goodsCategoryData[_key].d
      this.getCategoryGoodsListFn( _c )
      // 横向索引绑定竖向索引
      this.tabActive = _key
		},
    // 查询栏目的商品
   getCategoryGoodsListFn( _c ){
			axios.get( API_LIST.getCategoryGoodsList,{
					params:{ categoryId : _c }
				})
				.then( _d=>{
          // console.log(  _d.data );
          // 分类下的所有商品总数
          this.totalItems = _d.data.length;
					// this.goodsListData = _d.data;
				});
		},
      // 添加商品到数据库
    pushGoodsInfo(_goodsInfoObj){
      // 检查商品名称是否重复
      let _is = true
      for(let i = 0;i<this.entryGoodObj.length;i++){
        if(this.entryGoodObj[i].n === _goodsInfoObj.n){
          _is = false
          break;
        }
      }
      if(_is){
        this.entryGoodObj.push(_goodsInfoObj)
        this.isNameRepeat = true

      } else{
        this.isNameRepeat = false
        this.$dialog.alert({
          message:"商品重复了"
           
        })
      }
      // 四个信息填完
      this.isGoodsInfoWriter = true
    },
    // 商品信息没填完
    isVoidFalse(){
      this.isGoodsInfoWriter = false
    },
    // 商品信息补全后添加商品(信息填完+商品名不重复)
    addGoodsInputBtn(){
      if(this.isGoodsInfoWriter && this.isNameRepeat){
         this.emptyGoodsDomArr.push({})
      }else if(!this.isGoodsInfoWriter){
        this.$dialog.alert({
          message:"请填完整商品信息"
        })  
      }else if(!this.isNameRepeat){
        this.$dialog.alert({
          message:"商品名重复"
        })
      }
     
    },
      // 录入商品
    entryGoodToDb(){
      this.isEntryGoodDivBg = true;
      this.isEntryGoods = true;

    },
    // 提交新增商品
    submitBtn(){
      axios.post(API_LIST.insertGoods,this.entryGoodObj)
      .then( _d =>{
        // console.log(_d.data)
        this.$dialog.alert({
          message: _d.data.regInfo
        }).then(()=>{
          //关闭商品录入窗口
          this.isEntryGoodDivBg = false
          this.isEntryGoods=false
          //清空输入框数量
          this.emptyGoodsDomArr=[{}]
          //  更新页面获得商品列表-大类
          this.getGoodsCategoryFn()
        })
      })
    },
    //关闭按钮
    closeShop(){
      this.isEntryGoods=false
       this.isEntryGoodDivBg = false
      this.emptyGoodsDomArr=[{}]
    },
     //  获得商品列表-大类
    getGoodsCategoryFn(){
      axios.get(API_LIST.getGoodsCategory)
        .then( _d =>{
          this.goodsCategoryData = _d.data
        })
    },
  },
}
</script>


<style scoped>
h1, h2 {
  font-weight: normal;
}
li{
  display: inline;
  margin: 0 10px;
}
.inlandBtn{
  position: absolute;
  top: 2px;
  right: 0;
  }
.cle:after{
  content:'.' ;
  overflow: hidden;
  visibility: hidden;
  height: 0;
  display: block;
  clear: both;
}
.wrapDiv{
  margin-top: 5px;
  width: 98%;
  overflow: hidden;
  background-attachment: #eee;
  margin: 5px auto;
}
.leftDiv{
  float: left;
  width: 40%;
  margin: 10px;
  border-radius: 10px;
  height: 30px;
  padding: 10px;
  line-height: 30px;
  text-align: center;
  font-size: 22px;
}
.rightDiv{
  float: right;
  width: 40%;
  margin: 10px;
  border-radius: 10px;
  height: 30px;
  border: 1px solid #999;
  padding: 10px;
  background: #fff;
  line-height: 30px;
  text-align: center;
  font-size: 22px;
}
.goodsEntry{
  width: 80%;
  padding: 10px;
  position: absolute;
  top: 10%;
  left: 50%;
  margin-left: -43%;
  z-index: 112;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0,0.5);
  background: rgba(0, 0, 0, 0.2);
  line-height: 30px;
  text-align: center;
  font-size: 16px; 
}
.close{
  float: right;
  font-size: 24px;
  color: rgb(240, 240, 240);
}
.close:hover{
  color: rgb(248, 55, 20);
}
.shopNav{
  
  border-bottom: 2px solid rgb(153, 153, 153);
}
.nav-top{
  margin-top: 1px;
}
.nav-top img{
  width: 100%;
  height: 280px;
}
.goodsCategory{
  clear: both;
  margin: 10px 10px;
 
}
.goodsCategory li{
  
  font-size: 18px;
  float: left;
}
.goodsCategory img{
  width: 50px;
  height: 50px;
  border-radius: 10px;
  border: 1px solid #999;
}
.entryGoodsDivBg{
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;
  z-index: 111;
  position: absolute;
  top: 0;
  left: 0;
}
.imgSize{
  width: 100%;
  height: 188px;
}
.sideBarFn{
  position: absolute;
  width: 80px;
  top: 370px;
  left: 0;
  z-index: 5;
  background: rgb(212, 212, 212);
}
.sideBarFnItem{
  font-size: 10px;
  box-sizing: border-box;
  line-height: 18px;
  margin-bottom: 5%;
  margin-top: 5%;


}
.columnData{
  height: 300px;
  overflow: scroll;
  clear: both;
  width: 70%;
  margin: 0% 0 0 100px;
}
.columnData ul{
      	display: block;clear: both;overflow: hidden;margin:12px 0;
      	background: rgb(250, 250, 250);
      }
      .columnData ul li{
      		float: left;margin:5px;
      }
      .columnData ul li.tip{background: #eee;padding:2px;}
      .columnData ul li img{
      		width:60px;height: 80px;
      }
  .pageChange{
 
    padding: 12px 2px;
    width: 60%;
    margin-right: 10%;
    float: right;
    clear: both;
    margin-top: 2%;
  }
</style>
