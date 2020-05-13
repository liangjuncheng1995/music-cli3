<template>
  <div class="tab-fiexed">
    <div class="tab">
      <router-link tag="div" class="tab-item" to="/recommend">
        <span class="tab-link">推荐</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/singer">
        <span class="tab-link">歌手</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/rank">
        <span class="tab-link">排行</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/search">
        <span class="tab-link">搜索</span>
      </router-link>
    </div>
  </div>
</template>
<script>
  export default {
    name: "tab"
  };

</script>

<style lang="scss" scoped>
  .tab {
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: 14px;

    .tab-item {
      flex: 1;
      text-align: center;

      .tab-link {
        padding-bottom: 5px;
        color: #222;
      }
    }
  }

  .router-link-active .tab-link {
    color: $theme-color !important;
    border-bottom: 2px solid $theme-color;
  }

</style>
