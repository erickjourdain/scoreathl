import { filter, findIndex } from 'lodash'
import apolloClient from '@/apollo'

const state = {
  all: [],
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
  }
}

const mutations = {
  SET_ALL (state, payload) {
    state.all = payload
  },
  SET_SELECTED (state, payload) {
    state.selected = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
