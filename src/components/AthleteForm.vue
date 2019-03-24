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
        <v-menu :close-on-content-click="false" v-model="menu" :nudge-right="40" lazy
          transition="scale-transition" offset-y full-width min-width="290px" >
          <v-text-field slot="activator" v-model="computedDateFormatted" label="date de naissance"
            prepend-icon="mdi-calendar" readonly >
          </v-text-field>
          <v-date-picker v-model="date" @input="menu = false" locale="fr-fr" :allowed-dates="allowedDates"
            @change="$emit('athleteChange', { type, field: 'dateNaissance', value: date })" :disabled="valide" >
          </v-date-picker>
        </v-menu>
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
      date: this.$moment(this.athlete.dateNaissance).format('YYYY-MM-DD'),
      imageUrl: (this.athlete.avatar) ? `${process.env.VUE_APP_IMAGE}/${this.athlete.avatar}` : null,
      nomRules: [
        v => !!v || 'Le nom est obligatoire',
        v => (v && v.length >= 3) || 'Le nom doit comporter au moins 3 caractères'
      ],
      prenomRules: [
        v => !!v || 'Le prénom est obligatoire',
        v => (v && v.length >= 3) || 'Le nom doit comporter au moins 3 caractères'
      ]
    }
  },
  computed: {
    computedDateFormatted () {
      return this.formattedDate(this.date)
    }
  },
  methods: {
    setImage (e) {
      this.imageUrl = e.image
      this.$emit('athleteChange', { type: this.type, field: 'imageUrl', value: this.imageUrl })
    },
    formattedDate (value) {
      return this.$moment(value).format('DD/MM/YYYY')
    },
    allowedDates (val) {
      return this.$moment(val).isAfter('1950-01-01') && this.$moment(val).isBefore('2013-01-01')
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
