<template>
  <v-toolbar>
    <v-toolbar-title class="display-1 font-weight-medium text-uppercase">
      {{ competition.nom }}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon @click="$router.push(`/competition/${competition.id}`)">
          <v-icon v-on="on">mdi-trophy-outline</v-icon>
        </v-btn>
      </template>
      <span>classement</span>
    </v-tooltip>

    <v-tooltip bottom v-if="competition.statut && user && user.id">
      <template v-slot:activator="{ on }">
        <v-btn icon @click="$router.push(`/competition/${competition.id}/creer_equipe`)">
          <v-icon v-on="on">mdi-account-plus</v-icon>
        </v-btn>
      </template>
      <span>créer équipe</span>
    </v-tooltip>

    <v-menu bottom left v-if="organisateur || isAdmin">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-tile>
          <v-list-tile-title @click="$router.push(`/competition/${competition.id}/mettre_a_jour`)">
            mettre à jour
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-title @click="$router.push(`/competition/${competition.id}/equipes`)">
            équipes
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-title @click="$router.push(`/competition/${competition.id}/planning`)">
            planning
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-title @click="$router.push(`/competition/${competition.id}/juges`)">
            ajouter juge
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'CompetitionToolbar',
  computed: {
    ...mapState('main', {
      user: 'currentUser'
    }),
    ...mapState('competition', {
      competition: 'current'
    }),
    ...mapGetters('main', {
      isAdmin: 'isAdmin'
    }),
    ...mapGetters('competition', {
      organisateur: 'organisateur',
      juges: 'juges'
    })
  }
}
</script>
