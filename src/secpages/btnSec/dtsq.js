import Vue from 'vue'
import dtsq from './dtsq.vue'
import 'lib-flexible/flexible'
import { DatetimePicker, Picker, Popup } from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.config.productionTip = false
Vue.component(DatetimePicker.name, DatetimePicker)
Vue.component(Picker.name, Picker)
Vue.component(Popup.name, Popup)

/* eslint-disable no-new */
new Vue({
  el: '#dtsq',
  render: h => h(dtsq)
})
