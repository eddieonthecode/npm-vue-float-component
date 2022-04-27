import Vue from 'vue';
import Dev from './serve.vue';
import VueFloatComponent from "vue-float-component";

Vue.use(VueFloatComponent);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Dev),
}).$mount('#app');
