<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter='20'>
                <el-col :span='7'>
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getUserList">
                         <el-button slot="append" icon="el-icon-search" v-on:click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span='4'>
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <!-- 作用域插槽，得到这行的数据 -->
                    <template slot-scope="scope">
                        <!-- {{scope.row}} 得到这一行的所有数据-->
                        <el-switch v-model="scope.row.mg_state" @change="useStateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="190px">
                  <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                      <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                      </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域start -->
             <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
              :page-sizes="[2, 8, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
            <!-- 分页区域end -->

        </el-card>
        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" >
        <el-form :model="addForm" :rules="addRuleForm" ref="addFormRef" label-width="70px" >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.passowrd"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="tel">
            <el-input v-model="addForm.tel"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色对话框 -->
      <el-dialog
  title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @click="setRoleDialogClosed">
  <div>
    <p>当前的用户：{{userInfo.username}}</p>
    <p>当前的角色： {{userInfo.role_name}}</p>
    <p>分配新角色： 
      <el-select v-model="selectedUserId" placeholder="请选择">
        <el-option
          v-for="item in roleslist"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
        </el-option>
      </el-select>
    </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click ="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkTel = (rule, value, callback) => {
      const regTel = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regTel.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表数据参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      roleslist: [],
      // 已选中的角色id值
      selectedUserId: '',
      total: 0,
      // 控制对话框隐藏于显示
      addDialogVisible: false,
      // 控制分配角色对话框隐藏与显示
      setRoleDialogVisible: false,
      // 需要被分配角色的用户的信息
      userInfo: {},
      // 添加用户表单的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        tel: ''
      },
      // 添加用户表单验证的规则
      addRuleForm: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkTel, trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
    this.getUserList()
  },
  methods: {
    getUserList: async function () {
      const res = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      if (res.data.meta.status !== 200) return this.$message.error('用户信息获取失败')
      this.userlist = res.data.data.users
      this.total = res.data.data.total
    },
    handleSizeChange: function (newSize) {
      // 监听pagesize改变事件
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange: function (newPage) {
      // 监听页码值改变
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    useStateChange: async function (userinfo) {
      // 监听switch开关的状态变化
      console.log('获取到的用户值:' + userinfo)
      const res = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.data.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    setRole: async function (userInfo) {
      this.userInfo = userInfo
      // 获取所有角色列表
      const res = await this.$http.get('roles')
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleslist = res.data.data
      this.setRoleDialogVisible = true
      
    },
    saveRoleInfo: async function () {
      if( !this.selectedUserId) {
        return this.$message.error('请选择需要分配的角色')
      }
      const res = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedUserId })
      if (res.data.meta.status !== 200) {
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    setRoleDialogClosed: function () { 
      // 监听分配角色对话框关闭事件
      this.selectedUserId =''
      this.userInfo = ''
    }
  }
}
</script>

<style lang="less" scoped>

</style>
