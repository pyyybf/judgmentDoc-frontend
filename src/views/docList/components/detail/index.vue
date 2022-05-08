<template>
  <el-row style="margin-bottom: 35px">
    <el-col :span="14" :offset="5">
      <el-page-header @back="goBack" content="裁判文书详情"></el-page-header>
      <div class="court-name">{{ document.courtName }}</div>
      <div class="name">{{ document.name }}</div>
      <div class="number">{{ document.number }}</div>
      <div class="content">{{ document.content.replaceAll('\n', '\n　　') }}</div>
      <div class="members">
        <p v-for="member in document.members">
          {{ `${member.status}　${member.name.length === 2 ? `${member.name[0]}　${member.name[1]}` : member.name}` }}</p>
      </div>
      <div class="date">{{ manageDate(document.date) }}</div>
    </el-col>
  </el-row>
</template>

<script>
import {mapActions} from "vuex";

const NUMBER_TABLE = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const manageDate = function (date) {
  date = date.split('T')[0].split('-');
  var y = String(date[0]), m = String(date[1]), d = String(date[2]);
  var re = '';
  for (let i = 0; i < y.length; i++) {
    re = re + NUMBER_TABLE[Number(y[i])]
  }
  re = re + '年';
  if (m[0] == '1') {
    re = re + '十';
  }
  if (m[1] != '0') {
    re = re + NUMBER_TABLE[Number(m[1])];
  }
  re = re + '月';
  if (d[0] != '0') {
    if (d[0] == '2' || d[0] == '3') {
      re = re + NUMBER_TABLE[Number(d[0])];
    }
    re = re + '十';
  }
  if (d[1] != '0') {
    re = re + NUMBER_TABLE[Number(d[1])];
  }
  re = re + '日';
  return re;
}

export default {
  name: "DocumentDetail",
  data() {
    return {
      id: -1,
      document: {},
      manageDate,
    }
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getDocumentById(this.id).then(res => {
      this.document = res;
    }).catch(err => {
      this.$message.error(err);
    })
  },
  methods: {
    ...mapActions([
      'getDocumentById',
    ]),
    goBack() {
      this.$router.push({
        path: '/docList/list',
      });
    }
  }
}
</script>

<style scoped>
.court-name {
  text-align: center;
  font-size: 20px;
}

.name {
  text-align: center;
  font-size: 25px;
}

.number {
  text-align: right;
}

.content {
  text-align: left;
  white-space: pre-line;
  text-indent: 2em;
}

.members {
  text-align: right;
  line-height: 8px;
}

.date {
  text-align: right;
}
</style>
