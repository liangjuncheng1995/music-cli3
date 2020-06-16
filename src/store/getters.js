export const singer = state => state.singer

export const playlist = state => state.playlist

export const currentIndex = state => state.currentIndex

export const fullScreen = state => state.fullScreen

export const playing = state => state.playing

export const mode = state => state.mode 

export const sequenceList = state => state.sequenceList

export const currentSong = (state) => { //获取选中歌曲的具体数据，只能从仓库里取选歌曲列表的选中的一条数据来存储
    return state.playlist[state.currentIndex] || {}
}