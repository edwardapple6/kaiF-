<template>
  <div id="app">
    <div id="top">
      <ul class="app_ul">
        <li @click="popupShow">
          <span>基金公司</span>
          <input type="text" placeholder="请选择基金公司" disabled class="fs14" ref="jjgs">
          <img class="xlxz" src="../../../static/xl.png" alt>
        </li>
        <li>
          <span>公司代码</span>
          <input type="text" disabled class="_disabled" ref="jjgsdm">
        </li>
        <li>
          <span>开户方式</span>
          <input type="text" disabled class="_disabled" placeholder="新开或已有账户">
        </li>
      </ul>
      <div class="protocol">
        <p class="protocol_tittle">我已阅读并同意以下协议：</p>
        <ul>
          <li
            v-for="(list,index) in protocolList"
            v-bind:key="index"
            @click="ReadPDF(list,index)"
          >
            <img v-if="list.isChecked" src="../../../static/chencked.png" alt>
            <img src="../../../static/cancle.png" alt>
            <span v-bind:class="list.isChecked?'isSpan_2':'isSpan_1'">{{list.name}}</span>
          </li>
        </ul>
      </div>
      <div id="btn">
        <button 
          class="active" 
          v-bind:class="changeColor?'btnactive':'btnunactive'" 
          @click="click_sure"
        >{{msg}}</button>
      </div>
    </div>
    <div class="back" v-show="isAlertMsg">
      <!-- 弹窗 info -->
      <div class="dialog">
        <div class="title">{{ title }}</div>
        <div class="content" v-html="content"></div>
        <div class="button" @click="btnClicked">确定</div>
      </div>
    </div>
    <!-- <AlertInfo :title="title" :content="content" v-show="isAlertMsg" @info-btn01="change"/> -->
    <mt-popup v-model="popupVisible" position="bottom" class="popup">
      <ul id="popup_ul" v-bind:style="{ height: popupHeight + 'px'}">
        <li class="popup_li_title">请选择基金公司</li>
        <li
          class="popup_li"
          v-for="(data,index) in CC_data"
          :key="index"
          @click="selectChecked(CC_data,index)"
        >
          <span class="popup_li_span">{{data.F401}}</span>
          <img src="../../../static/xz.png" alt v-show="data.isShow">
        </li>
      </ul>
    </mt-popup>
  </div>
</template>

<script>
import tdxct from "../../lib/connect.js";
import { pageURL } from "../../common/pageUrl.js";
import { jumpType } from "../../common/pageUrl.js";
// import AlertInfo from "../../components/dlgInfo_02";
import { Reback } from "../../common/reback.js";
export default {
  name: "App",
  components: {
    // Botton
    // AlertInfol
  },
  data() {
    return {
      msg: "确定",
      CC_data: [],
      popupVisible: false,
      popupHeight: 0,
      AccInfoData: [],
      title: "提示",
      content: "",
      isAlertMsg: false,
      pageId: "jjkh",
      protocolList: [
        {name:'《开放式基金风险揭示书》',isChecked:false},
        {name:'《证券投资基金投资人权益须知》',isChecked:false}
      ],
      acceptData:[],
      changeColor: false,
      disabled:false,
      isContinue:true,
    };
  },
  created() {
    var that = this;
    tdxct.JYCallTql("2118",[{ F110: "7" }, { F113: "0" }],{ Way: "qs" },function(data) {
        var result = tdxct.FormatResult(data);
        console.log(result);
      }
    );
    
  },
  methods: {
    btnClicked(){
      location.reload()
      this.isAlertMsg = false;
    },
    popupShow: function() {
      if (this.CC_data == "" || this.CC_data == null) {
        this.popupVisible = false;
      } else {
        this.popupVisible = true;
      }
    },
    selectChecked(obj, idx) {
      for (var i in obj) {
        if (i == idx) {
          console.log(this.AccInfoData)
          obj[idx].isShow = true;
          this.$refs.jjgs.value = obj[idx].F401;
          this.$refs.jjgsdm.value = obj[idx].F426;
          this.sdxkt(this.AccInfoData.KHH,this.AccInfoData.WTFS,obj[idx].F401,obj[idx].F426)
        } else {
          obj[i].isShow = false;
        }
      }
      this.popupVisible = false;
    },
    //获取账号信息
    getAccInfo(startdate, enddate) {
      var _self = this;
      var jjgs = _self.$refs.jjgs.value;
      var gsdm = _self.$refs.jjgsdm.value;
      tdxct.tdxgetAccList(function(data) {
        if (
          tdxct.tdxCheckMobSys() == "WEB-IOS" ||
          tdxct.tdxCheckMobSys() == "IOS"
        ) {
          var result = JSON.parse(data);
          for (var i in result) {
            if (result[i].HostType == 0) {
              _self.AccInfoData = result[i];
              _self.Getconpany(result[i].WTFS);
              
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
              _self.Getconpany(result.WTFS);
              
              break;
            }
          }
        }
      });
    },
    //获取基金公司
    Getconpany: function(wtfs) {
      let __ = this;
      var param = [
        {
          F110: wtfs,
          F1207: "P"
        }
      ];
      tdxct.JYCallTql("2124", param, { Way: "qs" }, function(data) {
        var result = tdxct.FormatResult(data);
        if(parseInt(result.ErrorCode) === 0 && parseInt(result.Num) > 0){
          console.log(result);
          var alldata = result.rows;
          var n = 0;
          for (var i in alldata) {
            alldata[i].isShow = false;
            n++;
          }
          console.log(n);
          if (n >= 7) {
            __.popupHeight = 400;
          } else {
            __.popupHeight = 50 * (n + 1);
          }
          __.CC_data = alldata;
        }else {
          __.isAlertMsg = true;
          __.content = result.ErrorInfo;
        }
        
        
      });
    },
    //点击确定按钮
    click_sure: function() {
      var that01 = this;
      if(that01.changeColor == true){
        console.log('继续做')
        if(that01.isContinue == true){
          that01.isContinue = false;
          window.localStorage.removeItem('khpdfdata')
          window.localStorage.removeItem('jjkh')
          that01.continue_sdx()
        }
        
      }else{
        console.log('不能继续做')
      }
      
      // var _that = this;
      // var jjgs = _that.$refs.jjgs.value;
      // var gsdm = _that.$refs.jjgsdm.value;
      // var transmitData = [];
      // transmitData.push("Mobile.Stock.kfsjj.jjkh");
      // transmitData.push(_that.pageId);
      // transmitData.push(jjgs); //基金公司
      // transmitData.push(gsdm); //基金代码
      // transmitData.push(_that.AccInfoData); //账号信息
      // transmitData = JSON.stringify(transmitData);
      // window.localStorage.setItem("jjkh", transmitData);
      // if (jjgs == "") {
      //   this.content = "请选择需要开户的基金公司";
      //   this.isAlertMsg = true;
      // } else {
      //   _that.JumPage(
      //     "阅读协议书",
      //     pageURL.readptoUrl + "?data=" + "{fg}" + _that.pageId + "{fg}"
      //   );
      // }
    },
    JumPage: function(name, url) {
      //页面跳转函数
      tdxct.WEBCallTql(
        "tdxOpenUrl",
        {
          OpenName: name,
          OpenType: "native",
          OpenUrl: url,
          OpenParam: jumpType
        },
        function() {}
      );
    },
    change(e) {
      this.isAlertMsg = e;
      console.log(e);
    },
    getlocal() {
      var items = localStorage.getItem("khpdfdata");
      console.log(items);
      
      if (items != "" && items != null && items != undefined) {
        items = JSON.parse(items)
        var n = 0;
        for (var i in items) {
          if (items[i].isChecked == true) {
            n++;
          }
        }
        console.log(items.length)
        console.log(n)
        if (n == items.length) {
          this.changeColor = true;
          // this.change();
        } else {
          this.changeColor = false;
        }
        this.protocolList = items;
        console.log(111)
      }else {
        n = 0
      }
    },
    //进入阅读协议书页面
    ReadPDF(data,idx) {
      var _that = this;
      if(data.isChecked == false){
        var jjgs = _that.$refs.jjgs.value;
        var gsdm = _that.$refs.jjgsdm.value;
        var transmitData = [];
        transmitData.push("Mobile.Stock.kfsjj.jjkh");
        transmitData.push(_that.pageId);
        transmitData.push(jjgs); //基金公司
        transmitData.push(gsdm); //基金代码
        transmitData.push(_that.AccInfoData); //账号信息
        transmitData.push(_that.acceptData[1])
        transmitData = JSON.stringify(transmitData);
        window.localStorage.setItem("jjkh", transmitData);
        if (jjgs == "") {
          this.content = "请选择需要开户的基金公司";
          this.isAlertMsg = true;
        } else {
          console.log(typeof data == 'object')
          if(typeof data == 'object'){
            data = JSON.stringify(data)
            console.log(111)
          }
          _that.JumPage(
            "阅读协议书",
            pageURL.readptoUrl + "?data=" + "{fg}" + _that.pageId + "{fg}" + data + '{fg}' + idx + '{fg}'
          );
        }
      }
      
    },
    //适当性
    sdxkt(khh, wtfs, jjgs, gsdm) {
      var that03 = this;
      var param = [
        {
          F362: 'Mobile.Stock.kfsjj.jjkh',
          F1217: "SDX.CHECK_RISK_PRODUCTCODE,",
          F120: khh,
          F110: wtfs,
          F391: jjgs,
          F393: gsdm
        }
      ];
      tdxct.JYCallTql("198", param, { Way: "qs" }, function(data) {
        var result = tdxct.FormatResult(data);
        if (parseInt(result.ErrorCode) === 0 && parseInt(result.Num) >= 1) {
          console.log(result);
          var F1223 = result.rows[0].F1223;
          if (parseInt(F1223) === 7) {
            var QRSName = result.rows[0].F149;
            var arr = QRSName.split("{T}");
            var newArr = [];
            var newArr01 = arr[1].split(",");
            var newArr02 = arr[2].split(";");
            for (var i in newArr01) {
              if (i != newArr01.length - 1 && newArr01[i] != "") {
                newArr.push({
                  name: "《" + newArr01[i] + "》"
                });
                newArr[i].code = newArr02[i];
                newArr[i].isChecked = false;
              }
            }
            console.log(newArr);
            that03.protocolList = newArr;
            newArr = JSON.stringify(newArr)
            window.localStorage.setItem('khpdfdata',newArr)
            var base64Str = "";
            var strPOS = "original";
            that03.acceptData.push(newArr);
            that03.acceptData.push(result.rows[0].F1284);
            that03.acceptData.push(result.rows[0].F1217);
            console.log(that03.acceptData[0][0].code);
          } else if (parseInt(F1223) === 4) {
            that03.isAlertMsg = true;
            that03.content = result.rows[0].F149;
          }
        } else {
          that03.isAlertMsg = true;
          that03.content = result.ErrorInfo;
        }
      });
    },
    //继续做适当性
    continue_sdx() {
      var that08 = this;
      let  param = [
        {
          // tdxPageID:'_Base64',
          F362: 'Mobile.Stock.kfsjj.jjkh',
          F1217: that08.acceptData[2],
          F391: that08.$refs.jjgs.value,
          F393: that08.$refs.jjgsdm.value
        }
      ]
      tdxct.JYCallTql("198", param, { Way: "qs" }, function(data) {
        let result = tdxct.FormatResult(data);
        console.log(result)
        if (parseInt(result.ErrorCode) === 0) {
          if(result.rows == ''){
            that08.khcx(that08.AccInfoData.WTFS);
          }else {
            switch(parseInt(result.rows[0].F1223)){
              case 0: that08.khcx(that08.AccInfoData.WTFS);
              break;
              case 1: 
              break;
              case 3:
              break;
              case 4: 
              if(result.rows[0].F149.indexOf('FileNotFoundException') != -1){
                that08.isAlertMsg = true;
                that08.content = '本次协议签署失败，可能是因为您的资料中关键信息缺失，请到营业部或致电我司统一客服热线95351进行处理!';
                that08.isContinue = true;
              }else {
                that08.isAlertMsg = true;
                that08.content = result.rows[0].F149;
                that08.isContinue = true;
              }
              break;
              case 7:that08.continue_sdx(paramcode,jjgs, gsdm,result.rows.F1217)
              break;
            }
          }
        } else {
          that08.isContinue = true;
          that08.isAlertMsg = true;
          that08.content = result.ErrorInfo;
        }
        
      });
    },
     //开放式基金资金帐户开户查询
    khcx() {
      var that05 = this;
      var funcId = "2118";
      var param = [
        {
          F110: that05.AccInfoData.WTFS,
          F113: "0",
          F1217: "SDX.ORDER,"
        }
      ];
      if(that05.mobsys === 'IOS' || that05.mobsys === 'WEB-IOS') param[0].tdxPageID = '_Base64'
      
      tdxct.JYCallTql(funcId, param, { Way: "qs" }, function(data) {
        var result = tdxct.FormatResult(data);
        console.log(result);
        if (parseInt(result.ErrorCode) === 0 && parseInt(result.Num) >= 1) {
          var allData = result.rows[0];
          that05.kh_sure(allData);
        } else {
          that05.isAlertMsg = true;
          that05.content = result.ErrorInfo;
        }
      });
    },
    //开户委托函数
    kh_sure(data) {
      var that06 = this;
      var params = [
        {
          F110: that06.AccInfoData.WTFS,
          F426: that06.$refs.jjgsdm.value,
          F417: "",
          F113: "1",
          F122: data.F122,
          F950: data.F950,
          F128: data.F128,
          F129: data.F129,
          F450: data.F450,
          F454: data.F454,
          F455: data.F455,
          F456: data.F456,
          F463: data.F463,
          F457: data.F457,
          F458: "",
          F459: "",
          F465: "",
          F467: "",
          F952: data.F952,
          F953: data.F953,
          F452: data.F452,
          F464: data.F122,
          F1217: "SDX.ORDER,",
          F1284: that06.acceptData[1]
        }
      ];
      if(that06.mobsys === 'IOS' || that06.mobsys === 'WEB-IOS') params[0].tdxPageID = '_Base64';
      tdxct.JYCallTql("2118", params, { Way: "qs" }, function(data) {
        var result_2118 = tdxct.FormatResult(data);
        console.log(result_2118);
        if (
          parseInt(result_2118.ErrorCode) === 0 &&
          parseInt(result_2118.Num) >= 1
        ) {
          that06.isContinue = true;
          that06.isAlertMsg = true;
          that06.content = "您的基金开户申请已提交，请至'基金账户查询'功能查看状态。"
        } else {
          that06.isContinue = true;
          that06.isAlertMsg = true;
          that06.content = result_2118.ErrorInfo;
        }
      });
    },
    
  },
  mounted(){
    var that = this;
    this.getAccInfo();
    window.tdxActivity = function() {
      that.getlocal();
    };
    window.setPartHeight = function() {};
    window.changeFontSize = function() {};
    window.setPartHeight = function() {};
    window.changeFontSize = function() {};
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
body{
  background-color: #f0f0f0;
}
ul {
  list-style: none;
}
</style>
<style scoped>
#app {
  background-color: #f0f0f0;
}
#popup_ul {
  width: 100%;
  overflow: auto;
}
#top .app_ul {
  background-color: #fff;
  padding: 23px 15px 15px 15px;
}
#top li {
  position: relative;
  height: 42px;
  margin-bottom: 10px;
}
input {
  /* width: 257px; */
  width: 73%;
  height: 40px;
  color: #000;
  padding: 0 10px;
  border-radius: 5px;
  border: #dbdbdb 1px solid;
  background-color: #fff;
  -webkit-appearance: none;
  outline: none;
}
input:disabled, input[disabled]{ -webkit-opacity:1; opacity: 1; }
.fs14::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #b3b3b3;
}
.fs14:-moz-placeholder,
textarea:-moz-placeholder {
  color: #b3b3b3;
}
.fs14::-moz-placeholder,
textarea::-moz-placeholder {
  color: #b3b3b3;
}
.fs14:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: #b3b3b3;
}

.fs14:focus {
  outline: none;
  border: #fd671a 1px solid;
}
input._disabled {
  border: #f0f0f0 1px solid;
  color: #333;
  font-size: 16px;
}
.fs14 {
  font-size: 14px;
}
#top li span {
  color: #666;
  font-size: 14px;
  margin-right: 10px;
}
#top .allmoney {
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
.popup_li,
.popup_li_title {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #f1f1f1;
  padding: 0 15px;
  position: relative;
}
.popup_li {
  z-index: 2017;
  text-align: left;
}
.popup_li_title {
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2018;
  background-color: #fff;
}
.popup_li_span {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #666666;
  letter-spacing: 0;
  text-align: center;
}
.popup_li img {
  width: 19px;
  position: absolute;
  top: 18px;
  right: 15px;
}
.popup_li:nth-child(2) {
  margin-top: 51px;
}
.xlxz {
  width: 16px;
  height: 8px;
  position: absolute;
  top: 17px;
  right: 10px;
}
.popup {
  width: 100%;
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
  /* background-color: #fd671a; */
  font-family: PingFangSC-Regular;
  letter-spacing: 0;
}
#btn {
  padding: 0 15px;
}
/* 协议书 */
#top .protocol {
  margin-top:11px;
  background-color: #fff;
  padding: 10px 10px 0 10px;
}

#top .protocol_tittle {
  height: 48px;
  text-align: left;
  line-height: 48px;
  font-size: 14px;
  color: #333;
}
#top .protocol ul {
  /* margin-bottom: 156px; */
  font-size: 14px;
  list-style: none;
}
#top .protocol li {
  height: 48px;
  border-top: 1px solid #f0f0f0;
  line-height: 48px;
  text-align: left;
  margin-bottom:0;
  position: relative;
}
#top .protocol img {
  width: 16px;
  position: absolute;
  top: 14px;
  left: 0;
}
#top .protocol span {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 20px;
  height: 48px;
  line-height: 48px;
}

#top .protocol .isSpan_1 {
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#top .protocol .isSpan_2 {
  color: #b3b3b3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btnactive {
  background-color: #fd671a;
}
.btnunactive {
  background-color: #ffb48d;
}
/* 报错提示框 */
.back {
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1001;
}
.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 280px;
  transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  background-color: white;
  border-radius: 5px;
  z-index: 1002;
  text-align: center;
}
.title {
  line-height: 44px;
  font-size: 18px;
  color: #333;
}
.content {
  line-height: 24px;
  font-size: 14px;
  text-align: center;
  padding: 10px 15px;
  color: #666;
  border-bottom: #f0f0f0 1.5px solid;
  word-break: break-all;
}
.button {
  line-height: 44px;
  font-size: 16px;
  color: #fd671a;
}
.button:active {
  background-color: #f0f0f0;
}
</style>
