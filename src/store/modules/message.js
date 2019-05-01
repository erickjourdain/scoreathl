// import { map } from 'lodash'
import apolloClient from '@/apollo'

const state = {
  messages: [],
  newMessages: 0,
  chatWindow: false
}

const getters = {}

const actions = {
  changeChatWindowStatus ({ commit }, payload) {
    commit('SET_CHAT_WINDOW', payload)
  },
  setNewMessagesValue ({ commit }, payload) {
    commit('SET_NEW_MESSAGES', payload)
  },
  /*
  async getMessages ({ commit, rootState }) {
    const { data } = await apolloClient.query({
      query: require('@/graphql/getMessages.gql')
    })
    const messages = map(data.messages, message => {
      return {
        author: {
          ...message.user,
          me: message.user.id === rootState.main.currentUser.id
        },
        type: message.type,
        createdAt: message.createdAt,
        data: {
          text: message.text,
          emoji: message.emoji
        }
      }
    })
    commit('SET_MESSAGES', messages)
  },
  */
  async sendMessage (context, payload) {
    await apolloClient.mutate({
      mutation: require('@/graphql/sendMessage.gql'),
      variables: payload
    })
  },
  async nouveauMessage ({ commit, state, rootState }, payload) {
    if (!state.chatWindow) commit('SET_NEW_MESSAGES', state.newMessages + 1)
    commit('SET_MESSAGES', [...state.messages, {
      author: {
        ...payload.user,
        me: payload.user.id === rootState.main.currentUser.id
      },
      type: payload.type,
      createdAt: payload.createdAt,
      data: {
        text: payload.text,
        emoji: payload.emoji
      }
    }])
  }
}

const mutations = {
  SET_MESSAGES (state, payload) {
    state.messages = payload
  },
  SET_CHAT_WINDOW (state, payload) {
    state.chatWindow = payload
  },
  SET_NEW_MESSAGES (state, payload) {
    state.newMessages = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
