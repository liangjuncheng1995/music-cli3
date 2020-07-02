import * as types from "./mutation-types"
import { getPlayUrl } from '@/api/song'
import { playMode } from '@/common/js/config'
import { shuffle } from "@/common/js/util"
import { saveSearch, deleteSearch, clearSearch } from "@/common/js/cache"

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

export const checkoutAudioUrl = async function ({commit, state}, index) { //检查url是否有地址
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    console.log(playlist[index].name)
    console.log(sequenceList[index].name)
    if(!playlist[index].url) {
        const data = await getPlayUrl(playlist[index].mid)
        playlist[index].url = data.url_mid.data.midurlinfo[0].purl
    } 
    if(!sequenceList[index].url) {
        const data = await getPlayUrl(sequenceList[index].mid)
        sequenceList[index].url = data.url_mid.data.midurlinfo[0].purl
    } 
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
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
    if (!randomList[0].url) {
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

export const insertSong = async function ({ commit, state }, song) {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    //记录当前的歌曲
    let currentSong = playlist[currentIndex]
    //查找当前列表中是否有待插入的歌曲并返回其索引
    let fpIndex = findIndex(playlist, song)
    //因为插入歌曲，所以索引加一
    currentIndex++
    //插入这首歌到当前索引位置
    playlist.splice(currentIndex, 0, song)//插入当前前播放位置的后一位
    //如果已经包含这首歌
    if (fpIndex > -1) {
        //如果当前播放的的序号大于原本列表中的序号
        if (currentIndex > fpIndex) {
            playlist.splice(fpIndex, 1)//删除搜索到的歌曲 在原来列表位置的歌曲
            currentIndex--
        } else { //如果当前播放的的序号小于搜索之后原本列表中的序号
            playlist.splice(fpIndex + 1, 1)//删除原本列表的一条歌曲，由于fp的索引是有发生了改变的，所以要加1
        }
    }

    let currentSIndex = findIndex(sequenceList, currentSong) + 1
    let fsIndex = findIndex(sequenceList, song)
    sequenceList.splice(currentSIndex, 0, song)

    if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1)
        } else {
            sequenceList.splice(fsIndex + 1, 1)
        }
    }

    if (!sequenceList[currentIndex].url) {//处理没有url的地址
        const data = await getPlayUrl(sequenceList[currentIndex].mid)
        sequenceList[currentIndex].url = data.url_mid.data.midurlinfo[0].purl
    }
    if (!playlist[currentIndex].url) {//处理没有url的地址
        const data = await getPlayUrl(playlist[currentIndex].mid)
        playlist[currentIndex].url = data.url_mid.data.midurlinfo[0].purl
    }

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)

}

export const saveSearchHistory = function ({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({ commit }) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = async function({commit, state}, song) {
    let playlist = state.playlist.slice()
    let sequenceList = state.playlist.slice()
    let currentIndex = state.currentIndex

    let pIndex = findIndex(playlist, song)
    playlist.splice(pIndex, 1) //删除点击的一首歌曲
    let sIndex = findIndex(sequenceList, song) 
    sequenceList.splice(sIndex, 1) //删除点击的一首歌曲

    console.log(pIndex)
    console.log(currentIndex)
    

    if(currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex -- 
    }


    if (!playlist[currentIndex].url) {//处理没有url的地址
        const data = await getPlayUrl(playlist[currentIndex].mid)
        playlist[currentIndex].url = data.url_mid.data.midurlinfo[0].purl
    }
    if (!sequenceList[currentIndex].url) {//处理没有url的地址
        const data = await getPlayUrl(sequenceList[currentIndex].mid)
        sequenceList[currentIndex].url = data.url_mid.data.midurlinfo[0].purl
    }
    

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)

    if(!playlist.length) { //如果删除了最后一首
        commit(types.SET_PLAYING_STATE, false)
    } else {
        commit(types.SET_PLAYING_STATE, true)
    }
 
}

export const deleteSongList = function ({commit}) {
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
}
