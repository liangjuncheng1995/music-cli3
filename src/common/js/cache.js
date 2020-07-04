import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_LENGTH = 15

const PLAY_KEY = "__play__"
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = "__favorite__"
const FAVORITE_MAX_LENGTH = 200

function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare) //寻找搜索key的索引
    if (index === 0) {
        return
    }
    if (index > 0) { //删除已经搜索过的索引
        arr.splice(index, 1)
    }
    arr.unshift(val)
    if (maxLen && arr.length > maxLen) {//如果搜索历史的个数达到了上限，则删除最后一个搜索历史
        arr.pop()
    }
}

function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    insertArray(searches, query, (item) => {
        return item === query
    }, SEARCH_LENGTH)
    storage.set(SEARCH_KEY, searches)
    return searches
}


export function loadSearch() { //加载所有的缓存搜索key
    return storage.get(SEARCH_KEY, [])
}

export function clearSearch() {
    storage.remove(SEARCH_KEY)
    return []
}

export function deleteSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    deleteFromArray(searches, (item) => {
        return item === query
    })
    storage.set(SEARCH_KEY, searches)
    return searches
}

export function savePlay(song) {
    let songs = storage.get(PLAY_KEY, [])
    insertArray(songs, song, (item) => {
        return item.id === song.id
    }, PLAY_MAX_LENGTH)
    storage.set(PLAY_KEY, songs)
    return songs
}

export function loadPlay() {
    return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
    let songs = storage.get(FAVORITE_KEY, [])
    insertArray(songs, song, (item) => {
        return song.id === item.id
    }, FAVORITE_MAX_LENGTH)
    storage.set(FAVORITE_KEY, songs)
    return songs
}

export function deleteFavorite(song) {
    let songs = storage.get(FAVORITE_KEY, [])
    deleteFromArray(songs, (item) => {
        return song.id === item.id
    })
    storage.set(FAVORITE_KEY, songs)
    return songs
}

export function loadFavorite() {
    return storage.get(FAVORITE_KEY, [])
}

