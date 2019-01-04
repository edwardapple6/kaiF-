import Vue from 'vue'
import dtbg from './dtbg.vue'
import 'lib-flexible/flexible'
import { DatetimePicker, Picker, Popup } from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.config.productionTip = false
Vue.component(DatetimePicker.name, DatetimePicker)
Vue.component(Picker.name, Picker)
Vue.component(Popup.name, Popup)

/* eslint-disable no-new */
new Vue({
  el: '#dtbg',
  render: h => h(dtbg)
})
