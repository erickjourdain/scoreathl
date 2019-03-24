<template>
  <v-layout row>
    <v-flex xs2 sm1>
      <v-icon v-if="isUserCompetitionJuge" class="pointer" color="secondary"
        @click="$emit('def-score', resultat)">mdi-timer</v-icon>
    </v-flex>
    <v-flex xs4>
      {{ resultat.epreuve.nom }}
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
  props: [ 'resultat' ],
  computed: {
    ...mapState('main', {
      currentUser: 'currentUser'
    }),
    ...mapGetters('main', {
      isAdmin: 'isAdmin'
    }),
    ...mapGetters('competition', {
      organisateur: 'organisateur',
      juges: 'juges'
    }),
    points () {
      return (this.resultat.score >= 1) ? `${this.resultat.score} pts` : `${this.resultat.score} pt`
    },
    displayResultat () {
      if (!this.resultat.resultat.length) {
        return '-'
      }
      let res = max(this.resultat.resultat)
      switch (this.resultat.epreuve.unitePrincipale) {
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
      if (this.isAdmin || this.organisateur) {
        return true
      }
      return find(this.juges, juge => {
        return (find(juge.epreuves, { id: this.resultat.epreuve.id }) && juge.user.id === this.currentUser.id)
      })
    }
  }
}
</script>

<style>

</style>
