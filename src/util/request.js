import axios from 'axios'

const service = axios.create({
    //设置超时时间
    timeout: 60000,
    baseURL: ""
})
/**
 * 请求响应拦截
 * 用于处理需要在请求返回后的操作
 */
service.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers['Authorization'] = token
    }
    return config
}, (error) => {
    return Promise.reject(error)
})
/**
 * 请求响应拦截
 * 用于处理需要在请求返回后的操作
 */
service.interceptors.response.use(response => {
    const responseCode = response.status + ''
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (responseCode.indexOf('2') > -1) {
        return Promise.resolve(response.data)
    } else {
        return Promise.reject(response.data)
    }
}, error => {
    // 断网 或者 请求超时 状态
    if (!error.response) {
        // 请求超时状态
        if (error.message.includes('timeout')) {
            console.log('超时了')
            alert('请求超时，请检查网络是否连接正常')
        } else {
            // 可以展示断网组件
            console.log('断网了')
            alert('请求失败，请检查网络是否已连接')
        }
        return
    }
    // 服务器返回不是 2 开头的情况，会进入这个回调
    // 可以根据后端返回的状态码进行不同的操作
    const responseCode = error.response.status
    alert(responseCode)
    return Promise.reject(error)
})
// post请求的时候，我们需要加上一个请求头，所以可以在这里进行一个默认的设置
// 即设置post的请求头为application/x-www-form-urlencoded;charset=UTF-8
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
export default service

