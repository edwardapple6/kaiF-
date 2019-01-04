<template>
  <div class="protocol">
    <mobPdf
      :readPro="readPro"
      :proTitle="proTitle"
      @HasShow="HasShow"
      :acceptData="acceptData"
      :proData="proData"
      :isKhfirst="isKhfirst"
      :hc_data="hc_data"
      ref="readbook"
    />
    <div class="curtain" v-show="isAlert">
      <div class="back">
        <div class="dialog01">
          <div class="title">委托确认</div>
          <div class="content">
            <ul>
              <li>
                <span class="span1">操作类别:</span>
                <span class="span2">基金转换</span>
              </li>
              <li>
                <span class="span1">转出基金:</span>
                <span class="span2">{{hc_data[4]}}</span>
              </li>
              <li>
                <span class="span1">基金名称:</span>
                <span class="span2">{{hc_data[7]}}</span>
              </li>
              <li>
                <span class="span1">转入基金:</span>
                <span class="span2">{{hc_data[2]}}</span>
              </li>
              <li>
                <span class="span1">基金名称:</span>
                <span class="span2">{{hc_data[8]}}</span>
              </li>
              <li>
                <span class="span1">转换份额:</span>
                <span class="span2">{{hc_data[6]}}</span>
              </li>
            </ul>
          </div>
          <div class="button_1 btn1" @click="cancle">取消</div>
          <div class="button_1 btn2" @click="sure">确定</div>
        </div>
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
    <button
      v-show="isShow_1"
      v-bind:class="isDisable?'btnunactive':'btnactive'"
      @click="Jumpclick"
      :disabled="isDisable"
    >{{msg}}</button>
  </div>
</template>
<script>
import tdxct from "../../lib/connect.js";
import { pageURL } from "../../common/pageUrl.js";
import mobPdf from "../../components/mob-pdf";
export default {
  components: { mobPdf },
  data() {
    return {
      msg: "请仔细阅读上述协议",
      readPro: [],
      proTitle: "",
      isDisable: true,
      total: 3,
      isShow_1: false,
      acceptData: [],
      content: "",
      title: "提示",
      pageId: "ydqrs",
      isAlert: false, //基金转换点击阅读按钮之后显示确认弹框
      AccInfoData: [],
      proData: [], //保存约定B获取的F149
      isKhfirst: true,
      pdfDoc: null,
      hc_data: [],
      pageid_str: "", //传参过来的pageid
      f1284: "",
      isAlertMsg: false,
      isNext: true,
      mobsys: "",
      index:0,
    };
  },
  created() {
    // this.getAccInfo()
    
  },
  methods: {
    Jumpclick: function() {
      var that02 = this;
      that02.msg = "正在处理，请稍后...";
      if (that02.pageid_str == "jjkh") {
        var itempdf = window.localStorage.getItem('khpdfdata')
        itempdf = JSON.parse(itempdf)
        console.log(itempdf)
        if(itempdf != '' && itempdf != null){
          itempdf[that02.index].isChecked = true;
          itempdf = JSON.stringify(itempdf)
          window.localStorage.setItem('khpdfdata',itempdf)
        }
        that02.JumpFunc();
        // if (that02.isNext == true) {
        //   if (that02.isKhfirst == true) {
        //     that02.isKhfirst = false;
        //     that02.$refs.readbook.getBase64Data(
        //       base64Str,
        //       strPOS,
        //       that02.hc_data[2],
        //       that02.hc_data[3],
        //       that02.hc_data[0],
        //       that02.acceptData[0][1].code,
        //       that02.acceptData[1]
        //     );
        //     that02.$refs.readbook.alertShow = true;
        //     that02.$refs.readbook.loadNum = 0;
        //     that02.isDisable = true;
        //     that02.total = 3;
        //   } else {
        //     console.log(that02.hc_data)
        //     that02.isNext = false;
        //     that02.continue_sdx(
        //       that02.hc_data[0],
        //       that02.hc_data[2],
        //       that02.hc_data[3],
        //       that02.acceptData[2]
        //     );
        //   }
        // }
      } else if (that02.pageid_str === "jjzh") {
        console.log(that02.hc_data);
        if (that02.isNext == true) {
          that02.isNext = false;
          that02.continue_sdx(
            that02.hc_data[0],
            that02.hc_data[2],
            that02.hc_data[3],
            that02.acceptData[2]
          );
        }
      }
    },
    //适当性
    sdxkt(paramcode, khh, wtfs, jjgs, gsdm, idx) {
      var that03 = this;
      var param = [
        {
          F362: paramcode,
          F1217: "SDX.CHECK_RISK_PRODUCTCODE,",
          F120: khh,
          F110: wtfs,
          F391: jjgs,
          F393: gsdm
        }
      ];
      console.log(idx);
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
              }
            }
            console.log(newArr);
            that03.proData = newArr;
            var base64Str = "";
            var strPOS = "original";
            that03.acceptData.push(newArr);
            that03.acceptData.push(result.rows[0].F1284);
            that03.acceptData.push(result.rows[0].F1217);
            console.log(newArr[0].code);
            that03.$refs.readbook.getBase64Data(
              base64Str,
              strPOS,
              jjgs,
              gsdm,
              paramcode,
              newArr[0].code,
              that03.acceptData[1]
            );
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

    HasShow(e) {
      this.isShow_1 = e;
      if (this.isDisable == true && this.isShow_1 == true) {
        let clock = window.setInterval(() => {
          this.msg = "请仔细阅读上述协议" + "(" + this.total-- + "s)";
          if (this.total == -1) {
            this.msg = "我已阅读并同意";
            this.isDisable = false;
            clearInterval(clock);
          }
        }, 1000);
      }
      console.log(e);
    },
    //获取账号信息
    getAccInfo() {
      var that04 = this;
      var base64Str = "";
      var strPOS = "original";
      tdxct.tdxgetAccList(function(data) {
        var n = 0;
        if (
          tdxct.tdxCheckMobSys() == "WEB-IOS" ||
          tdxct.tdxCheckMobSys() == "IOS"
        ) {
          var result = JSON.parse(data);
          for (var i in result) {
            if (result[i].HostType == 0) {
              that04.AccInfoData = result[i];
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
              that04.AccInfoData = result;
              break;
            }
          }
        }
      });
    },
    //基金转换
    jjzh(wtfs) {
      var that07 = this;
      var paramSubmit = [
        {
          F110: wtfs,
          F426: that07.hc_data[3],
          F417: that07.hc_data[5],
          F402: that07.hc_data[4],
          F407: that07.hc_data[2],
          F405: that07.hc_data[6],
          F468: "0",
          F429: "0",
          F1223: "1"
        }
      ];
      if (that07.mobsys === "IOS" || that07.mobsys === "WEB-IOS")
        paramSubmit[0].tdxPageID = "_Base64";
      tdxct.JYCallTql("2104", paramSubmit, { Way: "qs" }, function(data) {
        var resultSubmit = tdxct.FormatResult(data);
        console.log(resultSubmit);
        if (
          parseInt(resultSubmit.ErrorCode) === 0 &&
          parseInt(resultSubmit.Num) >= 1
        ) {
          console.log(resultSubmit);
          that07.localstorage(
            "jjzhAlertMsg",
            "开放式基金转换已提交，合同号是" + resultSubmit.rows[0].F146
          );
          that07.JumpFunc();
        } else {
          that07.localstorage("jjzhAlertMsg", resultSubmit.ErrorInfo);
          that07.JumpFunc();
        }
      });
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
    change(e) {
      this.isShow = e;
      console.log(e);
    },
    JumpFunc() {
      //页面跳转函数
      tdxct.WEBCallTql("ReturnToSuperior", "", "");
    },
    sure() {
      this.jjzh(this.AccInfoData.WTFS);
      this.isAlert = false;
      window.localStorage.removeItem("jjzh");
    },
    cancle() {
      this.isAlert = false;
    },
    //继续做适当性
    continue_sdx(paramcode, jjgs, gsdm, remark) {
      var that08 = this;
      let param = [
        {
          // tdxPageID:'_Base64',
          F362: paramcode,
          F1217: remark,
          F391: jjgs,
          F393: gsdm
        }
      ];

      tdxct.JYCallTql("198", param, { Way: "qs" }, function(data) {
        let result = tdxct.FormatResult(data);
        if (parseInt(result.ErrorCode) === 0) {
          if (result.rows == "") {
            if (that08.pageid_str == "jjkh") {
              that08.khcx(that08.AccInfoData.WTFS);
            } else if (that08.pageid_str === "jjzh") {
              that08.isAlert = true;
            }
          } else {
            if (that08.pageid_str == "jjkh") {
              switch (parseInt(result.rows[0].F1223)) {
                case 0:
                  that08.khcx(that08.AccInfoData.WTFS);
                  break;
                case 1:
                  break;
                case 3:
                  break;
                case 4:
                  if (
                    result.rows[0].F149.indexOf("FileNotFoundException") != -1
                  ) {
                    that08.isAlertMsg = true;
                    that08.content =
                      "本次协议签署失败，可能是因为您的资料中关键信息缺失，请到营业部或致电我司统一客服热线95351进行处理!";
                  } else {
                    that08.isAlertMsg = true;
                    that08.content = result.rows[0].F149;
                  }
                  break;
                case 7:
                  that08.continue_sdx(paramcode, jjgs, gsdm, result.rows.F1217);
                  break;
              }
              // that08.khcx(that08.AccInfoData.WTFS);
            } else if (that08.pageid_str === "jjzh") {
              switch (parseInt(result.rows[0].F1223)) {
                case 0:
                  that08.isAlert = true;
                  break;
                case 1:
                  break;
                case 3:
                  break;
                case 4:
                  that08.isAlertMsg = true;
                  that08.content =
                    "本次协议签署失败，可能是因为您的资料中关键信息缺失，请到营业部或致电我司统一客服热线95351进行处理!";
                  break;
                case 7:
                  that08.continue_sdx(paramcode, jjgs, gsdm, result.rows.F1217);
                  break;
              }
            }
          }
        } else {
          that08.isAlertMsg = true;
          that08.content = result.ErrorInfo;
        }
      });
    },
    tdxActivity() {},
    setPartHeight() {},
    changeFontSize() {},
    btnClicked() {
      this.isAlertMsg = false;
      this.isDisable = true;
      this.msg = "我已阅读并同意";
    }
  },
  mounted() {
    var that01 = this;
    that01.mobsys = tdxct.tdxCheckMobSys();
    var searchUrl = window.location.href;
    var arrData = [];
    var searchText1 = decodeURI(searchUrl);
    var searchData = searchText1.split("{fg}");
    that01.index = searchData[3]
    console.log(searchData);
    that01.pageid_str = searchData[1];
    if (that01.pageid_str === "jjzh") {
      var item_jjzh = window.localStorage.getItem("jjzh");
      if (item_jjzh != "" || item_jjzh != null) {
        item_jjzh = JSON.parse(item_jjzh);
        that01.hc_data = item_jjzh;
        that01.sdxkt(
          item_jjzh[0],
          item_jjzh[9].KHH,
          item_jjzh[9].WTFS,
          item_jjzh[2],
          item_jjzh[3]
        );
        console.log(item_jjzh);
      }
    } else if (that01.pageid_str === "jjkh") {
      searchData[2] = JSON.parse(searchData[2])
      var idx = searchData[3]
      var item_jjkh = window.localStorage.getItem("jjkh");
      console.log(item_jjzh);
      if (item_jjkh != "" || item_jjkh != null) {
        // if(){}
        var base64Str = "";
        var strPOS = "original";
        item_jjkh = JSON.parse(item_jjkh);
        console.log(item_jjkh)
        that01.hc_data = item_jjkh;
        that01.$refs.readbook.getBase64Data(
          base64Str,
          strPOS,
          that01.hc_data[2],
          that01.hc_data[3],
          that01.hc_data[0],
          searchData[2].code,
          item_jjkh[5]
        );
      }
    }
  }
};
</script>
<style scoped>
.protocol {
  width: 100%;
}
.btnactive {
  background-color: #fd671a;
  width: 92%;
  height: 48px;
  font-size: 18px;
  outline: none;
  border: none;
  color: #fff;
  border-radius: 5px;
  margin-left: 4%;
  margin-bottom: 20px;
}
.btnunactive {
  background-color: #ffb48d;
  width: 92%;
  height: 48px;
  font-size: 18px;
  outline: none;
  border: none;
  color: #fff;
  border-radius: 5px;
  margin-left: 4%;
  margin-bottom: 20px;
}
p {
  background-color: #fff;
  text-align: left;
}

.btn1 {
  border-right: 1.5px solid #f0f0f0;
  color: #999;
}
.btn2 {
  color: #fd671a;
}
li {
  height: 30px;
  width: 100%;
  position: relative;
}
.span1 {
  position: absolute;
  top: 0;
  left: 0;
}
.span2 {
  position: absolute;
  top: 0;
  left: 80px;
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
.dialog01 {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 280px;
  transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  /* margin-left: -140px; */
  background-color: white;
  border-radius: 5px;
  z-index: 1002;
  text-align: center;
}
.button_1 {
  display: inline-block;
  width: 45%;
  height: 44px;
  line-height: 44px;
  font-size: 18px;
}
</style>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
* {
  margin: 0;
  padding: 0;
  list-style: none;
  -webkit-touch-callout:none;
  -webkit-user-select:none;
  -khtml-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
html,
body {
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #f0f0f0;
}
</style>