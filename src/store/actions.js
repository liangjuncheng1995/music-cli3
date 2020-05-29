import * as types from "./mutation-types"

export const selectPlay = function({commit, state}, {list, index}) {
    commit(types.SET_CURRENT_INDEX,index)
}