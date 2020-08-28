<template>
        <el-container class="home-content">
            <!-- 头部区域 -->
          <el-header class="header">
              <div class="headertitle">
                  <span>后台管理系统</span>
              </div>
              <el-button v-on:click="loginout" type="info">退出登录</el-button>
          </el-header>
          <!-- 侧边栏区域 -->
          <el-container>
            <el-aside width="200px" class="aside">
                <!-- 侧边栏菜单区域 -->
                <el-menu background-color="#009999" text-color="#fff" active-text-color="#ffd04b" unique-opend router>
                    <!-- 一级菜单 -->
                 <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                     <!-- 一级菜单模板区域 -->
                    <template slot="title">
                        <!-- 图标 -->
                    <i :class="iconlist[item.id]"></i>
                    <!-- 文本 -->
                    <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id">{{subitem.authName}}</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <!-- 主体内容区域 -->
            <el-main class="main">
              <!-- 路由占位符 -->
              <router-view></router-view>
            </el-main>
          </el-container>
        </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      iconlist: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  methods: {
    loginout: function () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenuList: async function () {
      const res = await this.$http.get('menus')
      console.log(res)
      if (res.data.meta.status !== 200) {
        this.$message.error(res.data.meta)
      } else {
        this.menulist = res.data.data
      }
    }
  },
  created: function () {
    this.getMenuList()
  }
}
</script>

<style lang="less" scoped>
    .home-content {
        height: 100%;
    }
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #669999;
    }
    .headertitle {
        color: #fff;
        font-size: 22px;
    }
    .aside {
        background-color: #009999;
        .el-menu {
            border-right: none;
        }
    }
    .main {
        background-color: #eaedf1;
    }
    .iconfont {
        margin-right: 10px;
    }
</style>
