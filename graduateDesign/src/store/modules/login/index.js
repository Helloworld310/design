import * as types from '../../mutation-types'

const state = {
  isLogin: false
}

const getters = {
  getLoginStatus: state => state.isLogin
}

const actions = {
  changeLogin ({ commit }, data) {
    commit('CHANGE_LOGIN', data)
  }
}

const mutations = {
  [types.CHANGE_LOGIN] (state, data) {
    state.isLogin = data.isLogin
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
