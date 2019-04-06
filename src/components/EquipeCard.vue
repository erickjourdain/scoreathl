<template>
  <v-flex xs12 md10 lg8>
    <v-card>
      <v-card-title primary-title>
        <v-flex xs2 class="text-xs-center">
          <v-avatar color="primary" size="75">
            <img v-if="equipe.avatar" :src="`${env}/${equipe.avatar}`" alt="Avatar"/>
            <v-icon dark v-else>
              mdi-human-male-boy
            </v-icon>
          </v-avatar>
        </v-flex>
        <v-flex xs8>
          <div class="display-1 secondary--text text-uppercase">
            {{ equipe.nom }}
          </div>
          <v-chip dark color="accent">{{ equipe.enfant.categorie.nom }}</v-chip>
          <v-chip dark color="secondary" v-if="equipe.etiquette">{{ equipe.etiquette.valeur }}</v-chip>
        </v-flex>
        <v-flex xs2 class="text-xs-right">
          <v-chip dark color="primary">{{ equipe.points }} pts</v-chip>
        </v-flex>
      </v-card-title>
      <v-divider light></v-divider>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12 md6 pr-2 class="border-right">
            <athlete-equipe-card :athlete="equipe.enfant"/>
          </v-flex>
          <v-flex xs12 md6 pl-2>
            <athlete-equipe-card :athlete="equipe.adulte"/>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions v-if="action">
        <v-layout row align-center justify-space-between>
          <v-flex xs2>
            <v-btn fab dark small color="error" @click="$emit('del-team')" v-if="!equipe.statut && (organisateur || proprietaire)">
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
            <v-btn fab dark small color="primary" @click="updateTeam" v-if="!equipe.statut && (organisateur || proprietaire)">
              <v-icon dark>mdi-eye</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs3 sm2 v-if="isAdmin || organisateur">
            <v-checkbox v-model="status" color="secondary" label="valide" @change="$emit('update-status')">
            </v-checkbox>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import { mapGetters } from 'vuex'
import AthleteEquipeCard from '@/components/AthleteEquipeCard'

export default {
  name: 'EquipeCard',
  components: { AthleteEquipeCard },
  props: [ 'equipe' ],
  data () {
    return {
      env: process.env.VUE_APP_IMAGE,
      status: this.equipe.statut
    }
  },
  computed: {
    ...mapGetters('main', {
      isAdmin: 'isAdmin'
    }),
    ...mapGetters('competition', {
      organisateur: 'organisateur',
      proprietaire: 'proprietaire'
    }),
    statut () {
      return (this.equipe.statut) ? 'validé' : 'à valider'
    },
    action () {
      let visible = true
      this.equipe.enfant.scores.map(res => {
        if (res.statut) {
          visible = false
        }
      })
      this.equipe.adulte.scores.map(res => {
        if (res.statut) {
          visible = false
        }
      })
      if (!this.isAdmin && !this.organisateur && !this.proprietaire) {
        visible = false
      }
      return visible
    }
  },
  methods: {
    updateTeam () {
      this.$router.push(`/competition/${this.$route.params.competition}/mettre_a_jour/${this.$route.params.equipe}`)
    }
  }
}
</script>

<style scoped>
  .border-right {
    border-right: solid 1px rgba(0,0,0,0.12);
  }
</style>
