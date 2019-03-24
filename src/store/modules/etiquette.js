import apolloClient from '@/apollo'
import { reject } from 'lodash'

const state = {
  all: []
}

const getters = {}

const actions = {
  async getEtiquettes ({ commit }) {
    try {
      const { data } = await apolloClient.query({
        query: require('@/graphql/getEtiquettes.gql')
      })
      commit('SET_ALL', data.etiquettes)
    } catch (error) {
      commit('main/SET_ERROR', error, { root: true })
    }
  },
  async createEtiquette ({ commit, state }, payload) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: require('@/graphql/etiquetteCreer.gql'),
        variables: payload
      })
      commit('SET_ALL', [...state.all, data.creerEtiquette])
    } catch (error) {
      commit('main/SET_ERROR', error, { root: true })
    }
  },
  async delEtiquette ({ commit, state }, payload) {
    try {
      await apolloClient.mutate({
        mutation: require('@/graphql/etiquetteSupprimer.gql'),
        variables: payload
      })
      commit('SET_ALL', reject(state.all, { id: payload.id }))
    } catch (error) {
      commit('main/SET_ERROR', error, { root: true })
    }
  }
}

const mutations = {
  SET_ALL (state, payload) {
    state.all = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
