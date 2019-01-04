import Vue from 'vue'
import jjzh from './jjzh.vue'
import 'lib-flexible'
import { Popup } from 'mint-ui';
import 'mint-ui/lib/style.css'
Vue.component(Popup.name, Popup);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { jjzh },
    template: '<jjzh/>'
})