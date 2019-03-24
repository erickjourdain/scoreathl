<template>
  <v-card>
    <v-img
      :src="image"
      aspect-ratio="2.75"
    ></v-img>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ competition.nom }}</h3>
        {{ competition.emplacement }} le {{ formatedDate(competition.date) }}
      </div>
    </v-card-title>
    <v-card-actions>
      <v-layout row align-center>
        <v-flex xs6>
          <v-icon @click="moveToCompetition(competition.id)">mdi-eye-outline</v-icon>
        </v-flex>
        <v-flex xs6 class="text-xs-right">
          <v-chip v-if="competition.statut" color="green" text-color="white">Ouverte</v-chip>
          <v-chip v-else color="red" text-color="white">Fermée</v-chip>
        </v-flex>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'CompetitionCard',
  props: ['competition'],
  computed: {
    image () {
      if (!this.competition.image) {
        return `${process.env.VUE_APP_IMAGE}/piste.jpg`
      } else {
        return `${process.env.VUE_APP_IMAGE}/${this.competition.image}`
      }
    }
  },
  methods: {
    moveToCompetition (id) {
      this.$router.push(`/competition/${id}`)
    },
    formatedDate (value) {
      return this.$moment(value).format('DD MMM YYYY')
    }
  }
}
</script>
