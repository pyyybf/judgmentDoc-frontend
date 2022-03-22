<template>
  <el-row>
    <el-col :span="4" :offset="3" style="padding:10px">
      <el-menu default-active="/home/info" router
               class="el-menu-vertical-demo">
        <el-menu-item index="/home/info">
          <i class="el-icon-menu"></i>
          <span slot="title">个人信息</span>
        </el-menu-item>
        <el-menu-item index="/home/documents">
          <i class="el-icon-document"></i>
          <span slot="title">我的文书</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="14">
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Home",

}
</script>

<style scoped>

</style>
