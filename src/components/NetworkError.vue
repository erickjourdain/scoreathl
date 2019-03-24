<template>
  <v-alert
    type="error"
    v-html="message"
    :value="true"
    dismissible
  >
  </v-alert>
</template>

<script>
export default {
  name: 'NetworkError',
  props: ['error'],
  computed: {
    message () {
      return `erreur code ${this.error.statusCode}<br/>${this.error}`
    }
  }
}
</script>

<style>

</style>
