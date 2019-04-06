<template>
  <v-layout row justify-center>
    <v-flex xs12 md8 lg6>
      <span class="headline">
        Creér une compétition
      </span>
      <competition-form :competition="competition" v-if="competition" />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import CompetitionForm from '@/components/CompetitionForm'

export default {
  name: 'NewCompetition',
  components: { CompetitionForm },
  data () {
    return {
      error: false,
      competition: null
    }
  },
  methods: {
    challenges () {
      let values = []
      for (let i = 0; i < this.epreuves.length; i++) {
        values.push({
          epreuve: this.epreuves[i],
          essais: this.epreuves[i].maxEssais,
          statut: true
        })
      }
      this.competition = {
        nom: '',
        emplacement: '',
        date: new Date().toISOString().substr(0, 10),
        organisateurs: [],
        statut: false,
        password: '',
        image: null,
        challenges: values
      }
    }
  },
  computed: {
    ...mapState('epreuve', {
      epreuves: 'all'
    })
  },
  mounted () {
    this.challenges()
  },
  watch: {
    epreuves (val) {
      let values = []
      for (let i = 0; i < val.length; i++) {
        values.push({
          epreuve: val[i],
          essais: val[i].maxEssais,
          statut: true
        })
      }
      this.competition = {
        nom: '',
        emplacement: '',
        date: new Date().toISOString().substr(0, 10),
        organisateurs: [],
        statut: false,
        password: '',
        image: null,
        challenges: values
      }
    }
  }
}
</script>

<style>

</style>
