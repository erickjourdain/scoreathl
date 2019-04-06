import { ApolloClient } from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'

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

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(createUploadLink({ uri: httpEndpoint }))
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
