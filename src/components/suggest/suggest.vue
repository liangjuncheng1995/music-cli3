<template lang="html">
  <div class="suggest" @scroll="scroll" ref="suggest">
  <!-- <div class="suggest" > -->
    <!-- <mescroll-vue ref="mescroll" @init="mescrollInit" :down="mescrollDown" :up="mescrollUp"> -->
    <ul class="suggest-list">
      <a @click="selectItem(item)" href="javascript:;" v-for="item in result"> 
        <li class="suggest-item" >
          <div class="icon1">
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name">
            <p class="text" v-html="getDisplayName(item)"></p>
          </div>
        </li>
      </a>
      <loading v-show="hasMore" title="" style="padding-top:10px;"></loading>
      <div v-show="!hasMore && result.length">
        <no-result title="已经到底了"></no-result>
      </div>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-container">
      <no-result title="抱歉,暂无搜索结果"></no-result>
    </div>
    <!-- </mescroll-vue> -->
  </div>
</template>

<script>
import { search } from "@/api/search";
import { ERR_OK } from "@/api/config";
import { createSong } from "@/common/js/song";
import Loading from "@/base/loading/loading";
import NoResult from "@/base/no-result/no-result";
import { Singer } from '@/common/js/singer';
import { mapMutations, mapActions } from 'vuex';

// import MescrollVue from "mescroll.js/mescroll.vue";
const TYPE_SINGER = "singer";
const perpage = 20;
export default {
  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      hasMore: true,
      showFlag: true,
      suggetOffsetHeight: 0
      // mescroll: null,
      // isShowNoMore: true,//显示没有更多的数据了
      // mescrollDown: {
      //   use: false,
      //   auto: false
      // },
      // mescrollUp: {
      //   auto: false,
      //   isBoth: false,
      //   isBounce: true,
      //   callback: this.searchMore
      // }
    };
  },
  methods: {
    // mescrollInit(mescroll) {
    //   this.mescroll = mescroll;
    // },
    search() {
      this.page = 1;
      this.hasMore = true;
      this.showFlag = true;
      console.log("点击了搜索");
      this.$refs.suggest.scrollTop = 0;
      this.result = [];
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data);
          this._checkMore(res.data);
          // this.mescroll.showUpScroll();
        }
      });
    },
    searchMore() {
      if (!this.hasMore) {
        console.log(this.hasMore);
        return;
      }
      this.showFlag = false;
      this.page++;
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        this.result = this.result.concat(this._genResult(res.data));
        this.showFlag = true;
        this._checkMore(res.data);
        // this.mescroll.endSuccess();
      });
    },
    scroll(e) {
      if (this.suggetOffsetHeight == 0) {
        this.suggetOffsetHeight = this.$refs.suggest.offsetHeight;
      }
      if (
        this.suggetOffsetHeight + this.$refs.suggest.scrollTop >=
          this.$refs.suggest.scrollHeight &&
        this.showFlag == true
      ) {
        this.searchMore();
      }
    },
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid && this.page == 1) {
        ret.push({
          ...data.zhida,
          ...{
            type: TYPE_SINGER
          }
        });
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list));
      }
      return ret;
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    _checkMore(data) {
      const song = data.song;
      if (!song.list.length || song.curnum + song.curpage * perpage > song.totalnum) {
        //没有数据返回，或者已经拿到最后一页的数据
        console.log("已经没有数据了");
        this.hasMore = false;
        this.showFlag = false;
        // this.mescroll.showNoMore();
      }
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return "icon iconfont icon-user";
      } else {
        return "icon iconfont icon-musical-note";
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    selectItem(item) {
      if(item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    // MescrollVue,
    Loading,
    NoResult
  },
  watch: {
    query() {
      this.search();
    }
  }
};
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;

  .suggest-list {
    a {
      padding: 0 30px;
      display: block;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
      color: $theme-color;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 10px;
        padding-top: 10px;

        .icon1 {
          flex: 0 0 30px;
          width: 30px;
        }

        .name {
          flex: 1;
          font-size: 14px;
          color: #333;
          overflow: hidden;

          .text {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
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
