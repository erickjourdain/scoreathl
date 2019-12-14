<template>
  <v-layout wrap row justify-center mt-3 >
    <v-flex xs12 sm6 md4 lg3 v-if="!equipe">
      Chargement des données...
    </v-flex>
    <v-layout align-center justify-center row wrap v-else>
      <equipe-card :equipe="equipe" v-on:del-team="del" v-on:update-status="updateStatut"/>
      <v-flex xs12>
        <v-btn fab dark small color="primary" @click="back">
          <v-icon dark>mdi-arrow-left-bold</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import EquipeCard from '@/components/EquipeCard'

export default {
  name: 'Team',
  components: { EquipeCard },
  computed: {
    ...mapGetters('main', {
      isAdmin: 'isAdmin'
    }),
    ...mapState('competition', {
      equipe: 'team'
    })
  },
  methods: {
    async del () {
      await this.$store.dispatch('competition/delTeam', { id: this.$route.params.equipe })
      this.$router.go(-1)
    },
    async updateStatut () {
      await this.$store.dispatch('competition/updateTeamStatus', { id: this.$route.params.equipe })
    },
    back () {
      // this.$router.go(-1)
      this.$router.push(`/competition/${this.$route.params.competition}`)
    }
  },
  created () {
    this.$store.dispatch('competition/setTeam', { id: this.$route.params.equipe })
  },
  destroyed () {
    this.$store.commit('competition/SET_TEAM', null)
  }
}
</script>

<style>

</style>
