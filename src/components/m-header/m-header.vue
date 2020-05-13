<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Bilibili Music</h1>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "MHeader"
};
</script>

<style lang="scss" scoped>
.m-header {
  width: 100%;
  position: fixed;
  z-index: 100;
  top: 0;
  background: #fff;
  height: 44px;
  text-align: center;
  color: $theme-color;
  font-size: 0;

  .icon {
    display: inline-block;
    vertical-align: top;
    margin-top: 5px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    background: url("bilibili-line.png");
    background-size: 30px 32px;
  }

  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: 18px;
  }
}
</style>
