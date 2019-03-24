<template>
  <div>
    <v-layout justify-center>
      <v-form ref="etiquetteForm" lazy-validation v-model="valid" >
        <v-text-field v-model="etiquette" :rules="etiquetteRules" label="Nouvelle étiquette" >
        </v-text-field>
        <v-btn :loading="loading" :disabled="!valid || loading" @click="submit" >
          Créer
        </v-btn>
        <v-btn @click="clear">Reset</v-btn>
      </v-form>
    </v-layout>
    <v-layout wrap mt-3 justify-center>
      <v-flex xs12 v-if="!etiquettes.length">
        Aucune étiquette définie
      </v-flex>
      <v-flex xs12 class="text-xs-center" v-else>
        <v-chip :color="tagColor(etiquette)" text-color="white"
          :close="!etiquette.utilisee" v-for="etiquette in etiquettes"
          :key="etiquette.id" @input="close(etiquette)" >
          {{ etiquette.valeur }}
        </v-chip>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Tags',
  data () {
    return {
      loading: false,
      valid: false,
      etiquette: '',
      etiquetteRules: [
        v => !!v || `la valeur est obligatoire`,
        v => (v && v.length >= 3) || 'La valeur doit comporter au moins 3 caractères'
      ]
    }
  },
  computed: {
    ...mapState('etiquette', {
      etiquettes: 'all'
    })
  },
  methods: {
    tagColor (etiquette) {
      return (etiquette.utilisee) ? 'error' : 'primary'
    },
    async submit () {
      if (this.$refs.etiquetteForm.validate()) {
        this.loading = true
        await this.$store.dispatch('etiquette/createEtiquette', { valeur: this.etiquette })
        this.clear()
        this.loading = false
      }
    },
    clear () {
      this.$refs.etiquetteForm.reset()
    },
    async close (etiquette) {
      this.loading = true
      await this.$store.dispatch('etiquette/delEtiquette', { id: etiquette.id })
      this.loading = false
    }
  }
}
</script>

<style>

</style>
