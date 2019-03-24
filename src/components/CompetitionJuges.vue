<template>
  <v-layout align-center class="juge" mt-2 pa-2 >
    <v-flex xs4 sm2 md1>
      <athlete-avatar :avatar="juge.user.avatar" />
    </v-flex>
    <v-flex sm5 md3 hidden-xs-only>
      <strong>{{juge.user.nom}}</strong>
    </v-flex>
    <v-flex xs7 sm4 md7>
      <v-chip v-for="epreuve in juge.epreuves" :key="epreuve.id"
        mr-5 color="primary" text-color="white" >
        {{epreuve.nom}}
      </v-chip>
    </v-flex>
    <v-flex xs1>
      <v-icon @click="$emit('deleteJuge', juge)" >
        mdi-delete
      </v-icon>
    </v-flex>
  </v-layout>
</template>

<script>
import AthleteAvatar from '@/components/AthleteAvatar'

export default {
  name: 'CompetitionJuges',
  components: { AthleteAvatar },
  props: [ 'juge' ]
}
</script>

<style scoped>
  .juge {
    background-color: white;
    border-bottom: 1px solid lightgray;
  }
</style>
