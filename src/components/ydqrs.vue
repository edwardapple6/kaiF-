<template>
    <div class="protocol">
        <p>
         <mobPdf
         :readPro="readPro"
         :proTitle="proTitle"
         @HasShow='HasShow'
         :acceptData='acceptData'
         />
        </p>
        <AlertInfo
        :title='title'
        :content='content'
        v-show="isShow"
        @info-btn01='change'
        />
        <button v-show="isShow_1" v-bind:class="isDisable?'btnunactive':'btnactive'" @click="Jumpclick" :disabled='isDisable'>{{msg}}</button>
    </div>
</template>
<script>
import tdxct from "../lib/connect.js";
import {pageURL} from '../common/pageUrl.js'
import mobPdf from "./mob-pdf";
import AlertInfo from './dlgInfo'
export default {
  components: { mobPdf,AlertInfo },
  data() {
    return {
      msg: "",
      readPro: [],
      proTitle: "",
      isDisable: true,
      total: 10,
      isShow_1: false,
      acceptData:[],
      content:'',
      title:'提示',
      isShow:false
    };
  },
  created() {
    
  },
  methods: {
    Jumpclick: function() {
      this.getAccInfo()
      //页面跳转函数
      tdxct.WEBCallTql(
        "tdxOpenUrl",
        {
          OpenName: "开户",
          OpenType: "native",
          OpenUrl: pageURL.khUrl,
          OpenParam: {
            UrlType: "Remote"
            // UrlType: "Absolute"
          }
        },
        function() {}
      );
    },
    HasShow(e) {
      this.isShow_1 = e;
      if (this.isDisable == true && this.isShow_1 == true) {
        let clock = window.setInterval(() => {
          this.msg = "请仔细阅读上述协议" + "(" + this.total-- + "s)";
          if (this.total == 0) {
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
      var _self = this;
      var base64Str = "";
      var strPOS = "original";
      tdxct.tdxgetAccList(function(data) {
        var n = 0;
        if (tdxct.tdxCheckMobSys() == "WEB-IOS" || tdxct.tdxCheckMobSys() == "IOS") {
          var result = JSON.parse(data);
          for (var i in result) {
            if (result[i].HostType == 0) {
              _self.AccInfoData = result[i];
              _self.khcx(result[i].WTFS)
              break;
            }
          }
        } else if (tdxct.tdxCheckMobSys() == "WEB-Android" || tdxct.tdxCheckMobSys() == "Android") {
          for (var i in data) {
            var result = JSON.parse(data[i]);
            if (result.HostType == 0) {
              console.log(result);
              _self.AccInfoData = result;
              console.log( n++)
              _self.khcx(result.WTFS)
              // _self.getBase64Data(strPOS,base64Str,result.KHH,result.WTFS,jjgs,gsdm);
              break;
            }
          }
        }
      });
    },
    //开放式基金资金帐户开户查询
    khcx(wtcx){
      var that = this;
      var funcId = '2118';
      var param = [{
        F110:wtcx,
        F113:'0'
      }];
      tdxct.JYCallTql(funcId,param,{Way:'qs'},function(data){
        var result = tdxct.FormatResult(data)
        if(parseInt(result.ErrorCode) === 0 && parseInt(result.Num) >= 1){
          var allData = result.rows[0];
          that.kh_sure(allData,wtcx)
        }else{
          alert(result.ErrorInfo)
        }
        
        console.log(result)
      })
    },
    //开户委托函数
    kh_sure(data,wtfs){
      var __ = this;
      var params = [{
        F110:wtfs,
        F426:'01',
        F417:'',
        F113:'1',
        F122:data.F122,
        F950:data.F950,
        F128:data.F128,
        F129:data.F129,
        F450:data.F450,
        F454:data.F454,
        F455:data.F455,
        F456:data.F456,
        F463:data.F463,
        F457:data.F457,
        F458:'',
        F459:'',
        F465:'',
        F467:'',
        F952:data.F952,
        F953:data.F953,
        F452:data.F452,
        F464:data.F122,
      }]
      tdxct.JYCallTql('2118',params,{Way:'qs'},function(data){
        var result_2118 = tdxct.FormatResult(data);
         if(parseInt(result_2118.ErrorCode) === 0 && parseInt(result_2118.Num) >= 1){

         }else{
           __.isShow = true;
           __.content = result_2118.ErrorInfo
          //  alert(result_2118.ErrorInfo)
         }
        console.log(result_2118)
      })
    },
    change(e){
      this.isShow = e;
      console.log(e)
    },
    tdxActivity(){},
    setPartHeight(){},
    changeFontSize(){}
  },
  mounted() {
    
  }
};
</script>
<style scoped>
.protocol {
  width: 100%;
  /* height: 100%; */
  /* position: relative; */
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
  /* position: absolute;
  bottom: 0px;
  left: 50%;
  margin-left: -46%; */
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
  /* padding: 40px 20px 156px 20px; */
  /* margin-bottom: 100px; */
  text-align: left;
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
}
html,
body {
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #f0f0f0;
}

</style>