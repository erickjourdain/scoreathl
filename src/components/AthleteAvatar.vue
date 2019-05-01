<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-avatar v-on="on" :size="size">
        <img v-if="avatar" :src="image" alt="Avatar"/>
        <v-icon v-else>
          mdi-account-circle
        </v-icon>
      </v-avatar>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'AtheleAvatar',
  props: {
    avatar: {
      type: String,
      default: null
    },
    tooltip: {
      type: String,
      default: null
    },
    size: {
      type: Number,
      default: 35
    }
  },
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
