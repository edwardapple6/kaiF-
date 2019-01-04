<template>
  <div class="loading">
    <!-- 弹窗 back -->
    <!-- <div class="back"> -->
      <img :src=loading alt="loading">
    <!-- </div> -->
  </div>
</template>

<script>
import loading from '../assets/loading.gif'

export default {
  name: 'loading',
  data () {
    return {
      loading: loading
    }
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loading {
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  z-index: 1001;
}
img {
  position: fixed;
  top: 35%;
  left: 50%;
  width: 36px;
  padding: 16px;
  margin-left: -34px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 5px;
  z-index: 1002;
}
</style>
