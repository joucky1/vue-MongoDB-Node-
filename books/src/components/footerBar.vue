<template>
  <div>
    <van-tabbar v-model="tabbarActive" @change="switchColumnBtn">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">分类</van-tabbar-item>
      <van-tabbar-item icon="friends-o">购物车</van-tabbar-item>
      <van-tabbar-item icon="setting-o">{{isLoginTxt}}</van-tabbar-item>
  </van-tabbar>
  </div>

</template>

<script>
import axios from 'axios'
import API_LIST from '@/apiList'
export default {
  name:'footerBar',
  data(){
    return{
      msg:'footer',
      tabbarActive:0,
      isLoginTxt:''
    }
  },
  created(){
    if(localStorage.username){
      this.isLoginTxt = '我的'
    }else{
      this.isLoginTxt = '未登录'
    }
  },
  mounted(){
    this.tabbarActive = Number(localStorage.getItem('inxState'))
  },
  methods:{
    switchColumnBtn(){
      // 打印当前的case
      // console.log(this.tabbarActive)
      let _inx = this.tabbarActive
      switch( _inx){
        case 0 :
          this.$router.push({path:'/'},()=>{
            localStorage.setItem('inxState',0)
          });
          break;
          
        case 1 :
         this.$router.push({path:'/goodsType'},()=>{
            localStorage.setItem('inxState',1)
          });
          break;

        case 2 :
          // this.$router.push({path:'/cart'});
          this.isLoginStateCar()
          break;

        case 3 :
          this.isLoginState()
          break;

      }
    },
    // 判断登录状态，登的话直接跳到我的界面，若为0则到登录页面
    isLoginState(){
      let _route = '';
      if(localStorage.username){
        _route = '/userAccount'
      }else{
        _route = '/userLogin'
      }
      this.$router.push({path:_route},()=>{
            localStorage.setItem('inxState',3)
          });
    },
    // 判断是否登录才能查看购物车如果为False则填转到登录界面
    isLoginStateCar(){
      let _route = '';
      if(localStorage.username){
        _route = '/cart'
      }else{
        _route = '/userLogin'
         this.$notify('请先登录，再查看购物车')
      }
      this.$router.push({path:_route},()=>{
            localStorage.setItem('inxState',3)
           
          });  
    }
  },
  
}
</script>