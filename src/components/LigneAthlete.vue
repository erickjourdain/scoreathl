<template>
  <v-layout row align-center >
    <v-flex xs4 sm2 md1 class="text-xs-center" >
      <v-avatar color="indigo darken-4" slot="activator" >
        <img v-if="athlete.avatar"
          :src="avatar" alt="Avatar" >
        <v-icon dark v-else>
          mdi-account-circle
        </v-icon>
      </v-avatar>
    </v-flex>
    <v-flex xs6 sm4 md3>
      {{ athlete.prenom }} {{ athlete.nom }}
    </v-flex>
    <v-flex xs2 sm2 md1
      class="text-md-right">
      {{ points }}
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'LigneAthlete',
  props: [ 'athlete' ],
  computed: {
    points () {
      return (this.athlete.points > 1) ? `${this.athlete.points} pts` : `${this.athlete.points} pt`
    },
    avatar () {
      return `${process.env.VUE_APP_IMAGE}/${this.athlete.avatar}`
    }
  }
}
</script>

<style>

</style>
