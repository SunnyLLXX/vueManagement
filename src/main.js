import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 配置axios拦截器，为请求头对象添加token的验证Authorization字段，这样有权限的API就可以正常调用成功了
axios.interceptors.request.use((config) => {
  console.log(config)
  // 最后必须返回config
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 注册富文本编辑器

Vue.use(VueQuillEditor)
// 全局注册组件
Vue.component('tree-table', TreeTable)
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')
  const h = (dt.getHours() + '').padStart(2, '0')
  const min = (dt.getMinutes() + '').padStart(2, '0')
  const s = (dt.getSeconds() + '').padStart(2, '0')
  // return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s
  return `${y}-${m}-${d} ${h}:${min}:${s}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
