<template>
  <div>
    <h1>登录</h1>
    <el-button type="primary" @click="apiTest">API测试</el-button>
  </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
  name: "Login",
  data() {
    return {}
  },
  methods: {
    ...mapActions([
      'test',
    ]),
    apiTest() {
      console.log('API测试')
      this.test().then(res => {
        console.log(res)
      }).catch(err => {
        alert(err)
      })
    },
  }
}
</script>

<style scoped>

</style>
