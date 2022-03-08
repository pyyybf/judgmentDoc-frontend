<template>
  <div style="text-align: center">
    <h1>登录</h1>
    <el-button type="primary" @click="handleLogin">登录</el-button>
    <p>当前登录用户：{{ username }}</p>
    <img :src="login_bg" class="login-center-layout">
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import login_bg from '@/assets/login_bg.png';

const sha256 = require("js-sha256").sha256;

export default {
  name: "Login",
  data() {
    return {
      login_bg,
    }
  },
  computed: {
    ...mapGetters([
      'username',
    ]),
  },
  methods: {
    ...mapActions([
      'login',
    ]),
    handleLogin() {
      var loginForm = {
        username: 'panyue',
        password: sha256('123456')
      };
      this.login(loginForm).then(res => {
        this.$message.success(`您好，${res}！`)
      }).catch(err => {
        alert(err)
      });
    },
  }
}
</script>

<style scoped>
.login-center-layout {
  background: #7A0F09;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  /*margin-top: 200px;*/
}
</style>
