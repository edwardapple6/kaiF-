<template>
  <div class="popupBtm">

    <!-- 弹窗 back -->
    <div class="back">

      <!-- 弹窗 info -->
      <div class="popup">
        <div :class="[mobSys === 'IOS' || mobSys === 'WEB-IOS' ? 'ios' : 'android']"
          class="title">{{ title }}</div>
        <div :class="[mobSys === 'IOS' || mobSys === 'WEB-IOS' ? 'ios' : 'android']"
          class="item"
          v-for="(item, index) in popCont"
          :key="item.index"
          @click="btnClicked(index)">
          <span>{{ item.txt }}</span>
          <img src="../assets/chosen.png" alt="选中"
            v-if="item.chosen">
        </div>
      </div>

    </div>

  </div>
</template>

<script>

export default {
  name: 'popupBtm',
  props: ['mobSys', 'title', 'content'],
  data () {
    return {
      popCont: []
    }
  },
  mounted () {
    this.popCont = this.content
  },
  methods: {
    btnClicked (index) {
      for (let i in this.popCont) {
        this.popCont[i].chosen = false
      }
      this.popCont[index].chosen = true
      this.$emit('popup-click', this.popCont)
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
.popup {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: white;
  z-index: 1002;
  text-align: center
}
.title {
  line-height: 50px;
  height: 50px;
  font-size: 18px;
  color: #333;
  border-bottom-color: #f0f0f0;
  border-bottom-style: solid;
}
.item {
  position: relative;
  line-height: 50px;
  font-size: 16px;
  text-align: left;
  padding: 0px 15px;
  color: #666;
  border-bottom-color: #f0f0f0;
  border-bottom-style: solid;
}
.item img {
  position: absolute;
  right: 0;
  height: 13px;
  margin: 19px 15px 0 0;
}
.item:active {
  background-color: #f0f0f0;
}
</style>
