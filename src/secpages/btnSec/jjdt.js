import Vue from 'vue'
import jjdt from './jjdt.vue'
import 'lib-flexible/flexible'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#jjdt',
  render: h => h(jjdt)
})
