<template>
  <div class="singer">
    <list-view :data="singers" @select="selectSinger"></list-view>
    <transition name="slide">
      <router-view />
    </transition>
  </div>
</template>

<script>
  import {
    getSingerList
  } from "@/api/singer";
  import {
    ERR_OK
  } from "@/api/config";
  import {
    Singer
  } from "@/common/js/singer";

  import ListView from "@/base/listview/listview";
  import {
    mapMutations
  } from "vuex"

  const HOT_NAME = "热门";
  const HOT_SINGER_LEN = 10;

  export default {
    name: "singer",
    data() {
      return {
        singers: []
      };
    },
    components: {
      ListView
    },
    created() {
      this._getSingerList();
    },
    methods: {
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        });
        this.setSinger(singer)
      },
      _getSingerList() {
        getSingerList().then(res => {
          if (res.code == ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list);
          }
        });
      },
      _normalizeSinger(list) {
        // 定义一个map 对象
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        };
        //遍历传进来的数据
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            //筛选前10名的歌手
            map.hot.items.push(
              new Singer({
                //调用singer类，获取对应的图片，名字对象的集合
                id: item.Fsinger_mid,
                name: item.Fsinger_name
              })
            );
          }
          const key = item.Findex; //获取对应歌手的首字母
          if (!map[key]) {
            //设置map对象的属性，以返回数据的Findex作为map对象的key值，这个key值与 hot属性是同一级别
            map[key] = {
              title: key,
              items: []
            };
          }
          map[key].items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        });
        //   处理有序的列表
        let hot = []; //热门歌手的数组
        let ret = []; //字母表的数组
        //再一次遍历map
        for (let key in map) {
          let val = map[key]; //遍历每一个对象的 value 值
          if (val.title.match(/[a-aA-Z]/)) {
            //筛选字母的歌手
            ret.push(val);
          } else if (val.title == HOT_NAME) {
            //热门，前10位歌手
            hot.push(val);
          }
        }
        ret.sort((a, b) => {
          //字母按顺序排序
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });
        return hot.concat(ret); //把热门的列表加到头部
      },
      ...mapMutations({
        setSinger: "SET_SINGER"
      })
    }
  };

</script>

<style lang="scss" scoped>
  .singer {
    margin-top: 88px;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter,
  .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

</style>
