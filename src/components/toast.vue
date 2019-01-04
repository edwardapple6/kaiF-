<template>
  <!-- 少量单行文字提示 -->
  <div class="toast">{{ content }}</div>
</template>

<script>
export default {
  name: 'toast',
  props: ['content'],
  data () {
    return {
    }
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.toast {
  white-space: nowrap;
  position: fixed;
  top: 45%;
  left: 50%;
  padding: 10px 15px;
  color: #ffffff;
  font-size: 14px;
  line-height: 24px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  z-index: 1001;
  text-align: center;
  overflow: hidden;
  animation: myfirst 1s;
}

@keyframes myfirst {
  0% {transform:translateX(-50%) translateY(-50%) scale(1, 1); opacity:1;}
  75% {transform:translateX(-50%) translateY(-50%) scale(0.8, 0.8); opacity:1;}
  100% {transform:translateX(-50%) translateY(-50%) scale(0.8, 0.8); opacity:0;}
}
</style>
