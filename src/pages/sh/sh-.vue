<template>
  <div id="app">
    <div id="top">
        <ul class="top_ul">
            <li><span>基金代码</span><input type="number" placeholder="请从下方持仓中选择赎回基金" class="fs14" ref="jjcode"></li>
            <li><span>基金名称</span><input type="text" disabled class="_disabled" ref="jjname"></li>
            <li><span>基金状态</span><input type="text" disabled class="_disabled" ref="jjstate"></li>
            <li><span>可赎份额</span><input type="text" disabled class="_disabled" ref="ksfe"></li>
            <li><span>赎回份额</span><input type="number" placeholder="请输入赎回份额" class="fs14 shfe" ref="shfe"><span class="allmoney" @click="allNum">全额</span></li>
        </ul>
        <Botton
        :msg="msg"
        />
    </div>
    
    <div id="CC_content">
        <ul class="CC_content_ul_title">
            <li class="CC_content_ul_title_li"><span class="CC_content_ul_title_li_span_1">基金名称</span><span class="CC_content_ul_title_li_span_2">基金代码</span></li>
            <li class="CC_content_ul_title_li"><span class="CC_content_ul_title_li_span_1">持有份额</span><span class="CC_content_ul_title_li_span_2">可用份额</span></li>
            <li class="CC_content_ul_title_li"><span class="CC_content_ul_title_li_span_1">昨日净值</span><span class="CC_content_ul_title_li_span_2">成本</span></li>
            <li class="CC_content_ul_title_li"><span class="CC_content_ul_title_li_span_1">盈亏金额</span><span class="CC_content_ul_title_li_span_2">市值</span></li>
        </ul>
        <ul class="CC_content_ul_content">
            <li class="CC_content_ul_content_li"  v-for="(data,index) in CC_data" :key="index" @click="select_checked(data)">
                <p class="CC_content_ul_content_li_p">
                    <span class="CC_content_ul_content_li_span_1 color_1">{{data.name}}</span>
                    <span class="CC_content_ul_content_li_span_2 color_2">{{data.code}}</span>
                </p>
                <p class="CC_content_ul_content_li_p">
                    <span class="CC_content_ul_content_li_span_1 color_3">{{data.haveMoney}}</span>
                    <span class="CC_content_ul_content_li_span_2 color_3">{{data.canmakeMoney}}</span>
                </p>
                <p class="CC_content_ul_content_li_p">
                    <span class="CC_content_ul_content_li_span_1 color_3">{{data.yestady}}</span>
                    <span class="CC_content_ul_content_li_span_2 color_3">{{data.cost}}</span>
                </p>
                <p class="CC_content_ul_content_li_p">
                    <span class="CC_content_ul_content_li_span_1 color_4">{{data.Profitloss}}</span>
                    <span class="CC_content_ul_content_li_span_2 color_2">{{data.marketValue}}</span>
                </p>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
import Botton from "../../components/mob-button";
export default {
  name: "App",
  components: {
    Botton
  },
  data() {
    return {
      msg: "确定",
      CC_data: [
        {
          name: "华夏理财30",
          code: "001057",
          haveMoney: "200.00",
          canmakeMoney: "100.00",
          yestady: "1.45",
          cost: "1.67",
          Profitloss: "5000.00",
          marketValue: "71152.06"
        },
        {
          name: "华夏理财30",
          code: "001057",
          haveMoney: "200.00",
          canmakeMoney: "100.00",
          yestady: "1.45",
          cost: "1.67",
          Profitloss: "6000.00",
          marketValue: "71152.06"
        },
        {
          name: "中国理财30",
          code: "001057",
          haveMoney: "200.00",
          canmakeMoney: "100.00",
          yestady: "1.45",
          cost: "1.67",
          Profitloss: "3000.00",
          marketValue: "71152.06"
        },
      ]
    };
  },
  methods:{
    select_checked(obj){
      this.$refs.jjcode.value = obj.code;
      this.$refs.jjname.value = obj.name;
      this.$refs.ksfe.value = obj.Profitloss;
    },
    allNum(){
      this.$refs.shfe.value = this.$refs.ksfe.value;
      
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
#top .top_ul{
  padding: 46px 30px 0 30px;
}
#top li {
  /* position: relative; */
  height: 84px;
  margin-bottom: 20px;
}
input {
  /* width: 257px; */
  width: 506px;
  height: 80px;
  color: #666;
  /* float: right; */
  /* position: absolute; */
  /* top:0; */
  /* right:30px; */
  padding: 0 20px;
  border-radius: 10px;
  border: #dbdbdb 2px solid;
  background-color: #fff;
}

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
  border: #fd671a 2px solid;
}
input._disabled {
  border: #f0f0f0 2px solid;
}
.fs14,
._disabled {
  font-size: 28px;
}
#top li span {
  color: #666;
  font-size: 28px;
  margin-right: 20px;
}
#top .allmoney {
  display: inline-block;
  background-color: #fd671a;
  color: #fff;
  font-size: 30px;
  font-family: PingFangSC-Regular;
  height: 80px;
  width: 140px;
  line-height: 80px;
  margin: 0;
  border-radius: 10px;
}
#top .shfe {
  width: 350px;
  height: 80px;
  margin-right: 20px;
}
/* 持仓 */
#CC_content {
  margin-top: 40px;
}
.CC_content_ul_title {
  font-size: 0;
  background-color: #f0f0f0;
  height: 100px;
}
.CC_content_ul_title_li,.CC_content_ul_content_li_p {
  height: 100px;
  font-size: 26px;
  display: inline-block;
  width: 25%;
  text-align: center;
  position: relative;
}
.CC_content_ul_content_li_p{
    width:24%;
    font-size:28px;
}
.CC_content_ul_title_li span,.CC_content_ul_content_li_p span {
  display: block;
  height: 32px;
  line-height: 32px;
  width: 100%;
  position: absolute;
  left: 0;
}
.CC_content_ul_title_li_span_1,.CC_content_ul_content_li_span_1 {
  top: 18px;
}
.CC_content_ul_title_li_span_2,.CC_content_ul_content_li_span_2 {
  top: 50px;
}
.color_1{
    color:#333;
}
.color_2{
    color:#2a2a2a;
}
.color_3{
    color:#666;
}
.color_4{
    color:#fd671a
}
</style>
