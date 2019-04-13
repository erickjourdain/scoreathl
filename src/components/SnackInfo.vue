<template>
  <v-snackbar v-model="snackbar.visible" :color="snackbar.color" right top>
    <span v-html="snackbar.text" />
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SnackInfo',
  computed: {
    ...mapState('main', {
      snackbar: 'snackbar'
    })
  }
}
</script>

<style>

</style>
