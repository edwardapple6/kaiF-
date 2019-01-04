import Vue from 'vue'
import cxwt from './cxwt.vue'
import 'lib-flexible/flexible'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#cxwt',
  render: h => h(cxwt)
})
