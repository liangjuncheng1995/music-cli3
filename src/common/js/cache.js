import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_LENGTH = 15

function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare) //寻找搜索key的索引
    if (index === 0) {
        return 
    }
    if(index > 0) { //删除已经搜索过的索引
        arr.splice(index, 1)
    }
    arr.unshift(val)
    if(maxLen && arr.length > maxLen) {//如果搜索历史的个数达到了上限，则删除最后一个搜索历史
        arr.pop()
    }
}

function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if(index > -1) {
        arr.splice(index, 1)
    }
}

export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    insertArray(searches,query, (item) =>{
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