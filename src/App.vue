<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to='/goods'>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/ratings'>评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/seller'>商家</router-link>
      </div>
    </div>
    
    <keep-alive><router-view :seller="seller"></router-view></keep-alive>

  </div>
</template>

<script>
  import header from 'components/header/header.vue'

  export default {
    data(){
      return {
        seller:{}
      }
    },
    created(){
      this.$http.get('/api/seller').then((response)=>{
        if(response.data.errno === 0){
          this.seller = response.data.data;
        }
        // console.log(this.seller);
      })
    },

    components:{
      'v-header':header
    }
  }
</script>

<style lang='less' scope>
  @import 'common/less/mixin.less';

  #app{
    .tab{
      display: flex;
      width: 100%;
      height: 40px;
      line-height: 40px;

      .border-1px(rgba(7,17,27,0.1));

      .tab-item{
        flex:1;
        text-align: center;

        a{
          display: block;
          font-size: 14px;
          color: rgb(77,85,93);

          &.active{
            color: rgb(240,20,20);
          }
        }
      }
    }
  }
</style>
