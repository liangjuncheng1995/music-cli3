import * as types from './mutation-types'

const mutations = {
    [types.SET_SINGER](state, singer) {//设置歌手的事件
        state.singer = singer
    },
    [types.SET_CURRENT_INDEX](state, index) {//设置点击了哪一首歌曲
        state.currentIndex = index
    },
    [types.SET_PLAYLIST](state, list) {//设置播放列表
        state.playlist = list
    },
    [types.SET_FULL_SCREEN](state, flag) {//设置迷你播放器的显示
        state.fullScreen = flag
    },
    [types.SET_PLAYING_STATE](state, flag) {//设置歌曲的播放状态
        state.playing = flag
    }

}

export default mutations