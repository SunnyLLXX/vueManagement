//修改webpack默认配置
module.exports = {
  chainWebpack:config =>{
      config.when(process.env.NODE_ENV === 'production',config => {
        config.entry('app').clear().add('./src/main-prod.js')
        config.set('externals',{
            vue:'Vue',
            'vue-router':'VueRouter',
            axios:'axios',
            loadsh:'_',
            echarts: 'echarts',
            nprogress:'Nrogress',
            'vue-quill-editor':'VueQuillEditor'
        })
        config.plugin('html').tap(args => {
            args[0].isProd = true
            return args
        })
      
    })
      config.when(process.env.NODE_ENV === 'development',config => {
        config.entry('app').clear().add('./src/main-dev.js')
        config.plugin('html').tap(args => {
            args[0].isProd = false
            return args
        })
    })
  }
}