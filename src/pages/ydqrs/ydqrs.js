import Vue from 'vue'
import ydqrs from './ydqrs.vue'
import 'lib-flexible'
import 'jquery'
// import '../lib/pdf'

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { ydqrs },
    template: '<ydqrs/>'
})