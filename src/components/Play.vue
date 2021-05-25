<template>
  <div v-show="showfu" class="player">
    <div class="playerBar" v-show="!isFullLrc">
      <i ref="rollImg">
        <img :src="song.al.picUrl" />
      </i>
      <i @click="showFull">{{ song.name }}-{{ song.ar[0].name }}</i>
      <i v-show="musicID != 0" @click="togglePlay">
        <canvas ref="canvas" width="50" height="50"></canvas>
        <span ref="faplay" class="switch fa fa-play"></span>
      </i>
    </div>
    <audio
      ref="musicplayer"
      controls
      autoplay
      :src="`https://music.163.com/song/media/outer/url?id=${musicID}.mp3`"
      @timeupdate="timeupdate"
    />

    <div class="fullLrc" v-show="isFullLrc">
      <div ref="fullLrc" class="bg"></div>
      <div class="logo" @click="isFullLrc = false">∨</div>

      <div ref="rollImg3" class="pichead">
        <img src="" alt="" />
      </div>
      <div ref="rollImg2" class="picImg">
        <img :src="song.al.picUrl" @click="bigimg" />
      </div>
      <span
        v-show="light"
        @click="togglePlay"
        ref="faplay1"
        class="switch fa fa-play"
      ></span>

      <h3>{{ song.name }}-{{ song.ar[0].name }}</h3>

      <div class="lrc">
        <div  style="position: relative;z-index:99999;margin-top:30px;list-style:none;text-decoration: underline;
" v-if="nolyric == true">
          <li>纯音乐鉴赏,没有歌词</li>
        </div>
        <div v-else>
          <ul
            :style="{
              transform: `translateY(-${lrcCurrent * 40}px)`,
            }"
          >
            <li
              v-for="(lrc, i) in lrcArr"
              :key="i"
              :class="{ active: i == lrcCurrent }"
            >
              {{ lrc.lyric }}
            </li>
          </ul>
        </div>
        <div class="progress">
          <h6 class="start">{{ currentTime | formatTime }}</h6>
          <input
            ref="range"
            type="range"
            :min="0"
            :max="durationTime"
            :value="currentTime"
            @input="handle"
          />
          <h6 class="end">{{ durationTime | formatTime }}</h6>
        </div>
        <div class="shuffelin">
          <span class="left" @click="playprev">
            <i class="switch fa fa-step-backward"></i>
          </span>
          <span class="center" @click="togglePlay">
            <i ref="center" class="switch fa fa-pause"></i>
          </span>
          <span class="right" @click="playnext">
            <i class="switch fa fa-step-forward"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["musicID"],
  data() {
    return {
      song: {
        al: {
          picUrl: "",
        },
        name: null,
        ar: [{ name: "" }],
      },
      lrcArr: [],
      isFullLrc: false,
      lrcCurrent: 0,
      light: false,
      showfu: false,
      durationTime: "00:00",
      currentTime: "00:00",
      nolyric:false
    };
  },
  watch: {
    musicID(val) {
      this.showfu = true;
      this.$refs.faplay.classList.remove("fa-play");
      this.$refs.faplay.classList.add("fa-pause");
      this.$http.get("/song/detail?ids=" + val).then((data) => {
        //根据id获取歌曲详细信息.
        this.song = data.data.songs[0];
        this.$refs.fullLrc.style.backgroundImage = `url(${this.song.al.picUrl})`;
      });
      // this.$http.defaults.baseURL = "http://music.kele8.cn"; //临时改变请求baseURL
      this.$http.get("/lyric?id=" + val).then((lrcdata) => {
        //请求歌词信息
        if (lrcdata.data.nolyric) {
          this.nolyric = true;
        } else {
          this.nolyric = false;
          let lrc = lrcdata.data.lrc.lyric;
          let lrcArr = lrc.split(/\n/);
          //[00:00.000] 作词 : 小星星Aurora
          let reg = /\[(\d+):(\d+\.\d+)\](.+)/;
          this.lrcArr = lrcArr.map((lc,i) => {
            reg.test(lc);
            let r1 = parseInt(RegExp.$1 * 60)
            if(r1>=240&&i<=11){
              r1 = 0
            }
            return {
              time: r1 + parseFloat(RegExp.$2),
              lyric: RegExp.$3,
            };
          });
          this.lrcArr = this.lrcArr.splice(0, this.lrcArr.length - 1);
        }
      });

      // this.$http.defaults.baseURL = "http://musicapi.leanapp.cn/"; //把临时服务器请求改回 leanapp.cn
      return val;
    },
  },
  filters: {
    formatTime(val) {
      let m = parseInt(val / 60);
      let s = parseInt(val % 60);
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      return m + ":" + s;
    },
  },
  methods: {
    playnext() {
      this.$root.playingMusic.newMusicList.some((v, i) => {
        if (v.id == this.$root.playingMusic.musicID) {
          if (i == this.$root.playingMusic.newMusicList.length - 1) {
            i = 0;
          } else {
            i = i + 1;
          }
          return (this.$root.playingMusic.musicID = this.$root.playingMusic.newMusicList[
            i
          ].id);
        }
      });
    },
    playprev() {
      this.$root.playingMusic.newMusicList.some((v, i) => {
        if (v.id == this.$root.playingMusic.musicID) {
          if (i == 0) {
            i = this.$root.playingMusic.newMusicList.length - 1;
          } else {
            i = i - 1;
          }
          return (this.$root.playingMusic.musicID = this.$root.playingMusic.newMusicList[
            i
          ].id);
        }
      });
    },
    handle(e) {
      this.$refs.musicplayer.currentTime = e.target.value;
    },
    bigimg() {
      this.togglePlay();
      this.isFullLrc = true;
    },
    formatTime(time) {
      let m = parseInt(time / 60);
      let s = parseInt(time % 60);
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      return m + ":" + s;
    },
    togglePlay() {
      if (this.$root.playingMusic.isPlay) {
        //如果为true 改为暂停
        this.$root.playingMusic.isPlay = false;
        this.$refs.musicplayer.pause();
        this.$refs.rollImg.style.animationPlayState = "paused"; //running
        this.$refs.rollImg2.style.animationPlayState = "paused";
        this.$refs.rollImg3.style.animationPlayState = "paused";
        this.$refs.faplay.classList.remove("fa-pause");
        this.$refs.faplay.classList.add("fa-play");
        this.$refs.faplay1.classList = this.$refs.faplay.classList;
        this.$refs.center.classList = this.$refs.faplay.classList;
        this.light = true;
        // console.dir(this.$refs.rollImg.style);
      } else {
        //暂停改为播放
        this.$root.playingMusic.isPlay = true;
        this.$refs.musicplayer.play();
        this.$refs.rollImg.style.animationPlayState = "running"; //设置ainimation动画运行状态.
        this.$refs.rollImg2.style.animationPlayState = "running"; //设置ainimation动画运行状态.
        this.$refs.rollImg3.style.animationPlayState = "running"; //设置ainimation动画运行状态.
        this.$refs.faplay.classList.remove("fa-play");
        this.$refs.faplay.classList.add("fa-pause");
        this.light = false;
        this.$refs.faplay1.classList = this.$refs.faplay.classList;
        this.$refs.center.classList = this.$refs.faplay.classList;
      }
    },
    showFull() {
      this.isFullLrc = true;
    },
    timeupdate(event) {
      // let long = this.lrcArr
      let audio = event.target;
      this.currentTime = audio.currentTime; //当前播放的时间
      this.durationTime = audio.duration; //总时长
      for (let i = 0; i < this.lrcArr.length; i++) {
        let lrcTime = this.lrcArr[i].time; //歌词的时间

        //  [01:00.000] 作词 : 小星星Aurora  currentTime=01:1
        //  [01:15.000] 作词 : 小星星Aurora  currentTime=01:1
        //判断当前歌词时间如果 小于等于当前播放时间，但是小于下一个歌词时间，当前歌词播放

        if (i == this.lrcArr.length - 1) {
          this.lrcCurrent = i;
          break;
        }
        var i2 = parseInt(i) + 1; //下标 是字符串 "0" +1 "1" +1
        if (
          this.currentTime >= lrcTime &&
          this.currentTime < this.lrcArr[i2].time
        ) {
          this.lrcCurrent = i; //  0 1 2 3 4 5 6

          break;
        }
      }
      if (this.currentTime == this.durationTime) {
        this.$root.playingMusic.newMusicList.some((v, i) => {
          if (v.id == this.$root.playingMusic.musicID) {
            if (i == this.$root.playingMusic.newMusicList.length - 1) {
              i = 0;
            } else {
              i = i + 1;
            }
            return (this.$root.playingMusic.musicID = this.$root.playingMusic.newMusicList[
              i
            ].id);
          }
        });
      }
      // console.log(this.lrcCurrent);
      //  audio.currentTime 当前播放时间  audio.duration 音频总时长
      this.drawCircle(this.currentTime, this.durationTime);
    },
    drawCircle(c, d) {
      let canvas = this.$refs.canvas;
      let cxt = canvas.getContext("2d"); //上下文
      cxt.beginPath();
      cxt.strokeStyle = "#ddd";
      cxt.arc(25, 25, 20, 0, Math.PI * 2);
      cxt.stroke();
      cxt.closePath();

      cxt.beginPath();
      cxt.strokeStyle = "red";
      cxt.arc(25, 25, 20, Math.PI * -0.5, Math.PI * 2 * (c / d) - 1.5);
      cxt.stroke();
      cxt.closePath();
    },
  },
};
</script>
<style lang="less" scoped>
.player {
  position: fixed;
  bottom: 0px;
  background-color: #fff;
  width: 100%;
  align-items: center;
  z-index: 999999;
  audio {
    height: 20px;
    display: none;
  }
  .playerBar {
    display: flex;
    align-items: center;
    i {
      .switch {
        display: block;
        width: 20px;
        height: 20px;
        font-size: 20px;
        color: red;
        position: absolute;
        top: 15px;
        left: 15px;
      }
      display: inline-block;
      &:first-of-type {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        animation: rollImg 2s linear 0s infinite;
      }
      &:nth-of-type(2) {
        text-align: left;
        margin-left: 10px;
        flex: 1;
        font-size: 17px;
        font-style: normal;
      }
      &:last-of-type {
        width: 50px;
        height: 50px;
        position: relative;
      }
    }
  }
  .fullLrc {
    width: 100vw;
    height: 100vh;
    color: white;
    position: relative;

    .bg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      filter: blur(20px);
      transform: scale(3.5);
    }
    .pichead {
      background-image: url("../assets/needle-ip6.png");
      width: 96px;
      height: 137px;
      background-size: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      transform-origin: 0 top;
      top: -6px;
      z-index: 1;
      animation: pichead 10s linear infinite;
    }
    .logo {
      width: 20px;
      height: 45px;
      font-weight: bold;
      position: relative;
      color: #ddd;
      font-size: 40px;
      text-align: left;
      margin-left: 20px;
      // .logo {
      //   position: absolute;
      //   background: url("../assets/title1.png") no-repeat 15px -3px;
      //   width: 137px;
      //   height: 40px;
      //   background-size: 180px;
      // }
    }

    .picImg {
      margin: 0 auto;
      background: url("http://s3.music.126.net/mobile-new/img/disc-plus.png?b700b62e1971b351dcb8b8ce1c9ceea3")
        no-repeat;
      background-size: 296px;
      overflow: hidden;
      width: 296px;
      height: 296px;
      border-radius: 50%;
      animation: rollImg 10s linear infinite;
      margin-top: 25px;
      position: relative;
      img {
        width: 62%;
        border-radius: 50%;
        transform: translateY(31%);
      }
    }
    .switch {
      display: block;
      width: 30px;
      height: 30px;
      font-size: 30px;
      color: rgba(255, 255, 255, 0.7);
      position: absolute;
      top: 29%;
      left: 50%;
      transform: translateX((-50%));
    }
    h3 {
      font-size: 20px;
      font-weight: bold;
      position: relative;
    }
    .lrc {
      display: flex;
      flex-direction: column;
      align-items: center;
      div {
        height: 29vh;
        overflow: hidden;
        ul {
          li {
            margin-top: 10px;
            height: 30px;
            &.active {
              color: red;
            }
          }
        }
      }
      .progress {
        z-index: 99999;
        display: flex;
        width: 100%;
        height: 20px;
        justify-content: center;
        h6 {
          margin-top: 3px;
        }
        input {
          margin: 10px 10px;

          width: 70%;
          height: 2px;
          background: -webkit-linear-gradient(#fff, #fff) no-repeat;
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            background: #fff !important;
            height: 0.5em;
            width: 0.5em;
          }
        }
      }
      .shuffelin {
        position: relative;
        z-index: 99999;
        width: 100%;
        height: 55px;
        display: flex;

        span.left {
          border: 1px solid #ddd;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: inline-block;
          line-height: 40px;
          position: absolute;
          top: 20%;
          left: 20%;
          .switch {
            display: block;
            width: 30px;
            height: 30px;
            font-size: 30px;
            color: rgba(255, 255, 255, 0.7);
            position: absolute;
            top: 15%;
            left: 48%;
          }
        }
        span.center {
          border: 1px solid #ddd;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: inline-block;
          line-height: 40px;
          position: absolute;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          .switch {
            display: block;
            width: 30px;
            height: 30px;
            font-size: 25px;
            color: rgba(255, 255, 255, 0.7);
            position: absolute;
            top: 16%;
            left: 51%;
          }
        }
        span.right {
          border: 1px solid #ddd;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: inline-block;
          line-height: 40px;
          position: absolute;
          top: 20%;
          right: 20%;
          .switch {
            display: block;
            width: 30px;
            height: 30px;
            font-size: 30px;
            color: rgba(255, 255, 255, 0.7);
            position: absolute;
            top: 15%;
            left: 48%;
          }
        }
      }
    }
  }
}
@keyframes rollImg {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes pichead {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
