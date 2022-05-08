<template>
  <el-container style="padding-top: 0;margin-top: 0">
    <el-header height="60px">
      <el-row style="height: 60px">
        <el-col :span="8" class="header-title">
          <div class="header-title-logo">
            <img :src="require('@/assets/logo-white.png')" height="50px" style="margin-top:5px">
          </div>
          <span class="header-title-text">裁判文书说理评估系统</span>
        </el-col>
        <el-col :span="8" :offset="7">
          <el-menu mode="horizontal" router style="float: right"
                   background-color="transparent" active-text-color="white" text-color="white">
            <el-menu-item index="/docList">文书列表</el-menu-item>
            <el-menu-item index="/articleList">法条列表</el-menu-item>
<!--            <el-menu-item index="/predict">判决预测</el-menu-item>-->
            <el-menu-item v-if="role==0" index="/editor">文书编辑</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="1" style="text-align: right">
          <el-dropdown>
            <el-avatar :src="avatar" size="large" style="margin-top: 10px"></el-avatar>
            <el-dropdown-menu slot="dropdown" style="margin-top: -10px">
              <el-dropdown-item icon="el-icon-user" @click.native="goHome">个人中心</el-dropdown-item>
              <el-dropdown-item icon="el-icon-switch-button" @click.native="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="sub-container">
      <el-main class="main-body">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  name: "Layout",
  data() {
    return {
      role: localStorage.getItem('role'),
      // avatar: localStorage.getItem('avatar'),
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
    ])
  },
  methods: {
    ...mapActions([
      'logout',
    ]),
    handleLogout() {
      this.logout().then(res => {
        this.$message.success('登出成功');
        this.$router.push({path: '/login'});
      }).catch(err => {
        this.$message.error(err);
      })
    },
    goHome() {
      this.$router.push({path: '/home'});
    },
  },
}
</script>

<style scoped>
.header-title {
  color: white;
  text-align: left;
  font-size: x-large;
  height: 100%;
}

.header-title-logo {
  height: 100%;
  float: left;
}

.header-title-text {
  color: white;
  font-size: x-large;
  float: left;
  margin-left: 15px;
}

.header-text {
  color: white;
}

.header-text:hover {
  cursor: default;
}

.sub-container {
  height: calc(100vh - 60px);
}

.main-body {
  overflow-y: scroll;
}
</style>

<style>
.el-header, .el-footer {
  background-color: #001529;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  /*background-color: #D3DCE6;*/
  color: #333;
  text-align: left;
  line-height: 200px;
}

.el-main {
  /*background-color: #E9EEF3;*/
  color: #333;
  text-align: center;
  /*line-height: 30px;*/
  padding-bottom: 0;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 60px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 60px;
}

.el-tabs__nav {
  line-height: 30px;
}
</style>
