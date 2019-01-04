import Vue from 'vue'
import gm from './gm.vue'
import 'lib-flexible'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { gm },
    template: '<gm/>'
})