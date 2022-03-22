// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import './permission'; // permission control

import ElementUI from 'element-ui';
import './theme/index.css';

import VueClipboard from 'vue-clipboard2';

Vue.config.productionTip = false
// process.env.MOCK && require('./mock');

Vue.use(ElementUI)
Vue.use(VueClipboard)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
