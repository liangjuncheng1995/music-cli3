<template lang="html">
  <ul class="switches">
    <li class="switches-item" v-for="(item, index) in switches" :key="item.index" :class="{'active': currentIndex === index}"
        @click="switchItem(index)"
    >
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    switches: {
      type: Array,
      default: []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem(index) {
      this.$emit("switch", index);
    }
  }
};
</script>

<style lang="scss" scoped>
.switches {
  display: flex;
  align-items: center;
  width: 240px;
  margin: 0 auto;
  border: 1px solid $theme-color;
  border-radius: 5px;
  .switches-item {
    flex: 1;
    padding: 8px;
    text-align: center;
    font-size: 14px;
    color: #333;
  }
  .active {
    background: $theme-color-bold;
    color: #fff;
  }
}
</style>


