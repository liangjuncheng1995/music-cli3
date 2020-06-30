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
    },
    [types.SET_PLAY_MODE](state, mode) {//设置播放列表的播放模式
        state.mode = mode
    },
    [types.SET_SEQUENCE_LIST](state, list) { //设置播放模式的循环的歌曲列表
        state.sequenceList = list
    },
    [types.SET_TOP_LIST](state, topList) { //设置排行榜的数据
        state.topList = topList
    },
    [types.SET_DISC](state, disc) { //设置推荐相关的歌曲数据
        state.disc = disc
    },
    [types.SET_SEARCH_HISTORY](state, history) { //设置搜索历史的相关数据
        state.searchHistory = history
    }



}

export default mutations