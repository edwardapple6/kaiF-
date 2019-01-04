<template>
  <div class="kfsjj">
    <div class="top">
      <div class="ccyk">{{ ccyk }}</div>
      <div class="ccyk-txt">持仓盈亏</div>
      <div class="wdjj"
        @click="clickWdjj">
        <span>我的基金</span>
        <img  src='../assets/arrow-wdjj.png' alt='更多'>
      </div>
    </div>
    <div class="sec01">
      <div class="btns01"
      :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']">
        <div class="btn01"
             v-for="(btn, index) in btnFir"
             @click="clickBtn01(index)"
             :key="btn.index">
             <img class="btn-pic01" :src=btn.src :alt=btn.txt>
             <span class="btn-txt01">{{ btn.txt }}</span>
        </div>
      </div>
      <div class="btns02">
        <div class="btn02"
            v-for="(btn, index) in btnSec"
            @click="clickBtn02(index)"
            :key="btn.index">
            <div class="btn02-wrap"
              :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']">
              <img class="btn-pic02" :src=btn.src :alt=btn.txt>
              <span class="btn-txt02">{{ btn.info }}</span>
            </div>
        </div>
      </div>
    </div>

    <div class="btns03">
      <div class="btn03"
          :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
          v-for="(btn, index) in btnThir"
          @click="clickBtn03(index)"
          :key="btn.index">
          <span class="btn-txt03">{{ btn.txt }}</span>
          <img class="btn-pic03" src='../assets/arrow-r.png' alt='更多'>
      </div>
    </div>

    <div class="btns03">
      <div class="btn04"
          :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
          v-for="(btn, index) in btnFor"
          @click="clickBtn04(index)"
          :key="btn.index">
          <span class="btn-txt03">{{ btn.txt }}</span>
          <img class="btn-pic03" src='../assets/arrow-r.png' alt='更多'>
      </div>
    </div>
    <dlgInfo v-if="dlgInfo.open"
      :title="dlgInfo.title"
      :content="dlgInfo.content"
      @info-btn01="infoBtn01"/>
    <!-- 加载提示 -->
    <loading v-if="loading"/>
  </div>
</template>

<script>
import config from '../lib/config.js'
import src01 from '../assets/shotcut01.png'
import src02 from '../assets/shotcut02.png'
import src03 from '../assets/shotcut03.png'
import src04 from '../assets/shotcut04.png'
import src05 from '../assets/shotcut05.png'
import src06 from '../assets/shotcut06.png'
import src07 from '../assets/shotcut07.png'
import tdxct from '../lib/connect.js'
import dlgInfo from '../components/dlgInfo'
import loading from '../components/loading'
import { sso } from '../common/JumpJudge.js'

export default {
  name: 'kfsjj',
  components: {
    dlgInfo,
    loading
  },
  data () {
    return {
      mobSys: '', // 手机系统
      ccyk: '', // 持仓盈亏
      loading: false,
      dlgInfo: {
        open: false,
        title: '',
        content: ''
      },
      F110: '',
      POS2106: '',
      aga2106: true,
      btnFir: [
        {
          src: src01,
          txt: '认购/申购',
          url: 'rgsg.html'
        },
        {
          src: src02,
          txt: '基金赎回',
          url: 'jjsh.html'
        },
        {
          src: src03,
          txt: '撤销委托',
          url: 'cxwt.html'
        }
      ],
      btnSec: [
        {
          src: src04,
          info: '开户',
          txt: '基金开户',
          url: 'kh.html'
        },
        {
          src: src05,
          info: '定投',
          txt: '基金定投',
          url: 'jjdt.html'
        },
        {
          src: src06,
          info: '分红',
          txt: '基金分红',
          url: 'fh.html'
        },
        {
          src: src07,
          info: '转换',
          txt: '基金转换',
          url: 'jjzh.html'
        }
      ],
      btnThir: [
        {
          txt: '委托查询',
          url: 'wtcx.html'
        },
        {
          txt: '成交查询',
          url: 'cjcx.html'
        },
        {
          txt: '基金账户查询',
          url: 'jjzhcx.html'
        },
        {
          txt: '基金代码查询',
          url: 'jjdmcx.html'
        }
      ],
      btnFor: [
        // {
        //   txt: '一键转场内',
        //   url: 'yjzcn.html'
        // },
        {
          txt: '风险测评',
          // url: 'fxcp.html'
        }
      ]
    }
  },
  created () {
    this.mobSys = tdxct.tdxCheckMobSys()
    window.tdxActivity = function () {}
    window.setPartHeight = function () {}
  },
  mounted () {
    let _self = this
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

      _self.get2106Data()
    })
  },
  methods: {
    get2106Data () {
      let _self = this
      /* 开放式基金份额查询 */
      this.loading = true
      this.aga2106 = true
      let param2106 = [{
        'F110': _self.F110,
        'F1286': this.POS2106,
        'F1288': 100
      }]
      /* UIConfig 中配置 Type="JyURL"，IOS 不用加（不加，LocalURL 解析为 -1） */
      if (_self.mobSys === 'IOS' || _self.mobSys === 'WEB-IOS') param2106['tdxPageID'] = '_Base64'
      console.log('param2106', param2106)
      tdxct.JYCallTql('2106', param2106, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data2106 = tdxct.FormatResult(data)
        console.log('data2106', data2106)
        switch (data2106.ErrorCode) {
          /* 安卓解析 -1，IOS解析 '-1' */
          case -1:
          case '-1':
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = data2106.ErrorInfo
            _self.aga2106 = false
            _self.ccyk = '-- --'
            break
          case '0':
            _self.POS2106 = data2106.POS
            _self.ccyk = 0
            for (let i in data2106.rows) {
              _self.ccyk = _self.ccyk + parseFloat(data2106.rows[i].F204)
            }
            _self.ccyk = _self.ccyk.toFixed(2)
            break
        }
        if (_self.POS2106 && _self.aga2106) _self.get2106Data()
      })
    },
    clickWdjj () {
      let temBtn = [
        {
          txt: '我的基金',
          url: 'wdjj.html'
        }
      ]
      this.changePage(0, temBtn)
    },
    clickBtn01 (index) {
      this.changePage(index, this.btnFir)
    },
    clickBtn02 (index) {
      this.changePage(index, this.btnSec)
    },
    clickBtn03 (index) {
      this.changePage(index, this.btnThir)
    },
    clickBtn04 (index) {
      sso('/ywbl/wande.do', '业务办理');
    },
    changePage (index, btnNum) {
      let temUrl = config.link + btnNum[index].url
      let tdxFuncParam = {
        OpenName: btnNum[index].txt,
        OpenType: 'native',
        OpenUrl: temUrl,
        OpenParam: config.OpenParam
      }
      tdxct.WEBCallTql('tdxOpenUrl', tdxFuncParam, '', '')
    },
    infoBtn01 (infoBtn01) {
      this.dlgInfo.open = infoBtn01
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 去掉 iphone 默认半透明点击效果 */
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.ios {
  border-width: 1px;
}
.android {
  border-width: 1.5px;
}
.top {
  background-color: #FD671A;
  text-align: center;
  color: #fff;
  position: relative;
}
.ccyk {
  font-size: 48px;
  line-height: 48px;
  height: 48px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 22px;
}
.ccyk-txt, .wdjj{
  font-size: 12px;
  line-height: 32px;
  height: 32px;
  padding-bottom: 12px;
}
.wdjj {
  position: absolute;
  right: 0;
  bottom: 0px;
  margin-right: 15px;
}
.wdjj img {
  height: 12px;
  margin-bottom: -1px;
}
.sec01 {
  background-color: #fff;
}
.btns01,
.btns02 {
  margin: 0 15px;
  color: #666;
}
.btns01 {
  border-bottom-color: #f1f1f1;
  border-bottom-style: solid;
  text-align: center;
}
.btn01 {
  display: inline-block;
  width: 33.33%;
  text-align: center;
}
.btn01:nth-child(2) {
  display: inline-block;
  width: 33.33%;
  text-align: center;
}
.btn-pic01 {
  display: block;
  margin: 16px auto;
  width: 36px;
}
.btn-txt01 {
  display: block;
  margin-bottom: 16px;
  font-size: 14px;
}

.btn02 {
  display: inline-block;
  width: 25%;
  text-align: center;
}
.btn02-wrap {
  margin: 15px 0;
  border-right-color: #f1f1f1;
  border-right-style: solid;
}
.btn02:nth-child(4) .btn02-wrap {
  border-right: none;
}
.btn-txt02 {
  font-size: 16px;
}
.btn-pic02 {
  width: 14px;
  margin-right: 10px;
}

.btns03 {
  margin: 10px 0;
  padding: 0 15px;
  color: #666;
  background-color: #fff;
}
.btn03, .btn04 {
  border-bottom-color: #f1f1f1;
  border-bottom-style: solid;
  padding: 15px 0;
}
.btn03:nth-child(4) {
  border-bottom: none;
}
.btn04:nth-child(2) {
  border-bottom: none;
}
.btn-txt03 {
  display: inline-block;
  line-height: 22px;
  height: 22px;
  font-size: 16px;
}
.btn-pic03 {
  float: right;
  margin: 3px 0;
  height: 16px;
}
</style>
