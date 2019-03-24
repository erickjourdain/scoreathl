<template>
  <v-navigation-drawer v-model="visible" absolute temporary app>
    <v-list>
      <div v-for="m of menu" :key="m.id">
        <v-list-tile v-if="!m.childs">
          <v-list-tile-action>
            <v-icon>{{ m.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>{{ m.title }} </v-list-tile-title>
        </v-list-tile>

        <v-list-group v-else :prepend-icon="m.icon" value="true" >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>{{ m.title }}</v-list-tile-title>
            </v-list-tile>
          </template>

          <div v-for="sm of menu.childs" :key="sm.id">

            <v-list-tile v-if="!sm.childs">
              <v-list-tile-action>
                <v-icon>{{ sm.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>{{ sm.title }} </v-list-tile-title>
            </v-list-tile>

            <v-list-group v-else no-action sub-group value="true" >
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>{{ sm.title }}</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile v-for="ssm in sm.childs" :key="ssm.i">
                <v-list-tile-title v-text="ssm.title"></v-list-tile-title>
                <v-list-tile-action>
                  <v-icon v-text="ssm.icon"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </div>
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'NavDrawer',
  props: ['drawer'],
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
      user: 'current'
    }),
    ...mapGetters('main', {
      isAdmin: 'isAdmin'
    }),
    ...mapGetters('competition', {
      organisateur: 'organisateur'
    }),
    menu () {
      let m = []
      m.push({ id: 1, title: 'Accueil', icon: 'mdi-home', route: '/' })
      if (this.isAdmin) {
        let childs = [
          { id: 21, title: 'Inscrits', icon: 'mdi-account-group', route: '/users' },
          { id: 22, title: 'Etiquettes', icon: 'mdi-tags', route: '/tags' },
          { id: 23, title: 'Competitions', icon: 'mdi-new-box', route: '/newCompetition' }
        ]
        m.push({ id: 2, title: 'Administration', icon: 'mdi-settings', childs })
      }
      if (this.currentCompetition) {
        let childs = [
          { id: 31, title: 'Classement', icon: 'mdi-trophy-outline', route: `/competition/${this.currentCompetition.id}` }
        ]
        if (this.user && this.user.id) {
          childs.push({ id: 32, title: 'Inscrire équipe', icon: 'mdi-new-box', route: `/competition/${this.currentCompetition.id}/creer_equipe` })
        }
        if (this.isAdmin) {
          let subMenu = {
            title: 'Administration',
            icon: 'mdi-settings',
            childs: [
              { id: 331, title: 'Equipes', icon: 'mdi-eye', route: `/competition/${this.currentCompetition.id}/equipes` },
              { id: 332, title: 'Définir juges', icon: 'mdi-timer', route: `/competition/${this.currentCompetition.id}/juges` },
              { id: 333, title: 'Mettre à jour', icon: 'mdi-file-plus', route: `/competition/${this.currentCompetition.id}/mettre_a_jour` }
            ]
          }
          childs.push(subMenu)
        }
        m.push({ id: 3, title: this.currentCompetition.nom, icon: 'mdi-run-fast', childs })
      }
      return m
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
