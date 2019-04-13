<template>
  <v-layout row justify-center wrap>
    <v-flex xs12>
      <span class="headline">Changement de mot de passe</span>
      <br>
      <span>Merci de fournir un nouveau mot de passe</span>
    </v-flex>
    <v-flex xs12 sm6 md4 lg3>
      <v-form ref="resetPwdForm" v-model="valid" lazy-validation>
        <v-text-field type="password" v-model="password" :rules="pwdRules" label="mot de passe" required>
        </v-text-field>
        <v-text-field type="password" v-model="confirmedPwd" :rules="confirmedPwdRules" label="confirmation mot de passe" required>
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
  name: 'ResetPwd',
  data () {
    return {
      valid: false,
      loading: false,
      password: '',
      confirmedPwd: '',
      pwdRules: [
        v => !!v || 'Le mot de passe est obligatoire',
        v => (v && v.length >= 5) || 'Le mot de passe doit comporter au moins 5 caractères'
      ],
      confirmedPwdRules: [
        v => !!v || 'Le mot de passe est obligatoire',
        v => (v && v.length >= 5 && v === this.password) ||
          'Les mots de passe ne correspondent pas'
      ]
    }
  },
  methods: {
    async sent () {
      try {
        if (this.$refs.resetPwdForm.validate()) {
          this.loading = true
          await apolloClient.mutate({
            mutation: require('@/graphql/resetPwd.gql'),
            variables: {
              token: this.$route.params.token,
              password: this.password
            }
          })
          this.loading = false
          this.$store.dispatch('main/setSnackbar', {
            visible: true,
            text: 'Votre mot de passe a été changé avec succès.',
            color: 'success'
          })
          this.$router.push('/login')
        }
      } catch (err) {
        this.loading = false
        this.$store.dispatch('main/setSnackbar', {
          visible: true,
          text: 'Impossible de changer le mot de passe',
          color: 'error'
        })
      }
    },
    clear () {
      this.$refs.resetPwdForm.reset()
    }
  }
}
</script>

<style>

</style>
