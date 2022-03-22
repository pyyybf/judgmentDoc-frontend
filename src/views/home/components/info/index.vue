<template>
  <el-main style="padding: 10px">
    <el-card style="text-align: left;padding: 20px 40px 0 40px">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="save">保存</el-button>
      </div>
      <el-row>
        <el-col :span="4" style="text-align: center">
          <el-image
            style="width: 100px;height: 100px"
            :src="avatar"
            fit="cover"></el-image>
          <br/>
          <el-button type="text" icon="el-icon-picture" @click="editAvatarDialogVisible=true">修改头像</el-button>
          <EditAvatarDialog :dialogVisible="editAvatarDialogVisible"
                            :close="closeEditAvatarDialog"
                            :upload="handleAvatar"
                            :uploadLoading="uploadLoading"
          ></EditAvatarDialog>
        </el-col>
        <el-col :span="18" :offset="2">
          <el-form ref="userInfo" :model="userInfo" :rules="infoRules" label-position="left" label-width="100px">
            <el-form-item label="用户名">{{ userInfo.username }}</el-form-item>
            <el-form-item label="身份">
              <el-tag :type="userInfo.role==0?'':'success'" size="small">{{ userInfo.role == 0 ? '法官' : '群众' }}</el-tag>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="userInfo.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row style="text-align: right;">
        <el-button type="text" icon="el-icon-edit" @click="editPsw=true">修改密码</el-button>
      </el-row>
      <el-row v-if="editPsw">
        <el-col :span="18" :offset="6">
          <el-form :rules="pswRules" label-position="left" label-width="100px">
            <el-form-item label="新密码" prop="password1">
              <el-input v-model="password1" type="password"></el-input>
            </el-form-item>
            <el-form-item label="重复新密码" prop="password2">
              <el-input v-model="password2" type="password"></el-input>
            </el-form-item>
            <el-form-item style="text-align: right">
              <el-button size="medium" @click="cancel">取消</el-button>
              <el-button type="primary" size="medium" @click="handlePassword">确认</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </el-main>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import EditAvatarDialog from "./components/editAvatar"

const sha256 = require("js-sha256").sha256;

export default {
  name: "Info",
  data() {
    return {
      userInfo: {},
      editAvatarDialogVisible: false,
      uploadLoading: false,
      infoRules: {
        email: [{
          required: false,
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
          required: false,
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
      editPsw: false,
      password1: '',
      password2: '',
      pswRules: {
        password1: [{
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
        password2: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (this.password2 !== this.password1) {
              callback(new Error('两次输入密码不同'))
            } else {
              callback()
            }
          }
        }],
      }
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
    ]),
  },
  components: {
    EditAvatarDialog,
  },
  mounted() {
    this.getUserInfoById(localStorage.getItem('userId')).then(res => {
      this.userInfo = res;
    }).catch(err => {
      this.$message.error(err);
    })
  },
  methods: {
    ...mapActions([
      'getUserInfoById',
      'updateAvatarById',
      'updateUserInfoById',
      'updatePasswordById',
    ]),
    closeEditAvatarDialog() {
      this.editAvatarDialogVisible = false;
    },
    handleAvatar(blob, fileName) {
      this.uploadLoading = true;
      var formData = new FormData();
      formData.append("file", blob, fileName);
      formData.append("userId", this.userInfo.id);
      this.updateAvatarById(formData).then(res => {
        this.$message.success('头像更换成功');
        this.uploadLoading = false;
        this.editAvatarDialogVisible = false;
        this.getUserInfoById(localStorage.getItem('userId')).then(res => {
          this.userInfo = res;
        }).catch(err => {
          this.$message.error(err);
        })
      }).catch(err => {
        this.$message.error(err);
      })
    },
    save() {
      this.updateUserInfoById(this.userInfo).then(res => {
        this.$message.success('保存成功');
        this.getUserInfoById(this.userInfo.id).then(res => {
          this.userInfo = res;
        }).catch(err => {
          this.$message.error(err);
        })
      }).catch(err => {
        this.$message.error(err);
      })
    },
    cancel() {
      this.editPsw = false;
      this.password1 = '';
      this.password2 = '';
    },
    handlePassword() {
      this.updatePasswordById({
        userId: this.userInfo.id,
        password: sha256(this.password1),
      }).then(res => {
        this.$message.success('修改成功');
        this.editPsw = false;
      }).catch(err => {
        this.$message.error(err);
      })
    },
  },
}
</script>

<style scoped>

</style>
