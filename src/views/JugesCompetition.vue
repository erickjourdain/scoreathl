<template>
  <div>
    <v-layout row justify-center>
      <v-flex xs12 sm6 lg4>
        <juge-form :existingJuges="juges" :loading="loading" v-on:addJuge="addJuge"/>
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-flex xs12>
        <span class="headline">
          Les juges de la compétition
        </span>
        <v-alert type="warning" :value="!juges.length" >
          Aucun juge défini, seul les organisateurs peuvent enregistrer des résultats
        </v-alert>
        <competition-juges v-for="juge in juges" :juge="juge" :key="juge.id" v-on:deleteJuge="deleteJuge" />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { map } from 'lodash'
import { mapGetters } from 'vuex'
import JugeForm from '@/components/JugeForm'
import CompetitionJuges from '@/components/CompetitionJuges'

export default {
  name: 'JugesCompetition',
  data () {
    return {
      competitionId: this.$route.params.competition,
      loading: false
    }
  },
  components: { JugeForm, CompetitionJuges },
  computed: {
    ...mapGetters('competition', {
      juges: 'juges'
    })
  },
  methods: {
    async deleteJuge (juge) {
      const juges = []
      map(this.juges, j => {
        if (j.user.id !== juge.user.id) {
          const epreuves = map(j.epreuves, e => {
            return e.id
          })
          juges.push({
            user: j.user.id,
            epreuves
          })
        }
      })
      this.loading = true
      await this.$store.dispatch('competition/defineJuge', juges)
      this.loading = false
    },
    async addJuge (juge) {
      const juges = map(this.juges, j => {
        const epreuves = map(j.epreuves, e => {
          return e.id
        })
        return {
          user: j.user.id,
          epreuves
        }
      })
      juges.push(juge)
      this.loading = true
      await this.$store.dispatch('competition/defineJuge', juges)
      this.loading = false
    }
  }
}
</script>

<style>

</style>
