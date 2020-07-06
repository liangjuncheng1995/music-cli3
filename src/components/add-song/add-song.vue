<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon iconfont icon-clear-num"></i>
        </div>
      </div>
      <div class="search-box-container">
        <search-box ref="searchBox" @query="search" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" @switch="switchItem" :currentIndex="currentIndex"></switches>
        <div class="list-container" v-show="currentIndex === 0" ref="listContainer0">
          <div class="list-scroll">
            <div class="list-inner">
              <song-list @select="selectSong" :songs="playHistory"></song-list>
            </div>
          </div>
        </div>

        <div class="list-container" ref="listContainer1" v-show="currentIndex === 1">
          <div class="list-scroll">
            <div class="list-inner">
              <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
            </div>
          </div>
        </div>
        <div class="no-result-container" v-show="noResult">
          <no-result :title="noResultDesc"></no-result>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" @select="selectSuggest" :showSinger="showSinger"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from "@/base/search-box/search-box";
import Suggest from "@/components/suggest/suggest";
import Switches from "@/base/switches/switches";
import SongList from "@/base/song-list/song-list";
import SearchList from "@/base/search-list/search-list";
import TopTip from "@/base/top-tip/top-tip";
import noResult from "@/base/no-result/no-result";

import Song from "@/common/js/song";

import { mapGetters, mapActions } from "vuex";
import { searchMixin } from "@/common/js/mixin";

export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      query: "",
      showSinger: false,
      currentIndex: 0,
      switches: [
        {
          name: "最近播放"
        },
        {
          name: "搜索历史"
        }
      ]
    };
  },
  computed: {
    noResult() {
      if (this.currentIndex === 0) {
        return !this.playHistory.length;
      } else {
        return !this.searchHistory.length;
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return "暂无播放歌曲";
      } else {
        return "暂无搜索记录";
      }
    },

    ...mapGetters(["playHistory"])
  },
  methods: {
    selectSuggest() {
      this.saveSearch();
      this.showTip();
    },
    showTip() {
      this.$refs.topTip.show();
    },
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },
    search(query) {
      this.query = query;
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    selectSong(song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song));
        this.showTip();
      }
    },
    ...mapActions(["insertSong"])
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    SongList,
    SearchList,
    TopTip,
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

.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: $theme-background-white;

  .header {
    position: relative;
    height: 44px;
    text-align: center;

    .title {
      line-height: 44px;
      font-size: 18px;
      color: #333;
    }

    .close {
      position: absolute;
      top: 0;
      right: 8px;

      .icon-clear-num {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $theme-color;
      }
    }
  }

  .search-box-container {
    margin: 20px;
  }

  .shortcut {
    .list-container {
      position: absolute;
      top: 165px;
      bottom: 0;
      width: 100%;
      overflow-y: scroll;

      .list-scroll {
        // height: 100%;
        // overflow: hidden;
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

  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }

  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;

    .icon-ok {
      font-size: 14px;
      color: $theme-color;
      margin-right: 4px;
    }

    .text {
      font-size: 14px;
      color: #fff;
    }
  }
}
</style>
