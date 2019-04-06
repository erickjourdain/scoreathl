<template>
  <v-layout row wrap align-center>
    <v-flex xs3 class="text-xs-left title secondary--text">
      <span v-if="score.challenge.essais > 1">
        Essai n° {{ index }} :
      </span>
    </v-flex>
    <v-flex xs3 lass="text-xs-left title secondary--text">
      <v-currency-field :value="res" v-model="res" :suffix="score.challenge.epreuve.unitePrincipale" @change="changeInput"/>
    </v-flex>
    <v-flex xs3 md2 offset-md3 class="text-xs-right">
      <v-checkbox :label="score.challenge.epreuve.erreur" v-model="checkbox" @change="checkboxChange"></v-checkbox>
    </v-flex>
    <v-flex xs12 sm6>
      <v-slider v-model="main" :max="maxPrincipal" :label="score.challenge.epreuve.unitePrincipale" @change="resChange"
        thumb-label="always" inverse-label color="accent" thumb-color="accent" :disabled="disabled"/>
    </v-flex>
    <v-flex xs12 sm6>
      <v-slider v-model="secondary" :max="maxSecondary" :label="score.challenge.epreuve.uniteSecondaire" @change="resChange"
        thumb-label="always" inverse-label color="accent" thumb-color="accent" :disabled="disabled"/>
    </v-flex>
  </v-layout>
</template>

<script>
import { max } from 'lodash'
import { mapState, mapGetters } from 'vuex'
import VCurrencyField from '@/components/VCurrencyField'

export default {
  name: 'EpreuveTry',
  props: [ 'index', 'initScore', 'initRes', 'new-score' ],
  components: { VCurrencyField },
  data () {
    return {
      res: this.initRes.marques[this.index - 1],
      main: Math.floor(this.initRes.marques[this.index - 1]),
      secondary: Math.floor((this.initRes.marques[this.index - 1] - Math.floor(this.initRes.marques[this.index - 1])) * 100),
      checkbox: this.initRes.marques[this.index - 1] < 0,
      disabled: this.initRes.marques[this.index - 1] < 0,
      maxSecondary: (this.initScore.challenge.epreuve.unitePrincipale === 'min') ? 59 : 99
    }
  },
  computed: {
    ...mapState('competition', {
      score: 'score'
    }),
    ...mapGetters('competition', {
      resultats: 'resultats'
    }),
    maxPrincipal () {
      return Math.floor(max(this.notations.points) * 1.1)
    },
    notations () {
      return this.$store.getters['categorie/getNotations'](this.score.athlete.categorie.id, this.score.challenge.epreuve.id)
    }
  },
  watch: {
    score (val) {
      this.maxSecondary = (val.challenge.epreuve.unitePrincipale === 'min') ? 59 : 99
    },
    resultats (val) {
      this.res = val.marques[this.index - 1]
      this.main = Math.floor(val.marques[this.index - 1])
      this.secondary = Math.floor((val.marques[this.index - 1] - Math.floor(val.marques[this.index - 1])) * 100)
      this.checkbox = val.marques[this.index - 1] < 0
      this.disabled = val.marques[this.index - 1] < 0
    }
  },
  methods: {
    checkboxChange () {
      this.disabled = this.checkbox
      this.main = 0
      this.secondary = 0
      this.res = 0
      if (this.checkbox) {
        this.$emit('new-score', -1, this.index)
      } else {
        this.$emit('new-score', 0, this.index)
      }
    },
    resChange () {
      this.res = (this.secondary < 10) ? `${this.main}.0${this.secondary}` : `${this.main}.${this.secondary}`
      this.$emit('new-score', this.res, this.index)
    },
    changeInput () {
      this.main = (this.res.toString().indexOf('.') >= 0) ? parseInt(this.res.toString().split('.')[0]) : this.res
      this.secondary = (this.res.toString().indexOf('.') >= 0) ? parseInt(this.res.toString().split('.')[1]) : 0
      this.$emit('new-score', this.res, this.index)
    }
  }
}
</script>

<style>

</style>
