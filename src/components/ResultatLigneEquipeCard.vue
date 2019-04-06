<template>
  <v-layout row>
    <v-flex xs2 sm1>
      <v-icon v-if="isUserCompetitionJuge" class="pointer" color="secondary"
        @click="$emit('def-score', score)">mdi-timer</v-icon>
    </v-flex>
    <v-flex xs4>
      {{ score.challenge.epreuve.nom }}
    </v-flex>
    <v-flex xs3 class="text-xs-center">
      {{ points }}
    </v-flex>
    <v-flex xs3 class="text-xs-right">
      {{ displayResultat }}
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { max, find } from 'lodash'

export default {
  name: 'ResultatLigneEquipeCard',
  props: [ 'score' ],
  computed: {
    ...mapState('main', {
      currentUser: 'currentUser'
    }),
    ...mapGetters('main', {
      isAdmin: 'isAdmin'
    }),
    ...mapState('competition', {
      equipe: 'team'
    }),
    ...mapGetters('competition', {
      organisateur: 'organisateur',
      juges: 'juges'
    }),
    points () {
      return (this.score.points >= 1) ? `${this.score.points} pts` : `${this.score.points} pt`
    },
    displayResultat () {
      let res = max(this.score.marques)
      switch (this.score.challenge.epreuve.unitePrincipale) {
        case 'sec':
          res = (res) ? res.toString().replace('.', '\'\'') : '0\'\'00'
          break
        case 'min':
          res = (res) ? `${res.toString().replace('.', '\'')}''` : '0\'00\'\''
          break
        default:
          res = (res) ? `${res.toString()}m` : '0.00m'
          break
      }
      return res
    },
    isUserCompetitionJuge () {
      if (!this.equipe || !this.equipe.statut) {
        return false
      }
      if (this.isAdmin || this.organisateur) {
        return true
      }
      return find(this.juges, juge => {
        return (find(juge.epreuves, { id: this.score.challenge.epreuve.id }) && juge.user.id === this.currentUser.id)
      })
    }
  }
}
</script>

<style>

</style>
