import * as types from './mutation-types'

const mutations = {
    [types.SET_SINGER](state, singer) {//设置歌手的事件
        state.singer = singer
    }
}

export default mutations