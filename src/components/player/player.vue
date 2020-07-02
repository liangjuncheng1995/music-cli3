<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" alt="">
        </div> 

        <div class="top">
          <div class="back" @click="back">
            <i class="icon iconfont icon-fanhui"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>

        <div class="middle" @touchstart="middleTouchStart" @touchmove="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-container" ref="cdContainer">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image" alt="">
              </div>
            </div>
            <div class="playing-lyric-container">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div> 
          </div>

          <div @scroll="scroll" class="middle-r" ref="lyricList">
            <mescroll-vue hardwareClass="mescroll-hardware" :down="mescrollDown" ref="mescroll" @init="mescrollInit">
              <div class="lyric-container" ref="lyricContainer">
                <div v-if="currentLyric">
                  <p ref="lyricLine" class="text" :key="index" v-for="(line, index) in currentLyric.lines"
                    :class="{'current': currentLineNum === index}"
                  >
                    {{line.txt}}
                  </p>
                </div>
              </div>
            </mescroll-vue>
          </div> 
        </div> 

        <div class="bottom">
          <div class="dot-container">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <!-- 进度条 -->
          <div class="progress-container">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-container">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <!-- 操作控件 -->
          <div class="operators">
            <div class="icon1 i-left" @click="changeMode">
              <i class="icon iconfont" :class="iconMode"></i>
            </div>
            <div class="icon1 i-left" :class="disableCls">
              <i @click="prev" class="icon iconfont icon-prev-song"></i>
            </div>
            <div class="icon1 i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon1 i-right" :class="disableCls">
              <i @click="next" class="icon iconfont icon-next-song"></i>
            </div>
            <div class="icon1 i-right">
              <i class="icon iconfont icon-favoriteoutline"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>  
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon-img">
          <img :src="currentSong.image" width="40" height="40" :class="cdCls" alt="">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon" id="minizi"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon iconfont icon-playlist"></i>
        </div>
      </div>
    </transition>   
    <playlist ref="playlist"></playlist>
    <audio ref='audio' :src="currentSong.url" @canplay="ready" @ended="end"  @error="error" @timeupdate="undateTime"></audio>
    <!-- @canplay="ready" play="ready"  -->
  </div>
</template>

<script>
import animations from "create-keyframe-animation";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { prefixStyle } from "@/common/js/dom";
// import { debuglog } from "util";
import ProgressBar from "@/base/progress-bar/progress-bar";
import ProgressCircle from "@/base/progress-circle/progress-circle";
import playlist from "@/components/playlist/playlist";
import MescrollVue from "mescroll.js/mescroll.vue";
import { playMode } from "@/common/js/config";
import Lyric from "lyric-parser";
import {
  playerMixin
} from "@/common/js/mixin"

const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");
export default {
  mixins: [playerMixin],
  data() {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null, //全部歌词
      playingLyric: "", //正在播放的歌词
      currentLineNum: 0,
      currentShow: "cd",
      mescroll: null,
      mescrollDown: {
        use: false,
        auto: false
      }
    };
  },
  computed: {
    cdCls() {
      return this.playing ? "play" : "play pause";
    },
    playIcon() {
      return this.playing
        ? "icon iconfont icon-time-out"
        : "icon iconfont icon-play";
    },
    
    miniIcon() {
      return this.playing
        ? "icon iconfont icon-mini-pause"
        : "icon iconfont icon-mini-play";
    },
    disableCls() {
      console.log("歌曲状态：");
      console.log(this.songReady);
      return this.songReady ? "" : "disable";
    },
    percent() {
      return this.currentTime / this.currentSong.duration; //当前歌曲的播放时间/当前歌曲的总时长 = 播放的百分比
    },
    ...mapGetters([
      "fullScreen", //获取模拟播放器的展示状态
      "playing",
      "currentIndex", //获取正在播放歌曲的索引
    ])
  },
  created() {
    this.touch = {};
  },
  components: {
    ProgressBar,
    ProgressCircle,
    MescrollVue,
    playlist
  },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      animations.runAnimation(this.$refs.cdContainer, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdContainer.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdContainer.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdContainer.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdContainer.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdContainer.style.transition = "";
      this.$refs.cdContainer.style.transform = "";
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 50;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    // playIcon() {},
    async prev() {
      if (!this.songReady) {
        console.log("上一首的地址错误");
        return;
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        //如果是从第一首歌曲点击了上一首，应该跳转到播放歌曲列表的最后一首
        index = this.playlist.length - 1;
      }
      await this.selectPrev({
        list: this.playlist,
        index
      });
      this.setCurrentIndex(index);
      if (!this.playing) {
        //如果播放的状态是暂停的时候，应该再次启动播放的按钮
        this.togglePlaying();
      }
      this.songReady = false;
    },
    async next() {
      if (!this.songReady) {
        console.log("地址错误，下一首歌曲获取不了");
        return;
      }
      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index == 0;
      }
      await this.selectPrev({
        list: this.playlist,
        index
      });
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      console.log(this.currentTime);
      this.songReady = false;
    },
    togglePlaying() {
      if (!this.songReady) {
        return;
      }
      console.log("点击暂停和播放");
      this.setPlayingState(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    ready() {
      this.songReady = true;
      console.log(this.currentSong.url);
      console.log("播放的歌曲的地址正确");
    },
    undateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    format(interval) {
      interval = interval | 0;
      const minute = (interval / 60) | 0;
      const seconds = this._pad(interval % 60);
      return `${minute}:${seconds}`;
    },
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    onProgressBarChange(percent) {
      const currentTime = this.currentSong.duration * percent;
      this.$refs.audio.currentTime = currentTime;
      if (!this.playing) {
        this.togglePlaying();
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    
    async getLyric() {
      console.log(this.currentSong);
      var resultLyric = await this.currentSong.getLyric();
      if (resultLyric != "no lyric") {
        this.currentLyric = new Lyric(resultLyric, this.handleLyric);
        if (this.playing) {
          this.currentLyric.play();
        }
      } else {
        this.currentLyric = null;
        this.playingLyric = "";
        this.currentLineNum = 0;
      }
    },
    handleLyric({ lineNum, txt }) {
      //操作正在播放的歌词
      this.currentLineNum = lineNum; //定位正在播放的歌词
      if (lineNum > 5) {
        //监听移动歌词的列表,//如果lineNum大于5，为了让currentLine保持在中间，滚动到lineNum-5的元素上
        let lineEl = this.$refs.lyricLine[lineNum - 5]; //获取调整滚动条的位置
        let unit = 32;
        let num = lineNum * unit - 5 * unit;
        // lineEl.scrollIntoView()
        var el = this.$refs.lyricList;
        // this.ScrollTopsa(num,200)
        this.$refs.lyricList.scrollTo({
          top: num,
          behavior: "smooth"
        });
        this.mescroll.scrollTo(num, 300);
        // this.$refs.lyricList.scrollTop = 0
        // this.$refs.lyricContainer.style.transform = `translate(0,${-num}px)`;
      } else {
        this.mescroll.scrollTo(0, 300);
      }
      this.playingLyric = txt;
    },
    showPlaylist() {
      this.$refs.playlist.show();
    },
    ScrollTopsa(number, time) {
      if (!time) {
        this.$refs.lyricList = number; //设置节点传进来的需要滚动的位置
        return number;
      }
      const spacingTime = 20;
      let spacingIndex = time;
      let nowTop = this.$refs.lyricList.scrollTop; //获取当前节点滚动条的位置
      let everTop = (number - nowTop) / spacingIndex; // 计算每次（每个单位时间）滑动的距离
      let scrollTimer = setInterval(() => {
        if (spacingIndex > 0) {
          spacingIndex--;
          this.ScrollTopsa((nowTop += everTop));
        } else {
          clearInterval(scrollTimer);
        }
      }, spacingTime);
    },
    middleTouchStart(e) {
      //存储点击的坐标位置
      this.touch.initiated = true;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX; //左滑 小于 0， 右滑大于0
      const deltaY = touch.pageY - this.touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        //如果y轴移动的距离大于x轴的距离 则取消操作
        return;
      }
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      //cd模板左滑 ， offsetWidth为 deltaX, 为负数 ， cd模板左滑 ， offsetWidth为 0 deltaX, 为正数
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      );
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth); //计算滑动的百分比

      this.$refs.middleL.style[transitionDuration] = 0; //消除过渡的时间
      this.$refs.lyricList.style.transitionDuration = 0;
      this.$refs.lyricList.style.transform = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.middleL.style.opacity = 1 - this.touch.percent; //根据移动距离改变cd页面的透明度
    },
    middleTouchEnd(e) {
      let offsetWidth;
      let opacity;

      const touch = e.changedTouches[0];
      const deltaX = touch.pageX - this.touch.startX; //左滑 小于 0， 右滑大于0
      const deltaY = touch.pageY - this.touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        //如果y轴移动的距离大于x轴的距离 则取消操作
        return;
      }
      if (this.currentShow === "cd") {
        //如果在cd页面，向左滑动超过10%就跳转到lyric页面
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        }
      } else {
        //在lyric 页面，向右滑动比例低于90%，就跳转到cd页面
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      this.$refs.middleL.style[transitionDuration] = `300ms`;
      this.$refs.lyricList.style.transitionDuration = `300ms`; //设置过度时间300ms
      this.$refs.lyricList.style.transform = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.middleL.style.opacity = opacity;

      this.touch.initiated = false;
    },
    
    error() {
      this.songReady = true;
      console.log("地址错误，需要更换地址");
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    scroll(e) {},
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
    }),
    ...mapActions(["selectPrev"])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id) {
        return;
      }
      if (newSong.id === oldSong.id) {
        //单曲的循环的时候，不需要重新请求数据
        return;
      }
      if (this.currentLyric) {
        //切换歌曲的时候，如果已经有this.currentLyric了就停止之前的
        this.currentLyric.stop();
      }
      this.$nextTick(() => {
        this.$refs.audio.play();
        this.getLyric(); //获取歌词
      });
    },
    playing(newPlaying) {
      this.$nextTick(() => {
        newPlaying ? this.$refs.audio.play() : this.$refs.audio.pause();
      });
    }
  }
};
</script>


<style lang="scss" scoped>
/* 动画 */
.normal-enter-active .top {
  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.normal-leave-active .top {
  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.normal-enter-active .bottom {
  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.normal-leave-active .bottom {
  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.normal-enter,
.normal-leave-to {
  opacity: 0;
}
.normal-enter,
.normal-leave-to .top {
  transform: translate3d(0, -100px, 0);
}
.normal-enter,
.normal-leave-to .bottom {
  transform: translate3d(0, 100px, 0);
}

.normal-enter-active,
.normal-leave-active {
  transition: all 0.4s;
}
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: #222;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-fanhui {
          display: block;
          padding: 9px;
          font-size: 22px;
          color: $theme-color;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include ellipseOne;
        font-size: 18px;
        color: #fff;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: 14px;
        color: #fff;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-container {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
        .playing-lyric-container {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            color: $theme-color-bold;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        // overflow: hidden;
        overflow-y: scroll;
        .lyric-container {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
          }
          .current {
            color: $theme-color-bold;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-container {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
        }
        .active {
          width: 20px;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.8);
        }
      }
      .progress-container {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: #fff;
          font-size: 12px;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
        }
        .time-l {
          text-align: left;
        }
        .time-r {
          text-align: right;
        }
        .progress-bar-container {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon1 {
          flex: 1;
          color: $theme-color;
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .disable {
          color: $theme-color-a !important;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
          .icon-favoriteoutline {
            font-size: 25px;
          }
        }
      }
    }
  }
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: #333;
    .icon-img {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;
      img {
        border-radius: 50%;
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
        font-size: 14px;
        color: #fff;
        @include ellipseOne;
      }
      .desc {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.3);
        @include ellipseOne;
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      i {
        font-size: 30px;
      }
      #minizi {
        font-size: 37px !important;
        color: $theme-color-a-3;
      }
      .icon-mini {
        // position: absolute;
        // left: 0.5px;
        // top: 0px;
        position: absolute;
        left: -2.4px;
        top: -1.5px;
      }
      .icon-playlist {
        font-size: 30px;
        color: $theme-color-a;
      }
    }
  }
}

.play {
  animation: rotate 20s linear infinite;
}
.pause {
  animation-play-state: paused;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
