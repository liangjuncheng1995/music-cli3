<template lang="html">
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result">
        <div class="icon1">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { search } from "@/api/search";
import { ERR_OK } from "@/api/config";
import { filterString } from "@/common/js/song";
const TYPE_SINGER = "singer";
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
      result: []
    };
  },
  methods: {
    search() {
      search(this.query, this.page, this.showSinger).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data);
        }
      });
    },
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({
          ...data.zhida,
          ...{
            type: TYPE_SINGER
          }
        });
      }
      if (data.song) {
        ret = ret.concat(data.song.list);
      }
      return ret;
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
        return `${item.songname}-${filterString(item.singer)}`;
      }
    }
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
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
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
</style>
