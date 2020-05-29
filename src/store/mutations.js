import * as types from './mutation-types'

const mutations = {
    [types.SET_SINGER](state, singer) {//设置歌手的事件
        state.singer = singer
    },
    [types.SET_CURRENT_INDEX](state, index) {
        state.currentIndex = index
    }

}

export default mutations