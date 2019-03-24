<template>
  <v-layout wrap row justify-center mt-3 >
    <v-flex xs12 sm6 md4 lg3 v-for="equipe in equipes" :key="equipe.id" >
      <v-card>
        <v-layout align-center>
          <v-flex xs2 ml-2>
            <v-avatar color="primary" >
              <img v-if="equipe.avatar" :src="`${env}/${equipe.avatar}`" alt="Avatar" />
              <v-icon dark v-else >
                mdi-human-male-boy
              </v-icon>
            </v-avatar>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="title">
                  {{ equipe.nom }}
                </div>
                <div>{{ equipe.enfant.categorie.nom }}</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider light></v-divider>
        <v-card-actions class="pa-3">
          <v-btn :to="`/competition/${$route.params.competition}/equipe/${equipe.id}`" >
            voir
          </v-btn>
          <v-spacer></v-spacer>
          <v-icon v-if="equipe.statut" color="success" >
            mdi-check
          </v-icon>
          <v-icon v-else color="warning" >
            mdi-pause
          </v-icon>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Teams',
  data () {
    return {
      env: process.env.VUE_APP_IMAGE
    }
  },
  computed: {
    ...mapState('main', {
      currentUser: 'currentUser'
    }),
    ...mapGetters('competition', {
      equipes: 'equipes'
    })
  }
}
</script>

<style>

</style>
