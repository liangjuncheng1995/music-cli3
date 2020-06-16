import * as types from "./mutation-types"
import { getPlayUrl } from '@/api/song'
import { playMode } from '@/common/js/config'
import { shuffle } from "@/common/js/util"

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

export const selectPlay = async function ({ commit, state }, { list, index }) {
    if (!list[index].url) {
        const data = await getPlayUrl(list[index].mid)
        list[index].url = data.url_mid.data.midurlinfo[0].purl
    }
    commit(types.SET_SEQUENCE_LIST, list)//提交到循环的列表

    if (state.mode === playMode.random) {
        let randomList = shuffle(list)//随机打乱播放的列表
        commit(types.SET_PLAYLIST, randomList) //把打乱的播放列表添加到playlist中
        index = findIndex(randomList, list[index])//然后把打乱数据的index 也需要重置
    } else {
        commit(types.SET_PLAYLIST, list)//提交到初始化的列表
    }

    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = async function ({ commit }, { list }) {
    
    commit(types.SET_PLAY_MODE, playMode.random) //更改播放的模式
    commit(types.SET_SEQUENCE_LIST, list) //设置循环的播放列表
    let randomList = shuffle(list)
    if(!randomList[0].url) {
        const data = await getPlayUrl(randomList[0].mid)
        randomList[0].url = data.url_mid.data.midurlinfo[0].purl
    }
    commit(types.SET_PLAYLIST, randomList) //设置播放的列表
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}



export const selectPrev = async function ({ commit, state }, { list, index }) {
    if (!list[index].url) {
        console.log("需要去请求歌曲的链接了")
        const data = await getPlayUrl(list[index].mid)
        list[index].url = data.url_mid.data.midurlinfo[0].purl
        commit(types.SET_PLAYLIST, list)
    }
}