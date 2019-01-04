<template>
  <div id="app">
    <div id="top">
        <ul>
            <li class="top_li">
              <span>基金代码</span>
              <input type="tel" v-model="cxMsg" class="fs14 shfe" @keyup="telKeyup()" ref="jjdm">
              <span class="check" @click="checking">查询</span>
              <img v-show="isDelete" @click="msgDel" class="qxnr" src="../../../static/delete.png" alt="">
            </li>
        </ul>
    </div>
    <div id="content">
        <ul class="content_title">
            <li class="content_title_li" v-for="(data,index) in AlertTitle" :key="index">
              <span class="content_title_li_span_1">{{data.msg}}</span>
            </li>
        </ul>
        <ul class="content_ul">
          <li class="alertmsg" v-show="isAlertMsg">请输入基金代码查询！</li>
          <li class="content_ul_li" v-for="(data,index) in showData" :key="index" @click="Gojjxq(data)">
              <p class="content_ul_li_p">
                  <span class="content_ul_li_span_1">{{data.F401}}</span>
              </p>
              <p class="content_ul_li_p">
                  <span class="content_ul_li_span_1">{{data.F403}}</span>
              </p>
              <p class="content_ul_li_p">
                  <span class="content_ul_li_span_1">{{data.F5517}}</span>
              </p>
              <p class="content_ul_li_p">
                  <span class="content_ul_li_span_1">{{data.F147}}</span>
              </p>
          </li>
        </ul>
    </div>
    <AlertInfo
      :title='title'
      :content='content'
      v-show="isShow_1"
      @info-btn01='change'
    />
  </div>
</template>

<script>
import Botton from "../../components/mob-button";
import { pageURL } from "../../common/pageUrl.js";
import { jumpType } from "../../common/pageUrl.js";
import AlertInfo from "../../components/dlgInfo_01";
import tdxct from "../../lib/connect.js";
export default {
  name: "App",
  components: {
    AlertInfo
  },
  data() {
    return {
      msg: "确定",
      AlertTitle: [
        { msg: "基金公司" },
        { msg: "基金名称" },
        { msg: "风险等级" },
        { msg: "状态" }
      ],
      showData: [],//展示内容数据
      isDelete: false,//输入框中x显示隐藏
      cxMsg: "",//input内容
      title: "温馨提示：",//提示弹框标题
      content: [],
      isShow_1: false,//弹框是否显示
      AccInfoData: [],//账号信息内容
      isAlertMsg: true,
      mobsys:''
    };
  },
  created() {
    this.getAccInfo();
    this.mobsys = tdxct.tdxCheckMobSys()
  },
  methods: {
    telKeyup() {
      var _self = this;
      _self.cxMsg = _self.cxMsg.replace(/[^0-9]/gi, "");
      if (_self.cxMsg.length === 6) {
        _self.isDelete = true;
      } else if (_self.cxMsg.length > 6) {
        _self.cxMsg = _self.cxMsg.slice(0, 6);
      } else {
        _self.isDelete = false;
      }
    },
    msgDel() {
      this.cxMsg = "";
      this.isDelete = false;
    },
    //点击查询按钮
    checking() {
      var __self = this;
      if (__self.$refs.jjdm.value.length === 6) {
        __self.GetjjInfo()
        
      } else {
        __self.isShow_1 = true;
        __self.content = "您输入的代码长度不符合要求，请重新输入！";
        __self.cxMsg = "";
      }
    },
    change(e) {
      this.isShow_1 = e;
      console.log(e);
    },
    //获取账号信息
    getAccInfo(startdate, enddate) {
      var _self = this;
      tdxct.tdxgetAccList(function(data) {
        if (
          tdxct.tdxCheckMobSys() == "WEB-IOS" ||
          tdxct.tdxCheckMobSys() == "IOS"
        ) {
          var result = JSON.parse(data);
          for (var i in result) {
            if (result[i].HostType == 0) {
              _self.AccInfoData = result[i];
              break;
            }
          }
        } else if (
          tdxct.tdxCheckMobSys() == "WEB-Android" ||
          tdxct.tdxCheckMobSys() == "Android"
        ) {
          for (var i in data) {
            var result = JSON.parse(data[i]);
            if (result.HostType == 0) {
              console.log(result);
              _self.AccInfoData = result;
              break;
            }
          }
        }
      });
    },
    GetjjInfo() {
      var __self = this;
      var params = [
        { F110: __self.AccInfoData.WTFS },
        { F1207: "P" },
        { F113: "-1" },
        { F402: __self.$refs.jjdm.value }
      ];
      if(__self.mobsys === 'IOS' || __self.mobsys === 'WEB-IOS') params[0].tdxPageID = '_Base64'

      tdxct.JYCallTql("2116", params, { Way: "qs" }, function(data) {
        var result = tdxct.FormatResult(data);
        if (parseInt(result.ErrorCode) === 0 && parseInt(result.Num) >= 1) {
          console.log(result);
          var alldata = result.rows;
          var msgTitle = JSON.parse(alldata[0].F51).heads;
          var contentCells = JSON.parse(alldata[0].F51).cells;
          for(var idx in contentCells){
            contentCells[idx] = contentCells[idx][0][0]
          }
          for(var i in alldata){
            alldata[i].heads = msgTitle;
            alldata[i].cells = contentCells;
          }
          __self.showData = alldata;
          __self.isAlertMsg = false;
        } else if (parseInt(result.ErrorCode) === 0 &&parseInt(result.Num) === 0) {
          console.log(result);
          __self.isShow_1 = true;
          __self.content = "没有查到此基金，请检查输入的基金代码!";
        } else {
          __self.isShow_1 = true;
          __self.content = result.ErrorInfo;
        }
      });
    },
    Gojjxq(obj){
      var name = obj.F403;
      console.log(name);
      obj = JSON.stringify(obj)
      var url = pageURL.jjxqUrl + '?data=' + '{fg}' + obj + '{fg}'
      tdxct.WEBCallTql(
        "tdxOpenUrl",
        {
          OpenName: name,
          OpenType: "native",
          OpenUrl: url,
          OpenParam:jumpType
        },
        function() {}
      );
    }
  }
};
</script>

<style>
#top {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
* {
  padding: 0;
  margin: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-touch-callout:none;
  -webkit-user-select:none;
  -khtml-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
body {
  background-color: #fff;
  /* font-size:0px !important; */
}
ul {
  list-style: none;
}
</style>
<style scoped>
#top {
  padding: 23px 15px 0 15px;
}
#top li {
  height: 42px;
  margin-bottom: 10px;
}
input {
  width: 73%;
  height: 40px;
  color: #666;
  font-size: 14px;
  padding: 0 10px;
  border-radius: 5px;
  border: #dbdbdb 1.5px solid;
  background-color: #fff;
  outline: none;
  -webkit-appearance:none;
  outline: none;
  -webkit-user-select:text !important;/*ios上无法输入的问题*/
}

#top li span {
  color: #666;
  font-size: 14px;
  /* margin-right: 10px; */
}
#top .check {
  display: inline-block;
  background-color: #fd671a;
  color: #fff;
  font-size: 15px;
  font-family: PingFangSC-Regular;
  height: 40px;
  width: 70px;
  line-height: 40px;
  margin: 0;
  border-radius: 5px;
}
#top .shfe {
  width: 175px;
  height: 40px;
  margin-right: 10px;
}
/* 持仓 */
#content {
  /* margin-top: 40px; */
  position: absolute;
  top: 90px;
  left: 0;
  right: 0;
  bottom: 0;
}
.content_title {
  font-size: 0;
  background-color: #f0f0f0;
  height: 50px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.content_ul {
  position: absolute;
  top: 51px;
  left: 0;
  right: 0;
  bottom: 0;
}
.content_ul_li {
  border-bottom: 1.5px solid #f1f1f1;
}
.content_title_li,
.content_ul_li_p {
  height: 50px;
  font-size: 13px;
  display: inline-block;
  width: 25%;
  text-align: center;
  position: relative;
}
.content_ul_li_p {
  width: 24%;
  font-size: 14px;
}
.content_title_li span,
.content_ul_li_p span {
  display: block;
  height: 50px;
  line-height: 50px;
  width: 100%;
}
.content_ul_li_span_1 {
  color: #666;
}
.top_li {
  position: relative;
  -webkit-user-select:text !important;/*ios上无法输入的问题*/
}
.qxnr {
  width: 16px;
  height: 16px;
  position: absolute;
  top: 12px;
  right: 100px;
}
.alertmsg {
  width: 50%;
  height: 20px;
  font-size: 14px;
  color: #999;
  position: absolute;
  top: 20%;
  left: 50%;
  margin-left: -25%;
  text-align:center;
}
/*详情样式*/
/* .xqcontent_ul {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: scroll;
}
.xqcontent_ul_li {
  position: relative;
  height: 46px;
  margin-bottom: 1.5px;
  background-color: #fff;
}
.left {
  position: absolute;
  top: 0;
  left: 15px;
  height: 46px;
  line-height: 46px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
}
.right {
  position: absolute;
  top: 0;
  right: 15px;
  height: 46px;
  line-height: 46px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
}
.xqcontent_ul_li:nth-child(8) {
  margin-top: 11px;
} */
/*遮罩样式*/
/* #curtain {
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
} */
/* .curtain_content {
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 280px;
  margin-left: -140px;
  border-radius: 10px;
}
.curtain_title {
  height: 40px;
  line-height: 40px;
  width: 100%;
  font-size: 18px;
  color: #fd671a;
  border-bottom: 1.5px solid #999;
  text-align: center;
}
.curtain_ul {
  padding: 0 10px;
}
.curtain_ul_li {
  height: 40px;
  width: 100%;
  position: relative;
  border-bottom: 1.5px solid #f1f1f1;
}
.curtain_ul_li span {
  position: absolute;
  height: 40px;
  width: 50%;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  color: #999;
}
.curtain_ul_li span:nth-child(1) {
  top: 0;
  left: 0;
}
.curtain_ul_li span:nth-child(2) {
  top: 0;
  right: 0;
} */
</style>
