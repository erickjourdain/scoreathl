<template>
  <div>
    <v-layout row align-center justify-center wrap >
      <v-flex xs12 v-if="!competition">
        Chargement des données ...
      </v-flex>

      <v-flex xs12 v-else >
        <competition-toolbar />
        <br>
        <span class="headline font-weight-medium text-capitalize" >
          {{ competition.emplacement }}
        </span>
        <span class="headline font-weight-medium" >
         le {{ $moment(competition.date).format('DD MMM YYYY') }}
        </span>
      </v-flex>
    </v-layout>
    <router-view v-if="competition"></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import apolloClient from '@/apollo'

import CompetitionToolbar from '@/components/CompetitionToolbar'

export default {
  name: 'Competition',
  data () {
    return {
      observers: {}
    }
  },
  components: {
    CompetitionToolbar
  },
  computed: {
    ...mapState('competition', {
      competition: 'current'
    })
  },
  created () {
    this.$store.dispatch('competition/getCompetition', { id: this.$route.params.competition })
    const store = this.$store
    this.observers.modifAthlete = apolloClient.subscribe({
      query: require('@/graphql/subscriptionAthleteModif.gql'),
      variables: { competition: this.$route.params.competition }
    }).subscribe({
      next (data) {
        store.dispatch('competition/modificationEquipe', { id: data.data.modificationAthlete.equipe })
      },
      error (error) {
        this.store.dispatch('main/setSnackbar', { visible: true, text: error, color: 'error' })
      }
    })
    this.observers.creerEquipe = apolloClient.subscribe({
      query: require('@/graphql/subscriptionEquipeCreer.gql'),
      variables: { competition: this.$route.params.competition }
    }).subscribe({
      next (data) {
        store.dispatch('competition/nouvelleEquipe', { id: data.data.nouvelleEquipe.equipe })
      },
      error (error) {
        this.store.dispatch('main/setSnackbar', { visible: true, text: error, color: 'error' })
      }
    })
    this.observers.modifEquipe = apolloClient.subscribe({
      query: require('@/graphql/subscriptionEquipeModif.gql'),
      variables: { competition: this.$route.params.competition }
    }).subscribe({
      next (data) {
        store.dispatch('competition/modificationEquipe', { id: data.data.modificationEquipe.equipe })
      },
      error (error) {
        this.store.dispatch('main/setSnackbar', { visible: true, text: error, color: 'error' })
      }
    })
    this.observers.suppEquipe = apolloClient.subscribe({
      query: require('@/graphql/subscriptionEquipeSupp.gql'),
      variables: { competition: this.$route.params.competition }
    }).subscribe({
      next (data) {
        store.dispatch('competition/suppressionEquipe', { id: data.data.suppressionEquipe.equipe })
      },
      error (error) {
        this.store.dispatch('main/setSnackbar', { visible: true, text: error, color: 'error' })
      }
    })
  },
  beforeDestroy () {
    this.observers.modifAthlete.unsubscribe()
    this.observers.creerEquipe.unsubscribe()
    this.observers.modifEquipe.unsubscribe()
    this.observers.suppEquipe.unsubscribe()
  },
  async destroyed () {
    await this.$store.commit('competition/SET_CURRENT', null)
  }
}
</script>

<style>

</style>
