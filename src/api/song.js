import service from '../util/request'
import { commonParams,recordApiURL } from './config'


export function getLyric(mid) {
    const url = `${recordApiURL}/getLyric`
    const data = Object.assign({}, commonParams, {
        songmid: mid,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        categoryId: 10000000,
        pcachetime: +new Date(),
        format: 'json'
    })
    return service.request({
        method: 'get',
        url,
        params: data
    })
}

export function getPlayUrl(mid) {
    const url = `${recordApiURL}/getPlayUrl`
    let mids = []
    let types = []
    mids.push(mid)
    types.push(0)


    const urlMid = genUrlMid(mids, types)
    const data = Object.assign({}, commonParams, {
        g_tk: 5381,
        format: 'json',
        platform: 'h5',
        needNewCode: 1,
        uin: 0,
        urlMid
    })

    return service.request({
        method: "post",
        url,
        data: {
            comm: data,
            url_mid: urlMid
        }
    })
}

function genUrlMid(mids, types) {
    const guid = getUid()
    return {
        module: 'vkey.GetVkeyServer',
        method: "CgiGetVkey",
        param: {
            guid,
            songmid: mids,
            songtype: types,
            uin: '0',
            loginflag: 0,
            platform: '23'
        }
    }
}

function getUid() {
    let _uid = ''

    if (_uid) {
        return _uid
    }
    if (!_uid) {
        const t = (new Date).getUTCMilliseconds()
        _uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10
    }
    return _uid

}