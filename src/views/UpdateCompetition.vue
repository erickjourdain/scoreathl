<template>
  <v-layout row justify-center>
    <v-flex xs12 md8 lg6>
      <span class="headline">
        Modifier
      </span>
      <competition-form :competition="competition"/>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import CompetitionForm from '@/components/CompetitionForm'

export default {
  name: 'UpdateCompetition',
  components: { CompetitionForm },
  data () {
    return {
      competitionId: this.$route.params.competition
    }
  },
  computed: {
    ...mapState('competition', {
      competition: 'current'
    })
  }
}
</script>

<style>

</style>
