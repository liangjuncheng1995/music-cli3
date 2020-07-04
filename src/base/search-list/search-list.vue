<template lang="html">
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li :key="item" @click="selectItem(item)" class="search-item" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon1" @click.stop="deleteOne(item)">
          <i class="icon iconfont icon-clear-num"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default: []
    }
  },
  methods: {
    selectItem(item) {
      this.$emit("select", item);
    },
    deleteOne(item) {
      this.$emit("delete", item);
    }
  }
};
</script>

<style lang="scss" scoped>
.search-list .list-enter-active, .search-list .list-leave-active{
  transition:all 0.1s;
}
.search-list .list-enter,.search-list .list-leave-to{
  height: 0;
}
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    .text {
      flex: 1;
      font-size: 14px;
    //   color: rgba(255, 255, 255, 0.5);
    }
    .icon1 {
      position: relative;
      &::before {
        content: "";
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
      }
      .icon-clear-num {
        font-size: 12px;
        color: $theme-color;
      }
    }
  }
}
</style>
