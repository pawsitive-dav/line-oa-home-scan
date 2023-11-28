export const state = () => ({
  notifyValue: false,
  type: 'info',
  title: 'Notify',
  message: 'message_mockup',
})

export const mutations = {
  setNotify(state, data) {
    state.notifyValue = data.notifyValue
    state.type = data.type
    state.title = data.title
    state.message = data.message
  },
  setCloseNotify(state) {
    if (state.notifyValue) {
      state.notifyValue = false
    }
  },
}

export const actions = {
  onNotify({ commit }, data) {
    commit('setNotify', { ...data })
  },
  closeNotify({ commit }) {
    commit('setCloseNotify')
  },
}
