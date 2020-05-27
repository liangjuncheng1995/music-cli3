import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'

// import './vant' //引用vant
 

import '@/assets/styles/reset.css'

Vue.use(VueLazyLoad,{
  loading:require('@/assets/img/loading.png')
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
