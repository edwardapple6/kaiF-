import Vue from 'vue'
import cjcx from './cjcx.vue'
import 'lib-flexible'
import { DatetimePicker } from 'mint-ui';
import 'mint-ui/lib/style.css'
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { cjcx },
    template: '<cjcx/>'
})