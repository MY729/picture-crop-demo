import Vue from 'vue'
import { Button, Row, Col } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)

new Vue({
  render: h => h(App),
}).$mount('#app')
