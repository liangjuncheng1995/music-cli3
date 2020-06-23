<template lang='html'>
   <music-list :bg-image="bgImage" :title="title" :songs="songs"></music-list> 
</template>

<script>
import MusicList from "@/components/music-list/music-list";
import { getMusicList } from "@/api/rank";
import { ERR_OK } from "@/api/config";
import { mapGetters } from "vuex";
import { createSong } from "@/common/js/song";

export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
      return this.topList.picUrl;
    },
    ...mapGetters(["topList"])
  },
  components: {
    MusicList
  },
  created() {
    this._getMusicList();
  },
  methods: {
    _getMusicList() {
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        const musicData = item.data;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>


