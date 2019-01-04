import Vue from 'vue'
import jjsh from './jjsh.vue'
import 'lib-flexible/flexible'
import { Popup } from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.config.productionTip = false
Vue.component(Popup.name, Popup)

/* eslint-disable no-new */
new Vue({
  el: '#jjsh',
  render: h => h(jjsh)
})
