<template>
  <v-layout row wrap justify-center>
    <v-flex v-for="competition in competitions" :key="competition.id"
      xs12 sm6 md4 mt-2 >
      <competition-card class="competition" :competition="competition" />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import CompetitionCard from '@/components/CompetitionCard'

export default {
  name: 'Home',
  components: { CompetitionCard },
  computed: {
    ...mapState('competition', {
      competitions: 'all'
    })
  },
  created () {
    this.$store.dispatch('competition/getCompetitions')
  }
}
</script>

<style scoped>
.competition{
  width: 95%;
}
</style>
