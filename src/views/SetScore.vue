<template>
  <v-layout align-center justify-center row>
    <v-flex xs12 md10 lg8>
      <score-choice />
      <score-card v-if="score && score.athlete && score.epreuve"/>
      <span v-else class="headline">
        Sélectionner un athlèete et une épreuve
      </span>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import ScoreChoice from '@/components/ScoreChoice'
import ScoreCard from '@/components/ScoreCard'

export default {
  name: 'SetScore',
  components: { ScoreCard, ScoreChoice },
  computed: {
    ...mapState('competition', {
      score: 'score'
    })
  }
}
</script>

<style>

</style>
