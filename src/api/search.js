import { commonParams, options,recordApiURL } from "./config"
import jsonp from "@/common/js/jsonp"
import service from "../util/request"

export function getHotKey() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
    const data = Object.assign({}, commonParams, {
        uin: 0,
        needNewCode: 1,
        platform: 'h5'
    })
    return jsonp(url, data, options)
}

export function search(query, page, zhida) {
    const url = `${recordApiURL}/search`
    const data = Object.assign({}, commonParams, {
        w: query,
        p: page,
        catZhida: zhida ? 1 : 0,
        zhidaqu: 1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage: 20,
        n: 20,
        remoteplace: 'txt.mqq.all',
        uid: 0,
        needNewCode: 1,
        platform: 'h5'
    })
    return service.request({
        method: 'get',
        url,
        params: data
    })
}