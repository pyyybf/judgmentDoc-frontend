<template>
  <el-container>
    <el-aside width="25vw">
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
        v-model="articleQuery.keyword"
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
        <el-form ref="form" :model="articleQuery" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="条目">
                <el-input v-model="articleQuery.number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="主旨">
                <el-input v-model="articleQuery.crime"></el-input>
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
        :data="articleData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="law"
          label="所属法律"
          width="180">
        </el-table-column>
        <el-table-column
          prop="number"
          label="条目"
          width="180">
        </el-table-column>
        <el-table-column
          prop="crime"
          label="主旨"
          width="180">
          <template slot-scope="scope">
            {{ scope.row.crime.split(',').join('/') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="全文">
          <template slot-scope="scope">
            <div style="white-space: pre-line;" v-html="setKeyWord(scope.row.content)"></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="action"
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button type="text"
                       icon="el-icon-document-copy"
                       v-clipboard:copy="scope.row.content"
                       v-clipboard:success="onCopy">复制
            </el-button>
            <el-button type="text"
                       icon="el-icon-paperclip"
                       v-clipboard:copy="`《${scope.row.law}》${scope.row.number}`"
                       v-clipboard:success="onCopy">引用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="article-pagination"
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

const NUMBER_TABLE = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
var manageNumber = function (number) {
  var arr = number.match(/\d+(.\d+)?/g);
  if (arr === null) {
    return number;
  }
  for (var n of arr) {
    var n1 = String(~~n);
    if (n1.length > 3) {
      continue;
    } else if (n1.length > 0) {
      var cur = (n1.length > 2 ? `${NUMBER_TABLE[Number(n1[n1.length - 3])]}百` : '') + (n1.length > 1 ? `${NUMBER_TABLE[Number(n1[n1.length - 2])]}十` : '') + NUMBER_TABLE[Number(n1[n1.length - 1])];
      cur = cur.replace('零十', '零').replace('零零', '').replace('十零', '十');
      cur.startsWith('一十') && (cur = cur.slice(1));
      number = number.replace(String(n), cur);
    }
  }
  return number;
}

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
  name: "ArticleList",
  data() {
    return {
      articleData: [],
      articleQuery: {
        keyword: '',
        number: '',
        crime: '',
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
    this.getCatalogTree().then(res => {
      this.catalogData = res;
    }).catch(err => {
      this.$message.error(err);
    })
    this.onSearch();
  },
  methods: {
    ...mapActions([
      'getAllArticle',
      'getCatalogTree',
    ]),
    onSearch() {
      this.loading = true;
      this.getAllArticle({
        ...this.articleQuery,
        number: manageNumber(this.articleQuery.number),
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        this.articleData = res.list;
        this.total = res.total;
        this.totalPage = res.totalPage;
        this.curKeyword = this.articleQuery.keyword;
        this.loading = false;
      }).catch(err => {
        this.$message.error(err);
      })
    },
    onCopy() {
      this.$message.success('已复制到剪贴板');
    },
    showQuery() {
      this.queryVisible = !this.queryVisible;
    },
    onClear() {
      this.articleQuery.number = '';
      this.articleQuery.crime = '';
    },
    setKeyWord(text) {
      return this.curKeyword !== '' ? text.replace(this.curKeyword, `<span style="color: #001529;font-weight: bold">${this.curKeyword}</span>`) : text;
    },
    handleNodeClick(data) {
      this.articleQuery.catalogs = getChildren(data);
      this.onSearch();
    },
    showAll() {
      this.articleQuery.catalogs = [];
      this.onSearch();
    },
  }
}
</script>

<style scoped>
.article-pagination {
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
  width: 24vw;
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
