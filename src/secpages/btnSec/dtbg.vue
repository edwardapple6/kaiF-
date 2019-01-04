<template>
  <div class="dtsq">

    <dtbgDos v-if="dtbgDosInfo.open"
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
import dtbgDos from './dtbg/dtbgDos'

export default {
  name: 'dtsq',
  components: {
    dlgInfo,
    loading,
    dtbgDos
  },
  data () {
    return {
      F362: 'Mobile.Stock.kfsjj.jjdtbg',
      mobSys: '',
      F110: '',
      loading: false,

      dtbgDosInfo: {
        open: true,
        F402: ''
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
    })
  },
  mounted () {},
  methods: {
    infoBtn01 (infoBtn01) {
      this.dlgInfo.open = infoBtn01
      tdxct.WEBCallTql('ReturnToSuperior', '', '') // 返回上一级页面
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
