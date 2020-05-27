<template>
  <div class="singer-detail">
    <music-list></music-list>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    getSingerDetail
  } from "@/api/singer";
  import {
    ERR_OK
  } from '@/api/config'
  import MusicList from "@/components/music-list/music-list"
  export default {
    computed: {
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this._getDetail();
      console.log(this.singer)
    },
    components: {
      MusicList
    },
    data() {
      return {
        
      }
    },
    methods: {
      _getDetail() {
        if(!this.singer.id) {//如果加载歌手详情页面的时候，没有歌手id,就直接返回歌手的列表页面
          this.$router.push('/singer')
          return 
        }
        getSingerDetail(this.singer.id).then((res) => {
          if(res.code === ERR_OK) {
            console.log(res.data.list)
          }
        })
      }
    }
  };

</script>

<style lang="scss" scoped>
  .singer-detail {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ffffff;
  }

</style>
