import * as types from '../../mutation-types'

const state = {
  isUpdate: false
}

const getters = {
  getUpdateStatus: state => state.isUpdate
}

const actions = {
  changeUpdate ({ commit }, data) {
    commit('CHANGE_UPDATE', data)
  }
}

const mutations = {
  [types.CHANGE_UPDATE] (state, data) {
    state.isUpdate = data.isUpdate
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
