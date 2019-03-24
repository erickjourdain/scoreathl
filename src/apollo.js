import { ApolloClient } from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

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

const client = new ApolloClient({
  link: authLink.concat(createUploadLink({ uri: httpEndpoint })),
  cache: new InMemoryCache()
})

export default client
