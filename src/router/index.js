import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Welcome.vue')
// import Users from '../components/Users.vue'
const Users = () => import(/* webpackChunkName: "users-rights-roles" */ '../components/Users.vue')
// import Rights from '../components/Rights.vue'
const Rights = () => import(/* webpackChunkName: "users-rights-roles" */ '../components/Rights.vue')
// import Roles from '../components/Roles.vue'
const Roles = () => import(/* webpackChunkName: "users-rights-roles" */ '../components/Roles.vue')
// import Categories from '../components/Categories.vue'
const Categories = () => import(/* webpackChunkName: "category-param-list" */ '../components/Categories.vue')
// import Params from '../components/Params.vue'
const Params = () => import(/* webpackChunkName: "category-param-list" */ '../components/Params.vue')
// import List from '../components/List.vue'
const List = () => import(/* webpackChunkName: "category-param-list" */ '../components/List.vue')
// import Add from '../components/Add.vue'
const Add = () => import(/* webpackChunkName: "add-order-report" */ '../components/Add.vue')
// import Order from '../components/Order.vue'
const Order = () => import(/* webpackChunkName: "add-order-report" */ '../components/Order.vue')
// import Report from '../components/Report.vue'
const Report = () => import(/* webpackChunkName: "add-order-report" */ '../components/Report.vue')
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home, redirect: '/welcome', children: [{ path: '/welcome', component: Welcome }, { path: '/users', component: Users }, { path: '/rights', component: Rights }, { path: '/roles', component: Roles }, { path: '/categories', component: Categories }, { path: '/params', component: Params }, { path: '/goods', component: List }, { path: '/goods/add', component: Add }, { path: '/orders', component: Order }, { path: '/reports', component: Report }] }
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
