<template>
  <div id="btn">
    <button class="active" @click="click_sure" >{{msg}}</button>
  </div>
    
</template>
<script>
// import { mapGetters } from "vuex";
import tdxct from "../lib/connect.js";
export default {
  props: ["msg", "AccInfoData"],
  data() {
    return {};
  },
  created() {},
  methods: {
    click_sure: function() {
      var param = [
        {
          F362: "Mobile.Stock.kfsjj.jjkh",
          F1217: "SDX.CHECK_RISK_PRODUCTCODE,",
          F120: this.AccInfoData.KHH,
          F110:this.AccInfoData.WTFS,
          F393:'01',
          F391:'南方基金',
        }
      ];
      tdxct.JYCallTql("198", param, { Way: "qs" }, function(data) {
        var result = tdxct.FormatResult(data);
        console.log(result);
      });
    }
  }
};
</script>
<style scoped>
#btn {
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

