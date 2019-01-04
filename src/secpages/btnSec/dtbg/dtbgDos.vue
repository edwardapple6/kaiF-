<template>
<!-- 20181227：定投金额可输入小数 -->
  <!-- 定投变更 组件 -->
  <div class="dtbfDos">

    <div class="sec01">
      <!-- 基金代码 -->
      <div class="item">
        <span class="span">{{ items.jjdm.tag }}</span>
        <input class="input-disable"
          type="text"
          :value="items.jjdm.value"
          readonly>
      </div>
      <!-- 只读信息 -->
      <div class="item"
        v-for="(item, index) in items.arr"
        :key="index">
        <span class="span">{{ items.arr[index].tag }}</span>
        <span class="unit">{{ items.arr[index].unit }}</span>
        <input class="input-disable"
          type="text"
          :value="items.arr[index].value"
          readonly>
      </div>
      <!-- 定投金额 -->
      <div class="item">
        <span class="span">{{ items.dtje.tag }}</span>
        <span class="unit">{{ items.dtje.unit }}</span>
        <input class="input-able"
          type="number"
          :placeholder="items.dtje.placeholder"
          v-model="items.dtje.value"
          :ref="items.dtje.ref"
          @keyup="dtjeKeyup">
      </div>
      <!-- 定投周期 -->
      <div class="item">
        <span class="span">{{ items.dtzq.tag }}</span>
        <img class="arrow-d" src="../../../assets/arrow-d.png" alt="更多">
        <input class="input-able"
          type="text"
          :placeholder="items.dtzq.placeholder"
          :value="items.dtzq.value"
          @click="chooseDate"
          readonly>
      </div>
      <mt-popup class="selector" position="bottom"
        v-model="items.dtzq.openSelector">
        <div class="title">请选择定投周期</div>
        <span class="close"
          @click="isClosed">取消</span>
        <span class="done"
          @click="isDone">完成</span>
        <mt-picker :slots="slots"
          @change="onValuesChange"></mt-picker>
      </mt-popup>
      <!-- 开始日期 -->
      <div class="item">
        <span class="span">{{ items.ksrq.tag }}</span>
        <input class="input-disable"
          type="text"
          :value="items.ksrq.value"
          readonly>
      </div>
      <!-- 结束日期 -->
      <div class="item">
        <span class="span">{{ items.jsrq.tag }}</span>
        <img class="arrow-d" src="../../../assets/arrow-d.png" alt="更多">
        <input class="input-able"
          type="text"
          :value="items.jsrq.value"
          @click="jsrqTime"
          readonly>
      </div>
      <mt-datetime-picker
        ref="jsrqPicker"
        type="date"
        v-model="items.jsrq.dateValue"
        :startDate="startDate"
        :endDate="endDate"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        @confirm="jsrqConfirm">
      </mt-datetime-picker>
    </div>

    <div class="btn" @click="conform">确定</div>

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
import tdxct from '../../../lib/connect.js'
import dlgConform from '../../../components/dlgConform'
import dlgInfo from '../../../components/dlgInfo'
import popupBtm from '../../../components/popupBtm'
import loading from '../../../components/loading'

export default {
  name: 'dtbfDos',
  components: {
    dlgConform,
    dlgInfo,
    popupBtm,
    loading
  },
  props: ['mobSys', 'F110', 'F362'],
  data () {
    return {
      chosenInfo: {},
      items: {
        jjdm: {
          tag: '基金代码',
          value: ''
        },
        arr: [
          {
            tag: '基金名称',
            value: ''
          },
          {
            tag: '基金净值',
            value: ''
          },
          {
            tag: '收费方式',
            value: '',
            F429: ''
          },
          {
            tag: '最低定投',
            value: '',
            unit: '元'
          }
        ],
        dtje: {
          tag: '定投金额',
          value: '',
          placeholder: '请输入每期定投金额',
          ref: 'dtje',
          unit: '元'
        },
        dtzq: {
          tag: '定投周期',
          value: '', // 显示字符串
          temValue: '',
          F449: '', // 每月扣款日
          placeholder: '请选择扣款日',
          openSelector: false
        },
        ksrq: {
          tag: '开始日期',
          value: ''
        },
        jsrq: {
          tag: '结束日期',
          value: '',
          dateValue: ''
        }
      },
      wantInfo: {
        F426: '' // 基金公司代码 2110
      },

      slots: [
        {
          flex: 1,
          values: ['每月'],
          className: 'slot1',
          textAlign: 'center',
          defaultIndex: 0
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日'],
          className: 'slot3',
          textAlign: 'center',
          defaultIndex: 14
        }
      ],

      dlgConform: {
        open: false,
        title: '',
        content: [
          {
            tag: '基金代码：',
            value: ''
          },
          {
            tag: '基金名称：',
            value: ''
          },
          {
            tag: '定投金额：',
            value: ''
          },
          {
            tag: '定投周期：',
            value: ''
          },
          {
            tag: '开始日期：',
            value: ''
          },
          {
            tag: '结束日期：',
            value: ''
          }
        ]
      },
      dlgInfo: {
        open: false,
        title: '',
        content: ''
      },
      popupBtm: {
        open: false,
        title: '请选择定投类型',
        content: [
          {
            txt: '设定结束日期',
            chosen: false
          },
          {
            txt: '设定金额累计上限',
            chosen: false
          },
          {
            txt: '设定成功次数上限',
            chosen: false
          }
        ]
      },
      loading: false,

      submitted: false,
      done: false,

      startDate: Date,
      endDate: Date
    }
  },
  created () {
    window.tdxActivity = function () {}
    window.setPartHeight = function () {}
    window.changeFontSize = function () {}
  },
  mounted () {
    const temStr = decodeURI(window.location).split('?')[1].split('&')[0].split('=')[1]
    const temChosenInfo = JSON.parse(temStr)
    console.log(temChosenInfo)
    console.log('temChosenInfo', temChosenInfo)
    this.chosenInfo = temChosenInfo
    /* 设置：结束日期 startDate endDate dateValue */
    this.startDate = this.getDateValue(this.chosenInfo.data[2][0])
    this.endDate = new Date(new Date().getFullYear() + 100, 11, 31)
    this.items.jsrq.dateValue = this.getDateValue(this.chosenInfo.data[2][1])
    /* 设定默认值：定投周期 选择器 */
    this.slots[2].defaultIndex = parseInt(this.chosenInfo.data[1][0].substring(2)) - 1
    this.get2110Data()
  },
  methods: {
    initTime () {

    },
    getDateValue (dateStr) {
      const y = parseInt(dateStr.substring(0, 4))
      const m = parseInt(dateStr.substring(4, 6)) - 1
      const d = parseInt(dateStr.substring(6, 8))
      return new Date(y, m, d)
    },
    jsrqTime () {
      this.$refs.jsrqPicker.open()
    },
    jsrqConfirm () {
      this.items.jsrq.value = this.formatDate(this.$refs.jsrqPicker.value)
    },
    // 时间格式转换
    formatDate (date) {
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    popupClicked (popCont) {
      // this.popupBtm.open = false
      // this.popupBtm.content = popCont
    },
    chooseDate () {
      this.items.dtzq.openSelector = true
    },
    onValuesChange (picker, values) {
      // TDX_ID_XT_MODE F1228 扣款周期:0--每月,1--每季,2--每天,3--每周，4-每双周
      this.items.dtzq.temValue = values[0] + values[1]
      this.items.dtzq.F449 = values[1].replace('日', '')
    },
    isClosed () {
      this.items.dtzq.openSelector = false
    },
    isDone () {
      this.items.dtzq.value = this.items.dtzq.temValue
      this.items.dtzq.openSelector = false
    },
    dtjeKeyup () {
      this.items.dtje.value = this.items.dtje.value.match(/^\d*(\.?\d{0,2})/g)[0]
      if (this.items.dtje.value.charAt(0) === '.') {
        this.items.dtje.value = '0' + this.items.dtje.value
      }
    },
    /* 在列表里：开放式基金信息查询 */
    get2110Data () {
      const _self = this
      this.loading = true
      let param2110 = [{
        'F110': this.F110,
        'F402': this.chosenInfo.data[0][1] // 基金代码
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param2110['tdxPageID'] = '_Base64'
      console.log('param2110', param2110)
      tdxct.JYCallTql('2110', param2110, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data2110 = tdxct.FormatResult(data)
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
            _self.items.jjdm.value = _self.chosenInfo.data[0][1] // 基金代码
            _self.items.arr[0].value = data2110.rows[0].F403 // 基金名称
            _self.items.arr[1].value = data2110.rows[0].F406 // 基金净值
            _self.items.arr[2].F429 = data2110.rows[0].F429 // 收费方式 待检验？？
            switch (data2110.rows[0].F429) {
              case '0':
              case '1':
                _self.items.arr[2].value = '前端收费'
                break
              case '2':
                _self.items.arr[2].value = '后端收费'
                break
            }
            _self.items.arr[3].value = data2110.rows[0].F322 // 最低定投/所需金额
            let temStr = _self.chosenInfo.data[1][1]
            _self.items.dtje.value = temStr.substring(0, temStr.indexOf('.')) // 定投金额
            _self.items.dtzq.value = _self.chosenInfo.data[1][0] // 定投周期
            _self.items.ksrq.value = _self.formatDateStr(_self.chosenInfo.data[2][0]) // 开始日期
            _self.items.jsrq.value = _self.formatDateStr(_self.chosenInfo.data[2][1]) // 结束日期
            _self.wantInfo.F426 = data2110.rows[0].F426 // 基金公司代码
            break
        }
      })
    },
    // 时间格式转换
    formatDateStr (dateStr) {
      const y = dateStr.substring(0, 4)
      const m = dateStr.substring(4, 6)
      const d = dateStr.substring(6, 8)
      return y + '-' + m + '-' + d
    },
    conform () {
      let dtjeValue = this.items.dtje.value // 定投金额
      /* 提示信息 */
      if (!dtjeValue) {
        this.dlgInfo.open = true
        this.dlgInfo.title = '提示'
        this.dlgInfo.content = '请输入正确的每期定投金额！'
      } else {
        /* 弹窗确认 */
        this.openDlgConform()
      }
    },
    infoBtn01 (infoBtn01) {
      this.dlgInfo.open = infoBtn01
      let jjdmValue = this.items.jjdm.value // 基金代码
      let dtjeValue = this.items.dtje.value // 定投金额
      if (!jjdmValue || jjdmValue.length < 6) {
        this.$refs.jjdm.focus()
      }
      if (jjdmValue.length === 6 && !dtjeValue) {
        this.$refs.dtje.focus()
      }
      // 2130提交
      if (this.submitted) {
        this.submitted = false
        // 交易成功，返回上一级；交易失败，不作操作
        if (this.done) {
          this.done = false
          /* 返回上一级 */
          tdxct.WEBCallTql('ReturnToSuperior', '', '') // 返回上一级页面
        }
      }
    },
    openDlgConform () {
      /* 弹窗确认 */
      this.dlgConform.open = true
      this.dlgConform.title = '请确认交易'
      this.dlgConform.content[0].value = this.items.jjdm.value // 基金代码
      this.dlgConform.content[1].value = this.items.arr[0].value // 基金名称
      this.dlgConform.content[2].value = this.items.dtje.value + '元' // 定投金额
      this.dlgConform.content[3].value = this.items.dtzq.value // 定投周期
      this.dlgConform.content[4].value = this.items.ksrq.value // 开始日期
      this.dlgConform.content[5].value = this.items.jsrq.value // 结束日期
    },
    conformBtn01 (conformBtn01) {
      this.dlgConform.open = conformBtn01
    },
    conformBtn02 (conformBtn02) {
      const _self = this
      this.dlgConform.open = conformBtn02
      this.submitted = true
      /* 表单提交 */
      this.loading = true
      let param2130 = [{
        'F362': this.F362,
        'F110': this.F110, // 委托方式
        'F426': this.wantInfo.F426, // 基金公司代码
        'F402': this.items.jjdm.value, // 基金代码
        'F405': this.items.dtje.value, // 交易金额
        'F126': this.items.ksrq.value.replace(/-/g, ''), // 开始日期
        'F127': this.items.jsrq.value.replace(/-/g, ''), // 结束日期
        'F449': this.items.dtzq.F449, // 每月扣款日1-28/每周扣款日1-5
        'F113': '1', // 操作标志 0：登记 1：变更
        'F429': this.items.arr[2].F429, // 收费方式
        'F234': '0', // 类型/期满种类/定投类型
        // 'F1227': '', // 参数(期满参数:TDX_ID_LX=1--表示成功次数最大限值,TDX_ID_LX=2--表示成功金额最大限值)
        'F1228': '0', // 模式/扣款周期 TDX_ID_XT_MODE F1228 扣款周期:0--每月,1--每季,2--每天,3--每周，4-每双周
        'F142': this.chosenInfo.F142, // 委托日期
        'F146': this.chosenInfo.F146, // 委托编号
        'F169': this.chosenInfo.F169 // 流水号
        // 'F1223': '0' // 检查风险标志 走198，不需要了
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param2130['tdxPageID'] = '_Base64'
      console.log('param2130', param2130)
      tdxct.JYCallTql('2130', param2130, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data2130 = tdxct.FormatResult(data)
        console.log('data2130', data2130)
        switch (data2130.ErrorCode) {
          /* 安卓解析 -1，IOS解析 '-1' */
          case -1:
          case '-1':
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = data2130.ErrorInfo
            _self.done = false
            break
          case '0':
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = '委托已提交，合同号是：' + data2130.rows[0].F146
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
  font-size: 14px;
}
.span {
  line-height: 40px;
  height: 40px;
  color: #666;
  /* margin-right: 10px; */
}
input {
  /* width: 257px; */
  font-size: 14px;
  width: 68%;
  height: 38px;
  color: #666;
  float: right;
  padding: 0 30px 0 10px;
  border-radius: 5px;
  border: #dbdbdb 1px solid;
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
  border: #FD671A 1px solid;
}
input.input-disable {
  border: #f0f0f0 1px solid;
}
.unit {
  position: absolute;
  right: 10px;
  line-height: 40px;
  height: 40px;
  color: #666;
}
.arrow-d {
  position: absolute;
  right: 10px;
  height: 8px;
  margin: 16px 0;
}
.btn {
  font-size: 15px;
  margin: 40px 15px 0;
  height: 40px;
  line-height: 40px;
  height: 40px;
  text-align: center;
  color: #fff;
  background-color: #FD671A;
  border-radius: 5px;
}
.selector {
  width: 100%;
}
.selector .title {
  font-size: 18px;
  text-align: center;
  color: #333;
  line-height: 50px;
  height: 50px;
  border-bottom: #f0f0f0 1px solid;
}
.selector .close, .selector .done {
  font-size: 14px;
  position: absolute;
  color: #FD671A;
  line-height: 50px;
  top: 0;
  padding: 0 15px;
}
.selector .close {
  left: 0;
}
.selector .done {
  right: 0;
}
</style>
