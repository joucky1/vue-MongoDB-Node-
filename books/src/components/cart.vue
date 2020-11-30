<template>
  <div class="cart">
    <van-nav-bar
      :title=msg
      left-text="返回"
      right-text="清空购物车"
      left-arrow
      @click-left="goBack"
      @click-right="clearCart"
    />
  

     <div class="goodsDiv cle" v-for="(item,s) in cartArr" :key="s">
      <label><img :src=item._img ></label>
      <h2>{{item._goodsName}}</h2>
      <h2> 数量:{{item._num,}}</h2>
      <h2> 单价{{item._price}}</h2>
      
      <!-- async-change必须为异步 -->
    <van-stepper 
      v-model="item['_num']" 
      :async-change = true
      @plus = "addBtnFn"
      @minus = 'adressBtnFn'
      @blur = "onInputBtnFn"
    />   
    </div> 
    <div class="tipCart" v-if="clearCartTxt">
      <p>当请购物车空空如页<span class="goToShopping" @click="goToShopping">快去添加商品吧</span></p>
    </div>
     
      <van-submit-bar 
        :price="allGoodsMoney*100" 
        :button-text= SubmitTxt 
        @submit="onSubmit" 
      />
  </div>
  
  
</template>



<script>
import axios from 'axios'
import API_LIST from '@/apiList'
import { Toast } from 'vant';
export default {
  name:'cart',
  data(){
    return{
      msg:'购物车',    
      cartArr:'', 
      allGoodsNum:0,
      allGoodsMoney:0,
      SubmitTxt:'提交订单',
      clearCartTxt:false
      
    }
  },
  created(){
    // 页面刚打开要加载保存的产品数据
   this.cartArr = localStorage.cartDataInfo
						? JSON.parse( localStorage.cartDataInfo )
						: [];
    // localStorage.removeItem('cartDataInfo')
    if(this.cartArr.length ===0){
      this.clearCartTxt = true
    }
    this.countAllGoodsNum()
    this.countAllGoodsMoney()
  },
  methods:{
    goBack(){
      this.$router.push({path:"/"},()=>{
        localStorage.setItem('inxState',0)
      })
    },
    //去购物
    goToShopping(){
      this.$router.push({path:"/"},()=>{
        localStorage.setItem('inxState',0)
      })
    },
    // 清空购物车
    clearCart(){
      this.cartArr=localStorage.removeItem('cartDataInfo')
      this.SubmitTxt = '去结账(0)'
      this.allGoodsMoney = 0
      this.clearCartTxt = true
    },

    // 计算所有商品总数
    countAllGoodsNum(){
      this.allGoodsNum = 0;
      for(let i = 0;i<this.cartArr.length;i++){
        this.allGoodsNum += this.cartArr[i]._num
      }
      this.SubmitTxt = '去结账('+this.allGoodsNum+')'

    },
    // 计算所有商品的总价
    countAllGoodsMoney(){
      this.allGoodsMoney = 0;
      for(let i = 0;i<this.cartArr.length;i++){
        this.allGoodsMoney += this.cartArr[i]._num * this.cartArr[i]._price
      }

    },
    // 添加商品按钮
    addBtnFn(){
      this.countAllGoodsNum(),
      this.countAllGoodsMoney()
    },
    //减少商品按钮
    adressBtnFn(){
      this.countAllGoodsNum(),
      this.countAllGoodsMoney()
    },
    // 输入框失去焦点时执行
    onInputBtnFn(){
      this.countAllGoodsNum(),
      this.countAllGoodsMoney()
    },
    // 提交订单
    onSubmit(){
      if(this.allGoodsMoney==0){
        Toast.fail('请去添加商品！')
      }else{
        this.$dialog.alert({
        message: '共'+this.allGoodsNum+'价商品总价'+this.allGoodsMoney+'元'
      }).then(()=>{
         Toast.success('支付成功')
          this.clearCart() 
      }) 
      }
        
    },
  }
    
  
}
</script>

<style lang="css">
.cle:after{
  content:'.' ;
  overflow: hidden;
  visibility: hidden;
  height: 0;
  display: block;
  clear: both;
}
.goodsDiv{
  width: 95%;
  margin: 5px auto;
  clear: both;
  border: 2px #999 solid;
  border-radius: 10px;
  
}
.goodsDiv label{
  float: left;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border: 1px solid rgb(49, 45, 45);
  margin: 2px;
  border-radius: 10px;

}
.goodsDiv label img{
  width: 100px;
  height: 100px;
}
.goodsDiv h2{
  display: inline-block;
  margin: 6% 2%;
  font-size: 16px;
}
.tipCart{
  margin-top: 50%;
  font-size: 16px;
  color: rgb(143, 143, 143);
}
.goToShopping{
  font-size: 18px;
  color: rgb(243, 29, 29);
  cursor: pointer;
}
.goToShopping:hover{
  font-size: 20px;
  color: rgb(8, 127, 238);
}


</style>