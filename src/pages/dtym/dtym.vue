<template>
  <div id="dtym">
     <p class="dtym_p">
       <img class="left" src="../../../static/dtsq.png" alt="">
       <span>定投申请</span>
       <img class="right" src="../../../static/right@2x.png" alt="">
     </p>
     <div class="wddt">
       <p class="wddt_p">我的定投</p>
       <ul class="title">
         <li class="title_li">开始日期</li>
         <li class="title_li"><span>基金名称</span><span>基金代码</span></li>
         <li class="title_li"><span>定投类型</span><span>期满参数</span></li>
         <li class="title_li"><span>定投周期</span><span>定投金额</span></li>
         
       </ul>
     </div>
  </div>
 
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      msg: "确定",
      CC_data: [{}],
      popupVisible: false,
      fhstylemsg: "请选择分红方式",
      select_fhstyle: [{ name: "红利转股" }, { name: "现金分红" }],
      rec_data: [
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
          Profitloss: "5000.00",
          marketValue: "71152.06"
        },
        {
          name: "中国理财30",
          code: "001057",
          haveMoney: "200.00",
          canmakeMoney: "100.00",
          yestady: "1.45",
          cost: "1.67",
          Profitloss: "5000.00",
          marketValue: "71152.06"
        }
      ]
    };
  },
  methods: {}
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
  background-color: #f0f0f0;
  /* font-size:0px !important; */
}
ul {
  list-style: none;
}
</style>
<style scoped>
/* 定投申请 */
.dtym_p {
  height: 100px;
  position: relative;
  background-color: #fff;
}
.left {
  width: 36px;
  position: absolute;
  top: 32px;
  left: 30px;
}
.dtym_p span {
  font-family: PingFangSC-Regular;
  font-size: 32px;
  color: #333333;
  letter-spacing: 0;
  position: absolute;
  left: 86px;
  top: 0;
  height: 100px;
  line-height: 100px;
}
.right {
  height: 36px;
  position: absolute;
  top: 32px;
  right: 30px;
}
/* 我的定投 */
.wddt {
  margin-top: 22px;
}
.wddt_p {
  height: 100px;
  line-height: 100px;
  padding: 0 30px;
  font-family: PingFangSC-Medium;
  font-size: 32px;
  color: #333333;
  letter-spacing: 0;
  background-color: #fff;
}
.title{
  background-color: #f0f0f0;
  overflow-x:scroll;
}
.title_li{
  display: inline-block;
  height: 140px;
  width:25%;
  margin-left:94px;
}
</style>
