<template>
  <v-layout row align-center>
    <v-flex xs12 sm6>
      <v-autocomplete
        v-model="athlete"
        :items="athletes" item-text="nom" item-value="id"
        label="sélectionner athlète"
        persistent-hint
        @input="setAthlete"
      >
        <template slot="selection" slot-scope="data">
          <v-chip :selected="data.selected">
            <athlete-avatar :avatar="data.item.avatar" />
            {{ data.item.nom }}
          </v-chip>
        </template>
        <template slot="item" slot-scope="data">
          <v-list-tile-avatar>
            <athlete-avatar :avatar="data.item.avatar" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="data.item.nom"></v-list-tile-title>
            <v-list-tile-sub-title v-html="data.item.equipe"></v-list-tile-sub-title>
          </v-list-tile-content>
        </template>
      </v-autocomplete>
    </v-flex>
    <v-flex xs12 sm6>
      <v-autocomplete
        v-model="epreuve"
        :items="epreuves"
        item-text="nom"
        item-value="id"
        chips
        label="sélectionner épreuve"
        persistent-hint
        @input="setEpreuve"
      >
      </v-autocomplete>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { find } from 'lodash'
import AthleteAvatar from '@/components/AthleteAvatar'

export default {
  name: 'ScoreChoice',
  components: { AthleteAvatar },
  data () {
    return {
      athlete: null,
      epreuve: null
    }
  },
  computed: {
    ...mapState('competition', {
      score: 'score'
    }),
    ...mapGetters('competition', {
      athletes: 'listAthletes'
    }),
    ...mapGetters('epreuve', {
      epreuves: 'listEpreuves'
    })
  },
  methods: {
    setAthlete () {
      this.$store.dispatch('competition/setAthlete', { id: this.athlete })
    },
    setEpreuve () {
      this.$store.commit('competition/SET_EPREUVE', find(this.epreuves, { id: this.epreuve }))
    }
  },
  watch: {
    score (val) {
      if (val && !val.athlete && !val.epreuve) {
        this.athlete = null
        this.epreuve = null
      }
    }
  }
}
</script>

<style>

</style>
