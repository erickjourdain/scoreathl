<template>
  <v-layout align-center row spacer >
    <v-flex xs4 sm2 md1>
      <equipe-avatar :avatar="equipe.avatar" />
    </v-flex>
    <v-flex xs6 sm4 md3>
      {{ equipe.nom }}
    </v-flex>
    <v-flex xs2 sm2 md1 class="text-md-right">
      {{ points }}
    </v-flex>
    <v-flex sm3 md2 hidden-xs-only class="text-md-center" >
      <v-chip color="accent" dark >
        {{ equipe.enfant.categorie.nom }}
      </v-chip>
    </v-flex>
    <v-flex md2 hidden-sm-down class="text-md-center" >
      <v-chip v-if="equipe.etiquette" color="secondary" dark >
        {{ equipe.etiquette.valeur }}
      </v-chip>
    </v-flex>
    <v-flex md2 hidden-sm-down class="text-md-center" >
      <v-chip :color="(nbEpreuves === 10) ? 'success' : 'warning'" dark >
        {{ (nbEpreuves > 1) ? `${nbEpreuves} épreuves` : `${nbEpreuves} épreuve` }}
      </v-chip>
    </v-flex>
    <v-flex xs1 class="text-xs-center">
      <v-icon @click="seeTeam">mdi-eye-outline</v-icon>
    </v-flex>
  </v-layout>
</template>

<script>
import EquipeAvatar from '@/components/EquipeAvatar'

export default {
  name: 'LigneEquipe',
  components: { EquipeAvatar },
  props: [ 'equipe' ],
  computed: {
    nbEpreuves () {
      let nbEpreuves = 0
      for (let resultat of this.equipe.adulte.scores) {
        nbEpreuves = (resultat.statut === 2) ? (nbEpreuves + 1) : nbEpreuves
      }
      for (let resultat of this.equipe.enfant.scores) {
        nbEpreuves = (resultat.statut === 2) ? (nbEpreuves + 1) : nbEpreuves
      }
      return nbEpreuves
    },
    points () {
      return (this.equipe.points > 1) ? `${this.equipe.points} pts` : `${this.equipe.points} pt`
    },
    avatar () {
      return `${process.env.VUE_APP_IMAGE}/${this.equipe.avatar}`
    }
  },
  methods: {
    seeTeam () {
      this.$router.push(`/competition/${this.$route.params.competition}/equipe/${this.equipe.id}`)
    }
  }
}
</script>

<style>

</style>
