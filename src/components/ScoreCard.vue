<template>
  <v-card v-if="score && score.athlete && score.challenge">
    <v-card-title primary-title>
      <v-flex xs2 class="text-xs-center">
        <v-avatar color="primary" size="75">
          <img v-if="score.athlete.avatar" :src="`${env}/${score.athlete.avatar}`" alt="Avatar"/>
          <v-icon dark v-else>
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </v-flex>
      <v-flex xs8>
        <div class="display-1 secondary--text text-capitalize">
          {{ score.athlete.prenom }} {{ score.athlete.nom }}
        </div>
        <v-chip dark color="accent">{{ score.athlete.categorie.nom }}</v-chip>
      </v-flex>
    </v-card-title>
    <v-divider light></v-divider>
    <v-card-text>
      <v-layout>
        <v-flex xs12 class="text-xs-center headline primary--text" mb-3>
          <span class="text-uppercase">{{ score.challenge.epreuve.nom }}</span> - {{ points }} pt
        </v-flex>
      </v-layout>
      <epreuve-try v-for="n in score.challenge.essais" :key="n" :index="n"
        :initScore="score" :initRes="resultats" v-on:new-score="newScore" />
    </v-card-text>
    <v-card-actions>
      <v-btn :disabled="disable" :loading="saving" @click="onSave">Sauver</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { orderBy, sortedIndex, max, find } from 'lodash'
import { mapState, mapGetters } from 'vuex'
import EpreuveTry from '@/components/EpreuveTry'

export default {
  name: 'ScoreCard',
  components: { EpreuveTry },
  data () {
    return {
      env: process.env.VUE_APP_IMAGE,
      points: 0,
      res: [],
      saving: false
    }
  },
  computed: {
    ...mapState('competition', {
      score: 'score',
      updatescore: 'updateScore',
      competition: 'current'
    }),
    ...mapGetters('competition', {
      resultats: 'resultats'
    }),
    notations () {
      return this.$store.getters['categorie/getNotations'](this.score.athlete.categorie.id, this.score.challenge.epreuve.id)
    },
    disable () {
      return (!this.updatescore || this.saving)
    }
  },
  watch: {
    resultats (val) {
      if (val) {
        this.res = val.marques
        this.points = val.score
      }
    }
  },
  mounted () {
    this.res = (this.resultats) ? this.resultats.marques : null
    this.points = (this.resultats) ? this.resultats.points : null
  },
  methods: {
    newScore (score, index) {
      this.res[index - 1] = parseFloat(score)
      this.$store.commit('competition/SET_UPDATE_SCORE', true)
      const res = max(this.res)
      if (res < 0) {
        this.points = 0
        return
      }
      this.points = (this.score.challenge.epreuve.unitePrincipale === 'm') ? sortedIndex(orderBy(this.notations.points, [], 'asc'), res) + 1
        : 40 - sortedIndex(orderBy(this.notations.points, [], 'asc'), res)
    },
    async onSave () {
      this.saving = true
      await this.$store.dispatch('competition/saveScore', { res: this.res })
      if (this.score.challenge.epreuve.nom === 'relais') {
        const equipe = find(this.competition.equipes, e => {
          return (e.adulte.id === this.score.athlete.id || e.enfant.id === this.score.athlete.id)
        })
        const athlete = (this.score.athlete.id === equipe.adulte.id) ? equipe.enfant : equipe.adulte
        this.$store.commit('competition/SET_ATHLETE', athlete)
        await this.$store.dispatch('competition/saveScore', { res: this.res })
      }
      this.saving = false
      this.$store.dispatch('main/setSnackbar', { visible: true, color: 'success', text: 'le score a été mis à jour!' })
      this.$store.commit('competition/SET_CHALLENGE', null)
      this.$store.commit('competition/SET_ATHLETE', null)
      this.$router.go(-1)
    }
  }
}
</script>

<style>

</style>
