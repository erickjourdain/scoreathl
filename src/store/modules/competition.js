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
  resultats (state) {
    if (!state.score || !state.score.athlete || !state.score.epreuve) {
      return null
    }
    return find(state.score.athlete.score.resultats, res => {
      return res.epreuve.id === state.score.epreuve.id
    })
  }
}

const actions = {
  async getCompetitions ({ commit }) {
    try {
      const { data } = await apolloClient.query({
        query: require('@/graphql/getCompetitions.gql')
      })
      commit('SET_ALL', data.competitions)
    } catch (error) {
      commit('main/SET_ERROR', error, { root: true })
    }
  },
  async getCompetition ({ commit }, payload) {
    try {
      const { data } = await apolloClient.query({
        query: require('@/graphql/getCompetition.gql'),
        variables: payload
      })
      commit('SET_CURRENT', data.competition)
    } catch (error) {
      commit('main/SET_ERROR', error, { root: true })
    }
  },
  setTeam ({ commit }, payload) {
    const team = (state.current && state.current.equipes) ? find(state.current.equipes, payload) : null
    commit('SET_TEAM', team)
  },
  setEpreuve ({ commit, rootState }, payload) {
    const epreuve = find(rootState.epreuve.all, payload)
    if (!epreuve) {
      commit('main/SET_ERROR', new Error(`impossible de trouver l'épreuve`), { root: true })
    }
    commit('SET_EPREUVE', epreuve)
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
    try {
      if (!state.team || payload.id !== state.team.id) {
        throw new Error(`impossible de supprimer l'équipe`)
      }
      await apolloClient.mutate({
        mutation: require('@/graphql/equipeUpdate.gql'),
        variables: { id: state.team.id, statut: !state.team.statut }
      })
      const equipes = map(state.current.equipes, equipe => {
        if (equipe.id === state.team.id) {
          return { ...equipe, statut: !equipe.statut }
        } else {
          return equipe
        }
      })
      commit('SET_CURRENT', { ...state.current, equipes })
      dispatch('setTeam', payload)
    } catch (error) {
      commit('main/SET_ERROR', error, { root: true })
    }
  },
  async createTeam ({ commit, state }, payload) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: require('@/graphql/equipeCreer.gql'),
        variables: payload
      })
      commit('SET_CURRENT', { ...state.current, equipes: [...state.current.equipes, data.creerEquipe] })
    } catch (error) {
      commit('main/SET_ERROR', error, { root: true })
    }
  },
  async delTeam ({ commit, state, dispatch }, payload) {
    try {
      if (!state.team || payload.id !== state.team.id) {
        throw new Error(`impossible de supprimer l'équipe`)
      }
      await apolloClient.mutate({
        mutation: require('@/graphql/delEquipe.gql'),
        variables: { id: state.team.id }
      })
      commit('SET_CURRENT', { ...state.current, equipes: reject(state.current.equipes, payload) })
      dispatch('setTeam', payload)
    } catch (error) {
      commit('main/SET_ERROR', error, { root: true })
    }
  },
  async saveScore ({ state, commit }, payload) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: require('@/graphql/setResultat.gql'),
        variables: {
          athlete: state.score.athlete.id,
          resultat: {
            epreuve: state.score.epreuve.id,
            resultats: payload.res
          }
        }
      })
      const newCurrent = {
        ...state.current,
        equipes: map(state.current.equipes, equipe => {
          if (equipe.adulte.id === state.score.athlete.id) {
            return {
              ...equipe,
              points: equipe.enfant.score.points + data.athleteResultat.score.points,
              adulte: {
                ...equipe.adulte,
                score: data.athleteResultat.score
              }
            }
          } else if (equipe.enfant.id === state.score.athlete.id) {
            return {
              ...equipe,
              points: equipe.adulte.score.points + data.athleteResultat.score.points,
              enfant: {
                ...equipe.enfant,
                score: data.athleteResultat.score
              }
            }
          } else {
            return equipe
          }
        })
      }
      commit('SET_CURRENT', newCurrent)
    } catch (error) {
      commit('main/SET_ERROR', error, { root: true })
    }
  },
  async defineJuge ({ commit, state }, payload) {
    try {
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
    } catch (error) {
      commit('main/SET_ERROR', error, { root: true })
    }
  },
  async createCompetition ({ commit, state }, payload) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: require('@/graphql/competitionCreer.gql'),
        variables: payload
      })
      commit('SET_ALL', [...state.all, data.creerCompetition])
    } catch (error) {
      commit('main/SET_ERROR', error, { root: true })
    }
  },
  async updateCompetition ({ commit, state }, payload) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: require('@/graphql/competitionUpdate.gql'),
        variables: payload
      })
      const competitionIndex = findIndex(state.all, { id: payload.id })
      commit('SET_ALL', [...state.all.slice(0, competitionIndex), data.majCompetition, ...state.all.slice(competitionIndex + 1)])
    } catch (error) {
      commit('main/SET_ERROR', error, { root: true })
    }
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
  SET_EPREUVE (state, payload) {
    state.score = {
      ...state.score,
      epreuve: payload
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
