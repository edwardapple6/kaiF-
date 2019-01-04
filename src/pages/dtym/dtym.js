import Vue from 'vue'
import dtym from './dtym.vue'
import 'lib-flexible'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { dtym },
    template: '<dtym/>'
})