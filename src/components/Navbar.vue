<template>
  <div>
    <nav-drawer :drawer="drawer" :user="currentUser" @drawerStatut="changeDrawer"/>
    <v-toolbar fixed color="primary" dark
      :clipped-left="false" app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer">
      </v-toolbar-side-icon>
      <router-link to="/">
        <img :src="'/assets/images/Logo-SOR-386x386.jpeg'" height="38px">
      </router-link>
      <v-toolbar-title class="headline">
        <span class="red--text text-uppercase">SOR</span>
        <span class="font-weight-light">Ath</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="!currentUser">
        <v-tooltip bottom>
          <v-btn icon @click="moveTo('/login')" slot="activator">
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
          <span>login</span>
        </v-tooltip>
      </div>
      <div v-else>
        <v-tooltip bottom>
          <v-btn icon slot="activator">
            <v-avatar size="32px">
              <img :src="avatar" alt="avatar" v-if="currentUser.avatar">
              <v-icon v-else>mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
          <span>{{currentUser.nom}}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn icon @click="logout" slot="activator">
            <v-icon>mdi-power</v-icon>
          </v-btn>
          <span>deconnexion</span>
        </v-tooltip>
      </div>
    </v-toolbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import NavDrawer from '@/components/NavDrawer'

export default {
  name: 'Navbar',
  components: { NavDrawer },
  data () {
    return {
      drawer: false,
      env: process.env.VUE_APP_IMAGE
    }
  },
  computed: {
    ...mapState('main', {
      currentUser: 'currentUser'
    }),
    avatar () {
      if (this.currentUser.avatar.indexOf('http') < 0) {
        return `${this.env}/${this.currentUser.avatar}`
      } else {
        return this.currentUser.avatar
      }
    }
  },
  methods: {
    ...mapMutations('main', {
      setCurrentUSer: 'SET_CURRENT_USER'
    }),
    changeDrawer (e) {
      this.drawer = e
    },
    moveTo (route) {
      this.$router.push(route)
    },
    async logout () {
      localStorage.removeItem('apollo-token')
      sessionStorage.removeItem('user')
      if (this.currentUser.service === 'google') {
        window.gapi.auth2.getAuthInstance().signOut()
      }
      if (this.currentUser.service === 'facebook') {
        window.FB.logout()
      }
      this.setCurrentUSer(null)
      this.$router.push('/')
    }
  }
}
</script>

<style>

</style>
