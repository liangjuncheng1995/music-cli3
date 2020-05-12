import originJSON from 'jsonp'

export default function jsonp(url, data, option) {
    url += (url.indexOf("?") < 0 ? '?' : '&') + param(data)
    return new Promise((resolve, reject) => {
        originJSON(url, option, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

function param(data) {
    let url = ''
    for (let k in data) {
        let value = data[i] !== undefined ? data[k] : ""
        url += `&${k}=${encodeURIComponent(value)}`
    }
    return url ? url.substring(1) : ''
}