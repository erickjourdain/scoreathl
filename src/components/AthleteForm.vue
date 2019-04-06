<template>
  <div>
    <v-layout row>
      <v-flex xs10>
        <v-text-field v-model="nom" :rules="nomRules" label="nom" :readonly="valide"
          @input="$emit('athleteChange', { type, field: 'nom', value: nom })" required >
        </v-text-field>
      </v-flex>
      <v-flex xs2 class="text-xs-right">
        <v-avatar color="secondary" class="pointer" @click="chooseImage()" >
          <v-icon v-if="!imageUrl" dark >
            mdi-account-circle
          </v-icon>
          <img v-else :src="imageUrl" alt="avatar" >
        </v-avatar>
      </v-flex>
    </v-layout>
    <v-text-field v-model="prenom" :rules="prenomRules" label="prénom" :readonly="valide"
      @input="$emit('athleteChange', { type, field: 'prenom', value: prenom })" required >
    </v-text-field>
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-select :items="[{ value: 'M', text: 'masculin' }, { value: 'F', text: 'féminin' }]"
          item-text="text" item-value="value" v-model="genre" :menu-props="{ maxHeight: '400' }"
          label="genre" @input="$emit('athleteChange', { type, field: 'genre', value: genre })"
          :readonly="valide" required >
        </v-select>
      </v-flex>
      <v-flex xs12 sm6>
        <v-text-field v-model="annee" :rules="anneeRules" label="année naissance" :readonly="valide"
          @input="$emit('athleteChange', { type, field: 'annee', value: annee })" type="number" required >
        </v-text-field>
      </v-flex>
    </v-layout>
    <picture-dialog :dialog="dialog" @close="closeDialog" @setImage="setImage" />
  </div>
</template>

<script>
import PictureDialog from '@/components/PictureDialog'

export default {
  nom: 'AthleteForm',
  props: [ 'athlete', 'type', 'valide' ],
  components: { PictureDialog },
  data () {
    return {
      menu: false,
      dialog: false,
      nom: this.athlete.nom,
      prenom: this.athlete.prenom,
      genre: this.athlete.genre,
      annee: this.athlete.annee,
      imageUrl: (this.athlete.avatar) ? `${process.env.VUE_APP_IMAGE}/${this.athlete.avatar}` : null,
      nomRules: [
        v => !!v || 'Le nom est obligatoire',
        v => (v && v.length >= 3) || 'Le nom doit comporter au moins 3 caractères'
      ],
      prenomRules: [
        v => !!v || 'Le prénom est obligatoire',
        v => (v && v.length >= 3) || 'Le nom doit comporter au moins 3 caractères'
      ],
      anneeRules: [
        v => !!v || `L'année de naissance est obligatoire`,
        v => (v && parseInt(v) <= 2015) || 'Un peu jeune nom?',
        v => (v && parseInt(v) > 1930) || 'Quelles artères!'
      ]
    }
  },
  methods: {
    setImage (e) {
      this.imageUrl = e.image
      this.$emit('athleteChange', { type: this.type, field: 'imageUrl', value: this.imageUrl })
    },
    closeDialog () {
      this.dialog = false
    },
    chooseImage () {
      this.dialog = true
    }
  }
}
</script>

<style>

</style>
