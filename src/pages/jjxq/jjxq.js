import Vue from 'vue'
import jjxq from './jjxq.vue'
import 'lib-flexible'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { jjxq },
    template: '<jjxq/>'
})