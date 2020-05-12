<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-container">
        轮播列表
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul></ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getBannerList
  } from "@/api/recommend";
  import {
    ERR_OK
  } from "@/api/config"
  export default {
    name: "Recommend",
    data() {
      return {

      }
    },
    created() {
      this._getBannerList()
    },
    methods: {
      _getBannerList() {
        getBannerList().then(res => {
          if(res.code === ERR_OK) {
            console.log(res.data.slider)
          }
        })
      }
    }


  };

</script>

<style lang="scss" scoped>
  .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;

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
      }
    }
  }

</style>
