import Vue from 'vue'
import Router from 'vue-router'
import ydqrs from '../components/ydqrs.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/ydqrs',
      name: 'ydqrs',
      component: ydqrs
    }
  ]
})
