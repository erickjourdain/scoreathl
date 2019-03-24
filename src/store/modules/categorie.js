import { find, filter } from 'lodash'
import apolloClient from '@/apollo'

const state = {
  all: []
}

const getters = {
  getNotations: state => (categorie, epreuve) => {
    if (!categorie || !epreuve) {
      return null
    }
    const athleteCategorie = find(state.all, { id: categorie })
    if (!athleteCategorie) {
      return null
    }
    return find(athleteCategorie.notations, notation => {
      return notation.epreuve.id === epreuve
    })
  },
  getCategories (state) {
    return filter(state.all, { genre: 'M' })
  }
}

const actions = {
  async getCategories ({ commit }) {
    try {
      const { data } = await apolloClient.query({
        query: require('@/graphql/getCategories.gql')
      })
      commit('SET_ALL', data.categories)
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
