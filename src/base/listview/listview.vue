<template>
  <div class="listview" @scroll="scroll" ref="listview">
    <ul >
      <li v-for="group in data" class="list-group" ref="listGroup" :key="group.title">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="item in group.items" :key="item.id">
            <img v-lazy="item.avatar" class="avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>

    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove"> 
      <ul>
        <li v-for="(item, index) in shortcutList" :key="index" :data-index="index" class="item"
          :class="{'current': currentIndex === index}">
          {{item}}
        </li>
      </ul>
    </div>

    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>

    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </div>
</template>
<script>
import Loading from "@/base/loading/loading";
import { getData } from "@/common/js/dom.js";
const ANCHOR_HEIGHT = 18; //每一个字母的高度
const TITLE_HEIGHT = 30; //每一个title的高度
export default {
  created() {
    this.touch = {};
    this.listHeight = [];
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  components: {
    Loading
  },
  computed: {
    shortcutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  mounted() {
  },
  data() {
    return {
      indexList: [],
      scrollY: -1,
      diff: -1,
      currentIndex: 0
    };
  },

  methods: {
    filter(data) {
      var Arr = [];
      data.forEach((item, index) => {
        Arr.push(item.title);
      });
      return Arr;
    },
    scroll(e) {
      this.scrollY = -e.target.scrollTop;
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, "index");
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY; //首次点击的时候在屏幕的位置
      this.touch.anchorIndex = anchorIndex; //获取点击之后的 data-index的属性
      this._scrollTo(anchorIndex); //执行滚动的方法
    },

    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      // 计算滚动了多少个索引
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0; //或0 向下取整，和Math.floor一样
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },

    _scrollTo(index) {
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        //滑动超过顶部
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        //滑动超过底部
        //看不懂，应该是点击字母表末尾的一些位置
        index = this.listHeight.length - 2;
      }
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollTop = - this.scrollY
    },
    _calculateHeight() {
      this.lineHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      list.forEach((item, index) => {
        //计算1 12 123 1234 。。。高度的集合
        height += item.clientHeight;
        this.listHeight.push(height);
      });
    }
  },
  watch: {
    data() {
      //数据更新的时候需要更新主列表的高度
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      //监听滚动条的数据
      const listHeight = this.listHeight;
      //当滚到顶部， newY > 0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      //在中间部分滚动
      
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];


        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          console.log(newY)
          console.log(height2)
          this.diff = height2 + newY;
          return;
        }
      }
      //当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  }
};
</script>
<style lang="scss" scoped>
.listview {
  position: relative;
  width: 100%;
  // height: 100%;
  height: 552px;
  overflow: hidden;
  background: #fff;
  overflow-y: scroll;

  .list-group-title {
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 1);
    background: $theme-color;
  }

  ul {
    .list-group {
      padding-bottom: 30px;

      .list-group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;

        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }

        .name {
          margin-left: 20px;
          // color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }
      }
    }
  }

  .list-shortcut {
    position: fixed;
    z-index: 30;
    right: 0;
    top: 60%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: rgba(255, 255, 255, 1);
      font-size: 12px;
    }

    .current {
      color: $theme-color;
    }
  }

  .list-fixed {
    position: fixed;
    top: 88px;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: 12px;
      color: rgba(255, 255, 255);
      background: $theme-color;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
