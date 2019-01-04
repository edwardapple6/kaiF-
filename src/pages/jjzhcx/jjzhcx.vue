<template>
  <div id="app">
    <div id="jjzhcx_content">
      <ul class="jjzhcx_ul_title">
        <li class="jjzhcx_ul_title_li li01">
          <span class="jjzhcx_ul_title_li_span_ywmc">{{Datatitle[0].val_1}}</span>
        </li>
        <li class="jjzhcx_ul_title_li li02">
          <span class="jjzhcx_ul_title_li_span_ywmc">{{Datatitle[1].val_1}}</span>
        </li>
        <li class="jjzhcx_ul_title_li li03">
          <span class="jjzhcx_ul_title_li_span_1">{{Datatitle[2].val_1}}</span>
          <span class="jjzhcx_ul_title_li_span_2">{{Datatitle[2].val_2}}</span>
        </li>
        <li class="jjzhcx_ul_title_li li04">
          <span class="jjzhcx_ul_title_li_span_ywmc">{{Datatitle[3].val_1}}</span>
        </li>
      </ul>
      <ul class="jjzhcx_ul_content">
        <li v-show="isShow" class="NoMsg">暂无查询数据！</li>
        <li class="jjzhcx_ul_content_li" v-for="(data,index) in jjzhcx_data" :key="index">
          <p class="jjzhcx_ul_content_li_p p01" v-bind:style="{ height: data.first_PHeoght + 'px'}">
            <span
              class="jjzhcx_ul_content_li_span color_3"
              v-bind:style="{ height: data.first_PHeoght + 'px',lineHeight: data.first_PHeoght + 'px'}"
            >{{data[cells[0]]}}</span>
          </p>
          <p class="jjzhcx_ul_content_li_p p02" v-bind:style="{ height: data.first_PHeoght + 'px'}">
            <span
              class="jjzhcx_ul_content_li_span color_3"
              v-bind:style="{ height: data.first_PHeoght + 'px',lineHeight: data.first_PHeoght + 'px'}"
            >{{data[cells[1]]}}</span>
          </p>
          <p class="jjzhcx_ul_content_li_p p03" v-bind:style="{ height: data.first_PHeoght + 'px'}">
            <span
              class="jjzhcx_ul_content_li_span_1 color_3"
              v-bind:style="{ height: data.jjmcHeight + 'px'}"
            >{{data[cells[2]]}}</span>
            <span class="jjzhcx_ul_content_li_span_2 color_3">{{data[cells[3]]}}</span>
          </p>
          <p class="jjzhcx_ul_content_li_p p04" v-bind:style="{ height: data.first_PHeoght + 'px'}">
            <span
              class="jjzhcx_ul_content_li_span color_3"
              v-bind:style="{ height: data.first_PHeoght + 'px',lineHeight: data.first_PHeoght + 'px'}"
            >{{data[cells[4]]}}</span>
          </p>
        </li>

        <li class="msgEnd" v-show="isEnd">已经到了底部，没有更多数据了！</li>
      </ul>
    </div>
    <div class="loading" v-show="isLoad">
      <span class="load_span">
        <img src="../../../static/loading.gif" alt>
      </span>
    </div>
    <AlertInfo :title="title" :content="content" v-show="isShow_1" @info-btn01="change"/>
  </div>
</template>

<script>
import Botton from "../../components/mob-button";
import tdxct from "../../lib/connect.js";
import AlertInfo from "../../components/dlgInfo_01";
export default {
  name: "App",
  components: {
    Botton,
    AlertInfo
  },
  data() {
    return {
      msg: "确定",
      jjzhcx_data: [],
      isShow: false,
      isLoad: true,
      isEnd: false,
      mobsys: "",
      isShow_1: false,
      title: "提示",
      content: "",
      Datatitle: [],
      cells: []
    };
  },
  created() {
    this.getAccInfo();
    this.mobsys = tdxct.tdxCheckMobSys();
  },
  methods: {
    ReqData(jjzhcx) {
      var __self = this;
      var params = [
        {
          F110: jjzhcx,
          // F120: khh,
          F1207: "p"
        }
      ];
      if (__self.mobsys === "IOS" || __self.mobsys === "WEB-IOS")
        params[0].tdxPageID = "_Base64";
      tdxct.JYCallTql("2126", params, { Way: "qs" }, function(data) {
        var result = tdxct.FormatResult(data);
        if (parseInt(result.ErrorCode) === 0 && parseInt(result.Num) >= 1) {
          var alldata = result.rows;
          var msgTitle = JSON.parse(alldata[0].F51).heads;
          var contentCells = JSON.parse(alldata[0].F51).cells;
          var arr = [];
          var arr_1 = [];
          for (var i in msgTitle) {
            //把第一条数据的heads中的值都放到一个空的数组中
            msgTitle[i] = msgTitle[i].split("/");
            arr.push({ val_1: msgTitle[i][0], val_2: msgTitle[i][1] });
          }
          for (let j in contentCells) {
            //把第一条数据的cells中的值都放到一个空的数组中
            if (j == 2) {
              arr_1.push(contentCells[j][0][0]);
              arr_1.push(contentCells[j][1][0]);
            } else {
              arr_1.push(contentCells[j][0][0]);
            }
          }
          console.log(arr);
          console.log(arr_1);
          var m = 0;
          console.log(alldata);
          for (var n in alldata) {
            //计算基金市值、持仓盈亏、以及根据名称长度决定li的高度
            m++;
            if (alldata[n].F401.length <= 7) {
              alldata[n].jjmcHeight = 18;
              alldata[n].first_PHeoght = 46;
            } else if (
              alldata[n].F401.length > 7 &&
              alldata[n].F401.length <= 14
            ) {
              alldata[n].jjmcHeight = 36;
              alldata[n].first_PHeoght = 68;
            } else if (
              alldata[n].F401.length > 14 &&
              alldata[n].F401.length <= 21
            ) {
              alldata[n].jjmcHeight = 54;
              alldata[n].first_PHeoght = 90;
            } else if (
              alldata[n].F401.length > 21 &&
              alldata[n].F401.length <= 24
            ) {
              alldata[n].jjmcHeight = 72;
              alldata[n].first_PHeoght = 112;
            }
          }
          console.log(m);
          if (m > 6) {
            __self.isEnd = true;
          } else {
            __self.isEnd = false;
          }
          __self.Datatitle = arr;
          __self.cells = arr_1;
          __self.isShow = false;
          __self.isLoad = false;

          __self.jjzhcx_data = alldata;
          console.log(result);
        } else if (
          parseInt(result.ErrorCode) === 0 &&
          parseInt(result.Num) === 0
        ) {
          //如果没有数据，表头信息从ErrorInfo里边取
          var NoDataTittle = JSON.parse(result.ErrorInfo).heads;
          var arr_2 = [];
          for (var i in NoDataTittle) {
            NoDataTittle[i] = NoDataTittle[i].split("/");
            arr_2.push({
              val_1: NoDataTittle[i][0],
              val_2: NoDataTittle[i][1]
            });
          }
          __self.Datatitle = arr_2;
          __self.isShow = true;
          __self.isEnd = false;
          __self.isLoad = false;
        } else {
          __self.Datatitle = [
            { val_1: "开户日期" },
            { val_1: "基金账号" },
            { val_1: "基金公司", val_2: "公司代码" },
            { val_1: "状态" }
          ];
          __self.isShow = true;
          __self.isEnd = false;
          __self.isLoad = false;
          _self.isShow_1 = true;
          _self.content = result.ErrorInfo;
        }
      });
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
              _self.ReqData(result[i].WTFS);
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
              _self.ReqData(result.WTFS);
              break;
            }
          }
        }
      });
    },
    change(e) {
      this.isShow_1 = e;
      console.log(e);
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
  -webkit-touch-callout:none;
  -webkit-user-select:none;
  -khtml-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
body {
  background-color: #fff;
  /* background-color: #f0f0f0; */
  /* font-size:0px !important; */
}
ul {
  list-style: none;
}
</style>
<style scoped>
/* 数据查询 */
#jjzhcx_content {
  /* margin-top: 40px; */
}
.jjzhcx_ul_title {
  font-size: 0;
  background-color: #f0f0f0;
  height: 50px;
  padding: 0 2% 0 1%;
}
.jjzhcx_ul_content {
  font-size: 0;
  background-color: #fff;
  position: absolute;
  top: 51px;
  left: 1%;
  right: 2%;
  bottom: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.jjzhcx_ul_content_li {
  border-bottom: 1.5px solid #f0f0f0;
  /* padding: 13px 0; */
}
.jjzhcx_ul_title_li {
  font-size: 13px;
  display: inline-block;
  text-align: center;
  position: relative;
}
.jjzhcx_ul_title_li {
  height: 52px;
}
.jjzhcx_ul_content_li_p {
  font-size: 14px;
  display: inline-block;
  text-align: center;
  position: relative;
}
.p01,
.p02,
.li01,
.li02 {
  width: 25%;
}
.p03,
.li03 {
  width: 30%;
}
.p04,
.li04 {
  width: 20%;
}
.jjzhcx_ul_content_li_p span {
  display: block;
  height: 18px;
  line-height: 18px;
  width: 100%;
  position: absolute;
  left: 0;
}
.jjzhcx_ul_title_li span {
  display: block;
  height: 18px;
  line-height: 18px;
  width: 100%;
  position: absolute;
  left: 0;
}
.jjzhcx_ul_title_li_span_1 {
  top: 7px;
}
.jjzhcx_ul_content_li_span_1 {
  top: 5px;
}
.jjzhcx_ul_title_li_span_2 {
  bottom: 7px;
}
.jjzhcx_ul_content_li_span_2 {
  bottom: 5px;
}
.jjzhcx_ul_content_li_p .jjzhcx_ul_content_li_span {
  display: inline-block;
  /* height: 63px; */
  /* line-height: 63px; */
}
.jjzhcx_ul_title_li .jjzhcx_ul_title_li_span_ywmc {
  height: 50px;
  line-height: 50px;
}
.color_1 {
  color: #333;
}
.color_2 {
  color: #2a2a2a;
}
.color_3 {
  color: #666;
}
.color_4 {
  color: #fd671a;
}
/*content部分基金名称另外样式*/
.jjzhcx_ul_content_jj {
  width: 24%;
  display: inline-block;
  position: relative;
  font-size: 14px;
  text-align: center;
}
.jjzhcx_ul_content_jj span {
  display: block;
  height: 22px;
  line-height: 22px;
  width: 100%;
  position: absolute;
  left: 0;
}
.jjzhcx_content_jjdm {
  bottom: 0;
}
.jjzhcx_content_jjmc {
  top: 0;
}
/*加载动画样式*/
.loading {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.load_span {
  display: inline-block;
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -30px;
  margin-top: -30px;
}
.load_span img {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 5px;
  left: 5px;
}
/*没有数据是显示信息样式*/
.NoMsg {
  height: 70px;
  width: 100%;
  text-align: center;
  line-height: 70px;
  font-size: 18px;
  color: #666;
}
/*数据过多时底部显示信息样式*/
.msgEnd {
  height: 30px;
  font-size: 12px;
  color: #999;
  width: 100%;
  line-height: 30px;
  text-align: center;
}
</style>
