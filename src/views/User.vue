<template>
  <v-layout row justify-center>
    <v-flex xs6 >
      <div v-if="!user">Chargement des données...</div>
      <v-card v-else>
        <v-layout row align-center>
          <v-flex xs4 class="text-xs-center">
            <v-avatar size="75px">
              <v-img :src="user.avatar" v-if="user.avatar"></v-img>
              <v-icon v-else>mdi-account-circle</v-icon>
            </v-avatar>
          </v-flex>
          <v-flex xs8>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{ user.nom }}</div>
                <div>créé le : {{ formattedDate(user.createdAt) }}</div>
                <div v-if="user.service">via {{ user.service }}</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider light></v-divider>
        <v-layout row align-center>
          <v-flex xs3 class="text-xs-right">
            Role
          </v-flex>
          <v-flex xs1/>
          <v-flex xs4>
            <v-select :items="roles" v-model="role" ></v-select>
          </v-flex>
          <v-flex xs1/>
          <v-flex xs2 class="text-xs-right">
            <v-btn :loading="loading" :disabled="loading" @click="save">
              sauver
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'User',
  data () {
    return {
      roles: ['admin', 'organisateur', 'juge', 'athlète'],
      role: 'athlète',
      loading: false
    }
  },
  computed: {
    ...mapState('user', {
      user: 'selected'
    })
  },
  methods: {
    formattedDate (value) {
      return this.$moment(value).format('DD MMM YYYY')
    },
    async save () {
      this.loading = true
      await this.$store.dispatch('user/updateUser', { id: this.$route.params.id, role: this.role })
      this.loading = false
    }
  },
  async mounted () {
    await this.$store.dispatch('user/getUser', { id: this.$route.params.id })
    this.role = this.user.role
  }
}
</script>

<style>

</style>
