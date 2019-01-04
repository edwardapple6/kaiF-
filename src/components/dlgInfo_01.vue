<template>
  <div class="dlgInfo">

    <!-- 弹窗 back -->
    <div class="back">

      <!-- 弹窗 info -->
      <div class="dialog" ref="alertHeight">
        <div class="title">{{ title }}</div>
        <div class="content"
          v-html="content" ></div>
        <div class="button"
          @click="btnClicked">确定</div>
      </div>

    </div>

  </div>
</template>

<script>
import tdxct from '../lib/connect.js'
import { pageURL } from '../common/pageUrl.js'
export default {
  name: 'dlgInfo',
  props: ['title', 'content'],
  data(){
    return {}
  },
  created(){
    
  },
  methods: {
    btnClicked () {
      this.$emit('info-btn01', false)
      localStorage.removeItem('jjzhAlertMsg')
      localStorage.removeItem('jjkhAlertMsg')
    },
    hqgd(){
      console.log(this.$refs.alertHeight.height)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  transform:translateX(-50%) translateY(-50%);
  -webkit-transform:translateX(-50%) translateY(-50%);
  /* margin-left: -140px; */
  background-color: white;
  border-radius: 5px;
  z-index: 1002;
  text-align: center
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
  border-bottom: #f0f0f0 1px solid;
  word-break: break-all;
}
.button {
  line-height: 44px;
  font-size: 16px;
  color: #FD671A;
}
.button:active {
  background-color: #f0f0f0;
}
</style>
