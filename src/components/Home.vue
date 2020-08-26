<template>
    <div>
        <el-button v-on:click="loginout" type="info">退出登录</el-button>
    </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    loginout: function () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
