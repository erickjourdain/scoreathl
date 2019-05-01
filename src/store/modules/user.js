import { filter, findIndex, reject, map, indexOf } from 'lodash'
import apolloClient from '@/apollo'

const state = {
  all: [],
  connected: [],
  selected: null
}

const getters = {
  juges (state) {
    return filter(state.all, { role: 'juge' })
  },
  organisateurs (state) {
    return filter(state.all, { role: 'organisateur' })
  },
  administrateurs (state) {
    return filter(state.all, { role: 'admin' })
  }
}

const actions = {
  async users ({ commit }) {
    const { data } = await apolloClient.query({
      query: require('@/graphql/getUsers.gql')
    })
    commit('SET_ALL', data.users)
  },
  async getUser ({ commit }, payload) {
    const { data } = await apolloClient.query({
      query: require('@/graphql/getUser.gql'),
      variables: payload
    })
    commit('SET_SELECTED', data.user)
  },
  async updateUser ({ commit, dispatch }, payload) {
    const { data } = await apolloClient.mutate({
      mutation: require('@/graphql/userUpdate.gql'),
      variables: payload
    })
    commit('SET_SELECTED', data.majUser)
    dispatch('main/setSnackbar', {
      visible: true,
      text: `${state.selected.nom} mis à jour`,
      color: 'success' },
    { root: true })
  },
  async connected ({ commit, rootState }) {
    const { data } = await apolloClient.query({
      query: require('@/graphql/usersConnected.gql')
    })
    const users = map(data.usersConnected, user => {
      const image = indexOf(user.avatar, 'http') ? user.avatar : (user.avatar) ? `${process.env.VUE_APP_IMAGE}/${user.avatar}` : null
      return {
        id: user.id,
        name: user.nom,
        imageUrl: image,
        me: (rootState.main.currentUser) ? (rootState.main.currentUser.id === user.id) : null
      }
    })
    commit('SET_CONNECTED', users)
  },
  nouveauUser ({ commit, state }, payload) {
    commit('SET_ALL', [...state.all, payload])
  },
  modificationUser ({ commit, state }, payload) {
    const ind = findIndex(state.all, { id: payload.id })
    commit('SET_ALL', [
      ...state.all.slice(0, ind),
      payload,
      ...state.all.slice(ind + 1)
    ])
  },
  userConnexion ({ commit, state, rootState }, payload) {
    const image = indexOf(payload.avatar, 'http') ? payload.avatar : (payload.avatar) ? `${process.env.VUE_APP_IMAGE}/${payload.avatar}` : null
    commit('SET_CONNECTED', [...state.connected, {
      id: payload.id,
      name: payload.nom,
      imageUrl: image,
      me: (rootState.main.currentUser) ? (rootState.main.currentUser.id === payload.id) : null
    }])
  },
  userDeconnexion ({ commit, state }, payload) {
    commit('SET_CONNECTED', reject(state.connected, { id: payload }))
  }
}

const mutations = {
  SET_ALL (state, payload) {
    state.all = payload
  },
  SET_SELECTED (state, payload) {
    state.selected = payload
  },
  SET_CONNECTED (state, payload) {
    state.connected = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
