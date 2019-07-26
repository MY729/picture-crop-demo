import Vue from 'vue'
import { Button, Row, Col, Tooltip, Tabs, TabPane, InputNumber } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tooltip)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(InputNumber)

new Vue({
  render: h => h(App),
}).$mount('#app')
