<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back()">
        <i class="icon iconfont icon-fanhui"></i>
      </div>
      <div class="switches-container">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon iconfont icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-container" ref="listContainer0" v-show="currentIndex === 0">
        <div class="list-scroll" >
          <div class="list-inner">
            <song-list @select="selectSong" :songs="favoriteList"></song-list>
          </div>
        </div>
      </div>
      <div class="list-container" ref="listContainer1" v-show="currentIndex === 1">
        <div class="list-scroll">
          <div class="list-inner">
            <song-list @select="selectSong"  :songs="playHistory"></song-list>
          </div>
        </div>
      </div>
      <div class="no-result-container" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import switches from "@/base/switches/switches";
import SongList from "@/base/song-list/song-list";
import noResult from "@/base/no-result/no-result";
import { mapGetters, mapActions } from "vuex";
import { playlistMixin } from "@/common/js/mixin";
import Song from "@/common/js/song";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      currentIndex: 0,
      switches: [
        {
          name: "我喜欢的"
        },
        {
          name: "我最近听的"
        }
      ]
    };
  },
  computed: {
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length;
      } else {
        return !this.playHistory.length;
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return "暂无收藏歌曲";
      } else {
        return "你还没有听过歌曲";
      }
    },
    ...mapGetters(["favoriteList", "playHistory"])
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.listContainer0.style.bottom = bottom;
      this.$refs.listContainer1.style.bottom = bottom;
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
      if (list.length === 0) {
        return;
      }
      list = list.map(song => {
        return new Song(song);
      });
      this.randomPlay({
        list
      });
    },
    back() {
      this.$router.back();
    },
    selectSong(song) {
      this.insertSong(new Song(song));
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    ...mapActions(["insertSong", "randomPlay"])
  },
  components: {
    switches,
    SongList,
    noResult
  }
};
</script>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $theme-background-color;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-fanhui {
      display: block;
      padding: 10px;
      font-size: 22px;
      color: $theme-color;
    }
  }

  .switches-container {
    margin: 10px 0 30px 0;
  }

  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $theme-color;
    color: $theme-color;
    border-radius: 100px;
    font-size: 0;

    .icon-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: 16px;
    }

    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: 12px;
    }
  }

  .list-container {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
    overflow-y: scroll;

    .list-scroll {
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .no-result-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
