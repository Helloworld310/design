import Vue from 'vue'
import 'babel-polyfill'
import Vuex from 'vuex'
import login from './modules/login'
import notice from './modules/notice'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    login,
    notice
  }
})
