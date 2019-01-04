<template>
  <div class="cxwt">

    <div class="cont">
      <!-- 表头 -->
      <div class="top">
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
    </div>
    <!-- 撤单按钮 -->
    <div class="action"
      v-if="hasAction">
      <div class="all-btn"
        :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
        @click="allBtnClicked">
        <img :src="[allActive ? checkboxIsActive : checkboxDefault]"
        alt='allActive'>
        <span>全选</span>
      </div>
      <div class="cd-btn"
        :class="[mobSys.indexOf('IOS') !== -1 ? 'ios' : 'android']"
        @click="cdBtnCliked">撤单</div>
    </div>

    <dlgInfo v-if="dlgInfo.open"
      :mobSys="mobSys"
      :title="dlgInfo.title"
      :content="dlgInfo.content"
      @info-btn01="infoBtn01"/>

    <dlgInfo2 v-if="dlgInfo2.open"
      :mobSys="mobSys"
      :title="dlgInfo2.title"
      :content="dlgInfo2.content"
      @info2-btn01="info2Btn01"
      @info2-btn02="info2Btn02"/>

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
import tdxct from '../../lib/connect.js'
import dlgConform from '../../components/dlgConform'
import dlgInfo from '../../components/dlgInfo'
import dlgInfo2 from '../../components/dlgInfo2'
import checkboxDefault from '../../assets/checkbox_0.png'
import checkboxIsActive from '../../assets/checkbox_1.png'
import loading from '../../components/loading'

export default {
  name: 'cxwt',
  components: {
    dlgConform,
    dlgInfo,
    dlgInfo2,
    loading
  },
  data () {
    return {
      mobSys: '', // 手机系统
      POS2108: '',
      req2108: 0,
      titles: [
        ['基金名称', '基金代码'],
        ['业务名称'],
        ['委托金额', '委托份额'],
        ['委托时间', '状态']
      ],
      lists: [
        // {
        //   data: [
        //     ['F403', 'F402'], // 基金名称，基金代码
        //     ['F306', 'F402'], // 业务名称
        //     ['F405', 'F414'], // 委托金额 交易金额，委托份额
        //     ['F143', 'F147'] // 委托时间，状态
        //   ],
        //   F426: '', // 基金公司代码
        //   F142: '', // 委托日期
        //   F146: '', // 委托编号
        //   isActive: ''
        // }
      ],
      noMore: false,
      checkedLists: [],
      succNum: 0,
      failNum: 0,
      hasSubmintted: false,
      checkboxDefault: checkboxDefault,
      checkboxIsActive: checkboxIsActive,

      allActive: false,

      dlgConform: {
        open: false,
        title: '',
        content: [
          {
            tag: '操作类别：',
            value: '基金撤单'
          },
          {
            tag: '买卖方向：',
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
            tag: '合同编号：',
            value: ''
          }
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
      ErrorInfo: '',
      noDataInfo: '',
      hasAction: false,

      loading: false,
      F110: ''
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
      _self.get2108Data()
    })
  },
  methods: {
    /* 查询协议 */
    get2108Data () {
      let _self = this
      this.loading = true
      /* 获取今天日期 */
      let temDate = new Date()
      let monthInfo = (temDate.getMonth() + 1).toString()
      let dateInfo = temDate.getDate().toString()
      if (monthInfo.length === 1) monthInfo = '0' + monthInfo
      if (dateInfo.length === 1) dateInfo = '0' + dateInfo
      let todayDate = temDate.getFullYear().toString() + monthInfo + dateInfo
      /* 送不送时间，返回结果一致 */
      let param2108 = [{
        'F362': 'Mobile.Stock.kfsjj.cxwt',
        'F110': this.F110,
        // 'F126': todayDate, // 开始日期
        // 'F127': todayDate, // 终止日期
        'F1286': this.POS2108,
        'F1288': 100
      }]
      if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param2108['tdxPageID'] = '_Base64'
      console.log('param2108', param2108)
      tdxct.JYCallTql('2108', param2108, { Way: 'qs' }, function (data) {
        _self.loading = false
        let data2108 = tdxct.FormatResult(data)
        console.log('data2108', data2108)
        switch (data2108.ErrorCode) {
          case -1:
          case '-1':
            _self.ErrorInfo = data2108.ErrorInfo
            _self.req2108 = -1
            _self.noMore = false
            break
          case '0':
            _self.POS2108 = data2108.POS
            _self.req2108++
            let rows2108 = data2108.rows
            for (let i in rows2108) {
              if (rows2108[i].F142 === todayDate) {
                let temObj = {
                  data: [
                    [rows2108[i].F403, rows2108[i].F402],
                    [rows2108[i].F306],
                    [rows2108[i].F405, rows2108[i].F414],
                    [rows2108[i].F143, rows2108[i].F147]
                  ],
                  F426: rows2108[i].F426,
                  F142: rows2108[i].F142,
                  F146: rows2108[i].F146,
                  isActive: false
                }
                _self.lists.push(temObj)
              }
            }
            break
        }
        if (_self.POS2108 && _self.req2108 !== -1) _self.get2108Data()
        if (!_self.POS2108 && _self.req2108 > 0) {
          if (_self.lists.length === 0) {
            _self.noDataInfo = '没有相应的查询信息！'
          } else {
            _self.noMore = true
            _self.hasAction = true
          }
        }
      })
    },
    listClicked (_p) {
      this.lists[_p].isActive = !this.lists[_p].isActive
      let temAllActive = true
      for (let i in this.lists) {
        if (!this.lists[i].isActive) {
          temAllActive = false
        }
      }
      this.allActive = temAllActive
    },
    allBtnClicked () {
      this.allActive = !this.allActive
      for (let i in this.lists) {
        this.lists[i].isActive = this.allActive
      }
    },
    cdBtnCliked () {
      let _self = this
      this.checkedLists = []
      let checkedNum = 0
      let lastIndex = 0
      for (let i in this.lists) {
        if (this.lists[i].isActive) {
          checkedNum++
          lastIndex = i
          _self.checkedLists.push(this.lists[i])
        }
      }
      if (!checkedNum) {
        _self.dlgInfo.open = true
        _self.dlgInfo.title = '提示'
        _self.dlgInfo.content = '请选择你要撤销的交易单！'
      } else if (checkedNum === 1) {
        _self.dlgConform.open = true
        _self.dlgConform.title = '提示'
        _self.dlgConform.content[1].value = _self.lists[lastIndex].data[1][0]
        _self.dlgConform.content[2].value = _self.lists[lastIndex].data[0][1]
        _self.dlgConform.content[3].value = _self.lists[lastIndex].data[0][0]
        _self.dlgConform.content[4].value = _self.lists[lastIndex].F146
      } else {
        _self.dlgInfo2.open = true
        _self.dlgInfo2.title = '提示'
        _self.dlgInfo2.content = '有 ' + _self.checkedLists.length + ' 笔委托需要提交，请确认！'
      }
      // this.allActive = temAllActive
    },
    /* 选中1个撤单 */
    conformBtn01 (conformBtn01) {
      this.dlgConform.open = conformBtn01
    },
    conformBtn02 (conformBtn02) {
      this.dlgConform.open = conformBtn02
      this.get2102Data()
    },
    /* 选中多个撤单 */
    info2Btn01 (info2Btn01) {
      this.dlgInfo2.open = info2Btn01
    },
    info2Btn02 (info2Btn02) {
      this.dlgInfo2.open = info2Btn02
      this.get2102Data()
    },
    /* 撤单结果显示 */
    infoBtn01 (infoBtn01) {
      this.dlgInfo.open = infoBtn01
      if (this.hasSubmintted) {
        this.lists = []
        this.get2108Data()
        this.allActive = false
        this.hasSubmintted = false
      }
    },
    /* 撤单协议 */
    get2102Data () {
      let _self = this
      this.succNum = 0
      this.failNum = 0
      let totalNum = 0
      let temErrorInfo = ''
      this.loading = true
      for (let i in _self.checkedLists) {
        let param2102 = [{
          'F110': this.F110, // 委托方式
          'F426': this.checkedLists[i].F426, // 基金公司代码
          'F402': this.checkedLists[i].data[0][1], // 基金代码
          'F142': this.checkedLists[i].F142, // 委托日期
          'F404': this.checkedLists[i].data[2][1], // 基金份额
          'F405': this.checkedLists[i].data[2][0], // 委托金额
          'F146': this.checkedLists[i].F146 // 委托编号
        }]
        if (this.mobSys === 'IOS' || this.mobSys === 'WEB-IOS') param2102['tdxPageID'] = '_Base64'
        console.log('param2102-' + i, param2102)
        tdxct.JYCallTql('2102', param2102, { Way: 'qs' }, function (data) {
          _self.loading = false
          let temStr = data.replace(/\\n/g, '').replace(/\\r/g, '').replace(/\\/g, '')
          let data2102 = tdxct.FormatResult(temStr)
          console.log('data2102-' + i, data2102)
          switch (data2102.ErrorCode) {
            case -1:
            case '-1':
              _self.failNum++
              temErrorInfo = data2102.ErrorInfo
              break
            case '0':
              _self.succNum++
              break
          }
          totalNum = _self.succNum + _self.failNum
          if (totalNum === _self.checkedLists.length) {
            _self.dlgInfo.title = '提示'
            if (_self.succNum === 0) {
              _self.dlgInfo.open = true
              _self.dlgInfo.content = '提交 ' + _self.checkedLists.length + ' 笔,失败 ' + _self.failNum + ' 笔<br>失败原因：' + temErrorInfo
            } else if (_self.failNum === 0) {
              _self.dlgInfo.open = true
              _self.dlgInfo.content = '提交 ' + _self.checkedLists.length + ' 笔,成功' + _self.succNum + ' 笔'
            } else {
              _self.dlgInfo.open = true
              _self.dlgInfo.content = '提交 ' + _self.checkedLists.length + ' 笔,成功 ' + _self.succNum + ' 笔,失败 ' + _self.failNum + ' 笔<br>失败原因：' + temErrorInfo
            }
          }
        })
      }
      this.hasSubmintted = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cont {
  margin-bottom: 46px;
}
.top {
  position: fixed;
  width: 100%;
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
  text-align: left;
}

.div-lists {
  padding-top: 50px;
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
  text-align: left;
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
  height: 46px;
  bottom: 0;
  position: fixed;
}
.all-btn, .cd-btn{
  float: left;
  text-align: center;
  font-size: 15px;
  line-height: 45px;
  height: 45px;
}
.all-btn {
  border-top-color: #f0f0f0;
  border-top-style: solid;
  width: 130px;
  color: #333;
  background-color: #fff;
}
.all-btn img {
  width: 15px;
  height: 15px;
  margin-bottom: -2px;
}
.cd-btn {
  width: 245px;
  border-top-color: #FD671A;
  border-top-style: solid;
  background-color: #FD671A;
  color: #fff;
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
