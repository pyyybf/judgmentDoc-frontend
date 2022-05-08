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
      <el-select v-model="crime" size="medium" placeholder="请选择案由" style="float: left;margin-top: 10px">
        <el-option v-for="item in crimeOptions"
                   :key="item.key"
                   :label="item.label"
                   :value="item.key">
        </el-option>
      </el-select>
      <el-button type="primary" plain size="medium"
                 style="float: right;margin-top: 10px"
                 @click="onCheck"
                 :loading="checkLoading"
      >检 验
      </el-button>
    </el-col>
    <el-col :span="8">
      <div v-if="result" id="show-all-btn">
        <el-button type="text" icon="el-icon-refresh" @click="showAll" style="">显示所有</el-button>
      </div>
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
      crime: '',
      crimeOptions: [
        {
          key: 'traffic',
          label: '交通肇事'
        },
        {
          key: 'hurt',
          label: '故意伤害'
        }
      ],
      checkLoading: false,
      canvasWidth: 0,
      canvasHeight: 0,
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getDocumentById(this.$route.query.id).then(res => {
        document.getElementById('textInput').appendChild(document.createTextNode(res.content));
        this.exportForm = {
          courtName: res.courtName,
          name: res.name,
          number: res.number,
          date: res.date,
          members: []
        }
        for (let member of res.members) {
          this.exportForm.members.push({
            status: member.status,
            name: member.name
          })
        }
      }).catch(err => {
        this.$message.error(err);
      })
    }
  },
  methods: {
    ...mapActions([
      'exportPdf',
      'exportWord',
      'check',
      'getDocumentById',
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
      if (this.crime == '') {
        this.$message.warning('请选择案由');
        return;
      }
      this.checkLoading = true;
      this.check({
        text: document.getElementById('textInput').innerText,
        crime: this.crime
      }).then(res => {
        this.result = res;
        document.getElementById('textInput').innerHTML = '';
        for (let text of this.result) {
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
          }
          document.getElementById('textInput').appendChild(span);
        }
        this.showAll();
      }).catch(err => {
        this.$message.error(err);
      }).finally(() => {
        this.checkLoading = false;
      })
    },
    showAll() {
      var idList = [];
      for (let text of this.result) {
        if (text.type > 0) {
          idList.push(text.id);
        }
      }
      this.manageData(idList);
    },
    onExportPdf() {
      this.exportLoading = true;
      this.exportPdf({
        ...this.exportForm,
        content: document.getElementById('textInput').innerText,
      }).then(res => {
        this.downloadDoc(res);
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

      const container = document.getElementById('container');
      const width = container.scrollWidth;
      const height = this.canvasHeight;

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
                width: width - 70,
                height: 20 * cfg.title.length + (cfg.value.length + cfg.warning.length) * 20,
                stroke: color,
                radius: r,
              },
              name: 'main-box',
            });

            group.addShape('rect', {
              attrs: {
                x: 0,
                y: 0,
                width: width - 70,
                height: 20 * cfg.title.length,
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
                text: cfg.title.join('\n'),
                fill: '#fff',
              },
              name: 'title',
            });
            // value text
            group.addShape('text', {
              attrs: {
                textBaseline: 'top',
                y: 5 + 20 * cfg.title.length,
                x: 5,
                lineHeight: 20,
                text: cfg.value.join('\n'),
                fill: '#000000',
                fontSize: 12,
              },
              name: 'content',
            });

            if (cfg.warning.length > 0) {
              group.addShape('text', {
                attrs: {
                  textBaseline: 'top',
                  x: 5,
                  y: cfg.value.length * 20 + 20 * cfg.title.length + 5,
                  lineHeight: 20,
                  text: cfg.warning.join('\n'),
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
              // console.log(value)
              if (value) {  //高亮
                children.forEach((shape) => {
                  if (shape.cfg.name === 'main-box') {
                    shape.attr('lineWidth', 3);
                    shape.attr('shadowColor', COLOR_TBL[item.getModel().textType]);
                    shape.attr('shadowBlur', 5);
                  }
                });
              } else {  //不高亮
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

      this.graph = new G6.Graph({
        container: 'container',
        width,
        height,
        fitCenter: true,
        defaultNode: {
          type: 'card-node',
        },
        fitView: true,
        defaultEdge: {
          /* style for the keyShape */
          type: 'arc',
          curveOffset: 50,
          style: {
            stroke: '#aaaaaa',
            opacity: 0.3,
            lineWidth: 1,
          },
        },
        edgeStateStyles: {
          active: {
            stroke: '#909399',
            opacity: 1,
            lineWidth: 2,
          },
        },
      });

      const nodeMap = new Map();
      var curY = 10;

      this.graphData.nodes.forEach(function (node, i) {
        console.log(node)
        node.x = 10;
        node.y = curY;
        curY = curY + 10 + node.title.length * 20 + (node.value.length + node.warning.length) * 20;
        nodeMap.set(node.id, node);
      });

      var that = this;
      this.graph.on('node:mouseover', function (e) {
        e.item.setState('highlight', true, e.item);
        document.getElementById(e.item.getModel().id).onmouseover();
      });
      this.graph.on('node:mouseleave', function (e) {
        e.item.setState('highlight', false, e.item);
        document.getElementById(e.item.getModel().id).onmouseout();
      });
      this.graph.on('node:click', function (e) {
        var idList = [e.item.getModel().id].concat(e.item.getModel().relations);
        that.manageData(idList);
        document.getElementById(e.item.getModel().id).onmouseout();
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
    manageData(idList) {
      this.graphData = {
        nodes: [],
        edges: []
      }
      this.canvasHeight = 10;
      const container = document.getElementById('container');
      const width = container.scrollWidth;
      for (let text of this.result) {
        if (idList.indexOf(text.id) > -1) {
          var node = {
            anchorPoints: [
              [1, 0.5],
              [1, 0.5],
            ],
            id: text.id,
            textType: text.type,
            warning: [],
            relations: text.relations,
          };
          if (text.type == 1) {  //fact
            node['title'] = mergeText(`事实${text.count}`, 12, width - 80);
            node['value'] = mergeText(text.content, 12, width - 80);
            for (let relation of text.relations) {
              this.graphData.edges.push({
                source: text.id,
                target: relation,
              })
            }
            // 可能需要引用的法条
            if (text.needs.length > 0) {
              let needMap = {};
              for (let need of text.needs) {
                if (!needMap.hasOwnProperty(need.law)) {
                  needMap[need.law] = [];
                }
                needMap[need.law].push(need.number);
              }
              let needText = '可能缺少的法条：';
              for (let law in needMap) {
                needText += (`\n《${law}》${needMap[law].join('、')}`);
              }
              node['warning'] = mergeText(needText, 12, width - 80);
            } else {
              node['warning'] = [];
            }
            this.canvasHeight = this.canvasHeight + 20 * (node['title'].length + node['value'].length + node['warning'].length) + 10;
          } else if (text.type == 2) {  //law
            if (text.article == null) {
              node['title'] = mergeText('暂无相关信息', 12, width - 80);
              node['value'] = [];
            } else {
              node['title'] = mergeText(`《${text.article.law}》${text.article.number}`, 12, width - 80);
              node['value'] = mergeText(text.article.content, 12, width - 80);
              if (text.relations.length == 0) {
                node['warning'] = mergeText('警告：缺少事实依据', 12, width - 80);
              }
            }
            this.canvasHeight = this.canvasHeight + 20 * (node['title'].length + node['value'].length + node['warning'].length) + 10;
          } else if (text.type == 3) {  //conclusion
            node['title'] = mergeText(`结论${text.count}`, 12, width - 80);
            node['value'] = mergeText(text.content, 12, width - 80);
            for (let relation of text.relations) {
              this.graphData.edges.push({
                source: relation,
                target: text.id,
              })
            }
            node['warning'] = [];
            this.canvasHeight = this.canvasHeight + 20 * (node['title'].length + node['value'].length + node['warning'].length) + 10;
          }
          this.graphData.nodes.push(node);
        }
      }
      this.initG6();
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

#show-all-btn {
  height: 6vh;
  text-align: right;
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
