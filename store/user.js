export const state = () => ({
  accountAvailable: 'wait',
  refreshToken: false,
  accountId: null,
  avatarPath: null,
  firstName: null,
  lastName: null,
  codeName: null,
  role: null,
  appRoleList: [],
  appRoleListStatus: false,
})

export const mutations = {
  setRefreshToken(state) {
    state.refreshToken = true
  },
  setAppRole(state, data) {
    if (state.role === data.role_level) state.role = data.role_name
    state.appRoleList.push(data)
  },
  setAppRoleListStatus(state) {
    state.appRoleListStatus = true
  },
  setMemberInfo(state, data) {
    state.accountId = data.accountId
    state.avatarPath = data.avatarPath
    state.firstName = data.firstName
    state.lastName = data.lastName
    state.codeName = data.codeName
    state.role = data.role
  },
  setLogout(state) {
    state.accountAvailable = 'wait'
    state.refreshToken = false
    state.accountId = null
    state.avatarPath = null
    state.firstName = null
    state.lastName = null
    state.codeName = null
    state.role = null
  },
  setAccountAvailable(state) {
    state.accountAvailable = 'active'
  },
  verifyAccount(state, data) {
    if (data.accountStatus === 'active') {
      state.accountAvailable = 'active'
    }
    if (!data.accountStatus) {
      state.refreshToken = false
      state.accountId = null
      state.avatarPath = null
      state.firstName = null
      state.lastName = null
      state.codeName = null
      state.role = null
      localStorage.removeItem('_cp_scope')
      window.location.href = '/auth/login'
    } else if (data.accountStatus === 'suspended') {
      state.refreshToken = false
      state.accountId = null
      state.avatarPath = null
      state.firstName = null
      state.lastName = null
      state.codeName = null
      state.role = null
      localStorage.removeItem('_cp_scope')
      window.location.href = '/auth/suspended'
    }
  },
}

export const actions = {
  setRefreshToken({ commit }) {
    commit('setRefreshToken')
  },

  setMemberInfo({ commit }, data) {
    commit('setMemberInfo', { ...data })
  },

  async getAccessToken({ commit }) {
    const refreshToken = localStorage.getItem('_cp_scope')
    const decodeToken = atob(refreshToken)
    return await this.$axios
      .post(`${process.env.API_ENDPOINT}/v1/auth/verify/token`, null, {
        headers: {
          Authorization: `Bearer ${decodeToken}`,
        },
      })
      .then(({ data }) => {
        if (data && data.data) {
          const accountData = data.data
          if (accountData.accountStatus === 'active') {
            const accessToken = accountData.accessToken
            commit('setAccountAvailable')
            return accessToken
          } else if (!accountData.accountStatus) {
            commit('setLogout')
            localStorage.removeItem('_cp_scope')
            window.location.href = '/auth/login'
          } else if (accountData.accountStatus === 'suspended') {
            commit('setLogout')
            localStorage.removeItem('_cp_scope')
            window.location.href = '/auth/suspended'
          } else {
            return null
          }
        }
        return null
      })
      .catch((error) => {
        if (error) return false
      })
  },

  setLogout({ commit }) {
    commit('setLogout')
  },

  verifyAccount({ commit }, data) {
    commit('verifyAccount', { ...data })
  },

  setAppRole({ commit }, data) {
    commit('setAppRole', data)
  },

  setAppRoleStatus({ commit }) {
    commit('setAppRoleListStatus')
  },
}
