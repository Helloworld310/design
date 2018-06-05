// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import { Row, Col, Input, Message, MessageBox, Button, Upload, Dialog, Tabs, TabPane, Carousel, CarouselItem, Pagination, Card } from 'element-ui'
import {api} from '../config/api'
import axios from 'axios'
import 'babel-polyfill'

axios.defaults.withCredentials = true
Vue.prototype.$api = api
Vue.config.productionTip = false
Vue.use(Row)
Vue.use(Col)
Vue.use(Input)
Vue.use(Button)
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Pagination)
Vue.use(Card)
Vue.prototype.$msg = Message;
Vue.prototype.$confirm = MessageBox.confirm;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
