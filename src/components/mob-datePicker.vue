<template>
    <div id="Head">
      <div id="datepicker">
        <div class="start">
          <span class="startInfo">起始日期</span>
          <span class="span_value1"  @click="startPicker()"><img  src="../../static/28.png" alt="">{{picker_value1}}</span>
        </div><i>|</i>
        <div class="end">
          <span class="endInfo">结束日期</span>
          <span class="span_value2"  @click="endPicker()">
            <img src="../../static/28.png" alt="">{{picker_value2}} 
          <!-- <span v-show="isShow_3" class="endCancle">x</span>  -->
          </span>
        </div>
      </div>
      <mt-datetime-picker
        v-model="value1"
        type="date"
        ref="startpicker"
        year-format="{value} 年"
        month-format="{value} 月"
        @confirm="handleConfirm1()" 
        date-format="{value} 日">
      </mt-datetime-picker>
      <mt-datetime-picker
        v-model="value2"
        type="date"
        ref="endpicker"
        @confirm="handleConfirm2()" 
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日">
      </mt-datetime-picker>
      <button class="span_cx" @click="select_check()" :disabled="isDisable">查询</button>
      <div id="kjcx">
          <span class="kjcx_span">快捷查询：</span>
          <!-- <span class="kjcx_date" :class="type.selected ? 'active_2' : ''" v-for="(type, index) in types" v-on:click="choose(index)">{{type.type}}</span> -->
          <span class="kjcx_date" v-bind:class="{active_2:isSpanActive_1}" v-on:click="span_1_click()">&nbsp;一周内&nbsp;|</span>
          <span class="kjcx_date" v-bind:class="{active_2:isSpanActive_2}" v-on:click="span_2_click()">&nbsp;一月内&nbsp;|</span>
          <span class="kjcx_date" v-bind:class="{active_2:isSpanActive_3}" v-on:click="span_3_click()">三月内</span>
      </div>
      <connect
       :picker_value1='picker_value1'
       :picker_value2='picker_value2'
       ref="cjcxData"
      />
    </div>
</template>
<script>
import tdxct from "../lib/connect.js";
import connect from './mob-cxconnect'
export default {
  components:{
    connect
  },
  data() {
    return {
      isSpanActive_1: false,
      isSpanActive_2: false,
      isSpanActive_3: false,
      value1: new Date(),
      value2: new Date(),
      picker_value1: "",
      picker_value2: "",
      isDisable: false,
      reqdata: [],
      submit_msg: "查询",
      earningsSum: "",
      isShow: true
    };
  },
  methods: {
    startPicker() {
      // console.log(this.$refs)
      this.$refs.startpicker.open();
    },
    endPicker() {
      this.$refs.endpicker.open();
    },
    //当时间选择完成点击确定时触发
    handleConfirm1() {
      this.picker_value1 = this.formatDate(this.$refs.startpicker.value);
      if (this.picker_value2 != "") {
        if (this.picker_value1 > this.picker_value2) {
          var str = this.picker_value2;
          this.picker_value2 = this.picker_value1;
          this.picker_value1 = str;
        }
      }
      //   console.log(this.formatDate(this.$refs.startpicker.value));
      // console.log(this.value) ;
    },
    //当时间选择完成点击确定时触发
    handleConfirm2() {
      this.picker_value2 = this.formatDate(this.$refs.endpicker.value);
      if (this.picker_value2 != "") {
        if (this.picker_value1 > this.picker_value2) {
          var str = this.picker_value2;
          this.picker_value2 = this.picker_value1;
          this.picker_value1 = str;
        }
      }
      //   console.log(this.formatDate(this.$refs.rqhy_endpicker.value));
      // console.log(this.value) ;
    },
    //时间格式转换
    formatDate(date) {
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "" + m + "" + d;
    },
    //点击查询
    select_check: function() {
      var __ = this;
      this.isDisable = true;
      __.isSpanActive_1 = false;
      __.isSpanActive_2 = false;
      __.isSpanActive_3 = false;
      // console.log(this.picker_value1);
      // console.log(this.picker_value2);
      if (this.picker_value1 == "" || this.picker_value2 == "") {
        alert("开始时间或者结束时间不能为空");
      } else {
        this.$refs.cjcxData.getAccInfo(this.picker_value1,this.picker_value2)
        
      }
      //防止短时间内连续点击发送请求
      setTimeout(function() {
        __.isDisable = false;
        // alert(this.flag)
      }, 1500);
    },
    //一周内查询数据
    span_1_click: function() {
      var arr = [];
      this.date_deffined(arr, 7,1);
      this.kjcx_change_1();
      this.picker_value1 = arr[0];
      this.picker_value2 = arr[1];
      // console.log(arr[0])
      // console.log(arr[1])
      this.$refs.cjcxData.getAccInfo(arr[0],arr[1])
    },
    //一月内查询数据
    span_2_click: function() {
      var arr = [];
      this.kjcx_change_2();
      this.date_deffined(arr, 0,0);
      this.picker_value1 = arr[0];
      this.picker_value2 = arr[1];
      this.$refs.cjcxData.getAccInfo(arr[0],arr[1])
      
    },
    //三月内查询数据
    span_3_click: function() {
      var arr = [];
      this.kjcx_change_3();
      this.date_deffined(arr, 0,-2);
      this.picker_value1 = arr[0];
      this.picker_value2 = arr[1];
      this.$refs.cjcxData.getAccInfo(arr[0],arr[1])
      // this.data_receive(this.rzhy_data, endData, nowData);
    },
    //快捷查询时间计算
    date_deffined: function( arr,datNum, Monthnum) {
      var startDate = new Date();
      var oldDate = new Date(startDate.getTime() - datNum * 24 * 3600 * 1000);
      var startYear = startDate.getFullYear().toString();
      var startMonth = (startDate.getMonth() + 1).toString();
      var startDay = startDate.getDate().toString();
      var endMonth = (oldDate.getMonth() + 1 * Monthnum).toString();
      var endYear = oldDate.getFullYear().toString();
      var endDay = oldDate.getDate().toString();
      startMonth = startMonth < 10 ? "0" + startMonth : startMonth;
      startDay = startDay < 10 ? "0" + startDay : startDay;
      endMonth = endMonth < 10 ? "0" + endMonth : endMonth;
      endDay = endDay < 10 ? "0" + endDay : endDay;
      var nowData = startYear + "" + startMonth + "" + startDay;
      var endData = endYear + "" + endMonth + "" + endDay;
      arr.push(endData);
      arr.push(nowData);
      return arr;
    },
    // date_deffined: function(arr, dayNum, Monthnum) {
    //   var startDate = new Date();
    //   var oldDate = new Date(startDate.getTime());
    //   var startYear = startDate.getFullYear().toString();
    //   var startMonth = (startDate.getMonth() + 1).toString();
    //   var startDay = startDate.getDate().toString();
    //   var endMonth = (oldDate.getMonth() + 1 * Monthnum).toString();
    //   var endYear = oldDate.getFullYear().toString();
    //   var endDay = (oldDate.getDate() + 1 * dayNum).toString();
    //   console.log(oldDate.getDate())
    //   startMonth = startMonth < 10 ? "0" + startMonth : startMonth;
    //   startDay = startDay < 10 ? "0" + startDay : startDay;
    //   endMonth = endMonth < 10 ? "0" + endMonth : endMonth;
    //   endDay = endDay < 10 ? "0" + endDay : endDay;
    //   var nowData = startYear + "" + startMonth + "" + startDay;
    //   var endData = endYear + "" + endMonth + "" + endDay;
      
    //   arr.push(endData);
    //   arr.push(nowData);
    //   return arr;
    // },
    //快捷查询选中样式更改
    kjcx_change_1: function() {
      if (this.isSpanActive_1) {
        this.isSpanActive_1 = true;
        this.isSpanActive_2 = false;
        this.isSpanActive_3 = false;
      } else {
        this.isSpanActive_1 = true;
        this.isSpanActive_2 = false;
        this.isSpanActive_3 = false;
      }
    },
    kjcx_change_2: function() {
      if (this.isSpanActive_2) {
        this.isSpanActive_2 = true;
        this.isSpanActive_1 = false;
        this.isSpanActive_3 = false;
      } else {
        this.isSpanActive_2 = true;
        this.isSpanActive_1 = false;
        this.isSpanActive_3 = false;
      }
    },
    kjcx_change_3: function() {
      if (this.isSpanActive_3) {
        this.isSpanActive_3 = true;
        this.isSpanActive_1 = false;
        this.isSpanActive_2 = false;
      } else {
        this.isSpanActive_3 = true;
        this.isSpanActive_1 = false;
        this.isSpanActive_2 = false;
      }
    },
  },
  mounted() {
    this.span_1_click()
  },
};
</script>
<style scoped>
#Head {
  position: fixed;
  top: 0px;
  left: 0;
  width: 100%;
  height: 160px;
  background-color: #fff;
}
#datepicker {
  position: absolute;
  top: 20px;
  left: 0;
  height: 50px;
  width: 100%;
}
.startInfo,
.endInfo {
  text-align: left;
  color: #9b9c9c;
  font-size: 14px;
}
.start,
.end {
  display: inline-block;
  position: absolute;
  top: 0;
  /* left: 10px; */
  width: 25%;
}
.start {
  left: 30px;
}
.end {
  right: 30px;
}
#datepicker img {
  width: 12px;
  position: absolute;
  left: 0;
  top: 27px;
}
i {
  position: absolute;
  top: 14px;
  left: 46%;
  color: #9b9c9c;
}
.span_cx {
  display: inline-block;
  position: absolute;
  top: 80px;
  left: 5%;
  font-size: 16px;
  /* margin-left:-150px; */
  width: 90%;
  height: 40px;
  line-height: 20px;
  border-radius: 3px;
  background-color: #fd671a;
  color: #fff;
  border: none;
}
#kjcx
{
  font-size: 14px;
  position: absolute;
  top: 120px;
  left: 5%;
  width: 100%;
  text-align: left;
  background-color: #fff;
  color: #9b9b9c;
  /* padding: 0 10px; */
}
.kjcx_span {
  display: inline-block;
  height: 40px;
  line-height:40px;
  background-color: #fff;
}
.kjcx_date {
  display: inline;
}
.span_value1,
.span_value2 {
  display: inline-block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  text-align: right;
  /* border: 1px solid red; */
}
.active_2{
  color: #fd671a;
}
</style>
