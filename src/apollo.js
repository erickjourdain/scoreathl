import { ApolloClient } from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { onError } from 'apollo-link-error'
import { split, ApolloLink } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'

import store from './store'

const wsLink = new WebSocketLink({
  uri: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:4000/graphql',
  options: {
    reconnect: true
  }
})

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
    let text = ''
    graphQLErrors.map(({ message }) => {
      text = (message.length) ? `${text}<br>${message}` : message
    })
    store.dispatch('main/setSnackbar', { visible: true, text, color: 'error' })
  }
  if (networkError) {
    const text = `erreur code ${networkError.statusCode}<br>${networkError}`
    store.dispatch('main/setSnackbar', { visible: true, text, color: 'error' })
  }
})

const client = new ApolloClient({
  link: ApolloLink.from([
    ErrorLink,
    split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
      },
      wsLink,
      authLink.concat(createUploadLink({ uri: httpEndpoint }))
    )
  ]),
  cache: new InMemoryCache()
})

export default client
