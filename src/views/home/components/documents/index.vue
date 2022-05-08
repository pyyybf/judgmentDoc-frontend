<template>
  <el-main>
    <el-table
      :data="documentList"
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        prop="courtName"
        label="经办法院">
      </el-table-column>
      <el-table-column
        prop="name"
        label="文书名称">
      </el-table-column>
      <el-table-column
        prop="number"
        label="案号">
      </el-table-column>
      <el-table-column
        prop="date"
        label="裁判时间"
        width="140">
        <template slot-scope="scope">
          {{ scope.row.date.split('T')[0].replace('-', '年').replace('-', '月') + '日' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作"
        width="70">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="onEdit(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="document-pagination"
      @size-change="onSearch"
      @current-change="onSearch"
      :current-page.sync="pageNum"
      :page-sizes="[5,10,15,20]"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-main>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "Documents",
  data() {
    return {
      documentList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      totalPage: 0,
      loading: false,
    }
  },
  mounted() {
    this.onSearch();
  },
  methods: {
    ...mapActions([
      'getDocumentsByUserId',
    ]),
    onSearch() {
      this.loading = true;
      this.getDocumentsByUserId({
        userId: localStorage.getItem('userId'),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }).then(res => {
        this.documentList = res.list;
        this.total = res.total;
        this.totalPage = res.totalPage;
      }).catch(err => {
        this.$message.error(err);
      }).finally(() => {
        this.loading = false;
      })
    },
    onEdit(id) {
      this.$router.push({
        path: '/editor',
        query: {
          id: id
        }
      });
    },
  }
}
</script>

<style scoped>
.document-pagination {
  text-align: right;
  margin-top: 8px;
  margin-bottom: 10px;
}
</style>
