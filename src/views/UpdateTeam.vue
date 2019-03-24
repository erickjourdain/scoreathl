<template>
  <v-layout row justify-center>
    <v-flex xs12 md6 lg4>
      <div v-if="$apollo.loading" class="loading apollo">Loading...</div>
      <div v-else>
        <span class="headline">
          Modifier <b>{{ equipe.nom }}</b>
        </span>
        <equipe-form :equipe="equipe"/>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex'
import EquipeForm from '@/components/EquipeForm'

export default {
  name: 'UpdateTeam',
  components: { EquipeForm },
  data () {
    return {
      equipeId: this.$route.params.equipe
    }
  },
  apollo: {
    equipe: {
      query: require('@/graphql/getEquipe.gql'),
      variables () {
        return {
          id: this.equipeId
        }
      },
      error (error) {
        this.setError(error)
      }
    }
  },
  methods: {
    ...mapMutations('main', {
      setError: 'SET_ERROR'
    })
  }
}
</script>

<style>

</style>
