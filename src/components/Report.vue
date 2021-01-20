<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card></el-card>
    </div>
</template>

<script>
// 折线
// import 'echarts/lib/chart/line'
// 饼状图
// import 'echarts/lib/chart/pie'
// 柱状图
// import 'echarts/lib/chart/bar'
// 提示
// import 'echarts/lib/component/tooltip'
// 图例
// import 'echarts/lib/component/legend'
// 标题
// import 'echarts/lib/component/title'
export default {
  data () {
    return {}
  }
}
</script>

<style scoped>

</style>
