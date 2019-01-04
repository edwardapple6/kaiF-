<template>
<!-- 20181224：可赎份额由 parseInt 改为 parseFloat; 赎回份额可输入小数 -->
  <div class="jjsh">
    <div class="sec01">
      <!-- 基金代码 -->
      <div class="item">
        <span class="span fs14">{{ items[0].tag }}</span>
        <img class="jjdm-arrow-d"
          :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
          v-if="items.length !== 0"
          src="../../assets/arrow-d.png"
          alt="更多"
          @click="openJjdmPopup()">
        <input class="input-able fs14"
          :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
          type="tel"
          :placeholder="items[0].placeholder"
          v-model="items[0].value"
          :ref="items[0].ref"
          @keyup="jjdmKeyup()">
      </div>
      <mt-popup class="jjdm-popup"
        v-model="hasJjdmPopup"
        position="bottom">
        <div :class="[mobSys === 'IOS' || mobSys === 'WEB-IOS' ? 'ios' : 'android']"
          class="title">请选择基金</div>
        <ul :class="[lists.length > 7 ? 'limit-height' : '']">
          <li :class="[mobSys === 'IOS' || mobSys === 'WEB-IOS' ? 'ios' : 'android']"
            v-for="(list, index) in lists"
            :key="index"
            @click="chooseJjdm(index)">
            {{ lists[index].data[0][0] }}
            <img src="../../assets/chosen.png" alt="选中"
              v-show="lists[index].chosen">
          </li>
        </ul>
      </mt-popup>
      <!-- 只读信息 -->
      <div class="item"
        v-for="(item, index) in items"
        :key="item.index"
        v-if="(index > 0 && index < 4)">
        <span class="span fs14">{{ item.tag }}</span>
        <span class="unit2 fs14"
          v-if=item.unit>{{ item.unit }}</span>
        <input class="input-disable fs14"
          :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
          v-if="(index !== 0)"
          type="text"
          :value="item.value"
          readonly>
      </div>
      <!-- 赎回份额 -->
      <div class="item">
        <span class="span fs14">{{ items[4].tag }}</span>
        <span class="unit3 fs14"
          v-if=items[4].unit>{{ items[4].unit }}</span>
        <div class="wrap"
          :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']">
          <div class="btn-sm fs15" @click="clickTotal">全额</div>
          <input class="input-able-narrow fs14"
            :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
            type="number"
            :placeholder="items[4].placeholder"
            v-model="items[4].value"
            :ref="items[4].ref"
            @keyup="shfeKeyup()">
        </div>
      </div>
      <!-- 巨额方式 -->
      <div class="item">
        <span class="span fs14">{{ items[5].tag }}</span>
        <img class="arrow-d" src="../../assets/arrow-d.png" alt="更多">
        <input class="input-able fs14"
          :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
          type="text"
          :placeholder="items[5].placeholder"
          v-model="items[5].value"
          @click="jefsClicked"
          readonly>
      </div>
    </div>

    <div class="btn fs15" @click="conform">确定</div>

    <!-- 持仓查询 -->
    <div class="titles">
      <ul class="fs13"
        v-for="title in titles"
        :key="title.index">
        <li>{{ title[0] }}</li>
        <li>{{ title[1] }}</li>
      </ul>
    </div>

    <div class="content">
      <div class="list clearfix"
        :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
        v-for="(list, p) in lists"
        :key="list.p"
        @click="listClicked(p, '')">
        <ul v-for="item in list.data"
          :key="item.q">
          <li>{{ item[0] }}</li>
          <li>{{ item[1] }}</li>
        </ul>
      </div>
      <div class="no-more" v-if="noMore">没有更多数据了</div>
      <!-- 没有数据 -->
      <div class="error-info" v-if="errorInfo">{{ errorInfo }}</div>
      <div class="no-data-info" v-if="noDataInfo">{{ noDataInfo }}</div>
    </div>

    <dlgConform v-if="dlgConform.open"
      :mobSys="mobSys"
      :title="dlgConform.title"
      :content="dlgConform.content"
      @conform-btn01="conformBtn01"
      @conform-btn02="conformBtn02"/>

    <dlgInfo v-if="dlgInfo.open"
      :mobSys="mobSys"
      :title="dlgInfo.title"
      :content="dlgInfo.content"
      @info-btn01="infoBtn01"/>

    <popupBtm v-if="popupBtm.open"
      :mobSys="mobSys"
      :title="popupBtm.title"
      :content="popupBtm.content"
      @popup-click="popupClicked"/>

    <!-- 加载提示 -->
    <loading v-if="loading"/>
  </div>
</template>

<script>
import tdxct from '../../lib/connect.js'
import dlgConform from '../../components/dlgConform'
import dlgInfo from '../../components/dlgInfo'
import popupBtm from '../../components/popupBtm'
import loading from '../../components/loading'

export default {
  name: 'jjsh',
  components: {
    dlgConform,
    dlgInfo,
    popupBtm,
    loading
  },
  data () {
    return {
      mobSys: '', // 手机系统
      loading: false,
      items: [
        {
          tag: '基金代码',
          value: '',
          placeholder: '请输入赎回基金',
          ref: 'jjdm'
        },
        {
          tag: '基金名称',
          value: ''
        },
        {
          tag: '基金状态',
          value: ''
        },
        {
          tag: '可赎份额',
          value: '',
          unit: '份'
        },
        {
          tag: '赎回份额',
          value: '',
          placeholder: '请输入赎回份额',
          ref: 'shfe',
          unit: '份'
        },
        {
          tag: '巨额方式',
          value: '',
          placeholder: '当发生巨额赎回时的处理方式'
        }
      ],
      hasJjdmPopup: false,
      popupBtm: {
        open: false,
        title: '请选择巨额方式',
        content: [
          {
            txt: '赎回取消',
            chosen: false
          },
          {
            txt: '赎回顺延',
            chosen: false
          }
        ]
      },
      titles: [
        // ['基金名称', '基金代码'],
        // ['持有份额', '可用份额'],
        // ['昨日净值', '成本'],
        // ['盈亏金额', '市值']
      ],
      lists: [
        // {
        //   data: [
        //     ['', ''],
        //     ['', ''],
        //     ['', ''],
        //     ['', '']
        //   ],
        //   chosen: false
        // }
      ],
      clickedInfo: {},
      noMore: false,
      errorInfo: '',
      noDataInfo: '',

      dlgConform: {
        open: false,
        title: '',
        content: [
          {
            tag: '操作类别：',
            value: '基金赎回'
          },
          {
            tag: '基金代码：',
            value: ''
          },
          {
            tag: '基金名称：',
            value: ''
          },
          {
            tag: '赎回份额：',
            value: ''
          },
          {
            tag: '基金账户：',
            value: ''
          }
        ]
      },
      dlgInfo: {
        open: false,
        title: '',
        content: ''
      },
      F110: '',
      F130: '',
      F166: '',

      POS2126: '',
      req3134: true,
      lists2126: [
        // ['', ''] // F426：基金公司代码 F417：基金账户
      ],

      POS2106: '',
      aga2106: true,

      F468: '', // 巨额方式
      submitted: false,
      done: false
    }
  },
  created () {
    this.mobSys = tdxct.tdxCheckMobSys()
    // window.tdxActivity = function () {}
    window.setPartHeight = function () {}
    window.changeFontSize = function () {}
  },
  mounted () {
    let _self = this
    /* 获取账户信息 */
    tdxct.tdxgetAccList(function (data) {
      console.log('dataAccs', data)
      let result = ''
      let usedAcc = ''
      if (_self.mobSys === 'IOS' || _self.mobSys === 'WEB-IOS') {
        result = JSON.parse(data)
        for (let i in result) {
          if (result[i].HostType === '0') {
            usedAcc = result[i]
            break
          }
        }
      } else if (_self.mobSys === 'Android' || _self.mobSys === 'WEB-Android') {
        for (let j in data) {
          result = JSON.parse(data[j])
          if (result.HostType === 0) {
            usedAcc = result
            break
          }
        }
      }
      _self.F110 = usedAcc.WTFS

      _self.get2126Data()
      _self.get2106Data()
    })
  },
  methods: {
    /* 开放式基金帐号查询 */
    get2126Data () {
      let _self = this
      this.loading = true
      let param2126 = [{
        'F110': this.F110,
        'F1286': this.POS2126,
        'F1288': 100
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param2126['tdxPageID'] = '_Base64'
      console.log('param2126', param2126)
      tdxct.JYCallTql('2126', param2126, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data2126 = tdxct.FormatResult(data)
        let rows2126 = data2126.rows
        console.log('data2126', data2126)
        switch (data2126.ErrorCode) {
          /* 安卓解析 -1，IOS解析 '-1' */
          case -1:
          case '-1':
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = data2126.ErrorInfo
            _self.req3134 = -1
            break
          case '0':
            _self.POS2126 = data2126.POS
            _self.req3134++
            for (let i in rows2126) {
              let temArr = [rows2126[i].F426, rows2126[i].F417]
              _self.lists2126.push(temArr)
            }
            break
        }
        if (_self.POS2126 && _self.req3134 !== -1) _self.get2126Data()
      })
    },
    getTitle (heads) {
      let titlesArr = []
      for (let i in heads) {
        let temIndex = heads[i].indexOf('/')
        let temArr = [heads[i].substring(0, temIndex), heads[i].substring(temIndex + 1)]
        titlesArr.push(temArr)
      }
      return titlesArr
    },
    /* 开放式基金份额查询 */
    get2106Data () {
      let _self = this
      this.lists = []
      this.noMore = false
      this.loading = true
      this.aga2106 = true
      let param2106 = [{
        'F110': this.F110,
        'F1286': this.POS2106,
        'F1288': 100
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param2106['tdxPageID'] = '_Base64'
      console.log('param2106', param2106)
      tdxct.JYCallTql('2106', param2106, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data2106 = tdxct.FormatResult(data)
        console.log('data2106', data2106)
        switch (data2106.ErrorCode) {
          /* 安卓解析 -1，IOS解析 '-1' */
          case -1:
          case '-1':
            _self.titles = [
              ['基金名称', '基金代码'],
              ['持有份额', '可用份额'],
              ['昨日净值', '成本'],
              ['盈亏金额', '市值']
            ]
            _self.errorInfo = data2106.ErrorInfo
            _self.aga2106 = false
            break
          case '0':
            _self.POS2106 = data2106.POS
            if (data2106.Num === '0') {
              /* 获取 titles */
              let heads = JSON.parse(data2106.ErrorInfo).heads
              _self.titles = _self.getTitle(heads)
              /* 信息展示 */
              _self.noDataInfo = '没有相应的查询信息！'
            } else if (data2106.Num > 0) {
              let rows2106 = data2106.rows
              /* 获取 titles */
              let heads = JSON.parse(rows2106[0].F51).heads
              _self.titles = _self.getTitle(heads)
              /* 信息展示 */
              let cells = JSON.parse(rows2106[0].F51).cells
              for (let i in rows2106) {
                let temObj = {
                  data: [
                    [rows2106[i][cells[0][0][0]], rows2106[i][cells[0][1][0]]],
                    [rows2106[i][cells[1][0][0]], rows2106[i][cells[1][1][0]]],
                    [rows2106[i][cells[2][0][0]], rows2106[i][cells[2][1][0]]],
                    [rows2106[i][cells[3][0][0]], rows2106[i][cells[3][1][0]]]
                  ],
                  chosen: false
                }
                _self.lists.push(temObj)
              }
              _self.noMore = true
            }
            break
        }
        if (_self.POS2106 && _self.aga2106) _self.get2106Data()
      })
    },
    jjdmKeyup () {
      /* type="tel"可以调出数字键盘 函数：只能输入数字 */
      this.items[0].value = this.items[0].value.replace(/[^a-zA-Z0-9]/ig, '')
      /* index为0是，基金代码 input 执行 */
      if (this.items[0].value.length > 6) {
        this.items[0].value = this.items[0].value.slice(0, 6)
      } else if (this.items[0].value.length === 6) {
        this.$refs.jjdm.blur()
        this.get2110Data('', this.items[0].value)
      } else {
        this.items[1].value = ''
        this.items[2].value = ''
        this.items[3].value = ''
      }
    },
    openJjdmPopup () {
      if (this.lists.length === 0) {
        this.dlgInfo.open = true
        this.dlgInfo.title = '提示'
        this.dlgInfo.content = '持仓中没有查询到赎回基金'
      } else {
        this.hasJjdmPopup = true
      }
    },
    chooseJjdm (_p) {
      for (let i in this.lists) {
        this.lists[i].chosen = false
      }
      this.lists[_p].chosen = true
      this.hasJjdmPopup = false
      /* 获取信息 */
      this.listClicked(_p, '')
    },
    shfeKeyup () {
      this.items[4].value = this.items[4].value.match(/^\d*(\.?\d{0,2})/g)[0]
      if (this.items[4].value.charAt(0) === '.') {
        this.items[4].value = '0' + this.items[4].value
      }
    },
    listClicked (_p, _code) {
      this.get2110Data(_p, _code)
    },
    /* 开放式基金信息查询 */
    get2110Data (_p, _code) {
      let _self = this
      this.items[1].value = ''
      this.items[2].value = ''
      this.items[3].value = ''
      if (_p.length !== 0) {
        /* 获取信息 */
        this.items[0].value = this.lists[_p].data[0][1] // 基金代码
        this.clickedInfo = this.lists[_p]
      } else {
        this.items[0].value = _code // 基金代码
      }
      /* 可赎份额 */
      let temNum = 0
      for (let i in this.lists) {
        if (this.items[0].value === this.lists[i].data[0][1]) {
          /* 相同代码 相加 */
          for (let j in this.lists) {
            if (this.items[0].value === this.lists[j].data[0][1]) {
              temNum = temNum + parseFloat(this.lists[j].data[1][1])
            }
          }
          this.items[3].value = temNum // 可赎份额
          break
        }
      }
      if (this.items[3].value.length === 0) {
        this.items[3].value = 0 // 可赎份额
      }
      /* 开放式基金信息查询 */
      this.loading = true
      let param2110 = [{
        'F110': this.F110, // 委托方式
        'F402': this.items[0].value // 基金代码
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param2110['tdxPageID'] = '_Base64'
      console.log('param2110', param2110)
      tdxct.JYCallTql('2110', param2110, { Way: 'qs' }, function (data) {
        _self.loading = false
        /* 兼容 IOS 的 \r \n 解析问题 */
        let temStr = data.replace(/\\n/g, '').replace(/\\r/g, '').replace(/\\/g, '')
        let data2110 = tdxct.FormatResult(temStr)
        console.log('data2110', data2110)
        switch (data2110.ErrorCode) {
          /* 安卓解析 -1，IOS解析 '-1' */
          case -1:
          case '-1':
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = data2110.ErrorInfo
            break
          case '0':
            _self.items[1].value = data2110.rows[0].F403 // 基金名称
            _self.items[2].value = data2110.rows[0].F147 // 基金状态

            _self.clickedInfo.F426 = data2110.rows[0].F426 // 基金公司代码
            break
        }
      })
    },
    clickTotal () {
      let jjdmValue = this.items[0].value
      /* 判断是否选择赎回基金 */
      if (!jjdmValue) {
        this.dlgInfo.open = true
        this.dlgInfo.title = '提示'
        this.dlgInfo.content = '请输入赎回基金'
      } else {
        this.items[4].value = this.items[3].value
        console.log(123)
      }
    },
    conform () {
      /* 判断是否选择赎回基金 */
      if (!this.items[0].value) {
        this.dlgInfo.open = true
        this.dlgInfo.title = '提示'
        this.dlgInfo.content = '请输入赎回基金'
      } else {
        /* 判断是否输入赎回份额 */
        if (!this.items[4].value) {
          this.dlgInfo.open = true
          this.dlgInfo.title = '提示'
          this.dlgInfo.content = '请输入正确的赎回份额'
        } else {
          /* 判断是否输入巨额方式 */
          if (!this.items[5].value) {
            this.dlgInfo.open = true
            this.dlgInfo.title = '提示'
            this.dlgInfo.content = '请选择巨额方式'
          } else {
            /* 确认弹窗 */
            this.dlgConform.open = true
            this.dlgConform.title = '提示'
            this.dlgConform.content[1].value = this.items[0].value // 基金代码
            this.dlgConform.content[2].value = this.items[1].value // 基金名称
            this.dlgConform.content[3].value = this.items[4].value + '份' // 赎回份额
            for (let i in this.lists2126) {
              if (this.clickedInfo.F426 === this.lists2126[i][0]) {
                this.dlgConform.content[4].value = this.lists2126[i][1] // 基金账户
                break
              }
            }
          }
        }
      }
    },
    jefsClicked () {
      this.popupBtm.open = true
    },
    popupClicked (popCont) {
      this.popupBtm.open = false
      this.popupBtm.content = popCont
      for (let i in this.popupBtm.content) {
        if (this.popupBtm.content[i].chosen === true) {
          this.items[5].value = this.popupBtm.content[i].txt
          // 赎回方式 0: 取消 1：顺延 typeof(i):string
          this.F468 = i
          break
        }
      }
    },
    infoBtn01 (infoBtn01) {
      this.dlgInfo.open = infoBtn01
      let jjdmValue = this.items[0].value
      let shfeValue = this.items[4].value
      if (jjdmValue && !shfeValue) {
        this.$refs.shfe.focus()
      }
      // 2100提交
      if (this.submitted) {
        this.submitted = false
        // 交易成功，清空信息；交易失败，不作操作
        if (this.done) {
          this.done = false
          for (let i in this.items) {
            this.items[i].value = ''
          }
          this.get2106Data()
        }
      }
    },
    conformBtn01 (conformBtn01) {
      this.dlgConform.open = conformBtn01
    },
    conformBtn02 (conformBtn02) {
      this.dlgConform.open = conformBtn02
      this.formDelivered()
    },
    /* 2100 表单提交 */
    formDelivered () {
      let _self = this
      this.submitted = true
      this.loading = true
      let temDate = new Date()
      let temF409 = temDate.getFullYear().toString() + (temDate.getMonth() + 1).toString() + temDate.getDate().toString()
      let param2100 = [{
        'F110': this.F110, // 委托方式
        'F426': this.clickedInfo.F426, // 基金公司代码
        'F417': this.dlgConform.content[4].value, // 基金账户
        'F402': this.items[0].value, // 基金代码
        'F400': '2', // 交易标志
        'F404': this.items[4].value, // 基金份额
        /* 待确认 */
        'F409': temF409, // 发生日期
        'F468': this.F468// 赎回方式 0: 取消 1：顺延
      }]
      if (_self.mobSys === 'IOS' || _self.mobSys === 'WEB-IOS') param2100['tdxPageID'] = '_Base64'
      console.log('param2100', param2100)
      tdxct.JYCallTql('2100', param2100, { Way: 'qs' }, function (data) {
        _self.loading = false
        /* 兼容 IOS 的 \r \n 解析问题 */
        let temStr = data.replace(/\\n/g, '').replace(/\\r/g, '').replace(/\\/g, '')
        let data2100 = tdxct.FormatResult(temStr)
        console.log('data2100', data2100)
        switch (data2100.ErrorCode) {
          /* 安卓解析 -1，IOS解析 '-1' */
          case -1:
          case '-1':
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = data2100.ErrorInfo
            _self.done = false
            break
          case '0':
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = '委托已提交，合同号是：' + data2100.rows[0].F146
            _self.done = true
            break
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fs14 {
  font-size: 14px;
}
.fs15 {
  font-size: 15px;
}
li {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
input {
  -webkit-appearance:none;
  outline: none;
}

.sec01 {
  margin: 20px 15px 0 15px;
}
.item {
  margin-bottom: 10px;
  position: relative;
}
.span {
  line-height: 40px;
  height: 40px;
  color: #666;
}
input {
  height: 38px;
  color: #666;
  float: right;
  padding: 0 30px 0 10px;
  border-radius: 5px;
  border-color: #dbdbdb;
  border-style: solid;
}
.input-able, .input-disable {
  width: 68%;
}

input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
color:#b3b3b3;
}
input:-moz-placeholder, textarea:-moz-placeholder {
color:#b3b3b3;
}
input::-moz-placeholder, textarea::-moz-placeholder {
color:#b3b3b3;
}
input:-ms-input-placeholder, textarea:-ms-input-placeholder {
color:#b3b3b3;
}

input:focus {
  border-color: #FD671A;
  border-style: solid;
}
input.input-disable {
  border-color: #f0f0f0;
  border-style: solid;
}
.unit2, .unit3 {
  position: absolute;
  line-height: 40px;
  height: 40px;
  color: #666;
}
.unit2 {
  right: 10px;
}
.unit3 {
  right: 90px;
  z-index: 10;
}
.jjdm-arrow-d {
  position: absolute;
  right: 0;
  height: 8px;
  padding: 15px 10px 15px 4px;
  border-color: rgba(0, 0, 0, 0);
  border-style: solid;
}
.arrow-d {
  position: absolute;
  right: 10px;
  height: 8px;
  margin: 16px 0;
}
.wrap {
  width: 68%;
  height: 40px;
  float: right;
  padding: 0 30px 0 10px;
  border-color: rgba(0, 0, 0, 0);
  border-style: solid;
}
.input-able-narrow {
  width: 66%;
  height: 38px;
  margin: -1px 0 0 -11px;
  float: left;
}
.btn-sm {
  float: right;
  width: 70px;
  height: 40px;
  line-height: 40px;
  height: 40px;
  text-align: center;
  color: #fff;
  background-color: #FD671A;
  border-radius: 5px;
  margin: -1px -31px 0 0;
}
.btn {
  margin: 40px 15px 20px 15px;
  height: 40px;
  line-height: 40px;
  height: 40px;
  text-align: center;
  color: #fff;
  background-color: #FD671A;
  border-radius: 5px;
}

.titles {
  height: 50px;
  padding: 0 15px;
  background-color: #f0f0f0;
}
.titles ul {
  list-style-type: none;
  width: 25%;
  float: left;
  text-align: right;
  color: #333;
  padding-top: 5px;
}
.titles li {
  line-height: 20px;
  height: 20px;
}
.titles ul:nth-child(1) {
  text-align: left;
}

.content {
  position: absolute;
  top: 460px;
  bottom: 0;
  width: 100%;
  overflow-y: scroll;
}
.list {
  margin: 0 15px;
  border-bottom-color: #f0f0f0;
  border-bottom-style: solid;
}
.list ul {
  font-size: 14px;
  list-style-type: none;
  width: 25%;
  float: left;
  text-align: right;
  color: #666;
  padding: 13px 0;
}
.list li {
  line-height: 22px;
  height: 22px;
}
.list ul:nth-child(1) {
  text-align: left;
}
.list ul:nth-child(1) li:nth-child(1) {
  color: #333;
}
.list ul:nth-child(4) li:nth-child(1) {
  color: #FD671A;
}
.error-info, .no-data-info {
  text-align: center;
  font-size: 14px;
  color: #999;
  margin-top: 40px;
  line-height: 40px;
  height: 40px;
}
.no-more {
  text-align: center;
  font-size: 12px;
  color: #b3b3b3;
  line-height: 35px;
  height: 35px;
}

.jjdm-popup {
  width: 100%;
  text-align: center
}
.jjdm-popup .title {
  line-height: 50px;
  height: 50px;
  font-size: 18px;
  color: #333;
  border-bottom-color: #f0f0f0;
  border-bottom-style: solid;
}
.limit-height {
  height: 400px;
  overflow-y: scroll;
}
.jjdm-popup li {
  position: relative;
  line-height: 50px;
  font-size: 16px;
  text-align: left;
  color: #666;
  padding: 0px 34px 0 15px;
  border-bottom-color: #f0f0f0;
  border-bottom-style: solid;
}
.jjdm-popup img {
  position: absolute;
  right: 0;
  height: 13px;
  margin: 19px 15px 0 0;
}
.jjdm-popup li:active {
  background-color: #f0f0f0;
}
</style>

<style>
/* 去掉 iphone 默认半透明点击效果 */
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  margin: 0;
  padding: 0;
}
.ios {
  border-width: 1px;
}
.android {
  border-width: 1.5px;
}
/*清除浮动*/
.clearfix:after{content:""; display:block; clear:both;}
.clearfix{zoom:1;}
</style>
