import Vue from 'vue'
import wtcx from './wtcx.vue'
import 'lib-flexible'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { wtcx },
    template: '<wtcx/>'
})