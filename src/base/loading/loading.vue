<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24" alt="">
    <p class="desc">{{title}}</p>
  </div>

</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: "正在载入中"
      }
    }
  };

</script>
<style lang="scss" scoped>
  .loading {
    width: 100%;
    text-align: center;

    .desc {
      line-height: 20px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }
  }

</style>
