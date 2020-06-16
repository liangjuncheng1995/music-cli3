<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-container" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from "@/common/js/dom";
const progressBtnWidth = 16;
const transform = prefixStyle('transform')
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {};
  },
  methods: {
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left; //点击节点的x坐标-进度条到最左边的距离= 点击位置到进度条的最左边的距离
      this._offset(offsetWidth);
      this._triggerPercent();
    },
    _triggerPercent() {
      //向父组件派发一个时间，调整音乐的播放进度
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      const percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit("percentChange", percent);
    },
    progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const deltaX = e.touches[0].pageX - this.touch.startX; //滑动距离,f负数为左滑，正数为右滑动
      const offsetWidth = Math.min(
        // 取个最小值
        this.$refs.progressBar.clientWidth - progressBtnWidth, //进度条的长度，不变的
        Math.max(0, this.touch.left + deltaX) // 滑动的时候按下去，也就是touchstart的时候正在播放的进度条的长度this.touch.left，
      );
      this._offset(offsetWidth);
    },
    progressTouchEnd() {
      this.touch.initiated = false;
      this._triggerPercent();
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        const offsetWidth = newPercent * barWidth;
        this._offset(offsetWidth);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $theme-color;
    }
    .progress-btn-container {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid #fff;
        border-radius: 50%;
        background: $theme-color;
      }
    }
  }
}
</style>
