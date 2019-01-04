<template>
   
    <div id="wtcx_content">
        <ul class="wtcx_ul_title">
            <li class="wtcx_ul_title_li">
              <span class="wtcx_ul_title_li_span_1">{{heads[0]}}</span>
              <span class="wtcx_ul_title_li_span_2">{{heads[1]}}</span>
            </li>
            <li class="wtcx_ul_title_li">
              <span class="wtcx_ul_title_li_span_ywmc">{{heads[2]}}</span>
            </li>
            <li class="wtcx_ul_title_li">
              <span class="wtcx_ul_title_li_span_1">{{heads[3]}}</span>
              <span class="wtcx_ul_title_li_span_2">{{heads[4]}}</span>
            </li>
            <li class="wtcx_ul_title_li">
              <span class="wtcx_ul_title_li_span_1">{{heads[5]}}</span>
              <span class="wtcx_ul_title_li_span_2">{{heads[6]}}</span>
            </li>
        </ul>
        <ul class="wtcx_ul_content">
          <li v-show="isShow" class="NoMsg">暂无查询数据！</li>
          <li class="wtcx_ul_content_li" v-for="(data,index) in RecData" :key="index">
              <p class="wtcx_ul_content_jj p1" v-bind:style="{ height: data.first_PHeoght + 'px'}">
                  <span class="wtcx_content_jjmc color_1" v-bind:style="{ height: data.jjmcHeight + 'px'}">{{data.F403}}</span>
                  <span class="wtcx_content_jjdm color_2">{{data.F402}}</span>
              </p>
              <p class="wtcx_ul_content_li_p" v-bind:style="{ height: data.first_PHeoght + 'px'}">
                  <span class="wtcx_ul_content_li_span_1 color_3">{{data.F306}}</span>
              </p>
              <p class="wtcx_ul_content_li_p" v-bind:style="{ height: data.first_PHeoght + 'px'}">
                  <span class="wtcx_ul_content_li_span_1 color_3">{{data.F416}}</span>
                  <span class="wtcx_ul_content_li_span_2 color_3">{{data.F415}}</span>
              </p>
              <p class="wtcx_ul_content_li_p p4" v-bind:style="{ height: data.first_PHeoght + 'px'}">
                  <span class="wtcx_ul_content_li_span_1 color_4">{{data.F150}}</span>
                  <span class="wtcx_ul_content_li_span_2 color_2">{{data.F151}}</span>
              </p>
          </li>
          <li class="msgEnd" v-show="isEnd">已经到了底部，没有更多数据了！</li>
        </ul>
        <div class="loading" v-show="isLoad">
          <span class="load_span">
            <img src="../../static/loading.gif" alt="">
          </span>
          
        </div>
    </div>
    
</template>
<script>
import tdxct from "../lib/connect.js";
export default {
  props: ["picker_value2", "picker_value1"],
  data() {
    return {
      AccInfoData: [],
      isLoad: true,
      isShow: false,
      RecData: [],
      isEnd: false,
      heads:[],
      cells:[],
      mobsys:''
    };
  },
  created() {
    this.mobsys = tdxct.tdxCheckMobSys()
    // this.getAccInfo('20180522','20181109')
  },
  methods: {
    //获取成交信息
    ReqData(wtfs, KHH, startDate, endDate) {
      var _self = this;
      _self.RecData = [];
      _self.isLoad = true;
      var params = [
        {
          F110: wtfs,
          F120: KHH,
          F126: startDate,
          F127: endDate,
          F1207: "P"
        }
      ];
      if(_self.mobsys === 'IOS' || _self.mobsys === 'WEB-IOS') params[0].tdxPageID = '_Base64'
      
      console.log(params);
      tdxct.JYCallTql("2112", params, { Way: "qs" }, function(data) {
        var result = tdxct.FormatResult(data);
        if (parseInt(result.ErrorCode) === 0 && parseInt(result.Num) >= 1) {
          var allData = result.rows;
          var n = 0;
          _self.isLoad = false;
          _self.isShow = false;
          //表头
          allData[0].F51 = JSON.parse(allData[0].F51)
          console.log(allData[0].F51);
          var Headarr = []//定义一个空数组
          var head = allData[0].F51.heads;
          for(var i in head){
            //把每个值都放到空数组中
            if(i == 0 || i == 2 || i == 3){
              head[i] = head[i].split('/')
              Headarr.push(head[i][0])  
              Headarr.push(head[i][1])
            }else if(i == 1){
              Headarr.push(head[i])
            }
          }
          console.log(Headarr);
          _self.heads = Headarr;

          //cells
          var Newcell = allData[0].F51.cells;

          var Cellarr = [];
          for(var j in Newcell){
             //把每个值都放到空数组中
            if(j == 0 || j == 2 || j == 3){
              
              Cellarr.push(Newcell[j][0][0])  
              Cellarr.push(Newcell[j][1][0])
            }else if(j == 1){
              Cellarr.push(Newcell[j][0][0])
            }
          }
          _self.cells = Cellarr;
          console.log(Cellarr)
          allData.sort(_self.compare("F150"));
          console.log(allData.length)
          var newArr = [],
            tempArr = [];
          //首先遍历请求的数据，并把数据中日期相同的组合到一起，最终得到的是一个大数组中子元素也是数组；
          for (var i = 0, j = allData.length; i < j; i++) {
            if (i < allData.length-1 && (allData[i].F142 == allData[i + 1].F142)) {
              tempArr.push(allData[i]);
            } else {
              tempArr.push(allData[i]);
              newArr.push(tempArr.slice(0));
              tempArr.length = 0;
            }
          }
          //再把得到的大数组遍历一下
          for(var k in newArr){
            //把子元素中长度大于1的再根据时间倒序排序，得到的大数组就是已经按照日期排序以及时间排序好的数据
            if(newArr[k].length > 1){
              newArr[k].sort(_self.compare("F151"));
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
          //最后把tempArr赋值给allData中
          allData = tempArr
          for (var i in allData) {
            n++;
            //根据基金名称的长度控制基金名称的高度
            if (allData[i].F403.length <= 6) {
              allData[i].jjmcHeight = 22;
              allData[i].first_PHeoght = 46;
            } else if (
              allData[i].F403.length > 6 &&
              allData[i].F403.length <= 12
            ) {
              allData[i].jjmcHeight = 44;
              allData[i].first_PHeoght = 68;
            } else if (
              allData[i].F403.length > 12 &&
              allData[i].F403.length <= 18
            ) {
              allData[i].jjmcHeight = 66;
              allData[i].first_PHeoght = 90;
            } else if (
              allData[i].F403.length > 18 &&
              allData[i].F403.length <= 24
            ) {
              allData[i].jjmcHeight = 88;
              allData[i].first_PHeoght = 112;
            }
          }
          if (n >= 6) {
            _self.isEnd = true;
            } else {
              _self.isEnd = false;
            }
          _self.RecData = allData;
        } else if (parseInt(result.ErrorCode) === 0 &&parseInt(result.Num) === 0) {
          var head = JSON.parse(result.ErrorInfo);
          var newArr = [];
          head = head.heads;
          for(var i in head){
            //把每个值都放到空数组中
            if(i == 0 || i == 2 || i == 3){
              head[i] = head[i].split('/')
              newArr.push(head[i][0])  
              newArr.push(head[i][1])
            }else if(i == 1){
              newArr.push(head[i])
            }
          }
          console.log(head);
          _self.heads = newArr;
          _self.isLoad = false;
          _self.isShow = true;
          _self.isEnd = false;
        } else {
          _self.heads = [
            "基金名称",
            "基金代码",
            "业务名称",
            "成交金额",
            "成交份额",
            "委托日期",
            "委托时间"
          ]
          _self.isLoad = false;
          _self.isShow = true;
          _self.isEnd = false;
          alert(result.ErrorInfo);
        }
        console.log(result);
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
              _self.ReqData(result[i].WTFS, result[i].KHH, startdate, enddate);
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
              _self.ReqData(result.WTFS, result.KHH, startdate, enddate);
              break;
            }
          }
        }
      });
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
<style scoped>
/* 数据查询 */
#wtcx_content {
  position: absolute;
  top: 161px;
  left: 0;
  right: 0;
  /* margin-top: 40px; */
}
.wtcx_ul_title {
  font-size: 0;
  background-color: #f0f0f0;
  height: 50px;
}
.wtcx_ul_content {
  background-color: #fff;
  position: fixed;
  top: 211px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.wtcx_ul_content_li {
  border-bottom: 1.5px solid #f0f0f0;
  padding: 13px 0;
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
  width: 24%;
  display: inline-block;
  position: relative;
  font-size: 14px;
  text-align: center;
}
.wtcx_ul_content_jj span {
  display: block;
  height: 22px;
  line-height: 22px;
  width: 100%;
  position: absolute;
  left: 0;
}
.wtcx_content_jjdm {
  bottom: 0;
}
.wtcx_content_jjmc {
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
