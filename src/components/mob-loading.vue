<template>
    <div class="loading">
      <span class="load_span">
        <img src="../../static/loading.gif" alt="">
      </span>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    }
}
</script>

<style scoped>
/*加载动画样式*/
.loading {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.load_span {
  display: inline-block;
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -30px;
  margin-top: -30px;
}
.load_span img {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 5px;
  left: 5px;
}
</style>
