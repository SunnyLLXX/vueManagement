<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 警告区域 -->
             <el-alert title="注意：只允许为第三级分类设置参数" type="warning" :closable="false" show-icon>
             </el-alert>
             <!-- 选择商品分类 -->
             <el-row class="showitem">
                 <el-col>
                     <span>选择商品分类</span>
                     <el-cascader v-model="selectedCateKeys"  :options="catelist"  :props="cateProps"
                      @change="handleChange">
                      </el-cascader>

                 </el-col>
             </el-row>
             <!-- tabs标签页 -->
              <el-tabs v-model="activeName" @tab-click="handleTabClick">
                    <el-tab-pane label="动态参数" name="many">
                        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
                        <!-- 动态参数表格 -->
                        <el-table :data="manyParams" border stripe>
                        <el-table-column type="expand">
                          <template slot-scope="scope">
                            <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                            <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)">
                          </el-input>
                          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                          </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作" >
                             <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="warning" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="静态属性" name="only">
                         <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
                         <!-- 静态表格 -->
                        <el-table :data="onlyParams" border stripe>
                          <el-table-column type="expand">
                          <template slot-scope="scope">
                            <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                            <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)">
                          </el-input>
                          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                          </template>
                        </el-table-column>
                            <el-table-column type="index"></el-table-column>
                            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                            <el-table-column label="操作" >
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                    <el-button type="warning" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
        </el-card>
        <!-- 添加参数对话框 -->
        <el-dialog
            :title="'添加' + titleText"
            :visible.sync="addDialogVisible"
            width="50%" @close="addDialogClose">
            <el-form :model="addForm" :rules="addFormRule" ref="addFormRef" label-width="100px" >
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
         <!-- 修改参数对话框 -->
        <el-dialog
            :title="'修改' + titleText"
            :visible.sync="editDialogVisible"
            width="50%" @close="editDialogClose">
            <el-form :model="editForm" :rules="editFormRule" ref="editFormRef" label-width="100px" >
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      catelist: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      // tab激活标签
      activeName: 'many',
      manyParams: [],
      onlyParams: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRule: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editFormRule: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editForm: {}
    }
  },
  methods: {
    getCateList: async function () {
      const res = await this.$http.get('categories')
      console.log('商品列表分类' + res.data)
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.catelist = res.data.data
    },
    handleChange: async function () {
      this.getParams()
    },
    handleTabClick: function () {
      // tab点击事件
      console.log('标签选中' + this.activeName)
      this.getParams()
    },
    // 获取参数
    getParams: async function () {
      console.log('级联选择器选中后的变化' + this.selectedCateKeys)
      if (this.selectedCateKeys.length !== 3) {
        // 选中的不是三级分类
        this.selectedCateKeys = []
        this.manyParams = []
        this.onlyParams = []
        return this.$message.error('请选择第三级分类')
      }
      // 根据所选的id以及对应的tab面板，获取对应的参数
      const res = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      console.log('参数列表' + res.data)
      res.data.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框的值
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyParams = res.data.data
      } else {
        this.onlyParams = res.data.data
      }
    },
    addDialogClose: function () {
      this.$refs.addFormRef.resetFields()
    },
    addParams: function () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('验证规则失败')
        }
        const res = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (res.data.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addDialogVisible = false
        this.getParams()
      })
    },
    showEditDialog: async function (attrId) {
      const res = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, { params: { attr_sel: this.activeName } })
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取信息失败')
      }
      this.editForm = res.data.data
      this.editDialogVisible = true
    },
    editDialogClose: function () {
      this.$refs.editFormRef.resetFields()
    },
    editParams: function () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('校验规则失败')
        }
        const res = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { params: { attr_name: this.editForm.attr_name, attr_sel: this.activeName } })
        if (res.data.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.getParams()
        this.editDialogVisible = false
      })
    },
    removeParams: async function (attrId) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消此次操作')
      }
      const res = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
      if (res.data.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getParams()
    },
    // 删除对应的参数可选项
    handleClose: function (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrvals(row)
    },
    saveAttrvals: async function (row) {
      const res = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
      if (res.data.meta.status !== 200) {
        return this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数成功')
    },
    handleInputConfirm: async function (row) {
      // 文本框失去焦点或者按下了enter键都会触发的事件
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return this.$message.success('成功')
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputValue = false
      this.saveAttrvals(row)
    },
    showInput: function () {
      // 点击按钮触发事件
      this.inputVisible = true
      // 文本框自动获得焦点
      this.$nextTick(_ => {
        // $nextTick作用就是当页面重新渲染之后，才会执行回调函数中的代码
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  created: function () {
    this.getCateList()
  },
  computed: {
    isBtnDisabled: function () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId: function () {
      // 当前选中的三级分类的id
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText: function () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.showitem {
    margin: 20px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
