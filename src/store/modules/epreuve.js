import apolloClient from '@/apollo'
import { map, find } from 'lodash'

const state = {
  all: []
}

const isJuge = (user, epreuve, competition) => {
  if (!user || !competition || !competition.juges) {
    return false
  }
  const juge = find(competition.juges, (item) => {
    return item.user.id === user.id
  })
  if (!juge) {
    return false
  }
  return find(juge.epreuves, { id: epreuve.id })
}

const getters = {
  listEpreuves (state, getters, rootState, rootGetters) {
    let epreuves = []
    map(state.all, epreuve => {
      if (rootGetters['main/isAdmin'] || rootGetters['competition/organisateur'] ||
        isJuge(rootState.main.currentUser, epreuve, rootState.competition.current)) {
        epreuves.push(epreuve)
      }
    })
    return epreuves
  }
}

const actions = {
  async getEpreuves ({ commit }) {
    const { data } = await apolloClient.query({
      query: require('@/graphql/getEpreuves.gql')
    })
    commit('SET_ALL', data.epreuves)
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
