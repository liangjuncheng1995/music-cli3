<template>
  <div class="singer-detail">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
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
  import {
    createSong
  } from '@/common/js/song'
  import MusicList from "@/components/music-list/music-list"
  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this._getDetail();
    },
    components: {
      MusicList
    },
    methods: {
      _getDetail() {
        if(!this.singer.id) {//如果加载歌手详情页面的时候，没有歌手id,就直接返回歌手的列表页面
          this.$router.push('/singer')
          return 
        }
        getSingerDetail(this.singer.id).then((res) => {
          if(res.code === ERR_OK) {
            // console.log(res.data.list)
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      _normalizeSongs(list) {//组装歌曲列表的数据
        let ret = []
        list.forEach((item) => {
          // let {musicData} = item
          let musicData = item.musicData
          if(musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
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
