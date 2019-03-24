import apolloClient from '@/apollo'

const state = {
  currentUser: null,
  loadedLoginServices: {
    google: false,
    facebook: false
  },
  error: null,
  snackbar: {
    visible: false,
    text: null,
    color: '#000'
  }
}

const getters = {
  isAdmin (state) {
    return (state.currentUser && state.currentUser.role === 'admin')
  }
}

const actions = {
  async createUser ({ commit, dispatch }, payload) {
    try {
      await apolloClient.mutate({
        mutation: require('@/graphql/createUser.gql'),
        variables: payload
      })
      dispatch('logPwd', { nom: payload.nom, password: payload.password })
    } catch (error) {
      commit('SET_ERROR', error)
    }
  },
  async logToken ({ commit }, payload) {
    try {
      const { data } = await apolloClient.query({ query: require('@/graphql/me.gql') })
      commit('SET_CURRENT_USER', data.me)
      sessionStorage.setItem('user', JSON.stringify({ nom: data.me.nom, role: data.me.role }))
    } catch (error) {
      commit('SET_ERROR', error)
    }
  },
  async logPwd ({ commit }, payload) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: require('@/graphql/passwordLogin.gql'),
        variables: payload
      })
      commit('SET_CURRENT_USER', data.loginPassword.user)
      localStorage.setItem('apollo-token', data.loginPassword.token)
      sessionStorage.setItem('user', JSON.stringify({ nom: data.loginPassword.user.nom, role: data.loginPassword.user.role }))
    } catch (error) {
      commit('SET_ERROR', error)
    }
  },
  async logFB ({ commit }, payload) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: require('@/graphql/loginFacebook.gql'),
        variables: payload
      })
      commit('SET_CURRENT_USER', data.loginFacebook.user)
      localStorage.setItem('apollo-token', data.loginFacebook.token)
      sessionStorage.setItem('user', JSON.stringify({ nom: data.loginFacebook.user.nom, role: data.loginFacebook.user.role }))
    } catch (error) {
      commit('SET_ERROR', error)
    }
  },
  async logGoogle ({ commit }, payload) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: require('@/graphql/loginGoogle.gql'),
        variables: payload
      })
      commit('SET_CURRENT_USER', data.loginGoogle.user)
      localStorage.setItem('apollo-token', data.loginGoogle.token)
      sessionStorage.setItem('user', JSON.stringify({ nom: data.loginGoogle.user.nom, role: data.loginGoogle.user.role }))
    } catch (error) {
      commit('SET_ERROR', error)
    }
  },
  setSnackbar ({ commit }, payload) {
    commit('SET_SNACKBAR', payload)
    setTimeout(() => {
      commit('SET_SNACKBAR', {
        visible: false,
        text: null,
        color: '#000'
      })
    }, 5000)
  }
}

const mutations = {
  SET_ERROR (state, payload) {
    state.error = payload
  },
  SET_CURRENT_USER (state, payload) {
    state.currentUser = payload
  },
  SET_FB_LOGIN_SERVICE (state, payload) {
    state.loadedLoginServices = {
      ...state.loadedLoginServices,
      facebook: payload.value
    }
  },
  SET_GOOGLE_LOGIN_SERVICE (state, payload) {
    state.loadedLoginServices = {
      ...state.loadedLoginServices,
      google: payload.value
    }
  },
  SET_SNACKBAR (state, payload) {
    state.snackbar = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
