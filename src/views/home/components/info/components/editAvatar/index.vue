<template>
  <el-dialog
    title="编辑头像"
    :visible.sync="dialogVisible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="600px"
  >
    <div style="display: flex" class="avatar">
      <div class="avatar-left">
        <div v-show="!options.img">
          <el-upload
            ref="upload"
            action=""
            style="text-align: center;margin-bottom: 24px"
            :on-change="uploads"
            accept="image/png, image/jpeg, image/jpg"
            :show-file-list="false"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary" ref="uploadBtn">选择图片</el-button>
          </el-upload>
          <div>支持jpg、png格式的图片，大小不超过3M</div>
        </div>
        <div v-show="options.img" class="avatar-left-crop">
          <vueCropper
            class="crop-box"
            ref="cropper"
            :img="options.img"
            :autoCrop="options.autoCrop"
            :fixedBox="options.fixedBox"
            :canMoveBox="options.canMoveBox"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :centerBox="options.centerBox"
            @realTime="realTime">
          </vueCropper>
        </div>
      </div>
    </div>
    <p class="tip">鼠标滚轮缩放控制图片显示大小，鼠标拖拽调整显示位置</p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="getCrop" :loading="uploadLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "EditAvatarDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    close: {type: Function},
    upload: {type: Function},
    uploadLoading: {type: Boolean},
  },
  data() {
    return {
      //vueCropper组件 裁剪配置信息
      options: {
        img: '',  //原图文件
        autoCrop: true,  //默认生成截图框
        fixedBox: true,  //固定截图框大小
        canMoveBox: false,    //截图框不能拖动
        autoCropWidth: 200,  //截图框宽度
        autoCropHeight: 200, //截图框高度
        centerBox: true,    //截图框被限制在图片里面
      },
      fileName: '',
    }
  },

  methods: {
    //读取原图
    uploads(file) {
      this.fileName = file.name;
      const isIMAGE = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png';
      const isLt3M = file.raw.size / 1024 / 1024 < 3;
      if (!isIMAGE) {
        this.$message({
          showClose: true,
          message: '请选择 jpg、png 格式的图片！',
          type: 'error',  //提示类型
        });
        return false;
      }
      if (!isLt3M) {
        this.$message({
          showClose: true,
          message: '上传图片大小不能超过 3MB',
          type: 'error',  //提示类型
        });
        return false;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = e => {
        this.options.img = e.target.result //base64
      }
    },
    //实时预览数据
    realTime(data) {
      this.previews = data
    },
    //获取截图信息
    getCrop() {
      // 获取截图的 blob 数据
      this.$refs.cropper.getCropBlob((data) => {
        this.upload(data, this.fileName);
        //重置 data 数据。(Object.assign是对象深复制  this.$data是组件内的数据对象 this.$options.data()是原始的数据)
        Object.assign(this.$data, this.$options.data())
      })
    },
    //关闭弹框
    closeDialog() {
      //重置 data 数据。(Object.assign是对象深复制  this.$data是组件内的数据对象 this.$options.data()是原始的数据)
      Object.assign(this.$data, this.$options.data())
      this.close();
    },
  }
}
</script>

<style scoped>
.avatar {
  display: flex;
  margin-top: -25px;
}

.avatar-left {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 380px;
  background-color: #F0F2F5;
  border-radius: 4px;
}

.avatar-left-crop {
  width: 100%;
  height: 380px;
  position: relative;
}

.crop-box {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden
}

.tip {
  text-align: center;
  width: 100%;
  margin-bottom: -25px;
  font-size: 12px;
  color: grey;
}
</style>
