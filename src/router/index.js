import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users.vue'
import Rights from '../components/Rights.vue'
import Roles from '../components/Roles.vue'
import Categories from '../components/Categories.vue'
import Params from '../components/Params.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home, redirect: '/welcome', children: [{ path: '/welcome', component: Welcome }, { path: '/users', component: Users }, { path: '/rights', component: Rights }, { path: '/roles', component: Roles }, { path: '/categories', component: Categories }, { path: '/params', component: Params }] }
]

const router = new VueRouter({
  routes
})

// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  // to代表要访问的路径
  // from代表从哪个路径来
  // next代表一个函数，表示放行 next()放行,next('/login)强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
