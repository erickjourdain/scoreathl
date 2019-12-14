<template>
  <v-layout row justify-center>
    <v-flex xs12 md10>
      <span class="headline">
        Planning des épreuves
      </span>
      <v-data-iterator
        :items="challenges"
        content-tag="v-layout"
        :hide-actions="true"
        row
        wrap
      >
        <template v-slot:item="props">
          <v-flex
            xs12
            sm6
          >
            <challenge-planning :challenge="props.item" />
          </v-flex>
        </template>
      </v-data-iterator>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import ChallengePlanning from '@/components/ChallengePlanning'

export default {
  name: 'Epreuves',
  components: { ChallengePlanning },
  computed: {
    ...mapGetters('competition', {
      challenges: 'listChallenges'
    })
  }
}
</script>
