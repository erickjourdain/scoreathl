<template>
  <v-avatar color="primary" >
    <img v-if="avatar" :src="`${env}/${avatar}`" alt="Avatar"/>
    <v-icon dark v-else>
      mdi-account-circle
    </v-icon>
  </v-avatar>
</template>

<script>
export default {
  name: 'AtheleAvatar',
  props: ['avatar'],
  data () {
    return {
      env: process.env.VUE_APP_IMAGE
    }
  }
}
</script>

<style>

</style>
