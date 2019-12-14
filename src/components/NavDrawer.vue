<template>
  <v-navigation-drawer v-model="visible" absolute temporary app>
    <v-list>

      <router-link to="/">
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>mdi-home</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Accueil</v-list-tile-title>
        </v-list-tile>
      </router-link>

      <router-link to="/notations">
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>mdi-calculator</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Notations</v-list-tile-title>
        </v-list-tile>
      </router-link>

      <router-link to="/about">
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>mdi-information</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>A propos</v-list-tile-title>
        </v-list-tile>
      </router-link>

      <v-list-group prepend-icon="mdi-account-star" value="true" v-if="isAdmin" >
        <v-list-tile slot="activator">
          <v-list-tile-title>Admin</v-list-tile-title>
        </v-list-tile>

        <router-link to="/users">
          <v-list-tile>
            <v-list-tile-title>utilisateurs</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>mdi-account-group</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </router-link>

        <router-link to="/newCompetition">
          <v-list-tile>
            <v-list-tile-title>créer compétition</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>mdi-new-box</v-icon>
              </v-list-tile-action>
          </v-list-tile>
        </router-link>

        <router-link to="/tags">
          <v-list-tile>
            <v-list-tile-title>étiquettes</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>mdi-tag</v-icon>
              </v-list-tile-action>
          </v-list-tile>
        </router-link>
      </v-list-group>

      <v-list-group prepend-icon="mdi-run-fast" v-if="currentCompetition" >
        <v-list-tile slot="activator">
          <v-list-tile-title>{{ currentCompetition.nom }}</v-list-tile-title>
        </v-list-tile>

        <router-link :to="`/competition/${currentCompetition.id}`">
          <v-list-tile>
            <v-list-tile-title>classement</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>mdi-trophy-outline</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </router-link>
<!--
        <router-link :to="`/competition/${currentCompetition.id}/definir_score`" v-if="organisateur || isAdmin || isJuge">
          <v-list-tile>
            <v-list-tile-title>enregistrer score</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>mdi-timer</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </router-link>
-->
        <router-link :to="`/competition/${currentCompetition.id}/creer_equipe`" v-if="currentCompetition.statut && user && user.id">
          <v-list-tile>
            <v-list-tile-title>créer équipe</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>mdi-emoticon-cool-outline</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </router-link>

        <router-link :to="`/competition/${currentCompetition.id}/mettre_a_jour`" v-if="organisateur || isAdmin">
          <v-list-tile>
            <v-list-tile-title>mettre à jour</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>mdi-file-plus</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </router-link>

        <router-link :to="`/competition/${currentCompetition.id}/equipes`" v-if="organisateur || isAdmin">
          <v-list-tile>
            <v-list-tile-title>equipes</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>mdi-eye</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </router-link>

        <router-link :to="`/competition/${currentCompetition.id}/planning`" v-if="organisateur || isAdmin">
          <v-list-tile>
            <v-list-tile-title>planning des épreuves</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>mdi-calendar</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </router-link>

        <router-link :to="`/competition/${currentCompetition.id}/juges`" v-if="organisateur || isAdmin">
          <v-list-tile>
            <v-list-tile-title>définir les juges</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>mdi-timer</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </router-link>
      </v-list-group>

    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { filter } from 'lodash'

export default {
  name: 'NavDrawer',
  props: ['drawer', 'user'],
  data () {
    return {
      visible: null
    }
  },
  computed: {
    ...mapState('competition', {
      currentCompetition: 'current'
    }),
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
    isJuge () {
      return filter(this.juges, juge => {
        return juge.user.id === this.currentUser.id
      })
    }
  },
  watch: {
    drawer (value) {
      this.visible = value
    },
    visible (value) {
      this.$emit('drawerStatut', value)
    }
  }
}
</script>

<style scoped>
  .application a {
    color: inherit;
    text-decoration: none;
  }
</style>
