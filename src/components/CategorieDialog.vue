<template>
  <v-dialog persistent
    v-model="dialog"
    transition="dialog-transition"
    max-width="600px">
    <v-card>
      <v-card-title primary-title>
        <div>
          <div class="headline text-capitalize">{{ athlete.prenom }} {{ athlete.nom }}</div>
          <span class="grey--text">Changer catégorie</span>
        </div>
      </v-card-title>
      <v-card-text>
        <v-alert :value="athlete.points" type="warning">
          Le changement de catégorie peut changer le nombre de points
        </v-alert>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6>
              <v-select :items="[{ value: 'M', text: 'masculin' }, { value: 'F', text: 'féminin' }]"
                item-text="text" item-value="value" v-model="genre" :menu-props="{ maxHeight: '400' }"
                label="genre" required >
              </v-select>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field v-model="annee" :rules="anneeRules" label="année naissance" type="number" required >
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('closeDialog')">Annuler</v-btn>
        <v-btn @click="save" :loading="update">Sauvegarder</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CategorieDialog',
  props: ['dialog', 'athlete'],
  data () {
    return {
      genre: 'M',
      annee: 1900,
      anneeRules: [
        v => !!v || `L'année de naissance est obligatoire`,
        v => (v && parseInt(v) <= 2015) || 'Un peu jeune nom?',
        v => (v && parseInt(v) > 1930) || 'Quelles artères!'
      ],
      update: false
    }
  },
  methods: {
    async save () {
      if (this.annee && this.genre) {
        await this.$store.dispatch('competition/updateCategorie', { athlete: this.athlete.id, annee: parseInt(this.annee), genre: this.genre })
        this.$emit('closeDialog')
      }
    }
  },
  created () {
    this.genre = this.athlete.categorie.genre
    this.annee = this.athlete.annee
  }
}
</script>
