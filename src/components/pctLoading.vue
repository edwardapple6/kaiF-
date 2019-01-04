<template>
  <div class="loading">
      <img src="../assets/loading.gif" alt="loading">
      <div class="info">已加载：{{ pct }}</div>
  </div>
</template>

<script>

export default {
  name: 'loading',
  props: ['pct'],
  data () {
    return {
      // loading: loading
    }
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loading {
  position: fixed;
  top: 35%;
  width: 100%;
  padding: 16px 0 6px;
  text-align: center;
}
img {
  width: 36px;
  height: 36px;
}
.info {
  font-size: 12px;
  height: 32px;
  line-height: 32px;
  color: #999;
}
</style>
