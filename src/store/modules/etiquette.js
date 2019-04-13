import apolloClient from '@/apollo'
import { reject } from 'lodash'

const state = {
  all: []
}

const getters = {}

const actions = {
  async getEtiquettes ({ commit }) {
    const { data } = await apolloClient.query({
      query: require('@/graphql/getEtiquettes.gql')
    })
    commit('SET_ALL', data.etiquettes)
  },
  async createEtiquette ({ commit, state }, payload) {
    const { data } = await apolloClient.mutate({
      mutation: require('@/graphql/etiquetteCreer.gql'),
      variables: payload
    })
    commit('SET_ALL', [...state.all, data.creerEtiquette])
  },
  async delEtiquette ({ commit, state }, payload) {
    await apolloClient.mutate({
      mutation: require('@/graphql/etiquetteSupprimer.gql'),
      variables: payload
    })
    commit('SET_ALL', reject(state.all, { id: payload.id }))
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
