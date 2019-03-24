<template>
  <v-container fluid>
    <v-layout row>
      <span class="headline">
        Creér un compte
      </span>
    </v-layout>
    <v-form ref="signinForm" v-model="valid" lazy-validation>
      <v-layout row justify-center>
        <v-flex xs10 sm6 md4>
          <v-text-field v-model="nom" :rules="nomRules" label="nom" required>
          </v-text-field>
        </v-flex>
        <v-flex xs2 class="text-xs-right">
          <v-avatar color="primary" class="pointer" @click="chooseImage()" >
            <v-icon v-if="!imageUrl" dark >
              mdi-human-male-boy
            </v-icon>
            <img v-else :src="imageUrl" alt="avatar" >
          </v-avatar>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <v-flex xs12 sm8 md6>
            <v-text-field v-model="email" :rules="emailRules" label="email" required>
            </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <v-flex xs12 sm8 md6>
          <v-text-field type="password" v-model="pwd" :rules="pwdRules" label="mot de passe" required>
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <v-flex xs12 sm8 md6>
          <v-text-field type="password" v-model="cfpwd" :rules="confirmedPwdRules" label="confirmer mot de passe" required>
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <v-btn :disabled="!valid" @click="submit" >
          Créer
        </v-btn>
        <v-btn @click="clear">
          Reset
        </v-btn>
      </v-layout>
    </v-form>
    <picture-dialog :dialog="dialog" @close="closeDialog" @setImage="setImage" />
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import PictureDialog from '@/components/PictureDialog'

export default {
  name: 'Signin',
  components: { PictureDialog },
  data () {
    return {
      dialog: false,
      valid: false,
      nom: '',
      email: '',
      pwd: '',
      cfpwd: '',
      imageUrl: '',
      nomRules: [
        v => !!v || 'Le nom est obligatoire',
        v => (v && v.length >= 3) || 'Le nom doit comporter au moins 3 caractères'
      ],
      emailRules: [
        v => !!v || 'Le nom est obligatoire',
        v => (v && this.validateEmail(v)) || 'L\'adresse email n\'est pas correct'
      ],
      pwdRules: [
        v => (!!v) || 'Le mot de passe est obligatoire',
        v => (v && v.length >= 6) || 'Le mot de passe doit comporter au moins 5 caractères'
      ],
      confirmedPwdRules: [
        v => (v && v.length >= 6 && v === this.pwd) || 'Les mots de passe ne correspondent pas'
      ]
    }
  },
  computed: {
    ...mapState('main', {
      error: 'error'
    })
  },
  methods: {
    async submit () {
      if (this.$refs.signinForm.validate()) {
        await this.$store.dispatch('main/createUser', { nom: this.nom, email: this.email, password: this.pwd, avatar: this.imageUrl })
        if (!this.error) {
          this.$router.push('/')
        }
      }
    },
    clear () {
      this.valid = false
      this.nom = ''
      this.email = ''
      this.pwd = ''
      this.cfpwd = ''
      this.imageUrl = ''
    },
    validateEmail (email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    setImage (e) {
      this.imageUrl = e.image
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
