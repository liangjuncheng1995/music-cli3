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

        <div class="middle">
          <div class="middle-l">
            <div class="cd-container" ref="cdContainer">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image" alt="">
              </div>
            </div>
          </div>
        </div> 

        <div class="bottom">
          <!-- 进度条 -->
          <div class="progress-container">
            <span class="time time-l"></span>
            <div class="progress-bar-container">
              <progress-bar></progress-bar>
            </div>
            <span class="time time-r"></span>
          </div>
          <!-- 操作控件 -->
          <div class="operators">
            <div class="icon1 i-left">
              <i class="icon iconfont icon-sequence-play"></i>
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
          <i @click.stop="togglePlaying" :class="miniIcon" id="minizi"></i>
        </div>
        <div class="control">
          <i class="icon iconfont icon-playlist"></i>
        </div>
      </div>
    </transition>   
    <audio ref='audio' :src="currentSong.url" @canplay="ready"  @error="error" @timeupdate="undateTime"></audio>
    <!-- @canplay="ready" play="ready"  -->
  </div>
</template>

<script>
import animations from "create-keyframe-animation";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { prefixStyle } from "@/common/js/dom";
import { debuglog } from "util";
import ProgressBar from "@/base/progress-bar/progress-bar";

const transform = prefixStyle("transform");
export default {
  data() {
    return {
      songReady: false
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
    ...mapGetters([
      "playlist",
      "currentSong", //需要播放的歌曲数据
      "fullScreen", //获取模拟播放器的展示状态
      "playing",
      "currentIndex" //获取正在播放歌曲的索引
    ])
  },
  components: {
    ProgressBar
  },
  methods: {
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
      this.songReady = false;
    },
    togglePlaying() {
      if (!this.songReady) {
        return;
      }
      console.log("点击暂停和播放");
      this.setPlayingState(!this.playing);
    },
    ready() {
      this.songReady = true;
      console.log(this.currentSong.url);
      console.log("播放的歌曲的地址正确");
    },
    error() {
      this.songReady = true;
      console.log("地址错误，需要更换地址");
    },

    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX"
    }),
    ...mapActions(["selectPrev"])
  },
  watch: {
    currentSong() {
      this.$nextTick(() => {
        this.$refs.audio.play();
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
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
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
        font-size: 35px !important;
        color: $theme-color-a;
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
