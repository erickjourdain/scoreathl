import { ApolloClient } from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { onError } from 'apollo-link-error'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'

import store from './store'

const wsLink = new WebSocketLink({
  uri: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:4000/graphql',
  options: {
    reconnect: true
  }
})

// const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:4000/graphql'
const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:4000/graphql'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('apollo-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const ErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log('erreur')
    let messages = ''
    graphQLErrors.map(({ message }) => {
      messages = `${messages}<br>${message}`
    })
    store.dispatch('main/setSnackbar', { visible: true, text: messages, color: 'error' })
  }
  if (networkError) store.dispatch('main/setSnackbar', { visible: true, text: networkError, color: 'error' })
  // console.log(`[Network error]: ${networkError}`)
})

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(createUploadLink({ uri: httpEndpoint })),
  ErrorLink
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

/*
const client = new ApolloClient({
  link: authLink.concat(createUploadLink({ uri: httpEndpoint })),
  cache: new InMemoryCache()
})
*/

export default client
