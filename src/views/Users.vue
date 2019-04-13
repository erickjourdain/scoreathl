<template>
  <v-container>
    <v-layout row justify-center>
      <v-flex xs6 md4>
        <v-text-field prepend-icon="mdi-account-search" v-model="search" clearable/>
      </v-flex>
    </v-layout>
    <v-layout row justify-center wrap >
      <v-chip v-for="user in selectedUsers" :key="user.id" :color="color(user)" text-color="white">
        <router-link :to="`/user/${user.id}`">
          <athlete-avatar :avatar="user.avatar" />
        </router-link>
        {{ user.nom }}
        <v-tooltip bottom v-if="user.role === 'admin'">
          <v-icon right slot="activator">mdi-alpha-a-circle</v-icon>
          <span>Administrateur</span>
        </v-tooltip>
        <v-tooltip bottom v-if="user.role === 'organisateur'">
          <v-icon right slot="activator">mdi-alpha-o-circle</v-icon>
          <span>Organisateur</span>
        </v-tooltip>
        <v-tooltip bottom v-if="user.role === 'juge'">
          <v-icon right slot="activator">mdi-alpha-j-circle</v-icon>
          <span>Juge</span>
        </v-tooltip>
        <v-tooltip bottom v-if="user.role === 'athlète'">
          <v-icon right slot="activator">mdi-alpha-u-circle</v-icon>
          <span>Athlète</span>
        </v-tooltip>
      </v-chip>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import AthleteAvatar from '@/components/AthleteAvatar'

export default {
  name: 'Users',
  components: { AthleteAvatar },
  data () {
    return {
      search: ''
    }
  },
  computed: {
    ...mapState('main', {
      currentUser: 'currentUser'
    }),
    ...mapState('user', {
      users: 'all'
    }),
    selectedUsers () {
      if (!this.search || !this.search.trim().length) {
        return this.users
      } else {
        return this.users.filter(u => u.nom.toLowerCase().indexOf(this.search.toLowerCase()) >= 0)
      }
    }
  },
  methods: {
    color (user) {
      switch (user.role) {
        case 'admin':
          return 'indigo'
        case 'organisateur':
          return 'primary'
        case 'juge':
          return 'teal'
        default:
          return 'orange'
      }
    }
  }
}
</script>

<style scoped>
  img {
    cursor: pointer;
  }
  a {
    text-decoration: none
  }
</style>
