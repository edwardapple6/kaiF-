<template>
  <div class="dlgConform">

    <!-- 弹窗 back -->
    <div class="back">

      <!-- 弹窗 conform -->
      <div class="dialog conform">
        <div class="title">温馨提示</div>
        <div :class="[mobSys === 'IOS' || mobSys === 'WEB-IOS' ? 'ios' : 'android']"
          class="content">{{ content }}
            <div class="item clearfix"
              v-for="item in callInfo"
              :key="item.index">
              <span class="tag">{{ item.tag }}</span>
              <span class="value">{{ item.value }}</span>
            </div>
        </div>
        <div class="buttons">
          <span :class="[
            mobSys === 'IOS' || mobSys === 'WEB-IOS' ? 'ios' : 'android',
            mobSys === 'IOS' || mobSys === 'WEB-IOS' ? 'ml-ios' : 'ml-android',
            ]"
            @click="btn01Clicked">确认</span>
          <span @click="btn02Clicked">拨打电话</span>
        </div>
      </div>

    </div>

  </div>
</template>

<script>

export default {
  name: 'dlgConform',
  props: ['mobSys', 'title', 'content', 'callInfo'],
  data () {
    return {
      // F397: ''
    }
  },
  methods: {
    btn01Clicked () {
      this.$emit('callDlg-btn01', false)
    },
    btn02Clicked () {
      this.$emit('callDlg-btn02', this.callInfo[1].value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*清除浮动*/
.clearfix:after{content:""; display:block; clear:both;}
.clearfix{zoom:1;}

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
  top: 45%;
  left: 50%;
  transform:translateX(-50%) translateY(-50%);
  width: 280px;
  background-color: white;
  border-radius: 5px;
  z-index: 1002;
  text-align: center;
  overflow: hidden;
}
.title {
  line-height: 44px;
  font-size: 18px;
  color: #333;
}
.content {
  line-height: 24px;
  font-size: 14px;
  padding: 0px 15px 10px 15px;
  color: #666;
  border-bottom-color: #f0f0f0;
  border-bottom-style: solid;
  text-align: left;
}
.tag, .value {
  float: left;
}
.tag {
  width: 90px;
}
.value {
  width: 160px;
  word-break:break-all;
}
.buttons {
  font-size: 0;
}
.buttons > span {
  display: inline-block;
  width: 50%;
  font-size: 16px;
  color: #666;
  line-height: 44px;
}
.buttons > span:nth-child(1) {
  border-right-color: #f0f0f0;
  border-right-style: solid;
}
.ml-ios {
  margin-left: -1px;
}
.ml-android {
  margin-left: -1.5px;
}
.buttons > span:nth-child(2) {
  color: #FD671A;
}
.buttons > span:active {
  background-color: #f0f0f0;
}
</style>
