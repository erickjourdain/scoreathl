<template>
  <v-layout row justify-center wrap>
    <v-flex xs12>
      <span class="headline">Changement de mot de passe</span>
      <br>
      <span>Merci de fournir votre adresse email</span>
    </v-flex>
    <v-flex xs12 sm6 md4 lg3>
      <v-form ref="fgtPwdForm" v-model="valid" lazy-validation>
        <v-text-field v-model="email" :rules="emailRules" label="email" required>
        </v-text-field>
        <v-btn :disabled="!valid || loading" @click="sent" :loading="loading">
          Envoyer
        </v-btn>
        <v-btn @click="clear">
          Reset
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import apolloClient from '@/apollo'

export default {
  name: 'ForgetPwd',
  data () {
    return {
      valid: false,
      loading: false,
      email: '',
      emailRules: [
        v => !!v || 'L\'email est obligatoire',
        v => (v && this.validateEmail(v)) || 'L\'adresse email n\'est pas correct'
      ]
    }
  },
  methods: {
    validateEmail (email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    async sent () {
      try {
        if (this.$refs.fgtPwdForm.validate()) {
          this.loading = true
          await apolloClient.mutate({
            mutation: require('@/graphql/forgetPwd.gql'),
            variables: { email: this.email }
          })
          this.loading = false
          this.$store.dispatch('main/setSnackbar', {
            visible: true,
            text: 'Un message vous a été envoyé sur votre adresse email pour changer votre mot de passe',
            color: 'success'
          })
          this.$router.push('/')
        }
      } catch (err) {
        this.loading = false
        this.$store.dispatch('main/setSnackbar', {
          visible: true,
          text: 'Impossible de procéder à l\'opération demandée',
          color: 'error'
        })
      }
    },
    clear () {
      this.$refs.fgtPwdForm.reset()
    }
  }
}
</script>

<style>

</style>
