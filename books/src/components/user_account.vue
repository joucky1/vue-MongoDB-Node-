<template>
  <div>
    <van-nav-bar
      :title=msg
      left-text="返回"
      right-text="退出登录"
      left-arrow
      @click-left="goBack"
      @click-right="logOutBtn"
    />

    <div class="userImgDiv">
      <p>欢迎<b>{{usersNameObj.username}}</b>!</p>
      <p>{{usersNameObj.desc}}</p>
    </div>

  <footerBar />
  </div>
</template>

<script>
import axios from 'axios'
import API_LIST from '@/apiList'
import footerBar from './footerBar'
export default {
  name:'userAccount',
  data(){
    return{
      msg:'用户中心',
      usersNameObj:''
    }
  },
  created(){
   this.usersNameObj = JSON.parse(localStorage.username) 
    /* console.log(localStorage.userName) */
  },
  methods:{
    // 退出登录
    logOutBtn(){
      localStorage.username = '',
       this.$dialog.alert({
        message: '您已经退出登录！'
      }).then(()=>{
        // 跳回首页
        this.goBack()
      })
    },
    // 返回首页
    goBack(){
      this.$router.push({path:"/"},()=>{
        localStorage.setItem('inxState',0)
      })
    },
  },
  components:{
    footerBar
  },
}
</script>

<style scoped>
  .wrapDiv{
    width: 90%;
    overflow: hidden;
    border: 1px solid #666;
    background: #eee;
    border-radius: 10px;
    margin: 10px auto;
  }
  .userImgDiv{
    font-size: 16px;
    position: relative;
    border-radius: 10px;
    margin: 10px;
  }
  .userImgDiv img{
    position: absolute;
    top: 0;
    left: -20px;
    width: 260px;
  }
  .userInfoDiv{
    font-size: 14px;
    float: left;
    text-align: left;
  }
</style>