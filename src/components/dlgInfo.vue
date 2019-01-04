<template>
  <div class="dlgInfo">

    <!-- 弹窗 back -->
    <div class="back">

      <!-- 弹窗 info -->
      <div class="dialog">
        <div class="title">{{ title }}</div>
        <div class="content"
          :class="[mobSys === 'IOS' || mobSys === 'WEB-IOS' ? 'ios' : 'android']"
          v-html="content"></div>
        <div class="button"
          @click="btnClicked">确定</div>
      </div>

    </div>

  </div>
</template>

<script>

export default {
  name: 'dlgInfo',
  props: ['mobSys', 'title', 'content'],
  methods: {
    btnClicked () {
      this.$emit('info-btn01', false)
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
  /* margin-left: -140px; */
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
