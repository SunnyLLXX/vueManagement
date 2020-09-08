<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showCategoryDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 树形表格start -->
            <tree-table class="treetable" :data="categorylist" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" border index-text="#">
              <!-- 是否有效的模板 -->
              <template slot="isok" slot-scope="scope">
                <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
                <i class="el-icon-error" v-if="scope.row.cat_deleted === true" style="color: red"></i>
              </template>
              <!-- 排序的模板 -->
              <template slot="order" slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                <el-tag type="warning" size="mini" v-else>三级</el-tag>
              </template>
              <!-- 操作的模板 -->
              <template slot="operate" >
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </tree-table>
             <!-- 树形表格end -->
             <!-- 分页区域 -->
             <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange"
               :current-page="queryInfo.pagenum" :page-sizes="[2, 8, 15, 20]" :page-size="queryInfo.pagesize"
               layout="total, sizes, prev, pager, next, jumper" :total="total">
             </el-pagination>
        </el-card>
        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCategoryDialogVisible" width="50%" @close="addCategoryClosed">
          <el-form :model="addCateForm" :rules="addCateFormRule" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称：" prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
           <el-form-item label="父级分类：">
               <el-cascader class="cascader"
                  v-model="selectedKeys"
                  :options="parentCateList"
                  :props="cascaderProps"
                  @change="handleParentChange" clearable>
              </el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCategory">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类列表
      categorylist: [],
      // 请求参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 8
      },
      // 级联选择器
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类id数组
      selectedKeys: [],
      // 添加分类的数据表单对象
      addCateForm: {
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 当前默认分类的等级是一级
        cat_level: 0
      },
      // 表单验证规则
      addCateFormRule: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      total: 0,
      addCategoryDialogVisible: false,
      // 为tree-table指定列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 自定义模板列
          type: 'template',
          // 表示当前这列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 自定义模板列
          type: 'template',
          // 表示当前这列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 自定义模板列
          type: 'template',
          // 表示当前这列使用的模板名称
          template: 'operate'
        }
      ],
      // 父级分类列表
      parentCateList: []
    }
  },
  methods: {
    getCategoryList: async function () {
      const res = await this.$http.get('categories', { params: this.queryInfo })
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      console.log(res)
      this.categorylist = res.data.data.result
      this.total = res.data.data.total
    },
    handleSizeChange: function (newSize) {
      // 监听pagesize
      this.queryInfo.pagesize = newSize
      this.getCategoryList()
    },
    handleCurrentChange: function (newPage) {
      // 监听pagenum
      this.queryInfo.pagenum = newPage
      this.getCategoryList()
    },
    showCategoryDialog: function () {
      this.getParentCateList()
      this.addCategoryDialogVisible = true
    },
    getParentCateList: async function () {
      // 获取父级分类的列表
      const res = await this.$http.get('categories', { params: { type: 2 } })
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取父级分类列表失败')
      }
      console.log('父级分类列表:' + res.data)
      this.parentCateList = res.data.data
    },
    handleParentChange: function () {
      // 选择项发生变化触发这个函数
      console.log('父级分类id数组' + this.selectedKeys)
      // 如果selectedKeys数组length大于0，说明选中了父级分类，如果没有则说明没有选中
      if (this.selectedKeys.length >= 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    addCategory: function () {
      // 点击对话框确定按钮添加分类
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('失败')
        }
        const res = await this.$http.post('categories', this.addCateForm)
        if (res.data.meta.status !== 200) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCategoryList()
        this.addCategoryDialogVisible = false
      })
    },
    addCategoryClosed: function () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  },
  created: function () {
    this.getCategoryList()
  }
}
</script>

<style lang="less" scoped>
.treetable {
  margin-top: 20px;
}
.cascader {
  width: 100%;
}

</style>
