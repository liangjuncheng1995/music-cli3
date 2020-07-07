import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'

// import './vant' //引用vant

import '@babel/polyfill'

import '@/assets/styles/reset.css'
import '@/assets/icon/iconfont.css'

Vue.use(VueLazyload,{
  loading:require('@/assets/img/loading.png')
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
