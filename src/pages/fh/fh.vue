<template>
  <div id="app">
    <div id="top">
        <ul class="top_ul">
            <li><span>基金代码</span><input type="text" disabled placeholder="请从下方持仓中选择赎回基金" class="fs14" ref="jjcode"></li>
            <li><span>基金名称</span><input type="text" disabled class="_disabled" ref="jjname"></li>
            <li><span class="fhname">分红方式</span><span class="fhfs" @click="popupShow">{{fhstylemsg}}<img id="fh_img" src="../../../static/xl.png" alt=""></span></li>
        </ul>
        <div id="btn">
          <button class="active" @click="click_sure()" >{{msg}}</button>
        </div>
    </div>
    
    <div id="CC_content">
      <ul class="title">
          <li class="title_li" v-for="(data,index) in Datatitle" :key="index">
              <span>{{data.val_1}}</span>
              <span>{{data.val_2}}</span>
          </li>
      </ul>
      <ul class="content">
          <li v-show="isShow" class="NoMsg">暂无查询数据！</li>
          <li class="content_li" v-for="(data,index) in content_data" :key="index" @click="select_checked(data)">
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
    <mt-popup
        v-model="popupVisible"
        position="bottom"
        class="popup"
        >
        <ul id="popup_ul">
          <li class="popup_li_title">请选择分红方式</li>
          <li v-for="(seldata,index) in select_fhstyle" :key="index" class="popup_li" @click="fh_sure(seldata)"><span class="popup_li_span">{{seldata.name}}</span></li>
        </ul>
    </mt-popup>
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
      popupVisible: false,
      fhstylemsg: "请选择分红方式",
      select_fhstyle: [
        { name: "红利转股", value: "0" },
        { name: "现金分红", value: "1" }
      ],
      rec_data: [],
      content_data: [],
      Datatitle: [],
      cells: [],
      isShow: false, //没有数据时显示‘暂无查询数据！’
      contentHeight: 0, //每项内容的高度
      isEnd: false, //最后一个信息显示隐藏
      isLoad: true,
      AccInfoData: [], //获取账号信息
      jjgsdm: "",
      fhfscode: "",
      isShow_1: false,
      content: [],
      title: "提示",
      mobsys:''
    };
  },
  created() {
    this.getAccInfo();
    this.mobsys = tdxct.tdxCheckMobSys()
  },
  methods: {
    //点击分红方式，显示弹框
    popupShow: function() {
      console.log(this.$refs.jjcode.value)
      if(this.$refs.jjcode.value === '' || this.$refs.jjcode.value === null){
        this.isShow_1 = true;
        this.content = '请先选择基金'
      }else{
        this.popupVisible = true;
      }
      
    },
    //选中分红方式
    fh_sure(obj) {
      this.fhfscode = "";
      this.fhstylemsg = obj.name;
      this.fhfscode = obj.value;
      this.popupVisible = false;
    },
    //选中基金
    select_checked(obj) {
      this.fhstylemsg = '请选择分红方式'//每次选中基金都把分红方式置空
      this.jjgsdm = "";//进入先把jjgsdm置空
      this.$refs.jjcode.value = obj.F402;
      this.$refs.jjname.value = obj.F403;
      this.jjgsdm = obj.F426;
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
              console.log(result);
              _self.AccInfoData = result;
              _self.Reqdata(result.WTFS);
              break;
            }
          }
        }
      });
    },
    //获取数据
    Reqdata(wtfs) {
      var that = this;
      let params = [{
        F110: wtfs,
         F1207: "P" 
      }]
      if(tdxct.tdxCheckMobSys() === 'IOS' || tdxct.tdxCheckMobSys() === 'WEB-IOS') params[0].tdxPageID = '_Base64'

      tdxct.JYCallTql( "2106", params, { Way: "qs" }, function(data) {
          var result = tdxct.FormatResult(data);
          console.log(result);
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
            }
            console.log(m);
            if (m > 5) {
              that.isEnd = true;
            } else {
              that.isEnd = false;
            }
            console.log(arr);
            that.Datatitle = arr;
            that.cells = arr_1;
            that.content_data = result.rows;
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
              console.log(NoDataTittle[i]);
              arr_2.push({
                val_1: NoDataTittle[i][0],
                val_2: NoDataTittle[i][1]
              });
            }
            that.isShow = true;
            that.Datatitle = arr_2;
            that.isLoad = false;
          } else {
            that.Datatitle = [
              { val_1: "基金名称", val_2: "基金代码" },
              { val_1: "持有份额", val_2: "可用份额" },
              { val_1: "昨日净值", val_2: "成本" },
              { val_1: "盈亏金额", val_2: "市值" }
            ];
            that.isShow = true;
            that.isLoad = false;
            that.isShow_1 = true;
            that.content = result.ErrorInfo
          }
        }
      );
    },
    //点击完成分红设置
    click_sure() {
      var _that = this;
      if (this.$refs.jjcode.value === "" || this.$refs.jjcode.value === null) {
        _that.isShow_1 = true;
        _that.content =
          "基金代码不能为空，请在下方点击选中需要重新设置分红方式的基金！";
      } else if (_that.fhfscode === "" || _that.fhfscode === null) {
        _that.isShow_1 = true;
        _that.content = "请选择分红方式";
      } else {
        var params = [
          {
            F426: _that.jjgsdm,
            F402: this.$refs.jjcode.value,
            F408: _that.fhfscode
          }
        ];
      if(_that.mobsys === 'IOS' || _that.mobsys === 'WEB-IOS') params[0].tdxPageID = '_Base64'
        
        console.log(params);
        tdxct.JYCallTql("2114", params, { Way: "qs" }, function(data) {
          var result_wt = tdxct.FormatResult(data);
          if (
            parseInt(result_wt.ErrorCode) === 0 &&
            parseInt(result_wt.Num) >= 1
          ) {
            _that.content =
              "分红设置已完成，委托编号为：" + result_wt.rows[0].F146;
            _that.isShow_1 = true;
            _that.fhfscode = ""
            console.log(result_wt);
          } else {
            _that.fhfscode = ""
            _that.isShow_1 = true;
            _that.content = result_wt.ErrorInfo;
          }
        });
      }
    },
    change(e) {
      this.isShow_1 = e;
      if(e == false){
        this.$refs.jjcode.value = ''
        this.$refs.jjname.value = ''
        this.fhstylemsg = '请选择分红方式'
      }
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
  font-size: 0;
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
/* #app{
  padding:46px 30px 0 30px;
} */
#popup_ul {
  width: 100%;
}
#top .top_ul {
  padding: 23px 15px 0 15px;
}
#top li {
  position: relative;
  height: 42px;
  margin-bottom: 10px;
}
input {
  width: 73%;
  height: 40px;
  color: #000;
  padding: 0 10px;
  border-radius: 5px;
  border: #dbdbdb 1.5px solid;
  background-color: #fff;
  -webkit-appearance:none;
  outline: none;
}
input:disabled, input[disabled]{ -webkit-opacity:1; opacity: 1; }
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #b3b3b3;
}
input:-moz-placeholder,
textarea:-moz-placeholder {
  color: #b3b3b3;
}
input::-moz-placeholder,
textarea::-moz-placeholder {
  color: #b3b3b3;
}
input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: #b3b3b3;
}

input:focus {
  outline: none;
  border: #fd671a 1.5px solid;
}
input._disabled {
  border: #f0f0f0 1.5px solid;
}
.fs14,
._disabled {
  font-size: 14px;
}
#top li span {
  color: #666;
  font-size: 14px;
  margin-right: 10px;
}

/* 底部样式 */
#CC_content {
  margin-top: 20px;
}
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
  top: 320px;
  left: 0;
  right: 0;
  /* height:63%; */
  bottom: 0;
  overflow: scroll;
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

.popup {
  width: 100%;
}
.popup_li,
.popup_li_title {
  height: 50px;
  line-height: 50px;
  border-bottom: 1.5px solid #f1f1f1;
  padding: 0 15px;
}
.popup_li_title {
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
}
.popup_li_span {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #666666;
  letter-spacing: 0;
  text-align: center;
}
.fhname {
  position: absolute;
  left: 0;
  top: 10px;
}
.fhfs {
  display: inline-block;
  width: 73%;
  height: 40px;
  color: #999;
  border-radius: 5px;
  border: #dbdbdb 1.5px solid;
  background-color: #fff;
  line-height: 40px;
  margin: 0 !important;
  position: absolute;
  right: 2px;
  top: 0;
  padding: 0 10px;
  text-align: left;
}
#fh_img {
  height: 10px;
  position: absolute;
  top: 15px;
  right: 10px;
}
/*“确定”按钮样式*/
#btn {
  /* width:100%; */
  padding: 0 15px;
}
.active {
  width: 100%;
  height: 40px;
  font-size: 15px;
  outline: none;
  border: none;
  color: #fff;
  border-radius: 5px;
  margin-top: 30px;
  background-color: #fd671a;
  font-family: PingFangSC-Regular;
  letter-spacing: 0;
}
</style>
