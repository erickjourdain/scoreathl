<template>
  <v-layout row justify-center>
    <v-flex xs12 md6 lg4>
      <span class="headline">
        Creér une compétition
      </span>
      <competition-form :competition="competition"/>
    </v-flex>
  </v-layout>
</template>

<script>
import CompetitionForm from '@/components/CompetitionForm'

export default {
  name: 'NewCompetition',
  components: { CompetitionForm },
  data () {
    return {
      error: false,
      competition: {
        nom: '',
        emplacement: '',
        date: new Date().toISOString().substr(0, 10),
        organisateurs: [],
        statut: false,
        password: '',
        image: null
      }
    }
  }
}
</script>

<style>

</style>
