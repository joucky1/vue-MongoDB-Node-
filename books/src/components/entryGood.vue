<template>
<!-- 管理员页面直接添加商品数据 name-->
  <div class="inputTem">
    <input type="text" 
        v-model=name 
        class="goodsEntry" 
        @blur="nameBlurFn"
        placeholder="输入名称" >

    <input type="text" 
        v-model=price 
        class="goodsEntry"
        @blur="priceBlurFn" 
        placeholder="输入价格" >

    <input type="text" 
        v-model=desc 
        class="goodsEntry"
        @blur="descBlurFn" 
        placeholder="输入描述" >

    <input type="text" 
        v-model=img 
        class="goodsEntry"
        @blur="imgBlurFn" 
        placeholder="输入图片" >

  </div>
</template>

<script>
export default {
  name:'entryGood',
  data(){
    return{
      name:'',
      price:'',
      desc:'',
      img:'',
      
      itemGoodsInfo:{
        n:'',
        p:'',
        d:'',
        i:''
      }
    }
  },
  methods:{
    nameBlurFn(){
      this.itemGoodsInfo.n = this.name;
      this.isInputCheckFn()
    },
    priceBlurFn(){
      this.itemGoodsInfo.p = this.price;
      this.isInputCheckFn()
    },
    descBlurFn(){
      this.itemGoodsInfo.d = this.desc;
      this.isInputCheckFn()
    },
    imgBlurFn(){
      this.itemGoodsInfo.i = this.img;
      this.isInputCheckFn()
    },
    // 检查是否输入完整
    isInputCheckFn(){
      let _is = true

      for(let i in this.itemGoodsInfo){
        if(!this.itemGoodsInfo[i]){
          _is = false
          break
        }
      }
      if(_is){
        this.$emit('pushGoodsInfo',this.itemGoodsInfo)
      }else{
        this.$emit('isVoidFalse')
      }
      // console.log(this.itemGoodsInfo)
    }
  }
  
}
</script>

<style scoped>
.cle:after{
  content:'.' ;
  overflow: hidden;
  visibility: hidden;
  height: 0;
  display: block;
  clear: both;
}
.goodsEntry{
  padding: 10px;
  margin: 10px auto;
  border-radius: 10px;
  border: 1px solid #999;
  line-height: 30px;
  text-align: center;
  font-size: 16px; 
}
.inputTem{
  width: 80%;
  margin: 20px auto;
  background: rgb(216, 214, 214);
  border-radius: 10px;
}

</style>