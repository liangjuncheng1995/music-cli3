<template>
  <div class="rank" ref="rank">
    <div class="toplist">
      <ul>
        <li class="item" v-for="item in topList" :key="item.id" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" alt="">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList" :key="index">
              <span style="font-weight: 600;">{{index + 1}}. </span>
              <span>{{song.songname}} - <em>{{song.singername}}</em></span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length"></div>
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/javascript">
import { ERR_OK } from "@/api/config";
import { getTopList } from "@/api/rank";
import Loading from "@/base/loading/loading";
import { playlistMixin } from "@/common/js/mixin";
import { mapMutations } from "vuex";

export default {
  mixins: [playlistMixin],
  created() {
    this._getTopList();
  },
  data() {
    return {
      topList: []
    };
  },
  components: {
    Loading
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length ? "60px" : "";
      this.$refs.rank.style.marginBottom = bottom;
    },
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      });
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      });
      this.setTopList(item);
    },
    ...mapMutations({
      setTopList: "SET_TOP_LIST"
    })
  }
};
</script>

<style lang="scss" scoped>
.rank {
  width: 100%;
  margin-top: 88px;

  .toplist {
    height: 100%;
    overflow: hidden;
    background: $theme-background-color;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      border-radius: 10px !important;

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: #ffffff;
        font-size: 12px;

        .song {
          @include ellipseOne;
          line-height: 26px;

          em {
            color: rgba(0, 0, 0, 0.4);
          }
        }
      }
    }
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
