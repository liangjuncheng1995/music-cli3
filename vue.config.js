

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
            `
            }
        }
    }
}