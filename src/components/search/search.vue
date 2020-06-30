<template>
  <div class="search">
    <div class="search-box-container">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-container" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQuery(item.k)" v-for="item in hotKey" :key="item.k" class="item">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest @select="saveSearch" :query="query"></suggest> 
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/javascript">
import SearchBox from "@/base/search-box/search-box";
import { getHotKey } from "@/api/search";
import { ERR_OK } from "@/api/config";
import suggest from '@/components/suggest/suggest'
import { mapActions } from 'vuex';
export default {
  name: "search",
  data() {
    return {
      hotKey: [],
      query: ""
    };
  },
  created() {
    this._getHotKey();
  },
  methods: {
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
      console.log("子组件传递的数据")
      console.log(query)
      this.query = query;
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory'
    ])
  },
  components: {
    SearchBox,
    suggest
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