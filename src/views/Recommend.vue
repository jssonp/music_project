<template>
  <div class="recommend">
    <!-- 轮播图 -->
    <Swipe :list="swipeList"></Swipe>

    <Title>推荐歌单</Title>
    <ul class="recommendList">
      <router-link
        :to="{ path: '/musiclist/' + rem.id }"
        tag="li"
        v-for="rem in recommendMusicList"
        :key="rem.id"
      >
        <div>
          <img :src="rem.picUrl" />
          <span>{{ rem.playCount | formatNum }}</span>
        </div>
        <p>{{ rem.name }}</p>
      </router-link>
    </ul>
    <Loading v-if="recommendMusicList.length <= 0" />
    <Title>最新音乐</Title>
    <MusicItem :newMusicList="newMusicList"></MusicItem>
    <div class="downlode">
      <div class="logo">音乐LOGO</div>
      <button>打开APP，发现更好音乐 ></button>
      <p>仿照网易云公司,不用于商业用途xxxxxxxxxxxxx</p>
    </div>
  </div>
</template>

<script>
import Title from "../components/Title";
import MusicItem from "../components/MusicItem";
import Swipe from "../components/Swipe";
import Loading from "../components/Loading";
export default {
  name: "Recommend",
  components: {
    Title,
    MusicItem,
    Loading,
    Swipe,
  },
  data() {
    return {
      recommendMusicList: [],
      newMusicList: [],
      swipeList: [],
    };
  },
  methods: {
    playMusic(id) {
      this.$emit("playMusic", id);
    },
  },
  beforeRouteEnter(to, from, next) {
    //路由守卫,再录又进入之前获取数据
    next((vm) => {
      vm.$http("/banner?type=2").then((data) => {
        vm.swipeList = data.data.banners;
      });
      vm.$http.get("/personalized?limit=6").then((data) => {
        vm.recommendMusicList = data.data.result;
      });
      vm.$http.get("/personalized/newsong").then((data) => {
        vm.newMusicList = data.data.result.map((v) => {
          return {
            name: v.name,
            artists: v.song.artists,
            id: v.id,
            // song:{
            //   artists:v.artists,
            //   privilege:{
            //     maxbr:1
            //   }
            // }
          };
        });
        vm.$root.playingMusic.newMusicList = vm.newMusicList;
      });
    });
  },
  filters: {
    formatNum(value) {
      return (value / 10000).toFixed(1) + "万";
    },
  },
};
</script>

<style lang="less" scoped>
.recommend {
  margin-top: 140px;
  ul.recommendList {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-bottom: 20px;
    li {
      width: 32%;
      margin-top: 15px;
      div {
        position: relative;
        span {
          top: 2px;
          right: 3px;
          position: absolute;
          color: white;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
          font-size: 10px;
          &::after {
            content: "";
            position: absolute;
            left: -17px;
            top: 3px;
            background: url("../assets/more.png") no-repeat 0 -24px;
            width: 14px;
            height: 11px;
            z-index: 999;
          }
        }
      }
    }
    p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      width: 100%;
      -webkit-line-clamp: 2;
      -moz-line-clamp: 2;
      -ms-line-clamp: 2;
      -o-line-clamp: 2;
      overflow: hidden;
      font-size: 13px;
      text-align: left;
      min-height: 30px;
      line-height: 1.2;
      padding: 2px 2px 0 6px;
    }
  }
  .downlode {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-image: url("../assets/bg1.png");
    width: 100%;
    height: 195px;
    .logo {
      margin-top: 30px;
      align-items: center;
      // background: url("../assets/title2.png") no-repeat -1px -48px;
      width: 205px;
      height: 70px;
      font-size: 30px;
    }
    button {
      border: 1px solid #db3a31;
      background-color: transparent;
      outline: none;
      width: 301px;
      height: 40px;
      color: #db3a31;
      border-radius: 20px;
      font-size: 17px;
    }
    p {
      margin-top: 5px;
      font-size: 12px;
      color: #b896a4;
    }
  }
}
</style>
