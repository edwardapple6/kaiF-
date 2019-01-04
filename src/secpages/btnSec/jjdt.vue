<template>
  <div class="jjdt">

    <!-- <div class="cont"> -->
      <!-- 表头 -->
      <div class="top">
        <div class="dtsq"
          @click="dtsqClicked">
          <img class="dtsq-pic" src="../../assets/dtsq.png" alt="申请">
          <img class="dtsq-more" src="../../assets/arrow-r.png" alt="更多">
          <div>定投申请</div>
        </div>
        <h1>我的定投</h1>
        <div class="titles clearfix">
          <ul v-for="title in titles"
            :key="title.index">
            <li :class="title.length === 1 ? 'tit-num1' : ''">{{ title[0] }}</li>
            <li v-if="title[1]">{{ title[1] }}</li>
          </ul>
        </div>
      </div>
      <!-- 有数据 -->
      <div class="div-lists">
        <div class="list"
          :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
          v-for="(list, p) in lists"
          :key="list.p"
          @click="listClicked(p)">
          <img :src="[list.isActive ? checkboxIsActive : checkboxDefault]"
            alt='isActive'>
          <div class="uls clearfix">
            <ul v-for="item in list.data"
              :key="item.q">
              <li :class="list.data.length === 1 ? 'list-num1' : ''">{{ item[0] }}</li>
              <li v-if="item[1]">{{ item[1] }}</li>
            </ul>
          </div>
        </div>
        <div class="no-more" v-if="noMore">没有更多数据了</div>
        <!-- 没有数据 -->
        <div class="error-info" v-if="ErrorInfo">{{ ErrorInfo }}</div>
        <div class="no-data-info" v-if="noDataInfo">{{ noDataInfo }}</div>
      </div>
    <!-- </div> -->

    <!-- 撤单按钮 -->
    <div class="action"
      v-if="hasAction">
      <div class="btn"
        @click="dtbgClicked">定投变更</div>
      <div class="btn"
        @click="dtcxClicked">定投撤销</div>
    </div>

    <dlgInfo v-if="dlgInfo.open"
      :mobSys="mobSys"
      :title="dlgInfo.title"
      :content="dlgInfo.content"
      @info-btn01="infoBtn01"/>

    <dlgConform v-if="dlgConform.open"
      :mobSys="mobSys"
      :title="dlgConform.title"
      :content="dlgConform.content"
      @conform-btn01="conformBtn01"
      @conform-btn02="conformBtn02"/>

    <!-- 加载提示 -->
    <loading v-if="loading"/>

  </div>

</template>

<script>
import config from '../../lib/config.js'
import tdxct from '../../lib/connect.js'
import dlgConform from '../../components/dlgConform'
import dlgInfo from '../../components/dlgInfo'
import checkboxDefault from '../../assets/radio_0.png'
import checkboxIsActive from '../../assets/radio_1.png'
import loading from '../../components/loading'

export default {
  name: 'jjdt',
  components: {
    dlgConform,
    dlgInfo,
    loading
  },
  data () {
    return {
      mobSys: '', // 手机系统
      POS2160: '',
      req2160: 0,
      titles: [],
      lists: [],
      noMore: false,
      checkedLists: [],
      checkboxDefault: checkboxDefault,
      checkboxIsActive: checkboxIsActive,

      chosenNum: 0,
      dlgConform: {
        open: false,
        title: '',
        content: [
          {
            tag: '操作类别：',
            value: '定投撤销'
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
      ErrorInfo: '',
      noDataInfo: '',
      hasAction: false,

      loading: false,

      submitted: false,
      done: false
    }
  },
  created () {
    const _self = this
    this.mobSys = tdxct.tdxCheckMobSys()
    window.tdxActivity = function () {
      _self.lists = []
      _self.get2160Data()
    }
    window.setPartHeight = function () {}
    window.changeFontSize = function () {}
  },
  mounted () {
    this.get2160Data()
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
    get2160Data () {
      let _self = this
      this.loading = true
      let param2160 = [{
        'F1286': this.POS2160,
        'F1288': 2
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param2160['tdxPageID'] = '_Base64'
      console.log('param2160', param2160)
      tdxct.JYCallTql('2160', param2160, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data2160 = tdxct.FormatResult(data)
        console.log('data2160', data2160)
        switch (data2160.ErrorCode) {
          case -1:
          case '-1':
            _self.titles = [
              ['基金名称', '基金代码'],
              ['定投周期', '定投金额'],
              ['开始日期', '结束日期'],
              ['处理日期', '处理状态']
            ]
            _self.ErrorInfo = data2160.ErrorInfo
            _self.req2160 = -1
            _self.noMore = false
            break
          case '0':
            _self.POS2160 = data2160.POS
            _self.req2160++
            if (data2160.Num === '0') {
              /* 获取 titles */
              let heads = JSON.parse(data2160.ErrorInfo).heads
              _self.titles = _self.getTitle(heads)
              /* 信息展示 */
              _self.noDataInfo = '没有相应的查询信息！'
            } else if (data2160.Num > 0) {
              let rows2160 = data2160.rows
              /* 获取 titles */
              if (_self.req2160 === 1) {
                let heads = JSON.parse(rows2160[0].F51).heads
                _self.titles = _self.getTitle(heads)
              }
              /* 信息展示 */
              let cells = JSON.parse(rows2160[0].F51).cells
              for (let i in rows2160) {
                let temObj = {
                  data: [
                    [rows2160[i][cells[0][0][0]], rows2160[i][cells[0][1][0]]],
                    [rows2160[i][cells[1][0][0]], rows2160[i][cells[1][1][0]]],
                    [rows2160[i][cells[2][0][0]], rows2160[i][cells[2][1][0]]]
                  ],
                  isActive: false,
                  F142: rows2160[i].F142, // 委托日期
                  F146: rows2160[i].F146, // 委托编号
                  F169: rows2160[i].F169, // 流水号
                  F426: rows2160[i].F426, // 基金公司代码
                  F449: rows2160[i].F449 // 每月扣款日
                }
                _self.lists.push(temObj)
              }
            }
            break
        }
        if (_self.POS2160 && _self.req2160 !== -1) _self.get2160Data()
        if (!_self.POS2160 && _self.req2160 > 0) {
          if (_self.lists.length > 0) {
            _self.noMore = true
            _self.hasAction = true
            _self.lists[0].isActive = true
          }
        }
      })
    },

    changeUrl (name, url) {
      let temUrl = config.link + url
      let tdxFuncParam = {
        OpenName: name,
        OpenType: 'native',
        OpenUrl: temUrl,
        OpenParam: config.OpenParam
      }
      tdxct.WEBCallTql('tdxOpenUrl', tdxFuncParam, '', '')
    },
    dtsqClicked () {
      this.changeUrl('定投申请', 'dtsq.html')
    },
    listClicked (_p) {
      for (let i in this.lists) {
        this.lists[i].isActive = false
      }
      this.lists[_p].isActive = true
      this.chosenNum = _p
    },
    dtbgClicked () {
      localStorage.setItem('myTemChosenInfo', JSON.stringify(this.lists[this.chosenNum]))
      this.changeUrl('定投变更', 'dtbg.html')
    },
    dtcxClicked () {
      this.dlgConform.open = true
      this.dlgConform.title = '提示'
      const temData = this.lists[this.chosenNum].data
      this.dlgConform.content[1].value = temData[0][0] // 基金代码
      this.dlgConform.content[2].value = temData[0][1] // 基金名称
      this.dlgConform.content[3].value = temData[1][1] + '元' // 定投金额
      this.dlgConform.content[4].value = temData[1][0] // 定投周期
      this.dlgConform.content[5].value = temData[2][0] // 开始日期
      this.dlgConform.content[6].value = temData[2][1] // 结束日期
    },
    conformBtn01 (conformBtn01) {
      this.dlgConform.open = conformBtn01
    },
    conformBtn02 (conformBtn02) {
      this.dlgConform.open = conformBtn02
      this.submitted = true
      this.get2132Data()
    },
    /* 基金定投撤单 */
    get2132Data () {
      const _self = this
      const temObj = this.lists[this.chosenNum]
      this.loading = true
      let param2132 = [{
        'F426': temObj.F426, // 基金公司代码
        'F402': temObj.data[0][1], // 基金代码
        'F169': temObj.F169 // 流水号
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param2132['tdxPageID'] = '_Base64'
      console.log('param2132', param2132)
      tdxct.JYCallTql('2132', param2132, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data2132 = tdxct.FormatResult(data)
        console.log('data2132', data2132)
        switch (data2132.ErrorCode) {
          case -1:
          case '-1':
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = data2132.ErrorInfo
            _self.done = false
            break
          case '0':
            _self.dlgInfo.open = true
            _self.dlgInfo.title = '提示'
            _self.dlgInfo.content = '委托已提交，合同号是：' + data2132.rows[0].F146
            _self.done = true
            break
        }
      })
    },
    /* 撤单结果显示 */
    infoBtn01 (infoBtn01) {
      this.dlgInfo.open = infoBtn01
      if (this.submitted) {
        this.submitted = false
        // 定投撤销成功，刷新；交易失败，不作操作
        if (this.done) {
          this.done = false
          this.lists = []
          this.get2160Data()
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top {
  position: fixed;
  width: 100%;
  background-color: #f0f0f0;
}
.dtsq {
  position: relative;
  height: 60px;
}
.dtsq-pic, .dtsq-more {
  position: absolute;
  top: 16px;
  height: 18px;
}
.dtsq-pic {
  left: 15px;
}
.dtsq-more {
  right: 15px;
}
.dtsq div {
  color: #333;
  font-size: 16px;
  line-height: 48px;
  padding: 2px 15px 0 43px;
  background-color: #fff;
}
h1 {
  color: #333;
  font-size: 16px;
  padding: 0 15px;
  line-height: 50px;
  font-weight: normal;
  background-color: #fff;
}
.titles {
  padding: 0 15px 0 50px;
  height: 50px;
  background-color: #f0f0f0;
}
.titles ul {
  font-size: 13px;
  list-style-type: none;
  width: 25%;
  float: left;
  text-align: right;
  color: #333;
  padding-top: 5px;
}
.titles ul:nth-child(2) {
  text-align: center;
}
.titles li {
  line-height: 20px;
  height: 20px;
}
.titles li.tit-num1 {
  line-height: 40px;
  height: 40px;
}
.titles ul:nth-child(1) {
  text-align: center;
  width: 50%;
}

.div-lists {
  position: absolute;
  top: 160px;
  bottom: 70px;
  width: 100%;
  overflow-y: scroll;
}
.list {
  margin: 0 15px;
  border-bottom-color: #f0f0f0;
  border-bottom-style: solid;
}
.list img {
  float: left;
  width: 15px;
  height: 15px;
  margin: 27px 20px 0 0;
}
.list .uls {
  margin-left: 35px;
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
.list li.list-num1 {
  line-height: 22px;
  height: 44px;
}
.list ul:nth-child(1) {
  text-align: center;
  width: 50%;
}
.list ul:nth-child(1) li:nth-child(1) {
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.list ul:nth-child(2) {
  text-align: center;
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

.action {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 70px;
  background-color: #ffffff;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 15px;
  align-items: center;
}
.btn {
  float: left;
  width: 167.5px;
  height: 40px;
  line-height: 40px;
  border-radius: 5px;
  color: #ffffff;
  background-color: #FD671A;
  font-size: 15px;
  text-align: center;
  margin: 10px 10px 0 0;
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
