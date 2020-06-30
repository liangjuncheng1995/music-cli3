<template lang="html">
  <div class="no-result">
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
.no-result {
  text-align: center;
  .no-result-text {
    margin-bottom: 10px;
    margin-top: 10px;
    font-size: 14px;
    color: #999;
    position: relative;
    font-size: 14px;
    color: $theme-color-placeholder;
    position: relative;
  }
}
</style>

