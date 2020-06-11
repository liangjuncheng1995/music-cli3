import * as types from "./mutation-types"
import {getPlayUrl} from '@/api/song'

export const selectPlay = async function({commit, state}, {list, index}) {
    if(!list[index].url) {
        const data = await getPlayUrl(list[index].mid)
        list[index].url = data.url_mid.data.midurlinfo[0].purl
    }
    commit(types.SET_PLAYLIST, list)
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}


export const selectPrev = async function({commit, state}, {list, index}) {
    if(!list[index].url) {
        const data = await getPlayUrl(list[index].mid)
        list[index].url = data.url_mid.data.midurlinfo[0].purl
    }
    commit(types.SET_PLAYLIST, list)
}