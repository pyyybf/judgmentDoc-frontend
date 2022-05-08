<template>
  <el-row>
    <el-col :span="16">
      <!-- 一些字体调整之类的 -->
      <div class="condition">
        <el-button type="text"
                   v-for="size in sizes" :key="size"
                   :style="{fontSize: size+'px',color:size==fontSize?'#001529':'black',textDecoration:size==fontSize?'underline':'none'}"
                   @click="changeSize(size)">A
        </el-button>
        <el-divider direction="vertical" style="background-color: gray"></el-divider>
        <el-button type="text" style="color: gray" icon="el-icon-download" @click="exportFormVisible = true">导出文档
        </el-button>
        <div class="char-count">共 {{ curLength }} 字</div>
      </div>
      <!-- 输入正文 -->
      <div id="textInput"
           class="textarea"
           :contenteditable="contentEditable"
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
      <div id="container"></div>
    </el-col>
    <el-dialog title="裁判文书信息" :visible.sync="exportFormVisible">
      <el-form ref="exportForm" id="exportForm" :model="exportForm" label-width="80px">
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
        <el-dropdown @command="handleCommand">
          <el-button type="primary" :loading="exportLoading">
            导 出 为<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="exportType in exportTypes" :command="exportType" :key="exportType">{{
                exportType
              }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import {mapActions} from "vuex";
import G6 from '@antv/g6';

const COLOR_TBL = ['#000000', '#909399', '#E6A23C', '#409EFF'];

const mergeText = function (str, fontSize, width) {
  const lineLength = Math.floor(width / fontSize);
  var count = 0;
  var curText = '';
  var res = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] == '\n') {
      count = 0;
      res.push(curText);
      curText = '';
    } else {
      count++;
      curText += str[i];
      if (count == lineLength || i == str.length - 1) {
        res.push(curText);
        count = 0;
        curText = '';
      }
    }
  }
  return res;
}

export default {
  name: "Editor",
  data() {
    return {
      fontSize: 14,
      sizes: [10, 14, 18],
      curLength: 0,
      result: null,
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
      exportLoading: false,
      contentEditable: true,
      graph: null,
      graphData: {
        nodes: [],
        edges: [],
      },
      exportTypes: ['pdf', 'word'],
    }
  },
  methods: {
    ...mapActions([
      'exportPdf',
      'exportWord',
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
        document.getElementById('textInput').innerHTML = '';
        this.graphData = {
          nodes: [],
          edges: []
        }
        for (let text of this.result.texts) {
          if (text.type == 0) {
            var span = document.createTextNode(text.content);
          } else {
            var span = document.createElement('span');
            span.id = text.id;
            span.className = `text${text.type}`;
            span.style.border = `${COLOR_TBL[text.type]} solid 1px`;
            span.style.borderRadius = '3px';
            span.style.backgroundColor = `${COLOR_TBL[text.type]}20`;
            span.innerText = text.content;
            var that = this;
            span.onmouseover = function () {
              this.style.boxShadow = `0 0 8px ${COLOR_TBL[text.type]}`;
              this.style.backgroundColor = `${COLOR_TBL[text.type]}40`;
              that.graph.getNodes().forEach(function (node) {
                if (node.getID() == text.id) {
                  node.setState('highlight', true, node);
                }
              });
              that.graph.paint();
            }
            span.onmouseout = function () {
              this.style.boxShadow = null;
              this.style.backgroundColor = `${COLOR_TBL[text.type]}20`;
              that.graph.getNodes().forEach(function (node) {
                if (node.getID() == text.id) {
                  node.setState('highlight', false, node);
                }
              });
              that.graph.paint();
            }
            var node = {
              anchorPoints: [
                [1, 0.5],
                [1, 0.5],
              ],
              id: text.id,
              textType: text.type,
              warning: 0,
            };
            if (text.type == 1) {
              node['title'] = `事实${text.count}`;
              node['value'] = mergeText(text.content, 12, 410);
              for (let relation of text.relations) {
                this.graphData.edges.push({
                  source: text.id,
                  target: relation,
                  style: {
                    lineWidth: 1,
                    stroke: COLOR_TBL[1],
                  }
                })
              }
            } else if (text.type == 2) {
              node['title'] = `《${text.article.law}》${text.article.number}`;
              node['value'] = mergeText(text.article.content, 12, 410);
              if (text.relations.length == 0) {
                node['warning'] = 1;
              }
            } else if (text.type == 3) {
              node['title'] = `结论${text.count}`;
              node['value'] = mergeText(text.content, 12, 410);
              for (let relation of text.relations) {
                this.graphData.edges.push({
                  source: relation,
                  target: text.id,
                  style: {
                    lineWidth: 1,
                    stroke: COLOR_TBL[2],
                  }
                })
              }
            }
            this.graphData.nodes.push(node);
          }
          document.getElementById('textInput').appendChild(span);
        }
        this.initG6();
      }).catch(err => {
        this.$message.error(err);
      })
    },
    onExportPdf() {
      this.exportLoading = true;
      this.exportPdf({
        ...this.exportForm,
        content: document.getElementById('textInput').innerText,
      }).then(res => {
        this.downloadDoc(res);
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
        this.exportFormVisible = false;
      }).catch(err => {
        this.$message.error(err);
      }).finally(() => {
        this.exportLoading = false;
      })
    },
    onExportWord() {
      this.exportLoading = true;
      this.exportWord({
        ...this.exportForm,
        content: document.getElementById('textInput').innerText,
      }).then(res => {
        this.downloadDoc(res);
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
        this.exportFormVisible = false;
      }).catch(err => {
        this.$message.error(err);
      }).finally(() => {
        this.exportLoading = false;
      })
    },
    initG6() {
      if (this.graph) {
        this.graph.destroy();
      }

      G6.registerNode(
        'card-node',
        {
          drawShape: function drawShape(cfg, group) {
            const color = COLOR_TBL[cfg.textType];
            const r = 5;
            const shape = group.addShape('rect', {
              attrs: {
                x: 0,
                y: 0,
                width: 420,
                height: 20 + (cfg.value.length + cfg.warning) * 20,
                stroke: color,
                radius: r,
              },
              name: 'main-box',
            });

            group.addShape('rect', {
              attrs: {
                x: 0,
                y: 0,
                width: 420,
                height: 20,
                fill: color,
                radius: [r, r, 0, 0],
              },
              name: 'title-box',
            });

            // title text
            group.addShape('text', {
              attrs: {
                textBaseline: 'top',
                y: 5,
                x: 5,
                lineHeight: 20,
                text: cfg.title,
                fill: '#fff',
              },
              name: 'title',
            });

            // value text
            group.addShape('text', {
              attrs: {
                textBaseline: 'top',
                y: 25,
                x: 5,
                lineHeight: 20,
                text: cfg.value.join('\n'),
                fill: '#000000',
                fontSize: 12,
              },
              name: 'content',
            });

            if (cfg.warning == 1) {
              group.addShape('text', {
                attrs: {
                  textBaseline: 'top',
                  y: cfg.value.length * 20 + 25,
                  x: 5,
                  lineHeight: 20,
                  text: '警告：缺少事实依据',
                  fill: '#F56C6C',
                  fontSize: 12,
                },
                name: 'warning',
              });
            }

            return shape;
          },
          setState: function setState(name, value, item) {
            const group = item.getContainer();
            const children = group.get('children');

            if (name === 'highlight') {
              if (value) {
                children.forEach((shape) => {
                  if (shape.cfg.name === 'main-box') {
                    shape.attr('lineWidth', 3);
                    shape.attr('shadowColor', COLOR_TBL[item.getModel().textType]);
                    shape.attr('shadowBlur', 5);
                  }
                });
              } else {
                children.forEach((shape) => {
                  if (shape.cfg.name === 'main-box') {
                    shape.attr('lineWidth', 1);
                    shape.attr('shadowColor', 'transparent');
                    shape.attr('shadowBlur', 0);
                  }
                });
              }
            }
          },
        },
        'single-node',
      );

      const container = document.getElementById('container');
      const width = container.scrollWidth;
      const height = container.scrollHeight;

      this.graph = new G6.Graph({
        container: 'container',
        width,
        height,
        fitCenter: true,
        defaultNode: {
          type: 'card-node',
        },
        fitView: true,
      });

      const nodeMap = new Map();
      var curY = 10;

      this.graphData.nodes.forEach(function (node, i) {
        node.x = 10;
        node.y = curY;
        curY = curY + 10 + 20 + (node.value.length + node.warning) * 20;
        nodeMap.set(node.id, node);
      });
      this.graphData.edges.forEach((edge) => {
        edge.type = 'arc';
        const source = nodeMap.get(edge.source);
        edge.curveOffset = 20;
        edge.color = source.color;
      });

      this.graph.on('node:mouseover', function (e) {
        document.getElementById(e.item.getModel().id).onmouseover();
        e.item.setState('highlight', true, e.item);
      });
      this.graph.on('node:mouseout', function (e) {
        document.getElementById(e.item.getModel().id).onmouseout();
        e.item.setState('highlight', false, e.item);
      });

      this.graph.data(this.graphData);
      this.graph.render();

      if (typeof window !== 'undefined')
        window.onresize = () => {
          if (!this.graph || this.graph.get('destroyed')) return;
          if (!container || !container.scrollWidth || !container.scrollHeight) return;
          this.graph.changeSize(container.scrollWidth, container.scrollHeight);
        };
    },
    handleCommand(command) {
      eval(`this.onExport${command.charAt(0).toUpperCase() + command.slice(1)}()`);
    },
    downloadDoc(blob) {
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
    }
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
  white-space: pre-line;
  line-height: 24px;
  z-index: 1;
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
  color: #001529;
  font-style: italic;
  font-weight: bold;
}

.accuracy-symbol {
  font-size: 20px;
  color: #001529;
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

#container {
  margin: 0;
  height: 81vh; /*87vh*/
  overflow-x: hidden;
  overflow-y: auto;
}

#container::-webkit-scrollbar { /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
}

#container::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
  border-radius: 10px;
  background: lightgray;
}

#container::-webkit-scrollbar-track { /*滚动条里面轨道*/
  border-radius: 10px;
  background: transparent;
}
</style>
