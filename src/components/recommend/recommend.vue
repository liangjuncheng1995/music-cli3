<template>
  <div class="recommend">
    <div class="recommend-content">
      <div v-if="recommends.length" class="slider-container">
        <slider>
          <div v-for="item in recommends" :key="item.id">
            <a :href="item.linkUrl">
              <img :src="item.picUrl" alt="">
            </a>
          </div>
        </slider>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li class="item" v-for="item in discList" :key="item.dissid">
            <div class="icon">
              <img width="60" height="60" v-lazy="item.imgurl"  alt="">
            </div> 
            <div class="text">
              <h2 class="name" v-html="item.creator.name"></h2>
              <p class="desc" v-html="item.dissname"></p>
              <p class="desc"></p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getBannerList } from "@/api/recommend";
import { getDiscList } from "@/api/recommend";
import { ERR_OK } from "@/api/config";
import Slider from "@/base/slider/slider";
export default {
  name: "Recommend",
  data() {
    return {
      recommends: [],
      discList: []
    };
  },
  components: {
    Slider
  },
  created() {
    this._getBannerList();
    this._getDiscList();
  },
  methods: {
    _getBannerList() {
      getBannerList().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        console.log(res);
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.recommend {
  width: 100%;
  margin-top: 88px;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-container {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: 14px;
        color: $theme-color;
      }
      ul {
        .item {
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 20px 20px;
          .icon {
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          }
          .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: 14px;
            .name {
              margin-bottom: 10px;
              color: $theme-color;
            }
            .desc {
              color: #999;
            }
          }
        }
      }
    }
  }
}
</style>
