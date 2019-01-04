import Vue from 'vue'
import kh from './kh.vue'
import 'lib-flexible'
// import router from '../../router'
import { Popup } from 'mint-ui';
import 'mint-ui/lib/style.css'
Vue.component(Popup.name, Popup);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { kh },
    template: '<kh/>'
})