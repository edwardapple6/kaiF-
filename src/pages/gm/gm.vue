<template>
  <div id="app">
    <ul class="app_ul">
        <li><span>基金代码</span><input type="number" placeholder="请输入基金代码" class="fs14"></li>
        <li><span>基金名称</span><input type="text" disabled class="_disabled"></li>
        <li><span>风险等级</span><input type="text" disabled class="_disabled"></li>
        <li><span>基金净值</span><input type="text" disabled class="_disabled"></li>
        <li><span>基金状态</span><input type="text" disabled class="_disabled"></li>
        <li><span>可用资金</span><input type="text" disabled class="_disabled"></li>
        <li><span>购买金额</span><input type="number" placeholder="请输入购买金额" class="fs14"></li>
    </ul>
    <Botton
    :msg="msg"
    />
  </div>
</template>

<script>
import Botton from '../../components/mob-button'
export default {
  name: 'App',
  components:{
    Botton
  },
  data(){
    return {
      msg:"确定"
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
*{
  padding: 0;
  margin: 0;
}
body{
  background-color: #fff;
  /* font-size:0px !important; */
}
ul{
  list-style: none;
}
</style>
<style scoped>

#app .app_ul{
  padding:46px 30px 0 30px;
}
/* ul{
  padding:46px 30px 0 30px;
} */
li{
  /* position: relative; */
  height:84px;
  margin-bottom:20px
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

input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
  color:#b3b3b3;
}
input:-moz-placeholder, textarea:-moz-placeholder {
  color:#b3b3b3;
}
input::-moz-placeholder, textarea::-moz-placeholder {
  color:#b3b3b3;
}
input:-ms-input-placeholder, textarea:-ms-input-placeholder {
  color:#b3b3b3;
}

input:focus {
  outline: none;
  border: #fd671a 2px solid;
}
input._disabled {
  border: #f0f0f0 2px solid;
  
}
.fs14,._disabled{
  font-size:28px;
}
li span{
    color:#666;
    font-size:28px;
    margin-right:20px;
}
</style>
