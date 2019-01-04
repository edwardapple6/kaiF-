<template>
  <div id="app">
    <div id="top">
      <ul class="one">
        <li @click="zcjj(jjzh_data)">
          <span>转出基金</span>
          <input type="text" disabled placeholder="请选择转出基金" class="fs14" ref="zcjj">
          <img src="../../../static/xl.png" alt>
        </li>
        <li>
          <span>基金名称</span>
          <input type="text" disabled class="_disabled" ref="zcjj_jjmc">
        </li>
      </ul>
      <ul class="two">
        <li class="mg_top">
          <span>转入基金</span>
          <input
            type="tel"
            v-bind:disabled="isSure_zrjj"
            v-model="cxMsg"
            @keyup="telKeyup()"
            placeholder="请选择转入基金"
            class="_disabled"
            ref="zrjj"
          >
          <img src="../../../static/xl.png" alt @click="zrjj(jjzh_data)">
        </li>
        <li>
          <span>基金名称</span>
          <input type="text" disabled class="_disabled" ref="zrjj_jjmc">
        </li>
        <li>
          <span>可赎份额</span>
          <input type="text" disabled class="_disabled" ref="ksfe">
        </li>
        <li>
          <span>转换份额</span>
          <input
            type="number"
            placeholder="请输入转换份额"
            class="fs14 shfe"
            ref="zhfe"
          >
          <span class="allmoney" @click="allNum">全额</span>
        </li>
      </ul>
    </div>
    <mt-popup v-model="popupVisible" position="bottom" class="popup">
      <ul id="popup_ul" v-bind:style="{ height: popupHeight + 'px'}">
        <li class="popup_li_title">{{titleMsg}}</li>
        <li
          class="popup_li"
          v-for="(data,index) in jjzh_data"
          :key="index"
          @click="selectChecked(jjzh_data,index)"
        >
          <span class="popup_li_span sp1">{{data.F403}}</span>
          <span class="popup_li_span color_2">{{data.F402}}</span>
          <img src="../../../static/xz.png" alt v-show="data.isShow">
        </li>
      </ul>
    </mt-popup>
    <div id="btn">
      <button class="active" @click="click_sure(jjzh_data)">{{msg}}</button>
    </div>
    <AlertInfo :title="title" :content="content" v-show="isShow_1" @info-btn01="change" ref="alertHeight"/>
  </div>
</template>

<script>
import tdxct from "../../lib/connect.js";
import { pageURL } from "../../common/pageUrl.js";
import { jumpType } from "../../common/pageUrl.js";
import AlertInfo from "../../components/dlgInfo_01";
export default {
  name: "App",
  components: {
    // Botton
    AlertInfo
  },
  data() {
    return {
      msg: "确定",
      jjzh_data: [], //基金账号数据
      isShow: false,
      popupVisible: false,
      titleMsg: "",
      popupHeight: 0, //弹出信息列表框高度
      AccInfoData: [], //账号信息
      jjzhxxData: [], //基金账号信息数据
      isSelzc: false, //转出基金是否选中
      sameJJ: [], //相同基金数组
      libData: [],
      ydqrs: pageURL.readptoUrl,
      pageId: "jjzh",
      gsdm: "",
      title: "提示", //提示框标题
      content: "", //提示框内容
      isShow_1: false, //提示框显示隐藏
      isInput: true, //转入基金是否可输入true--不可输入，false--可输入
      cxMsg: "", //输入转入基金双向绑定的数据
      isSure_zrjj: true,
      mobsys:''
    };
  },
  created() {
    var that = this;
    that.mobsys = tdxct.tdxCheckMobSys()
    window.tdxActivity = function() {
      //回退到基金转换页面时读取缓存
      that.getlocal();
    };
    window.setPartHeight = function() {};
    window.changeFontSize = function() {};
    var params = [
      {
        F362: "Mobile.Stock.kfsjj.jjzh",
        F1217: "SDX.CHECK_RISK_ACCOUNT,"
      }
    ];
    tdxct.JYCallTql("198", params, { Way: "qs" }, function(data) {
      var result = tdxct.FormatResult(data);
      console.log(result)
    });
    this.getAccInfo();
  },
  methods: {
    //点击转出基金
    zcjj(obj) {
      var _ = this;
      _.titleMsg = "我的基金";
      //把已经选中的基金排除掉
      if (_.jjzh_data == "") {
        _.ReqFunc("2106");
      } else {
        var dataLength = _.libData.length;
        if (dataLength > 6) {
          _.popupHeight = 410;
        } else {
          _.popupHeight = dataLength * 60 + 50;
        }
        _.popupVisible = true;
        var arr = _.libData;
        for (var i in arr) {
          if (_.$refs.zcjj.value == arr[i].F402) {
            arr[i].isShow = true;
          } else {
            arr[i].isShow = false;
          }
        }
        _.jjzh_data = arr;
      }
    },
    //点击转入基金
    zrjj(obj) {
      var _ = this;
      var arr = _.sameJJ;
      var arr_1 = [];

      if (_.isSelzc == true) {
        
          this.titleMsg = "同一基金管理人下其他基金";
          for (var m in arr) {
            if (this.$refs.zcjj.value != "") {
              if (this.$refs.zcjj.value != arr[m].F402) {
                arr_1.push(arr[m]);
              }
            }
          }
        if(arr_1.length >= 1){
            for (var i in arr_1) {
              if (_.$refs.zrjj.value == arr_1[i].F402) {
                arr_1[i].isShow = true;
              } else {
                arr_1[i].isShow = false;
              }
            }
            this.jjzh_data = arr_1;
            var dataLength = _.jjzh_data.length;
            if (dataLength > 5) {
              _.popupHeight = 350;
            } else {
              _.popupHeight = dataLength * 60 + 50;
            }
            
            _.popupVisible = true;
        }else {
          _.isShow_1 = true;
          _.content = "同一基金管理人下没有其他基金";
        }
        
      } else {
        _.isShow_1 = true;
        _.content = "请先选择转出基金！";
      }
    },
    //输入转入基金代码查询
    telKeyup() {
      var _self = this;
      // _self.cxMsg = _self.cxMsg.replace(/[^0-9]/gi, "");
      if (_self.cxMsg.length === 6) {
        _self.zrjj_cx(_self.cxMsg);
      } else if (_self.cxMsg.length > 6) {
        _self.cxMsg = _self.cxMsg.slice(0, 6);
      } else if (_self.cxMsg.length < 6) {
        _self.$refs.zrjj_jjmc.value = "";
      }
    },
    //请求数据函数
    ReqFunc(funcId, titleMsg) {
      var that = this;
      var params = [
        {
          F110: that.AccInfoData.WTFS,
          F1207: "P"
        }
      ];
      if(that.mobsys === 'IOS' || that.mobsys === 'WEB-IOS') params[0].tdxPageID = '_Base64'

      tdxct.JYCallTql(funcId, params, { Way: "qs" }, function(data) {
        var result = tdxct.FormatResult(data);
        if (parseInt(result.ErrorCode) === 0 && parseInt(result.Num) >= 1) {
          var n = 0;
          var alldata = result.rows;
          for (var i in alldata) {
            n++;
            alldata[i].isShow = false;
          }
          that.popupVisible = true;
          if (n > 6) {
            that.popupHeight = 410;
          } else {
            that.popupHeight = n * 60 + 50;
          }
          that.jjzh_data = alldata;
          that.libData = alldata;
        } else if (
          parseInt(result.ErrorCode) === 0 &&
          parseInt(result.Num) === 0
        ) {
          that.isShow_1 = true;
          that.content = "该账户没有购买基金";
        } else {
          that.popupVisible = false;
          that.isShow_1 = true;
          that.content = result.ErrorInfo;
        }
      });
    },
    //选中基金
    selectChecked(obj, idx) {
      var _self = this;
      var arr = [];
      var arr_1 = [];
      for (var n in obj) {
        if (obj[n].F426 == obj[idx].F426) {
          arr.push(obj[n]);
        }
      }
      _self.gsdm = obj[idx].F426;
      _self.sameJJ = arr;
      for (var i in obj) {
        if (i == idx) {
          if (_self.titleMsg == "我的基金") {
            //转出基金
            _self.$refs.zcjj.value = obj[idx].F402; //基金代码
            _self.$refs.zcjj_jjmc.value = obj[idx].F403; //基金名称
            _self.$refs.ksfe.value = obj[idx].F410; //可赎份额
            _self.$refs.zrjj_jjmc.value = ""; //基金名称
            _self.$refs.zrjj.value = ""; //基金代码
            obj[idx].isShow = true;
            _self.isSelzc = true;
            _self.isInput = false; //当选中每个基金之后转入基金输入框可输入
            _self.isSure_zrjj = false;
          } else if (_self.titleMsg == "同一基金管理人下其他基金") {
            //转入基金
            _self.$refs.zrjj_jjmc.value = obj[idx].F403; //基金名称
            _self.cxMsg = obj[idx].F402; //基金代码
            obj[idx].isShow = true;
          }
        } else {
          obj[i].isShow = false;
        }
      }
      _self.popupVisible = false;
    },
    //缓存数据函数
    localstorage: function(key, value) {
      var strKey = key;
      var storage = window.localStorage;
      var strValue = JSON.stringify(value);
      if (storage) {
        storage.setItem(strKey, strValue);
      } else {
        Cookie.write(strKey, strValue);
      }
    },
    //创建缓存
    setStorage: function(strKey, data) {
      for (var i in data) {
      }
      this.localstorage(strKey, data);
    },
    //点击‘全额’
    allNum() {
      this.$refs.zhfe.value = this.$refs.ksfe.value;
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
              _self.jjzhcx(result[i].WTFS);
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
              _self.jjzhcx(result.WTFS);
              break;
            }
          }
        }
      });
    },
    //开放式基金账户查询
    jjzhcx(wtfs) {
      var _this = this;
      var param = [
        {
          F110: wtfs,
          F1207: "P"
        }
      ];
      if(_this.mobsys === 'IOS' || _this.mobsys === 'WEB-IOS') param[0].tdxPageID = '_Base64'

      tdxct.JYCallTql("2126", param, { Way: "qs" }, function(data) {
        var resultJJzhcx = tdxct.FormatResult(data);
        if (
          parseInt(resultJJzhcx.ErrorCode) === 0 &&
          parseInt(resultJJzhcx.Num) >= 1
        ) {
          var JJzhcxalldata = resultJJzhcx.rows;
          _this.jjzhxxData = JJzhcxalldata;
        } else if (
          parseInt(resultJJzhcx.ErrorCode) === 0 &&
          parseInt(resultJJzhcx.Num) === 0
        ) {
        } else {
          _this.isShow_1 = true;
          _this.content = resultJJzhcx.ErrorInfo;
        }
      });
    },
    //点击确定按钮
    click_sure: function() {
      var _that = this;
      // _that.isShow_1 = true;
      var jjgs = _that.$refs.zrjj.value;
      var gsdm = _that.gsdm;
      var zhxx = _that.jjzhxxData;
      var zh_417 = "";
      for (var i in zhxx) {
        if (zhxx[i].F426 == gsdm) {
          zh_417 = zhxx[i].F417;
        }
      }
      
      var transmitData = [];
      transmitData.push("Mobile.Stock.kfsjj.jjzh");
      transmitData.push(_that.pageId); //页面ID
      transmitData.push(jjgs); //转入基金公司
      transmitData.push(gsdm); //转入基金代码
      transmitData.push(_that.$refs.zcjj.value); //转出基金代码
      transmitData.push(zh_417); //基金账户
      transmitData.push(_that.$refs.zhfe.value); //转换份额
      transmitData.push(_that.$refs.zcjj_jjmc.value); //转出基金名称
      transmitData.push(_that.$refs.zrjj_jjmc.value); //转入基金名称
      transmitData.push(_that.AccInfoData); //账号信息
      transmitData = JSON.stringify(transmitData);
      window.localStorage.setItem("jjzh", transmitData);
      if(_that.$refs.zcjj.value == ''){
        this.content = '请选择转出基金';
        this.isShow_1 = true;
      }else if(jjgs == ''){
        this.content = '请选择转入基金';
        this.isShow_1 = true;
      }else if(_that.$refs.zhfe.value == ''){
        this.content = '请输入转换份额';
        this.isShow_1 = true;
      }else{
        _that.JumPage(
          "阅读协议书",
          pageURL.readptoUrl + "?data=" + "{fg}" + _that.pageId + "{fg}"
        );
      }
    },
    JumPage: function(name, url) {
      //页面跳转函数
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
    },
    change(e) {
      this.isShow_1 = e;
    },
    getlocal() {
      var items = localStorage.getItem("jjzhAlertMsg");
      if (items != "" && items != null && items != undefined) {
        this.content = items;
        this.isShow_1 = true;
        this.$refs.alertHeight.hqgd();

      }
    },
    //‘2110’查询
    zrjj_cx(e) {
      let that01 = this;
      let params = [
        {
          F110: that01.AccInfoData.WTFS,
          F402: e
        }
      ];
      if(that01.mobsys === 'IOS' || that01.mobsys === 'WEB-IOS') params[0].tdxPageID = '_Base64'

      tdxct.JYCallTql("2110", params, { Way: "qs" }, function(data) {
        let result = tdxct.FormatResult(data);
        if (parseInt(result.ErrorCode) === 0 && parseInt(result.Num) >= 1) {
          that01.$refs.zrjj_jjmc.value = result.rows[0].F403;
        } else {
          that01.content = result.ErrorInfo;
          that01.isShow_1 = true;
        }
      });
    }
  }
};
</script>

<style>
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
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
  background-color: #f0f0f0;
  /* font-size:0px !important; */
}
ul {
  list-style: none;
}
</style>
<style scoped>
#top ul {
  background-color: #fff;
}
#top .one {
  padding: 23px 15px 11px 15px;
}
#top .two {
  padding: 23px 15px 20px 15px;
  margin-top: 11px;
}
#top li {
  position: relative;
  height: 42px;
  margin-bottom: 10px;
}
input {
  width: 75%;
  height: 40px;
  color: #000;
  padding: 0 0 0 10px;
  border-radius: 5px;
  border: #dbdbdb 1px solid;
  background-color: #fff;
  -webkit-appearance:none;
  outline: none;
  -webkit-user-select:text !important;/*ios上无法输入的问题*/
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

/* input:disabled, input[disabled]{ 
color: #333; 
-webkit-text-fill-color:#333; 
-webkit-opacity:1; 
opacity: 1; 
} */
input:focus {
  outline: none;
  border: #fd671a 1.5px solid;
}
input._disabled {
  border: #dbdbdb 1.5px solid !important;
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
  text-align: center;
}
#top .shfe {
  width: 50%;
  height: 40px;
  margin-right: 4%;
}
.mg_top {
  margin-top: 11px;
  -webkit-user-select:text !important;/*ios上无法输入的问题*/
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
  margin-top: 40px;
  margin-bottom: 52px;
  background-color: #fd671a;
  font-family: PingFangSC-Regular;
  letter-spacing: 0;
}
img {
  width: 16px;
  height: 8px;
  position: absolute;
  top: 17px;
  right: 5%;
}
/*popup样式*/
.popup {
  width: 100%;
}
#popup_ul {
  width: 100%;
  overflow: auto;
}

.popup_li_title {
  height: 50px;
  line-height: 50px;
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
  z-index: 2018;
  background-color: #fff;
  border-bottom: 1.5px solid #f1f1f1;
}
.popup_li {
  z-index: 2017;
  height: 60px;
  width: 100%;
  border-bottom: 1px solid #f1f1f1;
  position: relative;
}
.popup_li_span {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
  text-align: center;
  position: absolute;
  left: 15px;
  height: 20px;
}
.popup_li img {
  width: 19px;
  height: 13px;
  position: absolute;
  top: 18px;
  right: 15px;
}
.popup_li:nth-child(2) {
  margin-top: 51px;
}
.color_2 {
  font-family: PingFangSC-Regular;
  color: #999999;
  letter-spacing: 0;
  bottom: 10px;
}
.sp1 {
  color: #666;
  top: 10px;
}
</style>
