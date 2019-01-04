import Vue from 'vue'
import jjzhcx from './jjzhcx.vue'
import 'lib-flexible'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { jjzhcx },
    template: '<jjzhcx/>'
})