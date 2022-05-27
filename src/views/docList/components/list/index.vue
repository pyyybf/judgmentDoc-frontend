<template>
  <el-container>
    <el-aside width="20vw">
      <el-card class="content-card">
        <div slot="header" class="clearfix">
          <span>目录</span>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-refresh" @click="showAll">显示全部
          </el-button>
        </div>
        <el-tree :data="catalogData"
                 @node-click="handleNodeClick">
          <span class="tree-node-span" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </el-card>
    </el-aside>
    <el-main>
      <el-input
        placeholder="请输入关键词"
        v-model="documentQuery.keyword"
        clearable
        style="width:79%;float: left">
      </el-input>
      <el-button type="text"
                 @click="showQuery"
                 style="width: 10%;float: right">高级检索
        <i :class="queryVisible?'el-icon-arrow-down':'el-icon-arrow-right'"></i>
      </el-button>
      <el-button type="primary"
                 icon="el-icon-search"
                 @click="onSearch"
                 style="width: 10%;float: right">搜索
      </el-button>
      <el-card v-if="queryVisible" shadow="hover" class="search-box">
        <el-form ref="form" :model="documentQuery" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="经办法院">
                <el-input v-model="documentQuery.courtName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文书名称">
                <el-input v-model="documentQuery.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="案号">
                <el-input v-model="documentQuery.number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="裁判时间">
                <el-date-picker
                  v-model="documentQuery.dates"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item style="text-align: center">
                <el-button type="primary" @click="onSearch">搜索</el-button>
                <el-button @click="onClear">清空</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-table
        :data="documentData"
        v-loading="loading"
        @row-click="showDetail"
        style="width: 100%">
        <el-table-column
          prop="courtName"
          label="经办法院"
          width="160">
        </el-table-column>
        <el-table-column
          prop="name"
          label="文书名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="number"
          label="案号"
          width="220">
        </el-table-column>
        <el-table-column
          prop="date"
          label="裁判时间"
          width="130">
          <template slot-scope="scope">
            {{ scope.row.date.split('T')[0].replace('-', '年').replace('-', '月') + '日' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="正文">
          <template slot-scope="scope">
            <span class="tree-node-span">
              <span>{{ scope.row.content }}</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="document-pagination"
        background
        @size-change="onSearch"
        @current-change="onSearch"
        :current-page.sync="pageNum"
        :page-sizes="[5,10,15,20]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-main>
  </el-container>
</template>

<script>
import {mapActions} from "vuex";

var getChildren = function (node) {
  if (node.children == null) {
    return [node.id];
  } else {
    var list = [];
    for (let child of node.children) {
      list = list.concat(getChildren(child));
    }
    return list;
  }
}

export default {
  name: "DocumentList",
  data() {
    return {
      documentData: [],
      documentQuery: {
        keyword: '',
        courtName: '',
        name: '',
        number: '',
        dates: ['', ''],
        catalogs: [],
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      totalPage: 0,
      loading: false,
      queryVisible: false,
      curKeyword: '',
      catalogData: [],
    }
  },
  mounted() {
    this.getDocumentCatalogTree().then(res => {
      this.catalogData = res;
    }).catch(err => {
      this.$message.error(err);
    })
    this.onSearch();
  },
  methods: {
    ...mapActions([
      'getAllDocument',
      'getDocumentCatalogTree',
      'getDocumentById',
    ]),
    onSearch() {
      this.loading = true;
      this.getAllDocument({
        ...this.documentQuery,
        start: this.documentQuery.dates[0],
        end: this.documentQuery.dates[1],
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        this.documentData = res.list;
        this.total = res.total;
        this.totalPage = res.totalPage;
        this.curKeyword = this.documentQuery.keyword;
        this.loading = false;
      }).catch(err => {
        this.$message.error(err);
      })
    },
    showQuery() {
      this.queryVisible = !this.queryVisible;
    },
    onClear() {
      this.documentQuery.courtName = '';
      this.documentQuery.name = '';
      this.documentQuery.number = '';
      this.documentQuery.dates = ['', ''];
    },
    handleNodeClick(data) {
      this.documentQuery.catalogs = getChildren(data);
      this.onSearch();
    },
    showAll() {
      this.documentQuery.catalogs = [];
      this.onSearch();
    },
    showDetail(row) {
      this.$router.push({
        path: '/docList/detail',
        query: {
          id: row.id,
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

.search-box {
  width: 100%;
  margin-top: 50px;
  margin-bottom: 20px;
}

.content-card {
  width: 19vw;
  line-height: 100%;
  margin-bottom: 20px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.tree-node-span {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
