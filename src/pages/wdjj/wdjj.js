import Vue from 'vue'
import wdjj from './wdjj.vue'
import 'lib-flexible'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { wdjj },
    template: '<wdjj/>'
})