<template>
  <div>
    <el-card class="register-form-layout">
      <h2 class="register-title">注册</h2>
      <el-form :model="registerForm" status-icon :rules="registerRules" ref="registerForm" class="register-form">
        <el-form-item prop="role" style="text-align: center">
          <el-radio-group v-model="registerForm.role">
            <el-radio label="0">我是法官</el-radio>
            <el-radio label="1">我是普通群众</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="username">
          <el-input placeholder="用户名" prefix-icon="el-icon-user" v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input placeholder="手机号" prefix-icon="el-icon-mobile-phone" v-model="registerForm.phone"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input placeholder="邮箱" prefix-icon="el-icon-message" v-model="registerForm.email"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" prefix-icon="el-icon-lock" v-model="registerForm.password"
                    show-password autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="passwordRe">
          <el-input type="password" placeholder="重复密码" prefix-icon="el-icon-lock" v-model="passwordRe"
                    show-password autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="8">
              <el-input placeholder="验证码" prefix-icon="el-icon-circle-check" v-model="verification"
                        autocomplete="off" class="verification-input"
                        @keyup.enter.native="submitRegisterForm"></el-input>
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
        <el-form-item style="margin-bottom: 15px;text-align: center">
          <el-button type="primary" :loading="registerLoading" @click="submitRegisterForm"
                     class="register-submit-button">注册
          </el-button>
          <el-button type="text" @click="goLogin">
            已有账号？前往登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_bg" class="register-center-layout">
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import login_bg from '@/assets/login_bg.png'
import VerificationCode from '@/components/verificationCode'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const sha256 = require("js-sha256").sha256;

export default {
  name: 'Register',
  components: {VerificationCode},
  data() {
    return {
      login_bg,
      registerForm: {
        username: '',
        password: '',
        email: '',
        phone: '',
        role: '0'
      },
      registerRules: {
        username: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!/^[a-zA-Z0-9_]{6,12}$/.test(value)) {
              callback(new Error('用户名为6-12位，包含字母、数字或下划线'))
            } else {
              callback()
            }
          }
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!/^[a-zA-Z0-9]{6,12}$/.test(value)) {
              callback(new Error('密码为6-12位，包含字母或数字'))
            } else {
              callback()
            }
          }
        }],
        passwordRe: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (this.passwordRe !== this.registerForm.password) {
              callback(new Error('两次输入密码不同'))
            } else {
              callback()
            }
          }
        }],
        email: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
              callback(new Error('邮箱格式错误'))
            } else {
              callback()
            }
          }
        }],
        phone: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!/^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(value)) {
              callback(new Error('手机号格式错误'))
            } else {
              callback()
            }
          }
        }],
      },
      registerLoading: false,
      ALPHABET,
      verification: '',
      code: '',
      passwordRe: '',
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
      'register',
    ]),
    submitRegisterForm() {
      if (this.code.toLowerCase() !== this.verification.toLowerCase()) {
        this.$message.error('验证码错误');
        return;
      }
      this.registerLoading = true;
      this.register({
        ...this.registerForm,
        password: sha256(this.registerForm.password)
      }).then(res => {
        this.$message.success('注册成功');
        this.$router.push({path: '/login'});
      }).catch(err => {
        this.$message.error(err);
      }).finally(() => {
        this.registerLoading = false;
      })
    },
    changeCode() {
      this.code = '';
      for (let i = 0; i < 4; i++) {
        this.code += this.ALPHABET[Math.floor(Math.random() * 62)];
      }
    },
    goLogin() {
      this.$router.push({path: '/login'});
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.register-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 45px auto;
  border-top: 10px solid #001529;
}

.register-center-layout {
  background: #001529;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}

.register-logo {
  text-align: center;
  color: #001529;
  font-size: 56px;
  padding: 0;
}

.register-title {
  text-align: center;
  color: #001529;
  /*font-family: 幼圆;*/
  margin-top: 12px;
}

.register-submit-button {
  width: 100%;
}
</style>
<style>
.el-input__icon {
  color: #001529;
}
</style>
