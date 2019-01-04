<template>
  <div id="app">
    <div id="wtcx_content">
      <ul class="wtcx_ul_title">
        <li class="wtcx_ul_title_li">
          <span class="wtcx_ul_title_li_span_1">基金名称</span>
          <span class="wtcx_ul_title_li_span_2">基金代码</span>
        </li>
        <li class="wtcx_ul_title_li">
          <span class="wtcx_ul_title_li_span_ywmc">业务名称</span>
        </li>
        <li class="wtcx_ul_title_li">
          <span class="wtcx_ul_title_li_span_1">委托金额</span>
          <span class="wtcx_ul_title_li_span_2">委托份额</span>
        </li>
        <li class="wtcx_ul_title_li">
          <span class="wtcx_ul_title_li_span_1">委托时间</span>
          <span class="wtcx_ul_title_li_span_2">状态</span>
        </li>
      </ul>
      <ul class="wtcx_ul_content">
        <li v-show="isShow" class="NoMsg">暂无查询数据！</li>
        <li class="wtcx_ul_content_li" v-for="(data,index) in wtcx_data" :key="index">
          <p class="wtcx_ul_content_jj jjmc" v-bind:style="{ height: data.first_PHeoght + 'px'}">
            <span
              class="wtcx_content_jjmc color_1"
              v-bind:style="{ height: data.jjmcHeight + 'px'}"
            >{{data.F403}}</span>
            <span class="wtcx_content_jjdm color_2">{{data.F402}}</span>
          </p>
          <p
            class="wtcx_ul_content_li_p"
            v-bind:style="{ height: data.first_PHeoght + 'px',lineHeight: data.first_PHeoght + 'px'}"
          >
            <span class="wtcx_ul_content_li_span_1 color_3">{{data.F306}}</span>
          </p>
          <p class="wtcx_ul_content_li_p" v-bind:style="{ height: data.first_PHeoght + 'px'}">
            <span class="wtcx_ul_content_li_span_1 color_3">{{data.F405}}</span>
            <span class="wtcx_ul_content_li_span_2 color_3">{{data.F414}}</span>
          </p>
          <p class="wtcx_ul_content_li_p" v-bind:style="{ height: data.first_PHeoght + 'px'}">
            <span class="wtcx_ul_content_li_span_1 color_4">{{data.F143}}</span>
            <span class="wtcx_ul_content_li_span_2 color_2">{{data.F147}}</span>
          </p>
        </li>
        <li class="msgEnd" v-show="isEnd">已经到了底部，没有更多数据了！</li>
      </ul>
      <AlertInfo :title="title" :content="content" v-show="isShow_1" @info-btn01="change"/>
    </div>
    <!-- <div class="loading" v-show="isLoad">
      <span class="load_span">
        <img src="../../../static/loading.gif" alt="">
      </span>
    </div>-->
    <load v-show="isLoad"/>
  </div>
</template>

<script>
import Botton from "../../components/mob-button";
import tdxct from "../../lib/connect.js";
import load from "../../components/mob-loading";
import AlertInfo from "../../components/dlgInfo_01";
export default {
  name: "App",
  components: {
    Botton,
    load,
    AlertInfo
  },
  data() {
    return {
      msg: "确定",
      wtcx_data: [],
      isShow: false,
      isLoad: true,
      isEnd: false,
      title: "提示",
      content: "",
      isShow_1: false,
      mobsys: ""
    };
  },
  created() {
    this.getAccInfo();
    this.mobsys = tdxct.tdxCheckMobSys();
  },
  methods: {
    ReqData(wtcx, khh) {
      var __self = this;
      var params = [
        {
          F110: wtcx,
          F120: khh,
          F126: "",
          F127: "",
          F1207: "p"
        }
      ];
      if (__self.mobsys === "IOS" || __self.mobsys === "WEB-IOS") {
        params[0].tdxPageID = "_Base64";
      }
      tdxct.JYCallTql("2108", params, { Way: "qs" }, function(data) {
        var result = tdxct.FormatResult(data);
        // console.log(result);
        if (parseInt(result.ErrorCode) === 0 && parseInt(result.Num) >= 1) {
          var alldata = result.rows;
          __self.isShow = false;
          __self.isLoad = false;
          var n = 0;
          var arr = [];
          // console.log(alldata);
          // alldata.sort(__self.compare("F143"));

          alldata.sort(__self.compare("F142"));
          console.log(alldata.length)
          var newArr = [],
            tempArr = [];
          //首先遍历请求的数据，并把数据中日期相同的组合到一起，最终得到的是一个大数组中子元素也是数组；
          for (var i = 0, j = alldata.length; i < j; i++) {
            if (i < alldata.length-1 && (alldata[i].F142 == alldata[i + 1].F142)) {
              tempArr.push(alldata[i]);
            } else {
              tempArr.push(alldata[i]);
              newArr.push(tempArr.slice(0));
              tempArr.length = 0;
            }
          }
          //再把得到的大数组遍历一下
          for(var k in newArr){
            //把子元素中长度大于1的再根据时间倒序排序，得到的大数组就是已经按照日期排序以及时间排序好的数据
            if(newArr[k].length > 1){
              newArr[k].sort(__self.compare("F143"));
            }
          }
          //然后再遍历一遍大数组
          for(var a in newArr){
            if(newArr[a].length > 1){//把子数组长度大于1的在遍历一遍，并把子数组中的数据都push到tempArr中
              for(var b in newArr[a]){
                tempArr.push(newArr[a][b])
              }
            }else {//把子数组长度等于1的第0个元素push到tempArr中
              tempArr.push(newArr[a][0])
            }
          }
          //最后把tempArr赋值给alldata中
          alldata = tempArr
          for (var i in alldata) {
            n++;

            var times = alldata[i].F143;
            var times_01 = [];
            times = times.split("");
            if (times.length == 5) {
              times.unshift("0");
              times_01[0] = times.slice(0, 2).join("");
              times_01[1] = times.slice(2, 4).join("");
              times_01[2] = times.slice(4, 6).join("");
              alldata[i].F143 =
                times_01[0] + ":" + times_01[1] + ":" + times_01[2];
            } else {
              times_01[0] = times.slice(0, 2).join("");
              times_01[1] = times.slice(2, 4).join("");
              times_01[2] = times.slice(4, 6).join("");
              alldata[i].F143 =
                times_01[0] + ":" + times_01[1] + ":" + times_01[2];
            }
            if (alldata[i].F403.length <= 7) {
              alldata[i].jjmcHeight = 22;
              alldata[i].first_PHeoght = 46;
            } else if (
              alldata[i].F403.length > 7 &&
              alldata[i].F403.length <= 14
            ) {
              alldata[i].jjmcHeight = 44;
              alldata[i].first_PHeoght = 68;
            } else if (
              alldata[i].F403.length > 14 &&
              alldata[i].F403.length <= 21
            ) {
              alldata[i].jjmcHeight = 66;
              alldata[i].first_PHeoght = 90;
            } else if (
              alldata[i].F403.length > 21 &&
              alldata[i].F403.length <= 28
            ) {
              alldata[i].jjmcHeight = 88;
              alldata[i].first_PHeoght = 112;
            }
            if (n > 7) {
              __self.isEnd = true;
            } else {
              __self.isEnd = false;
            }
          }
          __self.wtcx_data = alldata;
        } else if (
          parseInt(result.ErrorCode) === 0 &&
          parseInt(result.Num) === 0
        ) {
          __self.isShow = true;
          __self.isEnd = false;
          __self.isLoad = false;
        } else {
          __self.isShow = true;
          __self.isEnd = false;
          __self.isLoad = false;
          __self.isShow_1 = true;
          __self.content = result.ErrorInfo;
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
              _self.ReqData(result[i].WTFS, result[i].KHH);

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
              _self.AccInfoData = result;
              _self.ReqData(result.WTFS, result.KHH);
              break;
            }
          }
        }
      });
    },
    change(e) {
      this.isShow_1 = e;
    },
    compare(deta) {
      return function(a, b) {
        var value1 = a[deta];
        var value2 = b[deta];
        return value2 - value1;
      };
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
#wtcx_content {
  /* margin-top: 40px; */
}
.wtcx_ul_title {
  font-size: 0;
  background-color: #f0f0f0;
  height: 50px;
}
.wtcx_ul_content {
  background-color: #fff;
  position: absolute;
  top: 51px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.wtcx_ul_content_li {
  border-bottom: 1.5px solid #f0f0f0;
  padding: 13px 0 8px 0;
}
.wtcx_ul_title_li,
.wtcx_ul_content_li_p {
  font-size: 13px;
  display: inline-block;
  width: 25%;
  text-align: center;
  position: relative;
}
.wtcx_ul_title_li {
  height: 52px;
}
.wtcx_ul_content_li_p {
  height: 46px;
  width: 24%;
  font-size: 14px;
}
.wtcx_ul_content_li_p span {
  display: block;
  height: 22px;
  line-height: 22px;
  width: 100%;
  position: absolute;
  left: 0;
}
.wtcx_ul_title_li span {
  display: block;
  height: 18px;
  line-height: 18px;
  width: 100%;
  position: absolute;
  left: 0;
}
.wtcx_ul_title_li_span_1 {
  top: 7px;
}
.wtcx_ul_content_li_span_1 {
  top: 0px;
}
.wtcx_ul_title_li_span_2 {
  bottom: 7px;
}
.wtcx_ul_content_li_span_2 {
  bottom: 0px;
}
.wtcx_ul_title_li .wtcx_ul_title_li_span_ywmc {
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
.wtcx_ul_content_jj {
  width: 25%;
  display: inline-block;
  position: relative;
  font-size: 13px;
  text-align: center;
}
.wtcx_ul_content_jj span {
  display: block;

  width: 100%;
  position: absolute;
  left: 0;
}
.wtcx_content_jjdm {
  height: 22px;
  line-height: 22px;
  bottom: 0;
}
.wtcx_content_jjmc {
  top: 0;
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
