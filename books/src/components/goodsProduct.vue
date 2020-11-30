<template>
  <div>
    <!-- 顶部标题 -->
    <van-nav-bar
      :title=msg
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    <!-- 中间商品详情介绍 -->
  <div class="goodsImgWrap">
    <img :src=goodsImgUrl alt="商品详情">
  </div>
  <p>{{goodsTitle}},<!-- {{describe}} 数据库忘记录详情了先不写-->{{price}}</p>

  <!-- 底部按钮组件 -->
  <van-sku
    v-model="showBase"
    :sku="sku"
    :goods="goods"
    :goods-id="goodsId"
    :quota-used=0
    :hide-stock="sku.hide_stock"
    :reset-stepper-on-hide= false
    :reset-selected-sku-on-hide = false
    :close-on-click-overlay = true
    :disable-stepper-input = false
    :message-config={}
    @sku-selected = "switchProductType"
    @add-cart = "onAddCartFn"
  />
    
    <!-- footer -->
    <van-goods-action>
      <van-goods-action-icon 
      :info= cartGoods_mini_num
      icon="cart-o" 
      text="购物车"
      @click="goToCartBtn"
      />
      <van-goods-action-button
        text="加入购物车"
        type="warning"
        @click="onClickCarBtn"
      />
      <van-goods-action-button
       text="立即购买"
       type="danger"
       @click="onClickBuyBtn"
      />
    </van-goods-action>


</div>
</template>

<script>
import axios from 'axios'
import API_LIST from '@/apiList'
import footerBar from './footerBar'
import { Toast } from 'vant';
export default {
  name:'goodsProduct',
  data(){
    return{
      msg:'产品详情页 ',
      goodsTitle:'',
      // 判断是否登录 默认为false
      goodsImgUrl:'',
      describe:'',
      price:'',
      cartGoods_mini_num:0,
      showBase:false,
      goods:{
        name:''
      },
      goodsId:0,
      sku: {
            tree: [
            {
              k: '产品',
              k_s: 's1', 
              v: [
                {
                  id: '1', 
                  name: '美少女日记', 
                  imgUrl: 'https://img.yzcdn.cn/1.jpg'
                  
                },
              ],
              largeImageMode: true, 
            }
          ],
    
          list: [
            {
              id: 2259, 
              s1: '1', 
              s2: '1', 
              price: '', 
              stock_num: 110 
            }
          ],
          price: '', 
          stock_num: 227,
          hide_stock: false 
        },
    }
  },
  created(){
    let _goodsId = this.$route.query._goodsObjId
    let _collectionName = this.$route.query._collectionName
    
    this.getGoodsInfoFn( _goodsId,_collectionName)
    // 给sku
    this.goodsId = _goodsId
    // 页面刚打开要加载保存的产品数据
    var xx = localStorage.cartDataInfo
						? JSON.parse( localStorage.cartDataInfo )
						: [];
		console.log( xx )
    // localStorage.removeItem('cartDataInfo')
    
    //页面一加载就取购物车总数数量
    this.total_cartGoodsNum()
    
  },
  components:{
    footerBar
  },
  methods:{
    //更新产品
    switchProductType(){
      this.sku.list[0].price = this.sku.price*100
      this.sku.tree[0].v[0].imgUrl = this.goodsImgUrl
      this.sku.tree[0].v[0].name = this.goodsTitle
    },
    // 添加购物车
    onAddCartFn( _d){
      //car数据中是否有相同的产品
      let _isTrue = false;

      let _tempObj ={
       _id : _d.goodsId,
      _price : this.price,
      _num  : _d.selectedNum,
      _goodsName : this.goods.title,
      _img:this.goodsImgUrl
      }
      // 已经存储在本地的数据
     	let _cartData = localStorage.cartDataInfo
							? JSON.parse( localStorage.cartDataInfo )
							: [];
      for(let i=0; i<_cartData.length; i++){
				//id相同，就是同一个产品
				if( _cartData[i]._id === _tempObj._id ){
					_cartData[i]._num += _tempObj._num;
					_isTrue = true;
					break;
				}
			}
      // 没有相同就直接push
      if(!_isTrue) {
				_cartData.push( _tempObj )
			}   
      //  _tempObj是js对象转字符
       localStorage.cartDataInfo = JSON.stringify( _cartData )
      //  console.log(_cartData)
      this.$dialog.alert({
        message: '加入购物车成功'
      }).then(()=>{
        this.showBase = false;
        this.total_cartGoodsNum()
      });

    },
    // 当前购物车中商品总数小图标显示
    total_cartGoodsNum(){
      // 读取本地存储数据
      let _temp = localStorage.cartDataInfo
							? JSON.parse( localStorage.cartDataInfo )
              : [];
      let _n = 0;
      for(let i=0;i<_temp.length;i++){
        _n += _temp[i]._num
      }
      this.cartGoods_mini_num = _n 

    },
    //更据id获取对应商品信息
    getGoodsInfoFn(_gId ,_collectionName){
      axios.get(API_LIST.getGoodsInfo,{
        params:{
          _id:_gId,
          _c:_collectionName
        }
      }).then(_d=>{
        //  console.log(_d.data)
        this.goodsTitle = _d.data.name;
				this.goodsImgUrl = _d.data.img;
				//this.describe = _d.data.describe;
        this.price = _d.data.price
        
        //给Goods（购物车）的数据
        this.goods.title = _d.data.name;
        this.goods.picture = _d.data.img;
        this.sku.price = _d.data.price;
      })
    },
    //购物车按钮，先判断是否登录！登录就加载商品购物属性，未登录就跳转去登录！
    onClickCarBtn(){
      // axios.post(API_LIST.userLogin_post)
      // .then(_d =>{
      //   console.log(_d.da)
      // })
      if(localStorage.username){
        this.showBase = true
      }else{
         this.$router.push({path:"/userLogin"})
         this.$notify('请先登录，再查看购物车')
         localStorage.setItem('inxState',3)
      }
      
    },
    //立即购买按钮
    onClickBuyBtn(){

      if(localStorage.username){
        Toast.success('支付成功')
        
        setTimeout(()=>{
          this.$router.push({path:"/"})
        },1000)
        
      }else{
         this.$router.push({path:"/userLogin"})
         this.$notify('请先登录，再查看购物车')
         localStorage.setItem('inxState',3)
      }
    },
    // 跳转到购物车页面
    goToCartBtn(){
      // 先判断是否登陆，再来跳转路径
      if(localStorage.username){
        this.$router.push({path:"/cart"})
      }else{
         this.$router.push({path:"/userLogin"})
         this.$notify('请先登录，再查看购物车')
         localStorage.setItem('inxState',3)
      }

      
    },
    
    goBack(){
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
  .goodsImgWrap{
    width: 100%;
    height: 350px;
    overflow: hidden;
    margin: 0 auto;
  }
  .goodsImgWrap img{
    width: 100%;
    border: 1px solid #999;
    height: 350px;
  }

</style>