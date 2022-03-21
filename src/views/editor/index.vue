<template>
  <el-row>
    <el-col :span="16">
      <!-- 一些字体调整之类的 -->
      <div class="condition">
        <el-button type="text"
                   v-for="size in sizes" :key="size"
                   :style="{fontSize: size+'px',color:size==fontSize?'#7A0F09':'black',textDecoration:size==fontSize?'underline':'none'}"
                   @click="changeSize(size)">A
        </el-button>
        <el-divider direction="vertical" style="background-color: gray"></el-divider>
        <el-button type="text" style="color: gray" icon="el-icon-download" @click="exportFormVisible = true">导出为pdf
        </el-button>
        <div class="char-count">共 {{ curLength }} 字</div>
      </div>
      <!-- 输入正文 -->
      <div id="textInput"
           class="textarea"
           contenteditable="true"
           @input="input"
           :style="{fontSize: fontSize+'px'}"
      ></div>
      <el-button type="primary" plain size="medium"
                 style="float: right;margin-top: 10px"
                 @click="onCheck"
      >检验
      </el-button>
    </el-col>
    <el-col :span="8">
      <el-card shadow="hover" style="width: 90%;margin-left: 5%;height: 130px">
        <div v-if="result">
          <div class="accuracy-card">
            <span class="accuracy-number">{{ result.accuracy }}</span>
            <span class="accuracy-symbol">%</span>
            <div class="accuracy-title">准确率</div>
          </div>
          <div class="detail-card">
            缺乏事实依据 {{ `${'.'.repeat(44 - String(result.factLess).length)} ${result.factLess}` }}<br/>
            缺乏法律依据 {{ `${'.'.repeat(44 - String(result.lawLess).length)} ${result.lawLess}` }}<br/>
            法条引用错误 {{ `${'.'.repeat(44 - String(result.lawError).length)} ${result.lawError}` }}<br/>
          </div>
        </div>
        <div v-else style="color: lightgrey;line-height: 85px">点击检验查看结果</div>
      </el-card>
    </el-col>
    <el-dialog title="裁判文书信息" :visible.sync="exportFormVisible">
      <el-form ref="exportForm" :model="exportForm" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="法院名称">
              <el-input v-model="exportForm.courtName" placeholder="请输入法院名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文书名称">
              <el-input v-model="exportForm.name" placeholder="请输入文书名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="案号">
              <el-input v-model="exportForm.number" placeholder="请输入案号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="日期">
              <el-date-picker
                v-model="exportForm.date"
                type="date"
                placeholder="请选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="组成人员">
              <div v-for="(item,index) in exportForm.members" style="text-align: left">
                <el-row style="margin-bottom: 5px">
                  <el-col :span="7">
                    <el-select v-model="item.status" placeholder="请选择身份">
                      <el-option label="审判长" value="审判长"></el-option>
                      <el-option label="审判员" value="审判员"></el-option>
                      <el-option label="代理审判员" value="代理审判员"></el-option>
                      <el-option label="人民陪审员" value="人民陪审员"></el-option>
                      <el-option label="书记员" value="书记员"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="15" :offset="1">
                    <el-input v-model="item.name" placeholder="请输入人员姓名"></el-input>
                  </el-col>
                  <el-col :span="1" style="text-align: right">
                    <el-button type="text" icon="el-icon-delete" @click="delMember(index)"></el-button>
                  </el-col>
                </el-row>
              </div>
              <el-row style="text-align: right">
                <el-button type="text" icon="el-icon-plus" @click="addMember">新增人员</el-button>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exportFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onExportPdf">导 出</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import {mapActions} from "vuex";


export default {
  name: "Editor",
  data() {
    return {
      fontSize: 14,
      sizes: [18, 14, 10],
      curLength: 0,
      result: null,
      // result: {
      //   accuracy: 78,
      //   factLess: 1,
      //   lawLess: 0,
      //   lawError: 0
      // },
      exportForm: {
        courtName: '',
        name: '',
        number: '',
        date: '',
        members: [
          {
            status: '审判长',
            name: ''
          },
        ]
      },
      exportFormVisible: false,
    }
  },
  methods: {
    ...mapActions([
      'exportPdf',
      'check',
    ]),
    addMember() {
      this.exportForm.members.push({
        status: '',
        name: ''
      })
    },
    delMember(index) {
      this.exportForm.members.splice(index, 1);
    },
    input(html) {
      var sel, range;
      if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          // Range.createContextualFragment() would be useful here but is
          // non-standard and not supported in all browsers (IE9, for one)
          var el = document.createElement("div");
          // el.innerHTML = html;
          try {
            el.appendChild(html)
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
              lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            // Preserve the selection
            if (lastNode) {
              range = range.cloneRange();
              range.setStartAfter(lastNode);
              range.collapse(true);
              sel.removeAllRanges();
              sel.addRange(range);
            }
          } catch (e) {
            // console.log(e)
          }
          this.curLength = document.getElementById('textInput').innerText.length;
        }
      } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
      }
    },
    changeSize(size) {
      this.fontSize = size;
    },
    onCheck() {
      var text = document.getElementById('textInput').innerText;
      this.check(text).then(res => {
        this.result = res;
      }).catch(err => {
        this.$message.error(err);
      })
    },
    onExportPdf() {
      this.exportPdf({
        ...this.exportForm,
        content: document.getElementById('textInput').innerText,
      }).then(res => {
        var blob = res;
        var fileName = this.exportForm.courtName + this.exportForm.name;
        if (window.navigator.msSaveOrOpenBlob) {  // IE浏览器下
          navigator.msSaveBlob(blob, fileName);
        } else {
          var link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          window.URL.revokeObjectURL(link.href);
        }
        this.exportForm = {
          courtName: '',
          name: '',
          number: '',
          date: '',
          members: [
            {
              status: '审判长',
              name: ''
            },
          ]
        }
      }).catch(err => {
        this.$message.error(err);
      })
    },
  },
}
</script>

<style scoped>
.condition {
  height: 6vh;
  background-color: lightgrey;
  text-align: left;
  padding: 0 10px 0 10px;
}

.textarea {
  border: lightgrey solid 1px;
  text-align: left;
  padding: 10px;
  height: 72vh;
  overflow: auto;
}

.textarea:focus {
  outline: none;
}

.textarea::-webkit-scrollbar { /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
}

.textarea::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
  border-radius: 10px;
  background: lightgray;
}

.textarea::-webkit-scrollbar-track { /*滚动条里面轨道*/
  border-radius: 10px;
  background: transparent;
}

.char-count {
  float: right;
  color: gray;
  line-height: 6vh;
  font-size: 14px;
}

.accuracy-card {
  width: 25%;
  text-align: center;
  float: left;
}

.accuracy-number {
  font-size: 50px;
  color: #7A0F09;
  font-style: italic;
  font-weight: bold;
}

.accuracy-symbol {
  font-size: 20px;
  color: #7A0F09;
  font-style: italic;
}

.accuracy-title {
  text-align: center;
  color: gray;
}

.detail-card {
  width: 70%;
  margin-left: 5%;
  float: left;
  text-align: left;
  line-height: 30px;
}
</style>
