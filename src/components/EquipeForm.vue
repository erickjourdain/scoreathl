<template>
  <div>
    <v-form ref="equipeForm" v-model="valid" lazy-validation >
      <v-layout row>
        <v-flex xs10>
          <v-text-field v-model="form.nom" :rules="nomRules" label="nom" required >
          </v-text-field>
        </v-flex>
        <v-flex xs2 class="text-xs-right">
          <v-avatar color="primary" class="pointer" @click="chooseImage()" >
            <v-icon v-if="!form.imageUrl" dark >
              mdi-human-male-boy
            </v-icon>
            <img v-else :src="form.imageUrl" alt="avatar" >
          </v-avatar>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12 sm6 v-if="requiredPwd">
          <v-text-field type="password" v-model="form.pwd" :rules="pwdRules" label="mot de passe" >
          </v-text-field>
        </v-flex>
        <v-flex xs12 sm6 v-if="adminOrOrganisateur">
          <v-select :items="etiquettes" item-text="valeur" item-value="id" v-model="form.etiquette"
            :menu-props="{ maxHeight: '400' }" label="etiquette">
          </v-select>
        </v-flex>
        <v-flex xs12 sm6 v-if="adminOrOrganisateur">
          <v-select :items="[{ value: true, text: 'validée' }, { value: false, text: 'à valider' }]"
            item-text="text" item-value="value" v-model="form.statut" :menu-props="{ maxHeight: '400' }"
            label="statut" required >
          </v-select>
        </v-flex>
      </v-layout>
      <span class="title secondary--text" >
        Enfant
      </span>
      <br/>
      <athlete-form :athlete="form.enfant" :valide="equipe.statut" type="enfant" v-on:athleteChange="athleteChange" />
      <span class="title secondary--text" >
        Adulte
      </span>
      <athlete-form :athlete="form.adulte" :valide="equipe.statut" type="adulte" v-on:athleteChange="athleteChange" />
      <br/>
      <v-btn :loading="loading" :disabled="!valid || loading" @click="submit" >
        {{ btnText }}
      </v-btn>
      <v-btn @click="clear">Reset</v-btn>
    </v-form>
    <picture-dialog :dialog="dialog" @close="closeDialog" @setImage="setImage" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import AthleteForm from '@/components/AthleteForm'
import PictureDialog from '@/components/PictureDialog'

export default {
  name: 'EquipeForm',
  components: { AthleteForm, PictureDialog },
  props: [ 'equipe' ],
  data () {
    return {
      dialog: false,
      valid: false,
      loading: false,
      form: {
        nom: this.equipe.nom,
        etiquette: this.equipe.etiquette,
        statut: this.equipe.statut,
        enfant: {
          nom: this.equipe.enfant.nom,
          prenom: this.equipe.enfant.prenom,
          annee: this.equipe.enfant.annee,
          genre: this.equipe.enfant.categorie.genre,
          avatar: this.equipe.enfant.avatar
        },
        adulte: {
          nom: this.equipe.adulte.nom,
          prenom: this.equipe.adulte.prenom,
          annee: this.equipe.adulte.annee,
          genre: this.equipe.adulte.categorie.genre,
          avatar: this.equipe.adulte.avatar
        },
        pwd: '',
        imageUrl: (this.equipe.avatar) ? `${process.env.VUE_APP_IMAGE}/${this.equipe.avatar}` : null
      },
      nomRules: [
        v => !!v || 'Le nom est obligatoire',
        v => (v && v.length >= 5) || 'Le nom doit comporter au moins 5 caractères'
      ],
      pwdRules: [
        v => (!!v & !!this.requiredPwd) || 'Le mot de passe est obligatoire',
        v => ((v && v.length >= 5) || !!this.requiredPwd) || 'Le mot de passe doit comporter au moins 5 caractères'
      ]
    }
  },
  computed: {
    ...mapState('main', {
      currentUser: 'currentUser'
    }),
    ...mapState('etiquette', {
      etiquettes: 'all'
    }),
    ...mapGetters('main', {
      isAdmin: 'isAdmin'
    }),
    ...mapGetters('competition', {
      isOrganisator: 'organisateur'
    }),
    btnText () {
      return (this.equipe.id) ? 'Mettre à jour' : 'Créer'
    },
    adminOrOrganisateur () {
      return (this.isOrganisator || this.isAdmin)
    },
    requiredPwd () {
      return !this.adminOrOrganisateur && !this.equipe.id
    }
  },
  methods: {
    setImage (e) {
      this.form.imageUrl = e.image
    },
    delImage () {
      this.image = null
    },
    athleteChange (data) {
      this.form[data.type][data.field] = data.value
    },
    async submit () {
      if (this.$refs.equipeForm.validate()) {
        this.loading = true
        let variables = {}
        if (this.equipe.id) {
          variables.id = this.equipe.id
          if (this.form.nom !== this.equipe.nom) variables.nom = this.form.nom
          if (this.form.etiquette !== this.equipe.etiquette) variables.etiquette = this.form.etiquette
          if (this.form.statut !== this.equipe.statut) variables.statut = this.form.statut
          if (this.form.enfant.nom !== this.equipe.enfant.nom) {
            if (!variables.enfant) variables.enfant = {}
            variables.enfant.nom = this.form.enfant.nom
          }
          if (this.form.enfant.prenom !== this.equipe.enfant.prenom) {
            if (!variables.enfant) variables.enfant = {}
            variables.enfant.prenom = this.form.enfant.prenom
          }
          if (parseInt(this.form.enfant.annee) !== parseInt(this.equipe.enfant.annee)) {
            if (!variables.enfant) variables.enfant = {}
            variables.enfant.annee = parseInt(this.form.enfant.annee)
          }
          if (this.form.enfant.genre !== this.equipe.enfant.genre) {
            if (!variables.enfant) variables.enfant = {}
            variables.enfant.genre = this.form.enfant.genre
          }
          if (this.form.adulte.nom !== this.equipe.adulte.nom) {
            if (!variables.adulte) variables.adulte = {}
            variables.adulte.nom = this.form.adulte.nom
          }
          if (this.form.adulte.prenom !== this.equipe.adulte.prenom) {
            if (!variables.adulte) variables.adulte = {}
            variables.adulte.prenom = this.form.adulte.prenom
          }
          if (parseInt(this.form.adulte.annee) !== parseInt(this.equipe.adulte.annee)) {
            if (!variables.adulte) variables.adulte = {}
            variables.adulte.annee = parseInt(this.form.adulte.annee)
          }
          if (this.form.adulte.genre !== this.equipe.adulte.genre) {
            if (!variables.adulte) variables.adulte = {}
            variables.adulte.genre = this.form.adulte.genre
          }
        } else {
          variables = {
            nom: this.form.nom,
            competition: this.$route.params.competition,
            etiquette: this.form.etiquette,
            adulte: {
              nom: this.form.adulte.nom,
              prenom: this.form.adulte.prenom,
              annee: parseInt(this.form.adulte.annee),
              genre: this.form.adulte.genre
            },
            enfant: {
              nom: this.form.enfant.nom,
              prenom: this.form.enfant.prenom,
              annee: parseInt(this.form.enfant.annee),
              genre: this.form.enfant.genre
            },
            statut: this.form.statut
          }
          if (this.form.pwd) variables.pwd = this.form.pwd
        }
        if (!variables.etiquette) delete variables.etiquette
        if (this.form.imageUrl && this.form.imageUrl.indexOf('http') < 0) {
          variables.avatar = await this.srcToFile(this.form.imageUrl, `${this.form.nom}.jpg`, 'image/jpeg')
        }
        if (this.form.adulte.imageUrl) {
          if (!variables.adulte) variables.adulte = {}
          variables.adulte.avatar = await this.srcToFile(this.form.adulte.imageUrl, `${this.form.adulte.nom}_${this.form.adulte.prenom}.jpg`, 'image/jpeg')
        }
        if (this.form.enfant.imageUrl) {
          if (!variables.enfant) variables.enfant = {}
          variables.enfant.avatar = await this.srcToFile(this.form.enfant.imageUrl, `${this.form.enfant.nom}_${this.form.enfant.prenom}.jpg`, 'image/jpeg')
        }
        try {
          if (this.equipe.id) {
            await this.$store.dispatch('competition/updateTeam', variables)
          } else {
            await this.$store.dispatch('competition/createTeam', variables)
          }
          this.$router.push(`/competition/${this.$route.params.competition}`)
        } catch {
          this.loading = false
        }
      }
    },
    srcToFile (src, fileName, mimeType) {
      return (fetch(src)
        .then(res => res.arrayBuffer())
        .then(buf => new File([buf], fileName, { type: mimeType }))
      )
    },
    clear () {
      this.$data.form = {
        nom: this.equipe.nom,
        etiquette: this.equipe.etiquette,
        statut: this.equipe.statut,
        enfant: {
          nom: this.equipe.enfant.nom,
          prenom: this.equipe.enfant.prenom,
          annee: this.equipe.enfant.annee,
          genre: this.equipe.enfant.categorie.genre,
          avatar: this.equipe.enfant.avatar
        },
        adulte: {
          nom: this.equipe.adulte.nom,
          prenom: this.equipe.adulte.prenom,
          annee: this.equipe.adulte.annee,
          genre: this.equipe.adulte.categorie.genre,
          avatar: this.equipe.adulte.avatar
        },
        pwd: '',
        imageUrl: (this.equipe.avatar) ? `${process.env.VUE_APP_IMAGE}/${this.equipe.avatar}` : null
      }
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
