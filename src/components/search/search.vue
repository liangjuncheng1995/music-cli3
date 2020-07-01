<template>
  <div class="search" >
    <div class="search-box-container">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutContainer" class="shortcut-container" v-show="!query" :style="'height:' + containerH + 'px'">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQuery(item.k)" v-for="item in hotKey" :key="item.k" class="item">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon iconfont icon-clear"></i>
            </span>  
          </h1>
          <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
        </div>
      </div>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest  @select="saveSearch" :query="query"></suggest> 
    </div>
    <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/javascript">
import SearchBox from "@/base/search-box/search-box";
import { getHotKey } from "@/api/search";
import { ERR_OK } from "@/api/config";
import suggest from "@/components/suggest/suggest";
import SearchList from "@/base/search-list/search-list";
import Confirm from "@/base/confirm/confirm";
import { mapActions, mapGetters } from "vuex";
import { playlistMixin } from "@/common/js/mixin";
export default {
  mixins: [playlistMixin],
  name: "search",
  data() {
    return {
      hotKey: [],
      query: ""
    };
  },
  computed: {
    ...mapGetters(["searchHistory"])
  },
  created() {
    this._getHotKey();
    this.containerH = window.innerHeight - (44 + 44 + 80);
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      const height = playlist.length > 0 ? this.containerH - 60 : this.containerH
      this.$refs.shortcutContainer.style.height = height  + "px"
      this.$refs.searchResult.style.bottom = bottom
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 20);
        }
      });
    },
    onQueryChange(query) {
      console.log("子组件传递的数据");
      console.log(query);
      this.query = query;
    },
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    ...mapActions([
      "saveSearchHistory",
      "deleteSearchHistory",
      "clearSearchHistory"
    ])
  },
  components: {
    SearchBox,
    suggest,
    SearchList,
    Confirm
  }
};
</script>

<style lang="scss" type="text/css">
.search {
  background-color: $theme-background-color;
  margin-top: 88px;
  overflow: hidden;
  .search-box-container {
    margin: 20px;
  }
  .shortcut-container {
    // position: fixed;
    // margin-top: 178px;
    bottom: 0;
    width: 100%;
    .shortcut {
      height: 100%;
      overflow: hidden;
      overflow-y: scroll;
      .hot-key {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: 14px;
          color: $theme-color;
        }
        ul {
          .item {
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: $theme-background-white;
            font-size: 14px;
            color: #333;
          }
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: 14px;
          color: $theme-color;
          .text {
            flex: 1;
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
            }
          }
        }
      }
    }
  }
  .search-result {
    position: fixed;
    width: 100%;
    top: 168px;
    bottom: 0;
  }
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>