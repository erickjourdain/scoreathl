<template>
  <div>
    <apollo-error v-if="type === 'apollo'" :errors="error.graphQLErrors" />
    <network-error v-if="type === 'network'" :error="error.networkError" />
  </div>
</template>

<script>
import ApolloError from '@/components/ApolloError.vue'
import NetworkError from '@/components/NetworkError.vue'

export default {
  name: 'Error',
  data () {
    return {
      type: null
    }
  },
  components: {
    ApolloError,
    NetworkError
  },
  props: ['error'],
  mounted () {
    if (this.error.graphQLErrors && this.error.graphQLErrors.length !== 0) {
      this.type = 'apollo'
      // console.error(`GraphQL execution errors`)
      // console.log(this.error)
      /*
      for (let e of this.error.graphQLErrors) {
        console.error(e)
      }
      */
    } else if (this.error.networkError) {
      this.type = 'network'
      // console.error(`Network Error`)
      // console.log(this.error.networkError)
    } else {
      // console.error(`An error has occured`)
      /*
      if (Array.isArray(this.error)) {
        console.error(...this.error)
      } else {
        console.error(this.error)
      }
      */
    }
  }
}
</script>

<style>

</style>
