import Vue from 'vue'
import pdf from './pdf.vue'
import 'lib-flexible/flexible'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#pdf',
  render: h => h(pdf)
})
