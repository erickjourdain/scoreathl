<template>
  <div>
    <v-layout align-center>
      <v-flex xs8>
        <span class="headline text-capitalize">
          {{ athlete.prenom }} {{ athlete.nom }}
        </span>
        <br/>
        <span>
          {{ $moment(athlete.dateNaissance).format('DD/MM/YYYY') }}
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
    <div v-for="resultat of athlete.score.resultats" :key="resultat.id">
      <resultat-ligne-equipe-card :resultat="resultat" v-on:def-score="defScore"/>
    </div>
  </div>
</template>

<script>
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
      return (this.athlete.score.points >= 1) ? `${this.athlete.score.points} pts` : `${this.athlete.score.points} pt`
    }
  },
  methods: {
    defScore (resultat) {
      this.$store.commit('competition/SET_ATHLETE', this.athlete)
      this.$store.dispatch('competition/setEpreuve', { id: resultat.epreuve.id })
      this.$router.push(`/competition/${this.$route.params.competition}/definir_score`)
    }
  }
}
</script>

<style>

</style>
