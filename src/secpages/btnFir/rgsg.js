import Vue from 'vue'
import rgsg from './rgsg.vue'
import 'lib-flexible/flexible'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#rgsg',
  render: h => h(rgsg)
})
