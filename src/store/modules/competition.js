import { find, findIndex, map, reject } from 'lodash'
import apolloClient from '@/apollo'

const state = {
  current: null,
  team: null,
  score: null,
  all: [],
  updateScore: false
}

const getters = {
  equipes (state) {
    return (state.current) ? state.current.equipes : null
  },
  statut (state) {
    return (state.current) ? state.current.statut : null
  },
  organisateur (state, getters, rootState) {
    return (rootState.main.currentUser && state.current)
      ? (findIndex(state.current.organisateurs, { id: rootState.main.currentUser.id }) >= 0) : false
  },
  proprietaire (state, getters, rootState) {
    return (rootState.main.currentUser && state.team)
      ? (state.team.proprietaire.id === rootState.main.currentUser.id) : false
  },
  juges (state) {
    return (state.current) ? state.current.juges : []
  },
  listAthletes (state) {
    if (!state.current) {
      return []
    }
    let athletes = []
    map(state.current.equipes, equipe => {
      athletes.push({ header: equipe.nom })
      map(['adulte', 'enfant'], type => {
        athletes.push({
          id: equipe[type].id,
          nom: `${equipe[type].prenom} ${equipe[type].nom}`,
          group: equipe.nom,
          avatar: equipe[type].avatar
        })
      })
      athletes.push({ divider: true })
    })
    return athletes
  },
  listChallenges (state) {
    return (state.current) ? state.current.challenges : []
  },
  resultats (state) {
    if (!state.score || !state.score.athlete || !state.score.challenge) {
      return null
    }
    return find(state.score.athlete.scores, sc => {
      return sc.challenge.id === state.score.challenge.id
    })
  }
}

const actions = {
  async getCompetitions ({ commit }) {
    const { data } = await apolloClient.query({
      query: require('@/graphql/getCompetitions.gql')
    })
    commit('SET_ALL', data.competitions)
  },
  async getCompetition ({ commit }, payload) {
    const { data } = await apolloClient.query({
      query: require('@/graphql/getCompetition.gql'),
      variables: payload
    })
    commit('SET_CURRENT', data.competition)
  },
  setTeam ({ commit }, payload) {
    const team = (state.current && state.current.equipes) ? find(state.current.equipes, payload) : null
    commit('SET_TEAM', team)
  },
  setChallenge ({ dispatch, commit, state }, payload) {
    const challenge = find(state.current.challenges, payload)
    if (!challenge) {
      dispatch('main/setSnackbar', { visible: true, text: `impossible de trouver l'épreuve`, color: 'error' })
    }
    commit('SET_CHALLENGE', challenge)
  },
  setAthlete ({ commit }, payload) {
    let athlete = null
    map(state.current.equipes, equipe => {
      map(['adulte', 'enfant'], type => {
        if (equipe[type].id === payload.id) {
          athlete = equipe[type]
        }
      })
    })
    commit('SET_ATHLETE', athlete)
  },
  async updateTeamStatus ({ commit, state, dispatch }, payload) {
    if (!state.team || payload.id !== state.team.id) {
      throw new Error(`impossible de modifier l'équipe`)
    }
    await apolloClient.mutate({
      mutation: require('@/graphql/equipeUpdate.gql'),
      variables: { id: state.team.id, statut: !state.team.statut }
    })
  },
  async createTeam ({ commit, state }, payload) {
    await apolloClient.mutate({
      mutation: require('@/graphql/equipeCreer.gql'),
      variables: payload
    })
  },
  async updateTeam ({ commit, state }, payload) {
    await apolloClient.mutate({
      mutation: require('@/graphql/equipeUpdate.gql'),
      variables: payload
    })
  },
  async delTeam ({ commit, state, dispatch }, payload) {
    if (!state.team || payload.id !== state.team.id) {
      throw new Error(`impossible de supprimer l'équipe`)
    }
    await apolloClient.mutate({
      mutation: require('@/graphql/delEquipe.gql'),
      variables: { id: state.team.id }
    })
  },
  async saveScore ({ state, commit, dispatch }, payload) {
    await apolloClient.mutate({
      mutation: require('@/graphql/setResultat.gql'),
      variables: {
        athlete: state.score.athlete.id,
        resultat: {
          challenge: state.score.challenge.id,
          resultats: payload.res
        }
      }
    })
  },
  async challengePlanification (context, payload) {
    await apolloClient.mutate({
      mutation: require('@/graphql/equipePlanification.gql'),
      variables: payload
    })
  },
  async defineJuge ({ commit, state }, payload) {
    const { data } = await apolloClient.mutate({
      mutation: require('@/graphql/jugeCreer.gql'),
      variables: {
        competition: state.current.id,
        juges: payload
      }
    })
    commit('SET_CURRENT', {
      ...state.current,
      juges: data.defineCompetitionJuges.juges
    })
  },
  async createCompetition ({ commit, state }, payload) {
    const { data } = await apolloClient.mutate({
      mutation: require('@/graphql/competitionCreer.gql'),
      variables: payload
    })
    commit('SET_ALL', [...state.all, data.creerCompetition])
  },
  async updateCompetition ({ commit, state }, payload) {
    const { data } = await apolloClient.mutate({
      mutation: require('@/graphql/competitionUpdate.gql'),
      variables: payload
    })
    const competitionIndex = findIndex(state.all, { id: payload.id })
    commit('SET_ALL', [...state.all.slice(0, competitionIndex), data.majCompetition, ...state.all.slice(competitionIndex + 1)])
  },
  async nouvelleEquipe ({ commit, state }, payload) {
    const { data } = await apolloClient.query({
      query: require('@/graphql/getEquipe.gql'),
      variables: payload,
      fetchPolicy: 'network-only'
    })
    commit('SET_CURRENT', { ...state.current, equipes: [...state.current.equipes, data.equipe] })
  },
  async modificationEquipe ({ commit, state }, payload) {
    const { data } = await apolloClient.query({
      query: require('@/graphql/getEquipe.gql'),
      variables: payload,
      fetchPolicy: 'network-only'
    })
    const ind = findIndex(state.current.equipes, { id: payload.id })
    commit('SET_CURRENT', {
      ...state.current,
      equipes: [
        ...state.current.equipes.slice(0, ind),
        data.equipe,
        ...state.current.equipes.slice(ind + 1)
      ]
    })
    if (state.team && data.equipe.id === state.team.id) {
      commit('SET_TEAM', data.equipe)
    }
  },
  async suppressionEquipe ({ commit, state }, payload) {
    commit('SET_CURRENT', { ...state.current, equipes: reject(state.current.equipes, payload) })
  },
  async setAthleteCategorie (context, payload) {
    await apolloClient.mutate({
      mutation: require('@/graphql/athleteCategorie.gql'),
      variables: payload
    })
  }
}

const mutations = {
  SET_ALL (state, payload) {
    state.all = payload
  },
  SET_CURRENT (state, payload) {
    state.current = payload
  },
  SET_TEAM (state, payload) {
    state.team = payload
  },
  SET_ATHLETE (state, payload) {
    state.score = {
      ...state.score,
      athlete: payload
    }
  },
  SET_CHALLENGE (state, payload) {
    state.score = {
      ...state.score,
      challenge: payload
    }
  },
  SET_UPDATE_SCORE (state, payload) {
    state.updateScore = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
