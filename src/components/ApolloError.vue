<template>
  <div v-if="errors">
    <v-alert v-for="err in errors"
      :key="JSON.stringify(err.locations)"
      type="error"
      :value="true"
      dismissible
    >
      {{ err.message }}
    </v-alert>
  </div>
</template>

<script>
export default {
  name: 'ApolloError',
  props: ['errors']
}
</script>

<style>

</style>
