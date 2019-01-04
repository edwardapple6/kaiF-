<template>
  <div class="chooseSC">

    <!-- 弹窗 back -->
    <div class="back">

      <div class="dialog chooseSC">
        <div class="title">温馨提示</div>
        <div :class="[mobSys === 'IOS' || mobSys === 'WEB-IOS' ? 'ios' : 'android']"
          class="content">{{ content }}</div>
        <div class="buttons">
          <span :class="[
            mobSys === 'IOS' || mobSys === 'WEB-IOS' ? 'ios' : 'android',
            mobSys === 'IOS' || mobSys === 'WEB-IOS' ? 'ml-ios' : 'ml-android'
          ]"
          @click="btn01Clicked">退出</span>
          <span @click="btn02Clicked">继续</span>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'chooseSC',
  props: ['mobSys', 'title', 'content'],
  data () {
    return {
    }
  },
  methods: {
    btn01Clicked () {
      this.$emit('firDlg-btn01', false)
    },
    btn02Clicked () {
      this.$emit('firDlg-btn02', false)
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
  text-align: center;
  padding: 10px 15px;
  color: #666;
  border-bottom-color: #f0f0f0;
  border-bottom-style: solid;
}
.buttons {
  font-size: 0;
}
.buttons > span {
  display: inline-block;
  width: 50%;
  font-size: 16px;
  line-height: 44px;
  color: #FD671A;
}
.buttons > span:nth-child(1) {
  border-right-color: #f0f0f0;
  border-right-style: solid;
  color: #999;
}
.ml-ios {
  margin-left: -1px;
}
.ml-android {
  margin-left: -1.5px;
}
.buttons > span:active {
  background-color: #f0f0f0;
}
</style>
