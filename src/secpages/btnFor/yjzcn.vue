<template>
  <!-- 20181214_1114：需求变更，改版
       20190103_0934：可转份额、转换份额 调整为 整数 -->
  <div class="yjzcn">
    <div class="info_1">
      <div class="info_div"
        :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
        v-if="clickedInfo.F403">
        <span class="jjmc has-jjmc">{{ clickedInfo.F403 }}</span>
        <span class="jjdm">{{ clickedInfo.F402 }}</span>
      </div>
      <div class="info_div"
        :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
        v-else>
        <span class="jjmc no-jjmc">{{ clickedInfo.placeholder }}</span>
      </div>
    </div>

    <div  class="info_2">
      <span class="zj-label">折价</span>
      <span class="zj-value"
        :class="[
          parseFloat(clickedInfo.discount) > 0 ? 'positive' : parseFloat(clickedInfo.discount) < 0 ? 'negative' : 'default',
          clickedInfo.discount === '- -' ? 'blank' : ''
        ]">{{ clickedInfo.discount }}</span>
      <div class="triangle"></div>
    </div>

    <div class="detail clearfix"
      v-show="true">
      <div class="left">
        <p class="p1">
          <span class="default">单位净值：</span>
          <span :class="[clickedInfo.F406 === '- -' ? 'blank' : 'default']">{{clickedInfo.F406}}</span>
        </p>
        <p class="p2">{{ clickedInfo.F406Date }}</p>
      </div>
      <div class="right">
        <p class="p1">
          <span class="default">最新：</span>
          <span :class="[clickedInfo.F203 === '- -' ? 'blank' : 'default']">{{clickedInfo.F203}}</span>
        </p>
        <p class="p2">{{ clickedInfo.F203Date }}</p>
      </div>
    </div>

    <div class="info_4 clearfix">
      <div class="left">
        <span class="label" ref="Convertible_1">可转份额</span>
        <span class="value" ref="Convertible_2"
          :class="[
            parseFloat(clickedInfo.F410) > 0 ? 'positive' : 'default',
            clickedInfo.F410 === '- -' ? 'blank' : ''
          ]">{{ clickedInfo.F410 }}</span>
      </div>
      <div class="right">
        <div class="regulate" ref="Convertible_3">
          <span class="subtract"
            @click="subtract(clickedInfo)">-</span>

          <!-- <input type="number" -->
          <input type="tel"
            :placeholder="clickedInfo.opeNumPlaHod"
            v-model="clickedInfo.opeNum"
            :readonly="clickedInfo.F410 === '- -' ? true : false"
            @keyup="zhfeKeyup(clickedInfo)"
            ref="zhfe">
          <span class="add"
            @click="add(clickedInfo)">+</span>
        </div>
      </div>
    </div>
    <!-- <div style="fontSize: 18px;">测试{{ clickedInfo.opeNum }}</div> -->

    <div class="yjzcn-btn"
      @click="conform">一键转场内</div>
    <p class="alertMsg">申请提交后，请于2个工作日后查询持仓</p>

    <!-- 持仓查询 -->
    <div class="titles">
      <ul v-for="title in titles"
        :key="title.index">
        <li>{{ title[0] }}</li>
        <li>{{ title[1] }}</li>
      </ul>
    </div>

    <div class="content">
      <div class="list clearfix"
        :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
        v-for="list in lists"
        :key="list.index"
        @click="get2542Data(list)">
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

    <firDlgInfo v-if="firDlgInfo.open"
      :content="firDlgInfo.content"
      @firDlg-btn01="firDlgBtn01"
      @firDlg-btn02="firDlgBtn02"/>

    <callDlgInfo v-if="callDlgInfo.open"
      :title="callDlgInfo.title"
      :content="callDlgInfo.content"
      :callInfo="callDlgInfo.callInfo"
      @callDlg-btn01="callDlgBtn01"
      @callDlg-btn02="callDlgBtn02"/>

    <dlgInfo v-if="dlgInfo.open"
      :title="dlgInfo.title"
      :content="dlgInfo.content"
      @info-btn01="infoBtn01"/>

    <dlgInfo2 v-if="dlgInfo2.open"
      :title="dlgInfo2.title"
      :content="dlgInfo2.content"
      @info2-btn01="info2Btn01"
      @info2-btn02="info2Btn02"/>

    <dlgConform v-if="dlgConform.open"
      :title="dlgConform.title"
      :content="dlgConform.content"
      @conform-btn01="conformBtn01"
      @conform-btn02="conformBtn02"/>

    <!-- 加载提示 -->
    <loading v-if="loading"/>
  </div>
</template>
<script>
import tdxct from '../../lib/connect.js'
import dlgConform from '../../components/dlgConform'
import dlgInfo from '../../components/dlgInfo'
import dlgInfo2 from '../../components/dlgInfo2'
import loading from '../../components/loading'
import firDlgInfo from './yjzcn/firDlgInfo'
import callDlgInfo from './yjzcn/callDlgInfo'

export default {
  name: 'yjzcn',
  components: {
    dlgConform,
    dlgInfo,
    dlgInfo2,
    loading,
    firDlgInfo,
    callDlgInfo
  },
  data () {
    return {
      mobSys: '', // 手机系统

      time2106: 0,

      POS2106: '',
      req2106: 0,
      titles: [],
      lists: [],

      clickedInfo: {
        placeholder: '请从下方持仓中选择转入场内的基金',
        F403: '', // 基金名称
        F402: '', // 基金代码
        // F204: '', // 浮动盈亏
        discount: '- -', // 折价 = 现价 / 基金净值 - 1
        F406: '- -', // 基金净值
        F406Date: '',
        F203: '- -', // 最新价
        F203Date: '',
        F410: '- -', // 可用份额
        opeNum: '',
        temOeNum: '',
        opeNumPlaHod: '',
        F426: '', // 基金公司代码
        F173: ''// 席位代码
      },

      noMore: false,
      errorInfo: '',
      noDataInfo: '',

      hasAction: false,
      allActive: false,

      dlgConform: {
        open: false,
        title: '',
        content: [
          {
            tag: '操作类别：',
            value: '一键转场内'
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
            tag: '转换份额：',
            value: ''
          }
        ]
      },
      firDlgInfo: {
        open: false,
        content: ''
      },
      callDlgInfo: {
        open: false,
        content: '',
        callInfo: [
          { tag: '营业部名称：', value: '' },
          { tag: '联系电话：', value: '' }
        ]
      },
      dlgInfo: {
        open: false,
        title: '',
        content: ''
      },
      dlgInfo2: {
        open: false,
        title: '',
        content: ''
      },
      loading: false,
      state: '' // '', 'noOpeNum', 'btnClicked', 'submitted', 'done'
    }
  },
  computed: {
  },
  created () {
    this.mobSys = tdxct.tdxCheckMobSys()

    // window.tdxActivity = function () {}
    window.setPartHeight = function () {}
    window.changeFontSize = function () {}
  },
  mounted () {
    this.get2106Data()
  },
  methods: {
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
      const _self = this
      this.lists = []
      this.noMore = false
      // this.loading = true
      let param2106 = [{
        'F362': 'Mobile.Stock.kfsjj.yjzcn',
        'F1286': this.POS2106,
        'F1288': 100
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param2106['tdxPageID'] = '_Base64'
      console.log('param2106', param2106)
      tdxct.JYCallTql('2106', param2106, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data2106 = tdxct.FormatResult(data)
        console.log('data2106', data2106)
        switch (parseInt(data2106.ErrorCode)) {
          /* 安卓解析 -1，IOS解析 '-1' */
          case -1:
            _self.titles = [
              ['基金名称', '基金代码'],
              ['持有份额', '可用份额'],
              ['昨日净值', '成本'],
              ['盈亏金额', '市值']
            ]
            _self.errorInfo = data2106.ErrorInfo
            _self.req2106 = -1
            break
          case 0:
            _self.POS2106 = data2106.POS
            _self.req2106++
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
                  F426: rows2106[i].F426, // 基金公司代码
                  F125: rows2106[i].F125, // 账号类别（2542：F125要送，F123可以不送）
                  chosen: false
                }
                _self.lists.push(temObj)
              }
              _self.noMore = true
            }
            break
        }
        if (_self.POS2106 && _self.req2106 !== -1) _self.get2106Data()
        if (!_self.POS2106 && _self.req2106 > 0) {
          if (++_self.time2106 === 1) {
            _self.firDlgInfo.open = true
            // eslint-disable-next-line
            _self.firDlgInfo.content = infoConf.firInfo
          }
        }
      })
    },
    firDlgBtn01 (firDlgBtn01) {
      this.firDlgInfo.open = firDlgBtn01
      tdxct.ReturnToSuperior()
    },
    firDlgBtn02 (firDlgBtn02) {
      this.firDlgInfo.open = firDlgBtn02
    },
    subtract (_info) {
      if (_info.F403) {
        if (--_info.opeNum === 0) {
          _info.opeNum = ''
        }
      }
    },
    add (_info) {
      if (_info.F403) {
        _info.opeNum++
        if (_info.opeNum > _info.F410) {
          _info.opeNum = _info.F410
        }
      }
    },
    zhfeKeyup (_info) {
      _info.opeNum = _info.opeNum.replace(/[^0-9]/ig, '')
    },
    yesterday () {
      let date = new Date()
      date.setTime(date - 24 * 60 * 60 * 1000)
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    nowTime () {
      const date = new Date()
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let min = date.getMinutes()
      min = min < 10 ? '0' + min : min
      let s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s
    },
    get2542Data (_list) {
      /* 初始化 */
      this.clickedInfo = {
        placeholder: '请从下方持仓中选择转入场内的基金',
        F403: '', // 基金名称
        F402: '', // 基金代码
        // F204: '', // 浮动盈亏
        discount: '- -', // 折价 = 现价 / 基金净值 - 1
        F406: '- -', // 基金净值
        F406Date: '',
        F203: '- -', // 最新价
        F203Date: '',
        F410: '- -', // 可用份额
        opeNum: '',
        temOeNum: '',
        opeNumPlaHod: '',
        F426: '', // 基金公司代码
        F173: ''// 席位代码
      }
      const _self = this
      this.loading = true
      let param2542 = [{
        F362: 'Mobile.Stock.kfsjj.yjzcn',
        F125: _list.F125, // 账号类别
        // F123: '0120961781',
        F426: _list.F426, // 基金公司代码
        F402: _list.data[0][1] // 基金代码
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param2542['tdxPageID'] = '_Base64'
      console.log('param2542', param2542)
      tdxct.JYCallTql('2542', param2542, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data2542 = tdxct.FormatResult(data)
        console.log('data2542', data2542)
        switch (parseInt(data2542.ErrorCode)) {
          /* 安卓解析 -1，IOS解析 '-1' */
          case -1:
            if (data2542.ErrorInfo.indexOf('证券代码表记录不存在') !== -1) {
              _self.dlgInfo.open = true
              _self.dlgInfo.title = '提示'
              _self.dlgInfo.content = '该基金无法转入场内。'
            } else if (data2542.ErrorInfo.indexOf('请联系您的开户营业部') !== -1) {
              _self.callDlgInfo.open = true
              const temStr = data2542.ErrorInfo
              let a = temStr.indexOf('（')
              let b = temStr.indexOf('）')
              let temStr1 = temStr.substring(0, a)
              let temStr2 = temStr.substring(a + 1, b)

              let c = temStr2.indexOf('，')
              let temStr2a = temStr2.substring(0, c)
              let temStr2b = temStr2.substring(c + 1)
              _self.callDlgInfo.content = temStr1
              _self.callDlgInfo.callInfo[0].value = temStr2a
              _self.callDlgInfo.callInfo[1].value = temStr2b
            } else {
              _self.dlgInfo.open = true
              _self.dlgInfo.title = '提示'
              _self.dlgInfo.content = data2542.ErrorInfo
            }
            break
          case 0:
            /* 读取信息 */
            _self.clickedInfo.F403 = _list.data[0][0] // 基金名称
            _self.clickedInfo.F402 = _list.data[0][1] // 基金代码
            _self.clickedInfo.F406 = _list.data[2][0] // 基金净值
            _self.clickedInfo.F406Date = _self.yesterday()
            _self.clickedInfo.F410 = parseInt(_list.data[1][1]) // 可用份额
            _self.clickedInfo.opeNum = parseInt(_list.data[1][1])
            _self.clickedInfo.opeNumPlaHod = '转换份额'
            _self.clickedInfo.F426 = _list.F426 // 基金公司代码
            /* 后台返回信息 */
            const temF203 = data2542.rows[0].F203 // 最新价
            _self.clickedInfo.F203 = temF203
            _self.clickedInfo.F203Date = _self.nowTime()
            _self.clickedInfo.F173 = data2542.rows[0].F173 // 席位代码
            _self.clickedInfo.discount = Math.round((temF203 / _self.clickedInfo.F406 - 1) * 10000) / 100 + '%' // 折价 = 现价 / 基金净值 - 1
            break
        }
      })
    },
    callDlgBtn01 (callDlgBtn01) {
      this.callDlgInfo.open = callDlgBtn01
    },
    callDlgBtn02 (cellnumb) {
      this.callDlgInfo.open = false
      let temNumb = cellnumb.replace(/[^0-9]/ig, '')
      tdxct.xcCallTel(temNumb)
    },
    conform () {
      if (!this.clickedInfo.F403) {
        this.dlgInfo.open = true
        this.dlgInfo.title = '提示'
        this.dlgInfo.content = '请从下方持仓中选择转入场内的基金'
      } else {
        if (!this.clickedInfo.opeNum) {
          this.state = 'noOpeNum'
          this.dlgInfo.open = true
          this.dlgInfo.title = '提示'
          this.dlgInfo.content = '请输入转换份额'
        } else if (this.clickedInfo.opeNum > this.clickedInfo.F410) {
          this.state = 'noOpeNum' // 提醒用户修改转换份额
          this.dlgInfo.open = true
          this.dlgInfo.title = '提示'
          this.dlgInfo.content = '转换份额不能大于可转份额'
        } else {
          /* 点击委托 */
          this.state = 'btnClicked'
          /* 风险提示 */
          this.dlgInfo.open = true
          this.dlgInfo.title = '温馨提示'
          // eslint-disable-next-line
          this.dlgInfo.content = infoConf.riskInfo
        }
      }
    },
    conformBtn01 (conformBtn01) {
      this.dlgConform.open = conformBtn01
    },
    conformBtn02 (conformBtn02) {
      this.dlgConform.open = conformBtn02
      this.get2540Data()
    },
    get2540Data () {
      const _self = this
      this.loading = true
      let param2540 = [{
        F362: 'Mobile.Stock.kfsjj.yjzcn',
        F426: this.clickedInfo.F426, // 基金公司代码
        F402: this.clickedInfo.F402, // 基金代码
        // F113: '1',
        F144: this.clickedInfo.opeNum, // 委托数量
        F173: this.clickedInfo.F173 // 席位代码
        // F242: '98'
        // F242: 'DA0002'
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param2540['tdxPageID'] = '_Base64'
      console.log('param2540', param2540)
      tdxct.JYCallTql('2540', param2540, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data2540 = tdxct.FormatResult(data)
        console.log('data2540', data2540)
        switch (parseInt(data2540.ErrorCode)) {
          case -1:
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = data2540.ErrorInfo
            _self.state = 'failed'
            break
          case 0:
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = '委托已提交，合同号是：' + data2540.rows[0].F146
            _self.state = 'done'
            break
        }
      })
    },
    /* 委托结果显示 */
    infoBtn01 (infoBtn01) {
      this.dlgInfo.open = infoBtn01
      switch (this.state) {
        case 'noOpeNum':
          this.$refs.zhfe.focus()
          break
        case 'btnClicked':
          /* 弹窗确认 */
          this.dlgConform.open = true
          this.dlgConform.title = '请确认交易'
          this.dlgConform.content[1].value = this.clickedInfo.F402 // 基金代码
          this.dlgConform.content[2].value = this.clickedInfo.F403 // 基金名称
          this.dlgConform.content[3].value = this.clickedInfo.opeNum // 转换份额
          this.state = ''
          break
        case 'failed':
          this.state = ''
          break
        case 'done':
          /* 初始化 */
          this.clickedInfo = {
            placeholder: '请从下方持仓中选择转入场内的基金',
            F403: '', // 基金名称
            F402: '', // 基金代码
            // F204: '', // 浮动盈亏
            discount: '- -', // 折价 = 现价 / 基金净值 - 1
            F406: '- -', // 基金净值
            F406Date: '',
            F203: '- -', // 最新价
            F203Date: '',
            F410: '- -', // 可用份额
            opeNum: '',
            temOeNum: '',
            opeNumPlaHod: '',
            F426: '', // 基金公司代码
            F173: ''// 席位代码
          }
          this.state = ''
          this.req2106 = 0
          this.get2106Data()
          break
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  font-size: 0;
}
li {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.positive {
  color: #fd671a;
}
.negative{
  color: #22bd22;
}
.default{
  color: #333333;
}
.blank {
  color: #999999;
}

.info_1 {
  padding: 0 15px;
}
.info_div, .info_2 {
  position: relative;
}
.info_div {
  border-bottom-style: solid;
  border-bottom-color: #f0f0f0;
}
.jjmc, .jjdm {
  font-size: 16px;
  display: inline-block;
  line-height: 50px;
  height: 50px;
}
.has-jjmc {
  color: #333333;
  width: 285px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.no-jjmc {
  color: #999999;
}
.jjdm {
  position: absolute;
  right: 0;
  width: 60px;
  text-align: right;
  color: #333333;
}

.zj-label, .zj-value {
  line-height: 50px;
  height: 50px;
  font-size: 16px;
}
.zj-label {
  margin: 0 5px 0 15px;
  color: #333;
}

.left, .right {
  float: left;
  width: 50%;
}
.triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 7px 11px 7px;
  border-color: transparent transparent #f0f0f0 transparent;
  position: absolute;
  top: 40px;
  left: 24px;
}

.detail {
  background-color: #f0f0f0;
  height: 50px;
}
.p1 {
  margin: 5px 0 0 15px;
}
.p1, .p1 span {
  font-size: 14px;
  line-height: 20px;
  height: 20px;
}
.p2 {
  padding-top: 2px;
  margin: 0 0 0 15px;
  font-size: 12px;
  color: #999999;
  line-height: 20px;
  height: 20px;
}

.info_4 {
  padding-top: 5px;
  position: relative;
}
.label, .value {
  line-height: 50px;
  height: 50px;
}
.label {
  margin: 0 5px 0 15px;
  font-size: 14px;
  color: #333;
}
.value {
  font-size: 16px;
  margin-right: 5px;
}

.regulate {
  width: 170px;
  height: 40px;
  margin: 5px 0;
  border-radius: 5px;
  background-color: #ff8f57;
  overflow: hidden;
}
.subtract, .add {
  float: left;
  height: 40px;
  line-height: 40px;
  width: 40px;
  background-color: #ff8f57;
  color: #fff;
  font-size: 30px;
  text-align: center;
}
input {
  float: left;
  border: 2px solid #ff8f57;
  height: 36px;
  width: 86px;
  font-size: 14px;
  /* line-height: 36px; */
  text-align: center;
  border-radius: 0px;
}

.yjzcn-btn {
  font-size: 15px;
  margin: 35px 15px 10px 15px;
  height: 40px;
  line-height: 40px;
  height: 40px;
  text-align: center;
  color: #fff;
  background-color: #FD671A;
  border-radius: 5px;
}
.alertMsg {
  color: #999999;
  font-size: 12px;
  text-align: center;
  padding-bottom: 20px;
  height: 20px;
  line-height: 20px;
}

.titles {
  height: 50px;
  padding: 0 15px;
  background-color: #f0f0f0;
}
.titles ul {
  width: 25%;
  float: left;
  text-align: right;
  color: #333;
  padding-top: 5px;
}
.titles li {
  font-size: 13px;
  line-height: 20px;
  height: 20px;
}
.titles ul:nth-child(1) {
  text-align: left;
}

.content {
  position: absolute;
  top: 380px;
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
  width: 25%;
  float: left;
  text-align: right;
  color: #666;
  padding: 13px 0;
}
.list li {
  font-size: 14px;
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
</style>

<style>
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  padding: 0;
  margin: 0;
}
ul, ol { list-style:none; }
.ios { border-width: 1px; }
.android { border-width: 1.5px; }
input {
  -webkit-appearance:none;
  outline: none;
}
input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { color:#b3b3b3; }
input:-moz-placeholder, textarea:-moz-placeholder { color:#b3b3b3; }
input::-moz-placeholder, textarea::-moz-placeholder { color:#b3b3b3; }
input:-ms-input-placeholder, textarea:-ms-input-placeholder { color:#b3b3b3; }
/*清除浮动*/
.clearfix:after{content:""; display:block; clear:both;}
.clearfix{zoom:1;}
</style>
