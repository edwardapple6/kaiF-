<template>
<!-- 20181228：购买金额可输入小数，去掉toast -->
  <div class="rgsg">

    <div class="sec01">
      <div class="item"
        v-for="(item, index) in items"
        :key="item.index">
        <span class="span fs14">{{ item.tag }}</span>

        <span class="unit fs14"
          v-if="(index > 4)">{{ item.unit }}</span>

        <!-- pattern="[0-9]*" -->
        <input class="input-able fs14"
          :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
          v-if="index === 0"
          type="tel"
          :placeholder="item.placeholder"
          v-model="item.value"
          :ref="item.ref"
          @keyup="jjdmKeyup"
          autofocus>

        <input class="input-disable fs14"
          :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
          v-if="(index > 0 && index < (items.length - 1))"
          type="text"
          :placeholder="item.placeholder"
          :value="item.value"
          readonly>

        <input class="input-able fs14"
          :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
          v-if="index === items.length - 1"
          type="number"
          :placeholder="item.placeholder"
          v-model="item.value"
          :ref="item.ref"
          @keyup="gmjeKeyup()"
          autofocus>
      </div>
    </div>

    <div class="btn fs15" @click="conform">确定</div>

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
import config from '../../lib/config.js'
import tdxct from '../../lib/connect.js'
import dlgConform from '../../components/dlgConform'
import dlgInfo from '../../components/dlgInfo'
import popupBtm from '../../components/popupBtm'
import loading from '../../components/loading'

export default {
  name: 'rgsg',
  components: {
    dlgConform,
    dlgInfo,
    popupBtm,
    loading
  },
  data () {
    return {
      mobSys: '',
      temRows2110: [],
      items: [
        {
          tag: '基金代码',
          value: '', // 产品代码
          placeholder: '请输入基金代码',
          ref: 'jjdm'
        },
        {
          tag: '基金名称', // 2110 F403
          value: ''
        },
        {
          tag: '风险等级', // 2110 F182
          value: ''
        },
        {
          tag: '基金净值', // 2110 F406
          value: ''
        },
        {
          tag: '基金状态',
          value: '' // 2110 F147 状态说明
        },
        {
          tag: '可用资金', // 2110 F301
          value: '',
          unit: '元'
        },
        {
          tag: '购买金额',
          value: '',
          placeholder: '请输入购买金额',
          ref: 'gmje',
          unit: '元'
        }
      ],

      POS2126: '',
      req2126: 0,
      lists2126: [
        // {
        //   F426: '', // 基金公司代码
        //   F417: '', // 基金账户
        // }
      ],
      wantInfo: {
        F426: '', // 2110 产品公司代码
        F425: '', // 2110 基金状态
        F400: '' // 交易标志 0:认购 1：申购 2：赎回 3:预约申购 4:预约赎回
      },
      dlgConform: {
        open: false,
        title: '',
        content: [
          {
            tag: '操作类别：',
            value: ''
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
            tag: '购买金额：',
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
        title: '请选择相应基金',
        content: [
          // {
          //   txt: '',
          //   chosen: true
          // }
        ]
      },
      loading: false,
      F110: '',

      submitted: false,
      done: false
    }
  },
  created () {
    const _self = this
    this.mobSys = tdxct.tdxCheckMobSys()
    window.tdxActivity = function () {
      _self.openDlgConform()
    }
    window.setPartHeight = function () {}
    window.changeFontSize = function () {}
  },
  mounted () {
    const _self = this
    this.$refs.jjdm[0].focus()
    /* 获取账户信息 */
    tdxct.tdxgetAccList(function (data) {
      console.log('dataAccs', data)
      let result = ''
      let usedAcc = ''
      if (_self.mobSys === 'IOS' || _self.mobSys === 'WEB-IOS') {
        /* IOS 一次性解析完全 */
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
    })
  },
  methods: {
    openDlgConform () {
      if (localStorage.getItem('myTemIsReadInfo')) {
        localStorage.removeItem('myTemIsReadInfo')
        /* 弹窗确认 */
        this.dlgConform.open = true
        this.dlgConform.title = '请确认交易'
        this.dlgConform.content[1].value = this.items[0].value // 基金代码
        this.dlgConform.content[2].value = this.items[1].value // 基金名称
        this.dlgConform.content[3].value = this.items[6].value + '元' // 认购金额
      }
    },
    /* 开放式基金帐号查询 */
    get2126Data () {
      const _self = this
      // this.loading = true
      let param2126 = [{
        'F110': this.F110,
        'F1286': this.POS2126,
        'F1288': 100
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param2126['tdxPageID'] = '_Base64'
      console.log('param2126', param2126)
      tdxct.JYCallTql('2126', param2126, { Way: 'qs' }, function (data) {
        // _self.loading = false
        let data2126 = tdxct.FormatResult(data)
        let rows2126 = data2126.rows
        console.log('data2126', data2126)
        switch (data2126.ErrorCode) {
          case -1:
          case '-1':
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = data2126.ErrorInfo
            _self.req2126 = -1
            break
          case '0':
            _self.POS2126 = data2126.POS
            _self.req2126++
            for (let i in rows2126) {
              let temArr = {
                F426: rows2126[i].F426, // 基金公司代码
                F417: rows2126[i].F417 // 基金账户
              }
              _self.lists2126.push(temArr)
            }
            break
        }
        if (_self.POS2126 && _self.req2126 !== -1) _self.get2126Data()
      })
    },
    jjdmKeyup () {
      /* type="tel"可以调出数字键盘 函数：只能输入数字 */
      this.items[0].value = this.items[0].value.replace(/[^0-9]/ig, '')
      /* index为0是，基金代码input执行 */
      if (this.items[0].value.length > 6) {
        this.items[0].value = this.items[0].value.slice(0, 6)
      } else if (this.items[0].value.length === 6) {
        this.$refs.jjdm[0].blur()
        this.get2110Data()
      } else {
        this.items[1].value = ''
        this.items[2].value = ''
        this.items[3].value = ''
        this.items[4].value = ''
        this.items[5].value = ''
      }
    },
    gmjeKeyup () {
      this.items[6].value = this.items[6].value.match(/^\d*(\.?\d{0,2})/g)[0]
      if (this.items[6].value.charAt(0) === '.') {
        this.items[6].value = '0' + this.items[6].value
      }
    },
    /* 不在列表里：可用资金查询 */
    get104Data () {
      const _self = this
      this.loading = true
      let param104 = [{
        'F110': this.F110, // 委托方式
        'F132': '-1', // 币种
        'F113': '-1' // 操作标志
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param104['tdxPageID'] = '_Base64'
      console.log('param104', param104)
      tdxct.JYCallTql('104', param104, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data104 = tdxct.FormatResult(data)
        console.log('data104', data104)
        switch (data104.ErrorCode) {
          case -1:
          case '-1':
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = data104.ErrorInfo
            break
          case '0':
            _self.items[5].value = data104.rows[0].F301 // 可用资金
            break
        }
      })
    },
    /* 在列表里：开放式基金信息查询 */
    get2110Data () {
      const _self = this
      this.loading = true
      let param2110 = [{
        'F110': this.F110,
        'F402': this.items[0].value
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param2110['tdxPageID'] = '_Base64'
      console.log('param2110', param2110)
      tdxct.JYCallTql('2110', param2110, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data2110 = tdxct.FormatResult(data)
        let rows2110 = data2110.rows
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
            /* 输入错误代码时：data2110.Num === '1'，字段均为空返回 */
            /* 同代码多基金，弹出底部弹窗 供用户选择 */
            if (data2110.Num === '1') {
              _self.getListInfo(rows2110[0])
            } else {
              _self.popupBtm.open = true // 弹出选择框
              for (let i in rows2110) {
                let temObj = {
                  txt: rows2110[i].F403,
                  chosen: false
                }
                if (i === '0') temObj.chosen = true
                _self.popupBtm.content.push(temObj)
              }
              _self.temRows2110 = rows2110
            }
            break
        }
      })
    },
    popupClicked (popCont) {
      this.popupBtm.open = false
      this.popupBtm.content = popCont
      for (let i in this.popupBtm.content) {
        if (this.popupBtm.content[i].chosen === true) {
          this.getListInfo(this.temRows2110[i])
          break
        }
      }
    },
    getListInfo (temObj) {
      this.items[1].value = temObj.F403 // 基金名称
      this.items[2].value = temObj.F182 // 风险说明->风险等级
      this.items[3].value = temObj.F406 // 基金净值
      this.items[4].value = temObj.F147 // 状态说明->基金状态
      /* 输入错误代码时，字段均为空返回（F402为空），发起 104 请求 */
      if (temObj.F402) {
        this.items[5].value = temObj.F301 // 可用资金
      } else {
        this.get104Data()
      }

      this.wantInfo.F426 = temObj.F426 // 基金公司代码
      this.wantInfo.F425 = temObj.F425 // 基金状态
    },
    conform () {
      const _self = this
      let jjdmValue = this.items[0].value
      let jjmcValue = this.items[1].value
      let gmjeValue = this.items[this.items.length - 1].value
      /* 判断是否输入基金代码 */
      if (!jjdmValue) {
        _self.dlgInfo.open = true
        _self.dlgInfo.title = '提示'
        _self.dlgInfo.content = '请输入基金代码！'
      }
      /* 判断基金代码位数 */
      if (jjdmValue.length < 6) {
        _self.dlgInfo.open = true
        _self.dlgInfo.title = '提示'
        _self.dlgInfo.content = '请输入完整的基金代码！'
      } else if (jjdmValue.length === 6) {
        if (!jjmcValue) {
          _self.dlgInfo.open = true
          _self.dlgInfo.title = '提示'
          _self.dlgInfo.content = '请确认输入的代码是否正确！'
        } else {
          if (!gmjeValue) {
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = '请输入正确的购买金额！'
          } else {
            _self.get198BData()
          }
        }
      }
    },
    /* 基金认购 适当性判断 */
    get198BData () {
      const _self = this
      /* 判断：认购、申购 */
      let temF362 = ''
      switch (this.wantInfo.F425) { // 基金状态
        /* 除了2 认购，其余状态均 申购 20181128 */
        case '2': // 认购期
          temF362 = 'Mobile.Stock.kfsjj.jjrg'
          this.items[4].F400 = '0' // 0:认购 1：申购 2：赎回 3:预约申购 4:预约赎回
          this.dlgConform.content[0].value = '基金认购' // 操作类别
          break
        default: // 开放期 停止赎回 及 其他状态
          temF362 = 'Mobile.Stock.kfsjj.jjsg'
          this.items[4].F400 = '1' // 0:认购 1：申购 2：赎回 3:预约申购 4:预约赎回
          this.dlgConform.content[0].value = '基金申购' // 操作类别
      }
      _self.loading = true
      let param198B = [{
        'F362': temF362,
        'F1217': 'SDX.CHECK_RISK_PRODUCTCODE,',
        'F391': _self.items[0].value, // 产品代码
        'F393': _self.wantInfo.F426 // 产品公司代码
      }]
      if (_self.mobSys === 'IOS' || _self.mobSys === 'WEB-IOS') param198B['tdxPageID'] = '_Base64'
      console.log('param198B', param198B)
      tdxct.JYCallTql('198', param198B, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data198B = tdxct.FormatResult(data)
        console.log('data198B', data198B)
        switch (data198B.ErrorCode) {
          case -1:
          case '-1':
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = data198B.ErrorInfo
            break
          case '0':
            switch (data198B.rows[0].F1223) {
              case '7':
                let myTemPdfInfo = {
                  'F362': temF362,
                  'F391': _self.items[0].value, // 产品代码
                  'F393': _self.wantInfo.F426, // 产品公司代码
                  'F149': data198B.rows[0].F149, // 获取请求 'PDF' 的 F1217
                  'F1217': data198B.rows[0].F1217, // 获取 '签署' 的 F1217
                  'F1223': data198B.rows[0].F1223, // 获取检查风险标志
                  'F1284': data198B.rows[0].F1284 // 获取F1284
                }
                localStorage.setItem('myTemPdfInfo', JSON.stringify(myTemPdfInfo))
                /* 跳转至 PDF 页面 */
                const temUrl = config.link + 'pdf.html'
                const temTitle = data198B.rows[0].F149.split('{T}')[1].split(',')[0]
                console.log('temUrl', temUrl)
                const tdxFuncParam = {
                  OpenName: temTitle,
                  OpenType: 'native',
                  OpenUrl: temUrl,
                  OpenParam: config.OpenParam
                }
                tdxct.WEBCallTql('tdxOpenUrl', tdxFuncParam, '', '')
                break
            }
            break
        }
      })
    },
    infoBtn01 (infoBtn01) {
      this.dlgInfo.open = infoBtn01
      let jjdmValue = this.items[0].value
      let gmjeValue = this.items[this.items.length - 1].value
      if (!jjdmValue || jjdmValue.length < 6) {
        this.$refs.jjdm[0].focus()
      }
      if (jjdmValue.length === 6 && !gmjeValue) {
        this.$refs.gmje[0].focus()
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
        }
      }
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
      let temF417 = ''
      for (let i in _self.lists2126) {
        if (_self.wantInfo.F426 === _self.lists2126[i].F426) {
          temF417 = _self.lists2126[i].F417
          break
        }
      }
      let param2100 = [{
        'F110': this.F110, // 委托方式
        'F426': this.wantInfo.F426, // 基金公司代码
        'F417': temF417, // 基金账户
        'F402': this.items[0].value, // 基金代码
        'F400': this.items[4].F400, // 交易标志
        'F405': this.items[this.items.length - 1].value, // 交易金额
        'F429': '-1' // 收费方式
        // 'F1223': '0' // 检查风险标志 走198，不需要了
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') {
        param2100['tdxPageID'] = '_Base64'
      }
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
  /* margin-right: 10px; */
}
input {
  /* width: 257px; */
  width: 68%;
  height: 38px;
  color: #666;
  float: right;
  padding: 0 30px 0 10px;
  border-radius: 5px;
  border-color: #dbdbdb;
  border-style: solid;
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
.unit {
  position: absolute;
  right: 10px;
  line-height: 40px;
  height: 40px;
  color: #666;
}
.btn {
  margin: 40px 15px;
  height: 40px;
  line-height: 40px;
  height: 40px;
  text-align: center;
  color: #fff;
  background-color: #FD671A;
  border-radius: 5px;
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
