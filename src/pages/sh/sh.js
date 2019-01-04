import Vue from 'vue'
import jjsh from './jjsh.vue'
import 'lib-flexible'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { jjsh },
    template: '<jjsh/>'
})