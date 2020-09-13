<template>
    <div>
          <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- Alert信息提示 -->
            <el-alert
                title="添加商品信息"
                type="info"
                center
                show-icon :closable="false">
            </el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                 <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
             </el-steps>
             <!-- tab栏 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
             <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="addForm.goods_price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="addForm.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="addForm.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_weight">
                        <el-cascader
                            v-model="addForm.goods_cat"
                            :options="catelist"
                            :props="{ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children' }"
                            @change="handleClickChange">
                        </el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <el-form-item :label="item.attr_name" v-for="item in manyTable" :key="item.arr_id">
                    <!-- 复选框组 -->
                     <el-checkbox-group v-model="item.attr_vals">
                        <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
                    </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                  <el-form-item :label="item.attr_name" v-for="item in onlyTable" :key="item.attr_id">
                    <el-input v-model="item.attr_vals"></el-input>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                  <!-- action表示图片要上传到的后端API地址， on-preview表示图片预览 on-remove表示图片的删除 -->
                  <el-upload
                    action="http://127.0.0.1:8888/api/private/v1/upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    list-type="picture"
                    :headers="headerObj"
                    :on-success="handleSuccess">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                  <!-- 富文本编辑器 -->
                  <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                  <el-button type="primary" class="btn" @click="add">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        </el-card>
        <!-- 图片预览对话框 -->
        <el-dialog
          title="图片预览"
          :visible.sync="preViewDialogVisible"
          width="30%">
          <img :src="preViewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activeIndex: '0',
      // 添加商品表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片数组
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []
      },
      // 表单校验规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      catelist: [],
      // 动态参数列表
      manyTable: [],
      // 静态参数列表
      onlyTable: [],
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      preViewPath: '',
      preViewDialogVisible: false

    }
  },
  methods: {
    getCateList: async function () {
      const res = await this.$http.get('categories')
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      console.log(res.data.data)
      this.catelist = res.data.data
    },
    handleClickChange: function () {
      // 级联选择器选中项发生变化
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave: function (activeName, oldActiveName) {
      console.log('即将离开的标签页是' + oldActiveName)
      console.log('即将进入的标签页是' + activeName)
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    tabClicked: async function () {
      console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        const res = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }
        console.log(res.data)
        res.data.data.forEach((item) => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        this.manyTable = res.data.data
      } else if (this.activeIndex === '2') {
        const res = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取静态参数失败')
        }
        console.log(res.data)
        this.onlyTable = res.data.data
      }
    },
    handlePreview: function (file) {
      // 图片预览
      console.log(file)
      this.preViewPath = file.response.data.url
      this.preViewDialogVisible = true
    },
    handleRemove: function (file) {
      // 图片移除
      console.log(file)
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 从这个pics数组中找到对应的图片的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // i 就是对应的索引值，X就是数组中的每一项，如果数组中的每一项的属性值等于filePath，那么就找到了
      // 调用数组的splice方法，将该图片信息删除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
      // file是将要移除的图片的信息
    },
    handleSuccess: function (response) {
      // 监听图片上传成功
      console.log(response)
      // 拼接得到一个图片信息对象
      // 将图片push到pics中
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    add: function () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请填写必要的选项')
        }
        const form = _.cloneDeep(this.addForm)
        this.addForm.goods_cat = form.goods_cat.join(',')
        this.manyTable.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTable.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        // 提交请求
        const res = await this.$http.post('goods', form)
        console.log(res.data)
        if (res.data.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  created: function () {
    this.getCateList()
  },
  computed: {
    cateId: function () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.previewImg {
  width: 100%;
}
.btn {
  margin: 20px 0;
}
</style>
