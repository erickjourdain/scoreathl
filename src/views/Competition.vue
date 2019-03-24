<template>
  <div>
    <v-layout row justify-center wrap >
      <v-flex xs12 v-if="!competition">
        Chargement des données ...
      </v-flex>
      <v-flex xs12 v-else >
        <span class="display-1 font-weight-medium text-uppercase" >
          {{ competition.nom }}
        </span>
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

export default {
  name: 'Competition',
  computed: {
    ...mapState('competition', {
      competition: 'current'
    })
  },
  created () {
    this.$store.dispatch('competition/getCompetition', { id: this.$route.params.competition })
  },
  async destroyed () {
    await this.$store.commit('competition/SET_CURRENT', null)
  }
}
</script>

<style>

</style>
