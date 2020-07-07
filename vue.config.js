
const isProduction = process.env.NODE_ENV === 'production';//生产环境
const isCdn = true;  // 是否开启cdn模式
// 忽略的包
const Externals = {//次数使用的规则。'官方使用的名字': '项目中引入的名字' 可以说是与实际调用的位置完全相反 import VueLazyLoad from "vue-lazyload" , 这里有个坑，VueLazyload不要写成VueLazyLoad externals是没有生效的
    'vue': 'Vue',
    'axios': 'axios',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'vue-lazyload': 'VueLazyload', 
    // 'better-scroll': 'BScroll',
};
// cdn 的链接
const cdn = {
    js: [
        // vue
        '//cdn.staticfile.org/vue/2.6.11/vue.min.js',
        // vue-router
        '//cdn.staticfile.org/vue-router/3.0.2/vue-router.min.js',
        //vue-lazyload
        '//cdn.staticfile.org/vue-lazyload/1.3.3/vue-lazyload.js',
        // axios
        '//cdn.staticfile.org/axios/0.19.0-beta.1/axios.min.js',
        // vuex
        '//cdn.staticfile.org/vuex/3.5.1/vuex.min.js',
        
        // BScroll
        // '//unpkg.com/better-scroll@1.0.1/dist/bscroll.min.js',
    ]
}
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
    lintOnSave: false,
    publicPath: process.env.NODE_ENV === 'production' ? '/music/' : '/',
    outputDir: 'music',
    devServer: {
        open: true,
        proxy: {
            '/recordApi': {
                target: 'http://localhost:6000',
                ws: true,
                changeOrigin: true
            },
            // '/recordApi': {
            //     target: 'https://www.ljcpro.cn',
            //     ws: true,
            //     changeOrigin: true
            // },
        },
    },
    chainWebpack: config => {
        config.plugin('html').tap(args => {//循环为index.html添加cdn的链接
            args[0].cdn = cdn
            return args
        })
    },
    // 这里会覆盖webpack默认配置
    configureWebpack: config => {
        if (isProduction && isCdn) {
            config.externals = Externals 
            config.optimization.minimizer[0] = 
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: {
                            // warnings: false,
                            drop_console: true,//console
                            drop_debugger: false,
                            pure_funcs: ['console.log']//移除console
                        }
                    }
                })
        }
    },
    //配置全局样式变量
    css: {
        loaderOptions: {
            sass: {
                data: `
              @import "@/assets/styles/theme.scss";
              @import "@/assets/styles/mixin.scss";
            `
            }
        }
    }
}