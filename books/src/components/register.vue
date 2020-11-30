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
      :error-message="userErr"
    /> 

    <van-field
      v-model="password"
      type="password"
      required
      clearable
      label="密码"
      placeholder="请输入密码"
      @click-right-icon="password=''"
      :error-message="passwordErr"
    />

    <van-field
      v-model="password2"
      type="password"
      required
      clearable
      label="重复密码"
      placeholder="请输入重复"
      @click-right-icon="password2=''"
      :error-message="password2Err"
    />

    <van-field
      v-model="desc"
      label="个人签名"
      placeholder="请输入签名"
      
    />

      <div class="btn">
        <van-button type="primary" @click="registerFn">立即注册</van-button>
        <van-button type="warning" @click="registerResetBtn">重置信息</van-button>
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
      msg:'注册',
      username:'',
      password:'',
      password2:'',
      desc:'',
      userErr:'',
      passwordErr:'',
      password2Err:'',
      
    }
  },
  components:{
    footerBar
  },
  methods:{
    // 回到上一步
    goBackFn(){
      this.$router.go(-1)
    },
    // 注册
    registerFn(){
      // 每次点击重置错误信息
      this.userErr=''
      this.passwordErr=''
      this.password2Err=''
      // 注册信息
      let _registerObj = {
        username:this.username,
        password:this.password,
        password2:this.password2,
        desc:this.desc
      }
      // 验证用户注册信息
      if(_registerObj.username===''){
        this.userErr='用户名不能为空'
        return false
      }
      if(_registerObj.username.length>10 || _registerObj.username.length<2){
        this.userErr='用户名长度不能超过10位且不能小于2位'
        return false
      }
      if(_registerObj.password===''){
        this.passwordErr='密码不能为空'
        return false
      }
      if(_registerObj.password.length>14 ||_registerObj.password.length<8){
        this.passwordErr='密码不能超过14位且不能小于8位'
        return false
      }
      if(_registerObj.password2===''){
        this.password2Err='重复密码不能为空'
        return false
      }
      if(_registerObj.password2.length>14 || _registerObj.password2.length<8){
        this.password2Err='密码不能超过14位且不能小于8位'
        return false
      }
      if(_registerObj.password!==this.password2){
        this.password2Err='密码和重复密码不一致'
        return false
      }
      this.postRegisterObj(_registerObj)
      
    },
    // 提交
    postRegisterObj(_registerObj){
      axios.post(API_LIST.register_post,_registerObj)
      .then(_d =>{
        console.log(_d.data)
        //弹窗返回提示
          this.$dialog.alert({
            message: _d.data.regInfo
           }).then(()=>{
            //  注册成功回到首页
             this.$router.push({path:'/'})
             localStorage.setItem('inxState',0);
           })
      })
    },
    // 重置
    registerResetBtn(){}
  }
  
}
</script>