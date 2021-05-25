<template>
  <div class="topnav" v-show="$route.meta.showNav">
    <div class="title">
      <div class="left">音乐播放器</div>
      <button class="right">下载APP</button>
    </div>
    <ul class="nav">
      <li><router-link to="/home">推荐音乐</router-link></li>
      <li><router-link to="/hot/1">热歌榜</router-link></li>
      <li><router-link to="/search">搜索</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  metaInfo (){
    console.log(this)
  }
};
</script>

<style lang="less" scoped>
.topnav {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 9999;
  .title {
      background-color: #e60026;
      display: flex;
      height: 84px;
      align-items: center;
      justify-content: space-between;
      padding: 0px 10px;
    div.left {
      // background: url("../assets/title1.png") no-repeat 0 -19px;
      // width: 157px;
      // height: 33px;
      color: white;
      font-size: 30px;
      text-shadow: 4px 2px 4px black
    }
    .right{
        border: none;
        outline: none;
        width: 100px;
        height: 36px;
        border-radius: 20px;
        color: #d43c33;
    }
  }
  .nav {
    display: flex;
    border-bottom: 1px solid #ddd;
    background-color: white;
    li {
      line-height: 40px;
      flex: 1 1 auto;
      font-size: 15px;
      a {
        display: inline-block;
        text-decoration: none;
        color: black;
        &.router-link-exact-active {
          color: red;
          border-bottom: 2px solid red;
        }
      }
    }
  }
}
</style>