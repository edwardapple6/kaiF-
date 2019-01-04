import Vue from 'vue'
import yjzcn from './yjzcn.vue'
import 'lib-flexible'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { yjzcn },
    template: '<yjzcn/>'
})