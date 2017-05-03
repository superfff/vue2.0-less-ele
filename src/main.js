// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueResource from 'vue-resource'

// import 'common/less/mixin.less'

// Vue.config.productionTip = false
Vue.use(vueResource);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

// router.go('/goods');

// let app = Vue.extend(app);

// let router = new Router