<template>
  <div>
    <van-nav-bar
      :title=msg
      left-text="返回"
      left-arrow
      @click-left="goBackFn"   
    />

     <van-field
      v-model="username"
      required
      clearable
      label="用户名"
      placeholder="请输入用户名"
      @click-right-icon="username=''"
      
    /> 

    <van-field
      v-model="password"
      type="password"
      required
      clearable
      label="密码"
      placeholder="请输入密码"
      @click-right-icon="password=''"
      
    />
      <div class="btn">
        <van-button type="info" size="large" @click="userLoginFn">登录</van-button> 
        <van-button type="primary" size="large" @click="registerBtn">注册</van-button>
      </div>
      
    <footerBar />
  </div>
  
</template>

<style lang="css">
  .btn{
    display: flex;
    justify-content: space-around;
    margin: 28px 12px 0 12px;
  }

</style>

<script>
import axios from 'axios'
import API_LIST from '@/apiList'
import footerBar from './footerBar'
export default {
  name:'register',
  data(){
    return{
      msg:'用户登录',
      username:'',
      password:'',  
    }
  },
   components:{
    footerBar
  },
  methods:{
    // 回到上一步
    goBackFn(){
      this.$router.push({path:'/'},()=>{
            localStorage.setItem('inxState',0)
          });
    },
    // 登录
    userLoginFn(){
      let _loginObj={
        //取当前用户和密码
        u:this.username,
        p:this.password
      }
      axios.post(API_LIST.userLogin_post,_loginObj)
        .then(_d =>{
          
             if(_d.data.reg_code === 3){
              //  转为字符串来储存
               localStorage.username =JSON.stringify(_d.data.regInfo) 
                //弹窗返回提示
                this.$dialog.alert({
                 
                  message:"欢迎："+ _d.data.regInfo.username +"登录成功"
                   }).then(()=>{ 
                     //  登录成功回到首页
                  this.$router.push({path:'/'},()=>{
                  localStorage.setItem('inxState',0)
                   })
                 })
            }else if(_d.data.reg_code===5){
              //弹窗返回提示
              this.$dialog.alert({
                  message:_d.data.regInfo
                   })
            }else if(_d.data.reg_code===4){
              //弹窗返回提示
                this.$dialog.alert({
                  message:_d.data.regInfo
                   })
            }
             
           })

//  this.$dialog.alert({
//              message:"欢迎："+ _d.data.regInfo.username +"登录成功"
//            }).then(()=>{
//         })
    },
    // 注册
    registerBtn(){
      this.$router.push({path:'/register'})
    },
  }
    
  
}
</script>