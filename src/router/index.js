import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from '@/components/recommend/recommend'
import Singer from '@/components/singer/singer'
import Rank from '@/components/rank/rank'
import Search from '@/components/search/search'
import SingerDetail from '@/components/singer-detail/singer-detail'
import TopList from '@/components/top-list/top-list'
import Disc from '@/components/disc/disc'

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    redirect: "/recommend",
    component: Recommend
  },
  {
    path: "/recommend",
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Disc
      }
    ]
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
    component: Rank,
    children:[
      {
        path: ':id',
        component: TopList
      }
    ]
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
