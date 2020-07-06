<template lang="html">
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-container" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon1 icon iconfont" :class="iconMode" @click="changeMode" ></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon iconfont icon-clear"></i>
            </span>
          </h1>
        </div>
        <div class="list-content" ref="listContent">
          <transition-group tag="ul" name="lists" >
            <li :key="item.id" class="item" v-for="(item, index) in sequenceList"  @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text" :class="getCurrentText(item)">{{item.name}}</span>
              <span class="like">
                <i class="icon iconfont icon-favoriteoutline"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon iconfont icon-clear-num"></i>
              </span>
            </li>
          </transition-group>
        </div>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon iconfont icon-add"></i>
            <span class="text">添加歌曲列表</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
      
      <add-song ref="addSong"></add-song>
    </div>
  </transition>

</template>

<script>
import Confirm from "@/base/confirm/confirm";
import AddSong from "@/components/add-song/add-song";
import { mapActions } from "vuex";
import { playMode } from "@/common/js/config";
import { playerMixin } from "@/common/js/mixin";
const itemHeight = 40;
export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false
    };
  },
  components: {
    Confirm,
    AddSong
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence
        ? "顺序播放"
        : this.mode === playMode.random ? "随机播放" : "单曲循环";
    }
  },
  methods: {
    
    show() {
      this.showFlag = true;
      this.$nextTick(() => {
        this.scrollToCurrent(this.currentSong);
      });
    },
    hide() {
      this.showFlag = false;
    },
    addSong() {
      this.$refs.addSong.show()
    },
    async selectItem(item, index) {
      if (this.mode === playMode.random) {
        //如果是随机播放的模式
        index = this.playlist.findIndex(song => {
          return song.id === item.id;
        });
      }
      await this.checkoutAudioUrl(index);
      this.setCurrentIndex(index);
      this.setPlayingState(true);
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return "icon iconfont icon-play";
      } else {
        return "";
      }
    },
    getCurrentText(item) {
      if (this.currentSong.id === item.id) {
        return "currentSongText";
      } else {
        return "";
      }
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => {
        return current.id === song.id;
      });
      // this.$refs.listContent.scrollTo({
      //   top: index * itemHeight,
      //   behavior: "smooth"
      // });
        this.$refs.listContent.scrollTop = index * itemHeight;
    },
    deleteOne(item) {
      this.deleteSong(item);
      if (!this.playlist.length) {
        this.hide();
      }
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    confirmClear() {
      this.deleteSongList();
      this.hide();
    },
    ...mapActions(["deleteSong", "checkoutAudioUrl", "deleteSongList"])
  },
  watch: {
    currentSong(newSong, oldSong) {
      //点击列表的歌曲之后，自动滚动到相应的位置
      if (!this.showFlag || newSong.id === oldSong.id) {
        return;
      }
      this.scrollToCurrent(newSong);
    }
  }
};
</script>

<style lang="scss" scoped>
// 歌曲列表组的动画
.lists-enter-active,
.lists-leave-active {
  transition: all 0.3s linear;
}

.lists-enter,
.lists-leave-to {
  opacity: 0;
  transform: translateX(-500px);
}

.list-fade-enter-active,
.list-fade-leave-active {
  transition: opacity 0.3s;
}

.list-fade-enter,
.list-fade-leave-to {
  opacity: 0;
}

.list-fade-enter-active .list-container {
  transition: all 0.3s;
}

.list-fade-leave-active .list-container {
  transition: all 0.3s;
}

.list-fade-enter .list-container {
  transform: translate3d(0, 100%, 0);
}

.list-fade-leave-to .list-container {
  transform: translate3d(0, 100%, 0);
}

.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.3);

  .list-container {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $theme-background-white;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon1 {
          margin-right: 10px;
          font-size: 30px;
          color: $theme-color;
        }

        .text {
          flex: 1;
          font-size: 14px;
          //   color: rgba(255, 255, 255, 0.5);
        }

        .clear {
          position: relative;

          &::before {
            content: "";
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
          }

          .icon-clear {
            font-size: 14px;
            color: $theme-color;
          }
        }
      }
    }
  }

  .list-content {
    max-height: 240px;
    overflow: hidden;
    overflow-y: scroll;

    .item {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 30px 0 20px;
      overflow: hidden;

      .current {
        flex: 0 0 20px;
        width: 20px;
        font-size: 12px;
        color: $theme-color-bold;
      }
      .currentSongText {
        color: $theme-color-bold;
      }
      .text {
        flex: 1;
        @include ellipseOne;
        font-size: 14px;
        // color: rgba(255, 255, 255, 0.3);
      }

      .like {
        position: relative;
        margin-right: 15px;
        font-size: 12px;
        color: rgb(251, 114, 153);

        &::before {
          content: "";
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
        }

        .icon-favoriteline {
          color: #d93f30;
        }
      }

      .delete {
        position: relative;
        font-size: 12px;
        color: $theme-color;

        &::before {
          content: "";
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
        }
      }
    }
  }

  .list-operate {
    width: 140px;
    margin: 20px auto 30px auto;

    .add {
      display: flex;
      justify-content: center;
      padding: 8px 16px;
      border: 1px solid $theme-color;
      border-radius: 100px;
      color: $theme-color;
      .icon-add {
        margin-right: 5px;
        font-size: 10px;
      }

      .text {
        font-size: 12px;
        color: $theme-color;
      }
    }
  }

  .list-close {
    text-align: center;
    line-height: 50px;
    background: #222;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
