<template>
    <div id="yjzcn">
        <ul class="yjzcn_content">
            <li class="yjzcn_content_li" v-for="(data,index) in dataList" :key="index">
                <p class="yjzcn_content_li_p_1" @click="checked(data,dataList)">
                    <span class="squery"></span>
                    <img src="../../../static/more_checked.png" alt="" v-show="data.img_show">
                    <span class="name">{{data.F403}}</span>
                    <span class="num">{{data.F402}}</span>
                </p>
                <p class="yjzcn_content_li_p_2">
                    <span class="accumulated_earnings">累积收益</span>
                    <span class="accumulated_earnings_num">{{data.F204}}</span>
                    <span class="discount">折价</span>
                    <span class="discount_num">{{data.discount_num}}</span>
                    <img src="../../../static/below.png" :class="[data.rotate?'go':'aa']" @click="start(data)" alt="">
                </p>
                <div class="detial" v-show="data.rotate">
                    <p class="detial_p_1">
                        <span class="detial_p_1_span_1">单位净值：{{data.F406}}</span>
                        <span class="detial_p_1_span_2">{{data.date}}</span>
                    </p>
                    <p class="detial_p_2">
                        <span class="detial_p_2_span_1">最新：{{data.F203}}</span>
                        <span class="detial_p_2_span_2">{{data.dateil_date}}</span>
                    </p>
                </div>
                <p class="yjzcn_content_li_p_4">
                    <span class="Convertible_amount" ref="Convertible_1">可转份额</span>
                    <span class="Convertible_amount_num" ref="Convertible_2">{{data.F410}}</span>
                    <span class="regulate_contorl" ref="Convertible_3">
                        <span class="subtract" @click="subtract(data)">-</span>
                        <span class="span_content">{{data.Convertible_amount_num}}</span>
                        <span class="add" @click="add(data)">+</span>
                    </span>
                </p>
            </li>
            <li class="alertMsg"><img src="../../../static/Shape@2x.png" alt=""> 申请提交后，请于2个工作日后查询持仓</li>
        </ul>
        <div id="foot">
          <p class="foot_p_1" @click="all_checked(dataList)">
            <img src="../../../static/more_checked.png" alt="" v-show="all_checked_show" >
            <span class="squery"></span>
            <span class="all_checked">全选</span>
          </p>
          <p class="foot_p_2" @click="Reqinfo(dataList)">一键转场内</p>
        </div>
    </div>
</template>
<script>
import tdxct from "../../lib/connect.js";
export default {
  data() {
    return {
      // img_show:false,
      all_checked_show: false,
      dataList: [],
      AccInfoData: [] //账号信息
    };
  },
  created() {
    this.ReqFunc();
    // this.getAccInfo();
    var that = this;
    var params = [
      {
        F110: "7",
        F1207: "P",
        F362: "Mobile.Stock.kfsjj.yjzcn"
      }
    ];
    tdxct.JYCallTql("2126", params, { Way: "qs" }, function(data) {
      var result = tdxct.FormatResult(data);
      console.log(result);
      if (parseInt(result.ErrorCode) === 0 && parseInt(result.Num) >= 1) {
      } else if (
        parseInt(result.ErrorCode) === 0 &&
        parseInt(result.Num) === 0
      ) {
      } else {
        alert(result.ErrorInfo);
      }
    });
  },
  methods: {
    //单项选中
    checked(item, obj) {
      var num = 0;

      //首先如果判断obj.img_show布尔值
      if (item.img_show == true) {
        //然后判断全选按钮的图片是否高亮
        if (this.all_checked_show == true) {
          //如果高亮就取消
          this.all_checked_show = false;
        }
        //使其布尔值=其的非值
        item.img_show = !item.img_show;
      } else if (item.img_show == false) {
        item.img_show = true;
      }
      for (var i in obj) {
        //首先获取到当前有多少项被选中
        if (obj[i].img_show == true) {
          num++;
        }
      }
      var objLength = obj.length;
      console.log(objLength);
      console.log(num);
      if (num == objLength) {
        //如果被选中的数量跟数据的长度一样，则全选按钮高亮，否则就灰掉
        this.all_checked_show = true;
      } else {
        this.all_checked_show = false;
      }
    },
    start(obj) {
      //折价的详情显示
      obj.rotate = !obj.rotate;
    },
    //减少1
    subtract(obj) {
      obj.Convertible_amount_num = obj.Convertible_amount_num - 1;
    },
    //加
    add(obj) {
      obj.Convertible_amount_num = Number(obj.Convertible_amount_num) + 1;
    },
    //全部选中或者取消
    all_checked(obj) {
      this.all_checked_show = !this.all_checked_show;
      if (this.all_checked_show == true) {
        var n = 0;
        for (var i in obj) {
          if (obj[i].img_show == true) {
            n++;
          } else {
            obj[i].img_show = true;
          }
        }
      } else {
        for (var i in obj) {
          if (obj[i].img_show == false) {
            n++;
          } else {
            obj[i].img_show = false;
          }
        }
      }
    },
    //请求份额列表数据函数
    ReqFunc(funcId, titleMsg) {
      var that = this;
      var params = [
        {
          F110: "7",
          F1207: "P",
          F362: "Mobile.Stock.kfsjj.yjzcn"
        }
      ];
      tdxct.JYCallTql("2106", params, { Way: "qs" }, function(data) {
        var result = tdxct.FormatResult(data);
        console.log(result);
        if (parseInt(result.ErrorCode) === 0 && parseInt(result.Num) >= 1) {
          var n = 0;
          var alldata = result.rows;
          for (var i in alldata) {
            alldata[i].img_show = false;
            alldata[i].rotate = false;
            alldata[i].discount_num =
              Math.floor((alldata[i].F203 / alldata[i].F406 - 1) * 100) / 100;
            alldata[i].F410 = Math.floor(alldata[i].F410);
            alldata[i].Convertible_amount_num = alldata[i].F410;
          }
          that.dataList = alldata;
        } else if (
          parseInt(result.ErrorCode) === 0 &&
          parseInt(result.Num) === 0
        ) {
        } else {
          alert(result.ErrorInfo);
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
              // _self.getdata(result[i].WTFS);
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
              _self.Reqinfo(result.WTFS, result.KHH);
              break;
            }
          }
        }
      });
    },
    //请求数据函数
    Reqinfo(WTFS, KHH) {
      var that = this;
      var params = [
        {
          F110: WTFS,
          F120: KHH,
          F1207: "P",
          F362: "Mobile.Stock.kfsjj.yjzcn",
          F426: "98",
          F417: "980516653679",
          F402: "168102",
          F113: "1",
          F144: "300",
          F1223: "0"
        }
      ];
      console.log(params);
      tdxct.JYCallTql("2542", params, { Way: "qs" }, function(data) {
        var result = tdxct.FormatResult(data);
        console.log(result);
        if (parseInt(result.ErrorCode) === 0 && parseInt(result.Num) >= 1) {
        } else if (
          parseInt(result.ErrorCode) === 0 &&
          parseInt(result.Num) === 0
        ) {
        } else {
          alert(result.ErrorInfo);
        }
      });
    }
  }
};
</script>
<style>
* {
  padding: 0;
  margin: 0;
}
ul {
  list-style: none;
}
input,
button {
  outline: none;
}
body {
  background-color: #f0f0f0;
  overflow-x: hidden;
  position: relative;
  /* font-size:0; */
}
.yjzcn_content {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 51px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
}
.yjzcn_content_li {
  background-color: #fff;
  margin-bottom: 11px;
}
.yjzcn_content_li_p_1,
.yjzcn_content_li_p_2 {
  height: 50px;
  position: relative;
}
.yjzcn_content_li_p_2 img {
  position: absolute;
  top: 23px;
  left: 298px;
  width: 12px;
  height: 7px;
}
.name,
.num {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  display: inline-block;
  height: 50px;
  line-height: 50px;
}
.name {
  position: absolute;
  left: 44px;
  top: 0;
}
.num {
  position: absolute;
  top: 0;
  right: 15px;
}
.squery {
  display: inline-block;
  height: 12px;
  width: 12px;
  border: 1.5px solid #000;
  position: absolute;
  top: 17px;
  left: 15px;
  border-radius: 2px;
}
.yjzcn_content_li_p_1 img {
  width: 15px;
  position: absolute;
  top: 17px;
  left: 15px;
}
.yjzcn_content_li_p_1 {
  border-bottom: 1.5px solid #f0f0f0;
}
.accumulated_earnings,
.accumulated_earnings_num,
.discount,
.discount_num {
  position: absolute;
  top: 0;
  height: 50px;
  line-height: 50px;
}
.accumulated_earnings {
  left: 15px;
  font-size: 14px;
  color: #333;
}
.accumulated_earnings_num {
  left: 75px;
  font-size: 16px;
  color: #fd671a;
}
.discount {
  left: 207px;
  font-size: 14px;
  color: #333;
}
.discount_num {
  left: 239px;
  font-size: 16px;
  color: #22bd22;
}
.detial {
  height: 50px;
  /* width:750px; */
  position: relative;
  background-color: #f0f0f0;
}
.detial_p_1,
.detial_p_2 {
  position: absolute;
  top: 0;

  height: 50px;
  width: 50%;
}
.detial_p_1 {
  left: 15px;
}
.detial_p_2 {
  left: 207px;
}
.detial_p_1_span_1,
.detial_p_1_span_2,
.detial_p_2_span_1,
.detial_p_2_span_2 {
  position: absolute;
  left: 0;
}
.detial_p_1_span_1,
.detial_p_2_span_1 {
  top: 6px;
  font-size: 14px;
}
.detial_p_1_span_2,
.detial_p_2_span_2 {
  top: 28px;
  font-size: 12px;
  color: #999;
}
.yjzcn_content_li_p_4 {
  height: 70px;
  position: relative;
}
.Convertible_amount,
.Convertible_amount_num {
  position: absolute;
}
.Convertible_amount {
  left: 15px;
  top: 19px;
  font-size: 14px;
  color: #333;
}
.Convertible_amount_num {
  left: 76px;
  top: 20px;
  color: #fd671a;
  font-size: 16px;
}
.regulate_contorl {
  width: 170px;
  height: 40px;
  position: absolute;
  top: 10px;
  left: 190px;
  right: 15px;
}
.subtract,
.add {
  position: absolute;
  top: 0;
  height: 40px;
  width: 40px;
  background-color: #ff8f57;
  color: #fff;
  font-size: 30px;
  text-align: center;
  line-height: 40px;
}
.subtract {
  left: 0;
  border-radius: 5px 0 0 5px;
}
.add {
  left: 130px;
  border-radius: 0 5px 5px 0;
}
.span_content {
  border: 2px solid #ff8f57;
  position: absolute;
  left: 39px;
  top: 0;
  height: 36px;
  width: 90px;
  font-size: 14px;
  line-height: 36px;
  text-align: center;
}
.aa {
  transition: all 0.2s;
}
.go {
  transform: rotate(-180deg);
  -webkit-transform: rotate(-180deg);
  transition: all 0.2s;
  -webkit-transition: all 0.2s;
}
#foot {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  width: 100%;
}
.foot_p_1 {
  height: 50px;
  width: 40%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
}
.foot_p_2 {
  height: 50px;
  width: 60%;
  position: absolute;
  top: 0;
  right: 0;
  /* left: 294px; */
  line-height: 50px;
  text-align: center;
  background-color: #fd671a;
  color: #fff;
  font-size: 15px;
}
.foot_p_1 img {
  width: 15px;
}
.foot_p_1 .squery,
.foot_p_1 img {
  position: absolute;
  top: 18px;
  left: 46px;
}
.all_checked {
  position: absolute;
  top: 14px;
  left: 70px;
  font-size: 15px;
  color: #333;
}
/*底部提示信息*/
.alertMsg {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #999999;
  letter-spacing: 0;
  text-align: center;
  margin: 40px 0;
  position: relative;
  height: 20px;
  line-height: 20px;
}
.alertMsg img {
  width: 16px;
  height: 16px;
  margin-bottom: -3px;
}
</style>
