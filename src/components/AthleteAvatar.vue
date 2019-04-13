<template>
  <v-avatar >
    <img v-if="avatar" :src="image" alt="Avatar"/>
    <v-icon v-else>
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
  },
  computed: {
    image () {
      if (this.avatar.indexOf('http') < 0) {
        return `${this.env}/${this.avatar}`
      } else {
        return this.avatar
      }
    }
  }
}
</script>

<style>

</style>
