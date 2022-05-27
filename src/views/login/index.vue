<template>
  <div>
    <el-card class="login-form-layout">
      <div class="login-logo">
        <img :src="require('../../assets/logo.png')" height="56px">
      </div>
      <h2 class="login-title">裁判文书说理评估系统</h2>
      <el-form :model="loginForm" status-icon :rules="loginRules" ref="loginForm" class="login-form">
        <el-form-item prop="username">
          <el-input placeholder="用户名" prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" prefix-icon="el-icon-lock" v-model="loginForm.password"
                    show-password autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="8">
              <el-input placeholder="验证码" prefix-icon="el-icon-circle-check" v-model="verification"
                        autocomplete="off" class="verification-input" @keyup.enter.native="submitLoginForm"></el-input>
            </el-col>
            <el-col :span="12">
              <VerificationCode :verificationCode="code"></VerificationCode>
            </el-col>
            <el-col :span="4">
              <el-button type="text" size="small" @click="changeCode"><u>换一张<i
                class="el-icon-refresh el-icon--right"></i></u></el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 28px;text-align: center">
          <el-button type="primary" :loading="loginLoading" @click="submitLoginForm" class="login-submit-button">登录
          </el-button>
          <el-button type="text" @click="goRegister">
            没有账号？前往注册
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_bg" class="login-center-layout">
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import login_bg from '@/assets/login_bg.png'
import VerificationCode from '@/components/verificationCode'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const sha256 = require("js-sha256").sha256;

export default {
  name: 'Login',
  components: {VerificationCode},
  data() {
    return {
      login_bg,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {},
      loginLoading: false,
      ALPHABET,
      verification: '',
      code: '',
    }
  },
  mounted() {
    this.changeCode();
  },
  created() {
    this.changeCode();
  },
  methods: {
    ...mapActions([
      'login',
    ]),
    submitLoginForm() {
      if (this.code.toLowerCase() !== this.verification.toLowerCase()) {
        this.$message.error('验证码错误');
        return;
      }
      this.loginLoading = true;
      this.login({
        ...this.loginForm,
        password: sha256(this.loginForm.password)
      }).then(res => {
        this.$message.success(`欢迎您，${res}！`);
        this.$router.push({path: '/articleList'});
      }).catch(err => {
        this.$message.error(err);
      }).finally(() => {
        this.loginLoading = false;
      })
    },
    changeCode() {
      this.code = '';
      for (let i = 0; i < 4; i++) {
        this.code += this.ALPHABET[Math.floor(Math.random() * 62)];
      }
    },
    goRegister() {
      this.$router.push({path: '/register'});
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 120px auto;
  border-top: 10px solid #001529;
}

.login-center-layout {
  background: #001529;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}

.login-logo {
  text-align: center;
  color: #001529;
  padding: 0;
}

.login-title {
  text-align: center;
  color: #001529;
  /*font-family: 幼圆;*/
  margin-top: 12px;
}

.login-submit-button {
  width: 100%;
}
</style>
<style>
.el-input__icon {
  color: #001529;
}
</style>
