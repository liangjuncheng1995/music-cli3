import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from '@/components/recommend/recommend'
import Singer from '@/components/singer/singer'
import Rank from '@/components/rank/rank'
import Search from '@/components/search/search'
import SingerDetail from '@/components/singer-detail/singer-detail'

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    redirect: "/recommend",
    component: Recommend
  },
  {
    path: "/recommend",
    component: Recommend
  },
  {
    path: "/singer",
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: "/rank",
    component: Rank
  },
  {
    path: "/search",
    component: Search
  }
 
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
