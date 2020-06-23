<template lang="html">
  <div class="search-box">
    <i class="icon iconfont icon-sousuo"></i>
    <input class="box" v-model="query" :placeholder="placeholder">
    <i @click="clear" v-show="query" class="icon iconfont icon-delete"></i>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  methods: {
    clear() {
      this.query = "";
    },
    setQuery(query) {
      this.query = query;
    }
  },
  created() {
    this.$watch("query", newQuery => {
        this.$emit("query", newQuery)
    });
  }
};
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $theme-background-white;
  border-radius: 6px;
  .icon-sousuo {
    font-size: 24px;
    color: #222;
  }
  .box {
    flex: 1;
    margin: 0 20px;
    line-height: 18px;
    background: $theme-background-white;
    color: #333;
    font-size: 14px;
  }
  .icon-delete {
    font-size: 16px;
    color: #222;
  }
}
input::-webkit-input-placeholder {
  /*WebKit browsers*/
  color: $theme-color-placeholder;
}
input::-moz-input-placeholder {
  /*Mozilla Firefox*/
  color: $theme-color-placeholder;
}
input::-ms-input-placeholder {
  /*Internet Explorer*/
  color: $theme-color-placeholder;
}
</style>
