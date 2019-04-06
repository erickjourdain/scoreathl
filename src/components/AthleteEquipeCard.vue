<template>
  <div>
    <v-layout align-center>
      <v-flex xs8>
        <span class="headline text-capitalize">
          {{ athlete.prenom }} {{ athlete.nom }}
        </span>
        <br/>
        <span>
          {{ athlete.categorie.nom }} - {{ athlete.annee }}
        </span>
      </v-flex>
      <v-flex xs4 class="text-xs-right">
        <v-avatar color="secondary">
          <img v-if="athlete.avatar" :src="`${env}/${athlete.avatar}`" alt="Avatar"/>
          <v-icon dark v-else>
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </v-flex>
    </v-layout>
    <v-layout mb-3>
      <v-flex xs12 class="text-xs-center">
        <v-chip color="primary" dark>{{ points }}</v-chip>
      </v-flex>
    </v-layout>
    <div v-for="score of scores" :key="score.id">
      <resultat-ligne-equipe-card :score="score" v-on:def-score="defScore"/>
    </div>
  </div>
</template>

<script>
import { orderBy } from 'lodash'
import ResultatLigneEquipeCard from '@/components/ResultatLigneEquipeCard'

export default {
  name: 'AthleteEquipeCard',
  props: [ 'athlete' ],
  components: { ResultatLigneEquipeCard },
  data () {
    return {
      env: process.env.VUE_APP_IMAGE
    }
  },
  computed: {
    points () {
      return (this.athlete.points >= 1) ? `${this.athlete.points} pts` : `${this.athlete.points} pt`
    },
    scores () {
      return orderBy(this.athlete.scores, s => { return s.challenge.epreuve.nom }, 'asc')
    }
  },
  methods: {
    defScore (score) {
      this.$store.commit('competition/SET_ATHLETE', this.athlete)
      this.$store.dispatch('competition/setChallenge', { id: score.challenge.id })
      this.$router.push(`/competition/${this.$route.params.competition}/definir_score`)
    }
  }
}
</script>

<style>

</style>
