<template>
  <v-form ref="competitionForm" v-model="valid" lazy-validation>
    <file-input accept="image/*" ref="fileInput" :value="imageUrl"
      @selectFile="setImage" @removeFile="delImage" />
    <v-text-field v-model="nom" :rules="nomRules" label="nom" >
    </v-text-field>
    <v-text-field v-model="emplacement" :rules="emplacementRules" label="emplacement" >
    </v-text-field>
    <v-menu :close-on-content-click="false" v-model="menu" :nudge-right="40" lazy
      transition="scale-transition" offset-y full-width min-width="290px" >
      <v-text-field slot="activator" v-model="computedDateFormatted" label="Date"
        prepend-icon="mdi-calendar" readonly ></v-text-field>
      <v-date-picker v-model="date" @input="menu = false" locale="fr-fr"
        :allowed-dates="allowedDates" ></v-date-picker>
    </v-menu>
    <v-select :items="usersOrganisateurs" item-text="nom" item-value="id"
      v-model="organisateurs" :menu-props="{ maxHeight: '400' }"
      label="organisateurs" multiple persistent-hint ></v-select>
    <v-select :items="[{ value: true, text: 'ouverte' }, { value: false, text: 'fermée' }]"
      item-text="text" item-value="value" v-model="statut" :menu-props="{ maxHeight: '400' }"
      label="statut" ></v-select>
    <v-text-field type="password" v-model="pwd" :rules="pwdRules" label="mot de passe" >
    </v-text-field>
    <v-text-field type="password" v-model="confirmedPassword"
      :rules="confirmedPwdRules" label="confirmer mot de passe" >
    </v-text-field>
    <v-btn :loading="loading" :disabled="!valid || loading"
      @click="submit" >
      {{ btnText }}
    </v-btn>
    <v-btn @click="clear">Reset</v-btn>
  </v-form>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { concat } from 'lodash'
import FileInput from '@/components/FileInput'

export default {
  name: 'CompetitionForm',
  components: { FileInput },
  props: [ 'competition' ],
  data () {
    return {
      loading: false,
      valid: false,
      menu: false,
      imageUrl: (this.competition.image) ? `${process.env.VUE_APP_IMAGE}/${this.competition.image}` : null,
      image: null,
      nom: this.competition.nom,
      emplacement: this.competition.emplacement,
      date: this.$moment(this.competition.date).format('YYYY-MM-DD'),
      organisateurs: this.competition.organisateurs,
      statut: this.competition.statut,
      pwd: null,
      confirmedPassword: null,
      nomRules: [
        v => !!v || 'Le nom est obligatoire',
        v => (v && v.length >= 5) || 'Le nom doit comporter au moins 5 caractères'
      ],
      emplacementRules: [
        v => !!v || `L'emplacement est obligatoire`,
        v => (v && v.length >= 5) || `L'emplacement doit comporter au moins 5 caractères`
      ],
      dateFormatted: this.formattedDate(this.date),
      dateRules: [
        v => !!v || 'Le date est obligatoire'
      ],
      pwdRules: [
        v => (!!v || !!this.competition.id) || 'Le mot de passe est obligatoire',
        v => ((v && v.length >= 5) || !!this.competition.id) || 'Le mot de passe doit comporter au moins 5 caractères'
      ],
      confirmedPwdRules: [
        v => ((!!v || !!this.competition.id) || !!this.competition.id) || 'Le mot de passe est obligatoire',
        v => ((v && v.length >= 5 && v === this.pwd) || !!this.competition.id) ||
          'Les mots de passe ne correspondent pas'
      ]
    }
  },
  computed: {
    ...mapState('main', {
      error: 'error'
    }),
    ...mapGetters('user', {
      orgas: 'organisateurs',
      admin: 'administrateurs'
    }),
    usersOrganisateurs () {
      return concat(this.orgas, this.admin)
    },
    computedDateFormatted () {
      return this.formattedDate(this.date)
    },
    btnText () {
      return (this.competition.id) ? 'Mettre à jour' : 'Créer'
    }
  },
  methods: {
    setImage (e) {
      this.image = e
    },
    delImage () {
      this.image = null
    },
    formattedDate (value) {
      return this.$moment(value).format('DD/MM/YYYY')
    },
    allowedDates (val) {
      return this.$moment(val).isAfter(new Date())
    },
    async submit () {
      if (this.$refs.competitionForm.validate()) {
        this.loading = true
        let variables = {}
        if (this.competition.id) {
          variables.id = this.competition.id
          if (this.competition.nom !== this.nom) {
            variables.nom = this.nom
          }
          if (this.competition.emplacement !== this.emplacement) {
            variables.emplacement = this.emplacement
          }
          if (!this.$moment(this.competition.date).isSame(this.date, 'day')) {
            variables.date = this.date
          }
          if (this.competition.statut !== this.statut) {
            variables.statut = this.statut
          }
          if (this.pwd) {
            variables.pwd = this.pwd
          }
        } else {
          variables = {
            nom: this.nom,
            emplacement: this.emplacement,
            date: this.date,
            organisateurs: this.organisateurs,
            statut: this.statut,
            pwd: this.pwd
          }
        }
        if (this.image) {
          variables.image = this.image
        }
        if (this.competition.id) {
          await this.$store.dispatch('competition/updateCompetition', variables)
        } else {
          await this.$store.dispatch('competition/createCompetition', variables)
        }
        if (!this.error) {
          this.$router.push('/')
        } else {
          this.loading = false
        }
      }
    },
    clear () {
      this.$refs.competitionForm.reset()
    }
  }
}
</script>

<style>

</style>
