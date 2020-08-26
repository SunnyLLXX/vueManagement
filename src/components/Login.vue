<template>

    <div class="login_content">
        <div class="login_box">
            <div class="title"><h3>欢迎登录</h3></div>
            <el-form label-width="0px" class="login_form" :model="loginform" :rules="loginrules" ref="loginref">
                <el-form-item prop="username">
                    <el-input v-model="loginform.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                  <el-form-item prop="password">
                    <el-input v-model="loginform.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                </el-form-item>

                 <el-form-item  class="btn">
                     <el-button type="primary" v-on:click="login">登录</el-button>
                      <el-button type="info" v-on:click="reset">重置</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
export default {

  data () {
    return {
      // 这是登录表单的绑定数据
      loginform: {
        username: '',
        password: ''
      },
      loginrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置表单
    reset: function () {
      this.$refs.loginref.resetFields()
    },
    login: function () {
      this.$refs.loginref.validate(async (valid) => {
        console.log(valid)
        if (!valid) return
        const res = await this.$http.post('login', this.loginform)
        console.log(res)
        if (res.data.meta.status === 200) {
          // 将登录成功后的token保存在客户端的sesstionStrage中
          // 作用就是项目中出现登录接口以外的API必须登录后才能访问，token只应在当前网站期间打开有效
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', res.data.data.token)
          this.$router.push('/home')
        } else {
          this.$message.error('登录失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .login_content {
        height: 100%;
        background-color: #2b4b6b;
    }
    .login_box {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 400px;
        height: 300px;
        background-color: #fff;
        border-radius: 5px;
    }
    .title {
        height: 40px;
        text-align: center;
        height: 40px;
        font-size: 18px;
    }
    .btn {
        display: flex;
        justify-content: space-between;
    }
    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        padding: 0 20px;

    }
</style>
