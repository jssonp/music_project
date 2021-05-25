import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
let playingMusic={//定义一个对象 存储全局数据 存储音乐ID 
  musicID:0,
  newMusicList: [],
  isPlay:true,
  playList:[]
}
new Vue({
  router,
  data:{
    playingMusic
  },
  render: h => h(App)
}).$mount('#app')
