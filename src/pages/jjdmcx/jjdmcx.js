import Vue from 'vue'
import jjdmcx from './jjdmcx.vue'
import 'lib-flexible'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { jjdmcx },
    template: '<jjdmcx/>'
})