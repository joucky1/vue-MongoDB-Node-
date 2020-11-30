<template>
  <div class="hello">
    <!-- 标题 -->
    <div>
      <h2>COCO书城</h2>
    </div>
     <transition name="van-slide-down">
      <div v-show="visible" class="TopTitle">
      </div>
    </transition>
    <!-- 搜索 -->
    <van-search
      v-model="searchValue"
      show-action
      label="地址"
      placeholder="可以查询前三个关键词"
      @search="onSearch"
    >
    <div @click="onSearch" slot="action">搜索</div>
    </van-search>

    <!-- 轮播图 -->
    <van-swipe :autoplay="2000" class="sliderDiv">
      <van-swipe-item v-for="(image, index) in sliderImgs" :key="index">
        <img v-lazy="image" />
      </van-swipe-item>
    </van-swipe>
    <!-- banar图 -->
    <div class="banar">
      <h2>商品展示</h2>
    </div>

    <!-- 商品展示 -->
  <div class="goodsContent" >
    <van-tabs sticky v-for="(itemObj,inxObj) in goodsObj " :key= inxObj  class="wrapDiv cle goodsList">
      <van-tab :title="itemObj.n">
          <li v-for="(goods,g) in itemObj.goodsList_aa" v-if="g<4" :key="g" @click="goodsProductFn(goods)">
              <label><img :src=goods.img ></label>
              <span>{{goods.name}}</span> 
              <span>￥{{goods.price}}</span>
          </li>
     
      <li v-for="(goods,g) in itemObj.goodsList_bb" :key="g"  v-if="g<4" @click="goodsProductFn(goods)">
        <label><img :src=goods.img ></label>
        <span>{{goods.name}}</span> 
        <span>￥{{goods.price}}</span>
      </li>
      <li v-for="(goods,g) in itemObj.goodsList_cc" :key="g"  v-if="g<4" @click="goodsProductFn(goods)">
        <label><img :src=goods.img ></label>
        <span>{{goods.name}}</span> 
        <span>￥{{goods.price}}</span>
      </li>
      <li v-for="(goods,g) in itemObj.goodsList_dd" :key="g"  v-if="g<4" @click="goodsProductFn(goods)">
        <label><img :src=goods.img ></label>
        <span>{{goods.name}}</span> 
        <span>￥{{goods.price}}</span>
      </li>
      </van-tab>
    </van-tabs>
  
  </div> 
  <div class="footerBar">
     <footerBar/>
  </div>
 

</div>
  
</template>

<script>
import axios from 'axios'
import API_LIST from '@/apiList'
import footerBar from './footerBar'
export default {
  name: 'proShopCartDemo',
  data () {
    return {
      msg: '我是小明',
      txt_data:'',
      isLogin:true,
      //所有商品数据
      goodsObj:'',
      visible:true,
      searchValue:'',
      //轮播图
      sliderImgs:''
      
    }
  },
  components:{
    footerBar
  },
  created(){
    //轮播图
    axios.get(API_LIST.getImgUrls)
     .then(_d=>{
       this.sliderImgs = _d.data.urls
     })
    

    if(localStorage.username){
       let _str = JSON.parse(localStorage.username)
     this.$notify(_str.username+'欢迎回来'),
     this.isLogin=false;
     this.msg ='用户名：'+_str.username
    }
     //查询所有分类及分类的商品
    this.getGoodsCategoryFn()
    
   
  },
  methods:{
    // 商品详情
    goodsProductFn(_self){
      this.$router.push({
        name:'goodsProduct',
        query:{
          _goodsObjId:_self._id,
          _collectionName : _self.category
          }
      })
    },
    //查询所有分类及分类的商品
    getGoodsCategoryFn(){
      axios.get(API_LIST.getGoodsCategory)
        .then(_d=>{
           console.table(_d.data)
          this.goodsObj = _d.data
        })
    },
    // 退出登录
    loginOutBtn(){
      localStorage.username = '',
      this.isLogin=true,
      this.$notify(localStorage.username+'您已经退出')
    },
    // 搜索栏
    onSearch(){
      let _v = this.searchValue;
      if(_v ==='' || _v=== undefined){
        this.$notify('查询条件不能为空')
      }else{
        axios.get(API_LIST.node_a,{
          params:{ v_data : _v}
        })
          .then(()=>{
            this.getBtn()
          })
      }

    },
    getBtn(){
      axios.get(API_LIST.node_b)
      .then(_d=>{
        this.txt_data = _d.data[0].name
        this.$notify(_d.data[0].name)
      })
       
      
    },
  }
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
.cle:after{
  content:'.' ;
  overflow: hidden;
  visibility: hidden;
  height: 0;
  display: block;
  clear: both;
}
.wrapDiv{
  width: 80%;
  overflow: hidden;
  border: 1px solid #666;
  background-attachment: #eee;
  margin: 10px auto;
}
.leftDiv{
  float: left;
  width: 40%;
  margin: 10px;
  border-radius: 10px;
  height: 30px;
  border: 1px solid #999;
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
  margin: 20px auto;
  border-radius: 10px;
  border: 1px solid #999;
  line-height: 30px;
  text-align: center;
  font-size: 16px; 
}
.close{
  float: right;
  font-size: 24px;
  color: #999;
}
.close:hover{
  color: rgb(248, 55, 20);
}
.shopNav{
  
  border-bottom: 2px solid rgb(153, 153, 153);
}
.nav-top{
  margin-top: 1px;
  border-top: 1px solid rgb(119, 119, 119);
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

.goodsContent{
  height: 560px;
  overflow: scroll;
  margin-bottom: 15%;
}
.goodsTitle{
  color: #fff;
  background: #000;
  border-radius: 1px;
  border-bottom: 3px solid rgb(141, 141, 141);
  padding: 10px;
}
.goodsContent li{
  display: inline-flex;
  flex-direction: column;
  margin: 10px 10px;
  padding: 10px;
  font-size: 12px;
  border: 2px solid rgb(51, 51, 51);
  
}
.goodsContent label{
  display: block;
  box-sizing: border-box;
  
}
.goodsContent img{  
  width: 100px;
  height: 120px;
  box-sizing: border-box;
  border: 1px solid rgb(51, 51, 51);
}
.goodsContent span{
  margin-top: 2px;
  font-weight: 700;
  font-size: 14px;
}
.goodsContent span:last-child{
  color: rgb(231, 19, 19);
}
.TopTitle{
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  margin-bottom: 5px;
}
.TopTitle h1{
  padding: 1%;
  margin: 10px auto;
  background: #000;
  border-radius: 0px;
  color: rgb(255, 255, 255);
  border: solid rgb(216, 112, 211) 1px;
}
.sliderDiv{
  width: 100%;
  margin: 10px auto;
}
.sliderDiv img{
  width: 100%;
  height: 188px;
}
.banar{
  width: 100%;
  height: 60px;
  margin-bottom: 3%;
  background: #eee;
}
.banar h2{
  color: rgb(133, 130, 130);
  line-height: 60px;
}
</style>
