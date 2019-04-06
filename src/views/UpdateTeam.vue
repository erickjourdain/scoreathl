<template>
  <v-layout row justify-center>
    <v-flex xs12 sm6 md4 lg3 v-if="!equipe">
      Chargement des données...
    </v-flex>
    <v-flex xs12 md8 lg6 v-else>
      <span class="headline">
        Modifier <b>{{ equipe.nom }}</b>
      </span>
      <equipe-form :equipe="equipe"/>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import EquipeForm from '@/components/EquipeForm'

export default {
  name: 'UpdateTeam',
  components: { EquipeForm },
  computed: {
    ...mapState('competition', {
      equipe: 'team'
    })
  },
  mounted () {
    this.$store.dispatch('competition/setTeam', { id: this.$route.params.equipe })
  },
  destroyed () {
    this.$store.commit('competition/SET_TEAM', null)
  }
}
</script>

<style>

</style>
