
// const isProduction = process.env.NODE_ENV === 'production';//生产环境
// const isCdn = true;  // 是否开启cdn模式
// // 忽略的包
// const Externals = {
//     'vue': 'Vue',
//     'axios': 'axios',
//     'vue-router': 'VueRouter',
//     'vuex': 'Vuex'
// };
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// // cdn 的链接
// const cdn = {
//     js: [
//         // vue
//         '//cdn.staticfile.org/vue/2.6.11/vue.min.js',
//         // vue-router
//         '//cdn.staticfile.org/vue-router/3.0.2/vue-router.min.js',
//         // axios
//         '//cdn.staticfile.org/axios/0.19.0-beta.1/axios.min.js',
//         // vuex
//         '//cdn.staticfile.org/vuex/3.5.1/vuex.min.js'

//     ]
// }
// module.exports = {
//     lintOnSave: false,
//     publicPath: process.env.NODE_ENV === 'production' ? '/music/' : '/',
//     outputDir: 'music',
//     devServer: {//开发本地代理
//         open: true,
//         proxy: {
//             '/musicApi': {
//                 target: 'http://localhost:3000',
//                 ws: true,
//                 changeOrigin: true
//             },
//         },
//     },
//     //配置全局样式变量
//     css: {
//         loaderOptions: {
//             sass: {
//                 data: `
//               @import "@/assets/styles/theme.scss";
//               @import "@/assets/styles/mixin.scss";
//             `
//             }
//         }
//     },
//     // chainWebpack: config => {
//     //     // production打包才使用CDN
//     //     config.plugin('html')
//     //         .tap(args => {
//     //             args[0].cdn = cdn
//     //             return args
//     //         })
//     // },
//     // // 这里会覆盖webpack默认配置
//     // configureWebpack: config => {
//     //     if (isProduction && isCdn) {
//     //         config.externals = Externals
//     //     }
//     // },
//     // configureWebpack: {
//     //     optimization: {
//     //         minimizer: [
//     //             new UglifyJsPlugin({
//     //                 uglifyOptions: {
//     //                     compress: {
//     //                         warnings: false,
//     //                         drop_console: true,//console
//     //                         drop_debugger: false,
//     //                         pure_funcs: ['console.log']//移除console
//     //                     }
//     //                 }
//     //             })
//     //         ]
//     //     }
//     // }
// }

module.exports = {
    lintOnSave: false,
    devServer: {
        open: true,
        proxy: {
            '/musicApi': {
                target: 'http://localhost:3000',
                ws: true,
                changeOrigin: true
            },
        },
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