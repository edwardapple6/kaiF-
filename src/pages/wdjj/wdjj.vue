<template>
    <div id="wdjj">
        <div id="wdjj_top">
           <div class="wdjj_top_above">
               <div class="wdjj_top_above_1">
                   <img src="../..//../static/jjsz.png" alt="">
                   <p class="wdjj_top_above_1_p">
                       <span class="wdjj_top_span_1">基金市值</span>
                       <span class="wdjj_top_span_2">{{marketValue}}</span>
                   </p>
               </div>
               <div class="wdjj_top_above_2">
                   <img src="../../../static/ccyk@2x.png" alt="">
                   <p class="wdjj_top_above_2_p">
                       <span class="wdjj_top_span_1">持仓盈亏</span>
                       <span class="wdjj_top_span_2">{{ccprofitLoss}}</span>
                   </p>
               </div>
           </div>
           <div class="wdjj_top_below">
                <div class="wdjj_top_below_1">
                    <img src="../../../static/kyzj.png" alt="">
                    <p class="wdjj_top_below_1_p">
                        <span class="wdjj_top_span_1">可用资金</span>
                        <span class="wdjj_top_span_2">{{usableMoney}}</span>
                    </p>
                </div>
                <div class="wdjj_top_below_2">
                    <img src="../../../static/kqzj.png" alt="">
                    <p class="wdjj_top_below_2_p">
                        <span class="wdjj_top_span_1">可取资金</span>
                       <span class="wdjj_top_span_2">{{advisableMoeny}}</span>
                    </p>
                </div>
           </div>
        </div>
        <div id="wdjj_foot">
            <ul class="title">
                <li class="title_li" v-for="(data,index) in title" :key="index">
                    <span>{{data.val_1}}</span>
                    <span>{{data.val_2}}</span>
                </li>
            </ul>
            <ul class="content" ref="cc_content">
                <li v-show="isShow" class="NoMsg">暂无查询数据！</li>
                <li class="content_li" v-for="(data,index) in content_data" :key="index">
                    <p class="content_li_p" v-bind:style="{ height: data.first_PHeoght + 'px'}">
                        <span class="color_1" v-bind:style="{ height: data.jjmcHeight + 'px'}">{{data[cells[0]]}}</span>
                        <span class="color_2">{{data[cells[1]]}}</span>
                    </p>
                    <p class="content_li_p" v-bind:style="{ height: data.first_PHeoght + 'px'}">
                        <span class="color_2" v-bind:style="{ height: data.jjmcHeight + 'px'}">{{data[cells[2]]}}</span>
                        <span class="color_2">{{data[cells[3]]}}</span>
                    </p>
                    <p class="content_li_p" v-bind:style="{ height: data.first_PHeoght + 'px'}">
                    <span class="color_2" v-bind:style="{ height: data.jjmcHeight + 'px'}">{{data[cells[4]]}}</span>
                        <span class="color_2">{{data[cells[5]]}}</span>
                    </p>
                    <p class="content_li_p" v-bind:style="{ height: data.first_PHeoght + 'px'}">
                        <span class="color_3" v-bind:style="{ height: data.jjmcHeight + 'px'}">{{data[cells[6]]}}</span>
                        <span class="color_2">{{data[cells[7]]}}</span>
                    </p>
                </li>
                <li class="msgEnd" v-show="isEnd">已经到了底部，没有更多数据了！</li>
            </ul>
        </div>
        <AlertInfo :title="Alerttitle" :content="content" v-show="isShow_1" @info-btn01="change"/>
        <load
        v-show="isLoad"
        />
        <!-- <Loading/> -->
    </div>
</template>
<script>
import tdxct from "../../lib/connect.js";
import load from "../../components/mob-loading";
import AlertInfo from "../../components/dlgInfo_01";

// import Loading from '../../components/mob-load'
export default {
  components: {
    load,
    AlertInfo
    // Loading
  },
  data() {
    return {
      content_data: [],
      title: [],
      cells: [],
      isShow: false, //没有数据时显示‘暂无查询数据！’
      marketValue: 0, //基金市值
      ccprofitLoss: 0, //持仓盈亏
      usableMoney: "0", //可用资金
      advisableMoeny: "0", //可取资金
      contentHeight: 0, //每项内容的高度
      isEnd: false, //最后一个信息显示隐藏
      isLoad: true,
      AccInfoData:[],//获取账号信息
      mobsys:'',
      Alerttitle: "提示",
      content: "",
      isShow_1: false,
      content_P_height:0,
    };
  },
  created() {
    var that = this;
    that.getAccInfo()
    that.mobsys = tdxct.tdxCheckMobSys()
  },
  methods: {
    //获取数据
    Reqdata(wtfs) {
      var that = this;
      let params2106 = [{
        F110: wtfs,
        F1207: "P"
      }]
      if(that.mobsys === 'IOS' || that.mobsys === 'WEB-IOS') params2106[0].tdxPageID = '_Base64'

      tdxct.JYCallTql( "2106",params2106, { Way: "qs" }, function(data) {
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
              arr_1.push(contentCells[j][0][0]);
              arr_1.push(contentCells[j][1][0]);
            }
            var m = 0;
            for (var n in alldata) {
              //计算基金市值、持仓盈亏、以及根据名称长度决定li的高度
              m++;
              //成本价显示小数点之后四位
              alldata[n][arr_1[5]] = Math.floor(alldata[n][arr_1[5]] * 10000)/10000
              var result = (alldata[n][arr_1[5]].toString()).indexOf(".");
              if(result != -1) {//如果有小数点
                alldata[n][arr_1[5]] = Math.floor(alldata[n][arr_1[5]] * 10000)/10000
                var str_01 = alldata[n][arr_1[5]].toString()
                switch(str_01.length){//判断处理之后字符串的长度，如果少于6后边补0
                  case 3:alldata[n][arr_1[5]]= alldata[n][arr_1[5]] + '000'
                  
                  break;
                  case 4:alldata[n][arr_1[5]] = alldata[n][arr_1[5]] + '00'
                  
                  break;
                  case 5: alldata[n][arr_1[5]] = alldata[n][arr_1[5]] + '0'
                  
                  break;
                }
              } else {//没有小数点的话自动补四个0
                  alldata[n][arr_1[5]] = alldata[n][arr_1[5]].toFixed(4)
              }
              if (alldata[n].F403.length <= 7) {
                alldata[n].jjmcHeight = 22;
                alldata[n].first_PHeoght = 46;
              } else if (
                alldata[n].F403.length > 7 &&
                alldata[n].F403.length <= 14
              ) {
                alldata[n].jjmcHeight = 44;
                alldata[n].first_PHeoght = 68;
              } else if (
                alldata[n].F403.length > 14 &&
                alldata[n].F403.length <= 21
              ) {
                alldata[n].jjmcHeight = 66;
                alldata[n].first_PHeoght = 90;
              } else if (
                alldata[n].F403.length > 21 &&
                alldata[n].F403.length <= 24
              ) {
                alldata[n].jjmcHeight = 88;
                alldata[n].first_PHeoght = 112;
              }
              that.ccprofitLoss += Number(alldata[n][arr_1[6]]); //盈亏总和
              that.marketValue += Number(alldata[n][arr_1[7]]); //市值总额

            }
            that.ccprofitLoss = Math.floor(that.ccprofitLoss * 100)/100
            that.marketValue = Math.floor(that.marketValue * 100)/100
            if (m > 6) {
              that.isEnd = true;
            } else {
              that.isEnd = false;
            }
            that.title = arr;
            that.cells = arr_1;
            that.content_data = alldata;
            that.isShow = false;
            that.isLoad = false;
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
            that.isShow = true;
            that.title = arr_2;
            that.isLoad = false;
          } else {
            that.title = [
              { val_1: "基金名称", val_2: "基金代码" },
              { val_1: "持有份额", val_2: "可用份额" },
              { val_1: "昨日净值", val_2: "成本" },
              { val_1: "盈亏金额", val_2: "市值" }
            ];
            that.isShow = true;
            that.isLoad = false;
            that.isShow_1 = true;
            that.content = result.ErrorInfo;
          }
        }
      );
    },
    getdata(wtfs) {//可取金额与可用金额
      var that = this;
      let params104 = [{
        F110: wtfs,
        F1207: "P"
      }]
      if(that.mobsys === 'IOS' || that.mobsys === 'WEB-IOS') params104[0].tdxPageID = '_Base64'

      tdxct.JYCallTql( "104", params104, { Way: "qs" }, function(data) {
          var result_1 = tdxct.FormatResult(data);
          if (
            parseInt(result_1.ErrorCode) === 0 &&
            parseInt(result_1.Num) >= 1
          ) {
            that.usableMoney = result_1.rows[0].F301;
            that.advisableMoeny = result_1.rows[0].F302;
          } else {
            alert(result_1.ErrorInfo);
          }
        }
      );
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
              _self.getdata(result[i].WTFS);
              _self.Reqdata(result[i].WTFS);
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
              _self.getdata(result.WTFS);
              _self.Reqdata(result.WTFS);
              break;
            }
          }
        }
      });
    },
  },
  mounted(){

  },
  watch(){
    content_P_height:'Reqdata'
  }
};
</script>
<style>
* {
  padding: 0;
  margin: 0;
  font-size: 0;
  -webkit-touch-callout:none;
  -webkit-user-select:none;
  -khtml-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
ul {
  list-style: none;
}
input,
button {
  outline: none;
}
</style>

<style scoped>

/*顶部样式*/
#wdjj_top {
  padding: 0 15px;
}
.wdjj_top_above,
.wdjj_top_below {
  height: 83px;
}
.wdjj_top_above {
  border-bottom: 1.5px solid #f1f1f1;
}
img {
  width: 28px;
  position: absolute;
  top: 27px;
  left: 5px;
}
.wdjj_top_above_1,
.wdjj_top_above_2,
.wdjj_top_below_1,
.wdjj_top_below_2 {
  display: inline-block;
  width: 50%;
  height: 83px;
  position: relative;
  /* padding:40px 0; */
}
.wdjj_top_above_1,
.wdjj_top_below_1 {
  border-right: 1.5px solid #f1f1f1;
}
.wdjj_top_above_2,
.wdjj_top_below_2 {
  width: 49%;
}
.wdjj_top_above_1_p,
.wdjj_top_above_2_p,
.wdjj_top_below_1_p,
.wdjj_top_below_2_p {
  position: absolute;
  top: 0;
  left: 42px;
  right: 0;
  bottom: 0;
  padding: 20px 0;
}
.wdjj_top_span_1 {
  font-size: 12px;
  font-family: PingFangSC-Regular;
  color: #999999;
  letter-spacing: 0;
  display: block;
  width: 100%;
  margin-bottom: 4px;
}
.wdjj_top_span_2 {
  display: block;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  width: 100%;
}
.wdjj_top_above_2 img,
.wdjj_top_below_2 img {
  left: 15px;
}
.wdjj_top_above_2_p,
.wdjj_top_below_2_p {
  left: 52px;
}
/* 底部样式 */
.title {
  background-color: #f0f0f0;
  height: 50px;
  /* padding: 0 30px; */
}
.title_li {
  width: 25%;
  display: inline-block;
  height: 50px;
  color: #333;
  padding: 7px 0 0 0;
}
.title_li span,
.content_li_p span {
  display: block;
  font-size: 13px;
  text-align: center;
  font-family: PingFangSC-Regular;
}
.content {
  position: absolute;
  top: 218px;
  left: 0;
  right: 0;
  /* height:63%; */
  bottom: 0;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.content_li {
  /* height: 50px; */
  background-color: #fff;
  border-bottom: 1.5px solid #f1f1f1;
  /* border-top: 1px solid red; */
}
.content_li_p {
  width: 25%;
  display: inline-block;
  color: #333;
  padding: 7px 0 0 0;
}
.color_1 {
  color: #333;
  font-size: 14px;
}
.color_2 {
  color: #666;
}
.color_3 {
  color: #fd671a;
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
