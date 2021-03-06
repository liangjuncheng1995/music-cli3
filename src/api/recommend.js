import { get } from '../util/http'
import service from '../util/request'
import jsonp from '../common/js/jsonp'
import { commonParams, options, recordApiURL } from './config'

export function getRecommend() {
    const url = "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg"

    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        uin: 0,
        needNewCode: 1
    })
    return jsonp(url, data, options)
}

export function getDiscList() {
    const url = `${recordApiURL}/getDiscList`

    const data = Object.assign({}, commonParams, {
        platform: 'yqq',
        hostUin: 0,
        sin: 0,
        ein: 29,
        sortId: 5,
        needNewCode: 0,
        categoryId: 10000000,
        rnd: Math.random(),
        format: 'json'
    })
    return service.request({
        method: "get",
        url,
        params: data
    })
}


const getBannerList = get(`${recordApiURL}/getBannerList`)

export function getSongList(disstid) {
    const url = `${recordApiURL}/getSongList`
    const data = Object.assign({}, commonParams, {
        disstid,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0
    })
    return service.request({
        method: "get",
        url,
        params: data
    })
}

export {
    getBannerList
}