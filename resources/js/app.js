require('./bootstrap');

window.Vue = require('vue').default;

import Vue from 'vue';
import VueAxios from 'vue-axios';
import axios from 'axios';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import App from './App.vue';
import store from './store/index';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueAxios, axios);
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.component('contact-table', require('./components/ContactTable.vue').default);

const app = new Vue({
    el: '#app',
    render: h => h(App),
    store,
});
