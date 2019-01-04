<template>
  <div class="dtsq">

    <pdf v-if="pdfInfo.open"
      :F362="F362"
      :mobSys="mobSys"
      :pdfInfo="pdfInfo"
      @pdf-all-read="pdfAllRead"/>
    <dos v-if="dosInfo.open"
      :mobSys="mobSys"
      :F110="F110"
      :F362="F362"/>

    <dlgInfo v-if="dlgInfo.open"
      :mobSys="mobSys"
      :title="dlgInfo.title"
      :content="dlgInfo.content"
      @info-btn01="infoBtn01"/>
    <!-- 加载提示 -->
    <loading v-if="loading"/>
  </div>
</template>

<script>
import tdxct from '../../lib/connect.js'
import dlgInfo from '../../components/dlgInfo'
import loading from '../../components/loading'
import dos from './dtsq/dos'
import pdf from './dtsq/prePdf'

export default {
  name: 'dtsq',
  components: {
    dlgInfo,
    loading,
    dos,
    pdf
  },
  data () {
    return {
      F362: 'Mobile.Stock.kfsjj.jjdtsq',
      mobSys: '',
      F110: '',
      loading: false,

      pdfInfo: {
        open: false,
        F149: '', // 获取请求 'PDF' 的 F1217
        F1217: '', // 获取 '签署' 的 F1217
        F1223: '', // 获取检查风险标志
        F1284: '' // 获取 F1284
      },
      dosInfo: {
        open: false
      },
      dlgInfo: {
        open: false,
        title: '',
        content: ''
      }
    }
  },
  created () {
    const _self = this
    window.setPartHeight = function () {}
    window.changeFontSize = function () {}
    /* 获取账户信息 */
    tdxct.tdxgetAccList(function (data) {
      console.log('dataAccs', data)
      _self.mobSys = tdxct.tdxCheckMobSys()
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

      _self.get198AData()
    })
  },
  mounted () {},
  methods: {
    /* 适当性判断 198 A */
    get198AData () {
      let _self = this
      this.loading = true
      let param198a = [{
        'F362': this.F362,
        'F1217': 'SDX.CHECK_RISK_ACCOUNT,'
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param198a['tdxPageID'] = '_Base64'
      console.log('param198a', param198a)
      tdxct.JYCallTql('198', param198a, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data198a = tdxct.FormatResult(data)
        console.log('data198a', data198a)
        switch (data198a.ErrorCode) {
          /* 安卓解析 -1，IOS解析 '-1' */
          case -1:
          case '-1':
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = data198a.ErrorInfo
            break
          case '0':
            _self.pdfInfo.open = true
            _self.pdfInfo.F149 = data198a.rows[0].F149
            _self.pdfInfo.F1217 = data198a.rows[0].F1217
            _self.pdfInfo.F1223 = data198a.rows[0].F1223
            _self.pdfInfo.F1284 = data198a.rows[0].F1284
            break
        }
      })
    },
    infoBtn01 (infoBtn01) {
      this.dlgInfo.open = infoBtn01
      tdxct.WEBCallTql('ReturnToSuperior', '', '') // 返回上一级页面
    },
    pdfAllRead (pdfAllRead) {
      this.pdfInfo.open = false
      this.dosInfo.open = pdfAllRead
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
