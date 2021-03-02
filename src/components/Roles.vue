<template>
    <div>
          <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="roleslist" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="item1 in scope.row.children" :key="item1.id" :class="['bdbottom','center']">
                            <el-col :span="5">
                                <el-tag closable @close="removeRightsById(scope.row,item1.id)">{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row v-for="item2 in item1.children" :key="item2.id" class="center">
                                    <el-col :sapn="6" >
                                        <el-tag type="success" closable @close="removeRightsById(scope.row,item2.id)">{{item2.authName}}</el-tag><i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :sapn="18">
                                        <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" closable @close="removeRightsById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="190px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        </el-tooltip>
                         <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                             <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                         </el-tooltip>
                        <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)"></el-button>
                      </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
          <!-- 树形控件 -->
          <el-tree :data="rightslist" :props="treeProps" show-checkbox default-expand-all node-key="id" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
export default {
  data () {
    return {
      roleslist: [],
      // 控制分配权限的对话框的展示与隐藏
      setRightDialogVisible: false,
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认勾选的节点数组
      defKeys: [],
      roleId: ''
    }
  },
  created: function () {
    this.getRolesList()
  },
  methods: {
    getRolesList: async function () {
      const res = await this.$http.get('roles')
      if (res.data.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.roleslist = res.data.data
    },
    removeRightsById: async function (role, rightid) {
      const resconfirm = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (resconfirm !== 'confirm') return this.$message.info('取消了删除')
      console.log('确认了删除')
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
      if (res.data.meta.status !== 200) return this.$message.error('删除权限失败')
      this.$message.success('权限删除成功')
      role.children = res.data.data
    },
    showSetRightDialog: async function (role) {
      this.roleId = role.id
      // 首先获取所有的权限数据
      const res = await this.$http.get('rights/tree')
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      }
      this.rightslist = res.data.data
      // 递归获取三级节点的id
      this.getDefKeys(role, this.defKeys)
      // 展示添加权限的对话框
      this.setRightDialogVisible = true
    },
    getDefKeys: function (node, arr) {
      // 通过递归的方法，获取所有三级节点权限的id，然后将该数据保存到defKeys数组中
      if (!node.children) {
        // 如果当前节点不包括children属性，则是三级节点
        return arr.push(node.id)
      }
      // 如果不是，则进行递归
      node.children.forEach((item) => {
        this.getDefKeys(item, arr)
      })
    },
    // 避免出现每次点击分配权限的对话框的权限节点有重复冲突
    setRightDialogClosed: function () {
      this.defKeys = []
    },
    allotRights: async function () {
      // 分配权限
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')
      const res = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.data.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }

  }

}
</script>

<style lang="less" scoped>
  .el-tag {
      margin: 10px;
  }
  .bdbottom {
      border-bottom: 1px solid #eee;
  }
  .center {
      display: flex;
      align-items: center;
  }
</style>
