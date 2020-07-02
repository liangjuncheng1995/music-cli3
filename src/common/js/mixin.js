import { mapGetters, mapMutations } from 'vuex'
import {
    playMode
} from "@/common/js/config"
import {
    shuffle
} from "@/common/js/util"

export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playlist'
        ])
    },
    mounted() {
        this.handlePlaylist(this.playlist)
    },
    activated() {
        this.handlePlaylist(this.playlist)
    },
    watch: {
        playlist(newVal) {
            this.handlePlaylist(newVal)
        }
    },
    methods: {
        handlePlaylist() {
            throw new Error('component must implement handlePlaylist method')
        }
    }
}

export const playerMixin = {
    computed: {
        ...mapGetters([
            "playlist",
            "sequenceList", //获取循环的列表
            "currentSong", //需要播放的歌曲数据
            "mode", //获取播放的模式
        ]),
        iconMode() {
            //计算切换播放模式的icon
            return this.mode === playMode.sequence
                ? "icon-sequence-play"
                : this.mode === playMode.loop ? "icon-loop" : "icon-random";
        },

    },
    methods: {
        changeMode() {
            //更改播放列表的状态
            const mode = (this.mode + 1) % 3;
            this.setPlayMode(mode);
            let list = null;
            if (mode === playMode.random) {
                list = shuffle(this.sequenceList);
            } else {
                list = this.sequenceList;
            }
            this._resetCurrentIndex(list);
            this.setPlayList(list);
        },
        _resetCurrentIndex(list) {
            let index = list.findIndex(item => {
                return item.id === this.currentSong.id;
            });
            this.setCurrentIndex(index);
        },
        ...mapMutations({
            setPlayingState: "SET_PLAYING_STATE",
            setCurrentIndex: "SET_CURRENT_INDEX",
            setPlayMode: "SET_PLAY_MODE",
            setPlayList: "SET_PLAYLIST"
        }),
    }
}