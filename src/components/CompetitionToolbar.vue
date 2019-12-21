<template>
  <div>
    <confirmation-dialog :dialog="confirmationDialog"
      @undo="confirmationDialog = false" @confirm="suppCompetition"
      :text="messageConfirmation" :loading="loading"/>
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
            <v-list-tile-title class="pointer" @click="$router.push(`/competition/${competition.id}/mettre_a_jour`)">
              mettre à jour
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-title class="pointer" @click="$router.push(`/competition/${competition.id}/equipes`)">
              équipes
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-title class="pointer" @click="$router.push(`/competition/${competition.id}/planning`)">
              planning
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-title class="pointer" @click="$router.push(`/competition/${competition.id}/juges`)">
              ajouter juge
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-title class="pointer" @click="confirmationDialog = true">
              supprimer la compétition
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import ConfirmationDialog from '@/components/ConfirmationDialog'

export default {
  name: 'CompetitionToolbar',
  components: {
    ConfirmationDialog
  },
  data () {
    return {
      confirmationDialog: false,
      loading: false
    }
  },
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
    }),
    messageConfirmation () {
      return `<p>Confirmer la suppression de la compétition <b>${this.competition.nom}</b>
        du ${this.$moment(this.competition.date).format('DD MMM YYYY')}?</p>
        <p>Toutes les données seront supprimées de la base de données.</p>`
    }
  },
  methods: {
    async suppCompetition () {
      await this.$store.dispatch('competition/suppressionCompetition', { id: this.competition.id })
      this.$store.dispatch('competition/setFecthPolicy', { competition: 'network-only' })
      this.confirmationDialog = false
      this.loading = false
      this.$router.push('/')
    }
  }
}
</script>
