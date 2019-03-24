<template>
  <v-app>
    <v-container grid-list-md>
      <navbar />
      <v-content>
        <error v-if="componentError" :error="componentError" />
        <snack-info />
        <router-view/>
      </v-content>
    </v-container>
  </v-app>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Error from '@/components/Error'
import SnackInfo from '@/components/SnackInfo'
import Navbar from '@/components/Navbar'

export default {
  name: 'App',
  components: {
    Navbar,
    Error,
    SnackInfo
  },
  data () {
    return {
      error: null
    }
  },
  computed: {
    ...mapState('main', {
      componentError: 'error'
    })
  },
  methods: {
    ...mapMutations('main', {
      setError: 'SET_ERROR',
      setFBLogin: 'SET_FB_LOGIN_SERVICE',
      setGoogleLogin: 'SET_GOOGLE_LOGIN_SERVICE'
    }),
    loadFbSdk (appId, version) {
      (function (d, s, id) { // eslint-disable-line func-names
        const fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) {
          return
        }
        const js = d.createElement(s)
        js.id = id
        js.src = '//connect.facebook.net/fr_FR/sdk.js'
        fjs.parentNode.insertBefore(js, fjs)
      }(document, 'script', 'facebook-jssdk'))

      window.fbAsyncInit = function () { // eslint-disable-line func-names
        window.FB.init({
          appId,
          xfbml: true,
          version,
          cookie: true
        })
        window.FB.AppEvents.logPageView()
      }
    },
    loadapi (apiUrl) {
      return new Promise((resolve) => {
        var script = document.createElement('script')
        script.src = apiUrl
        script.onreadystatechange = script.onload = function () {
          if (!script.readyState || /loaded|compvare/.test(script.readyState)) {
            setTimeout(function () {
              resolve()
            }, 500)
          }
        }
        document.getElementsByTagName('head')[0].appendChild(script)
      })
    },
    initGoogleapi (config) {
      window.gapi.load('client:auth2', {
        callback: () => {
          window.gapi.client.init(config)
            .then(() => {
              this.setGoogleLogin({ value: true })
            }, () => {
              this.setError(new Error('Impossible d\'initialiser Google api'))
            })
        },
        onerror: () => {
          this.setError(new Error('Impossible de charger Google api'))
        }
      })
    }
  },
  async created () {
    if (localStorage.getItem('apollo-token')) {
      this.$store.dispatch('main/logToken', { token: localStorage.getItem('apollo-token') })
    }
    await this.$store.dispatch('user/users')
    await this.$store.dispatch('categorie/getCategories')
    await this.$store.dispatch('epreuve/getEpreuves')
    await this.$store.dispatch('etiquette/getEtiquettes')
  },
  async mounted () {
    try {
      await this.loadFbSdk(process.env.VUE_APP_FACEBOOK_CLIENTID, 'v3.2')
      await this.loadapi('https://apis.google.com/js/api.js')
      await this.initGoogleapi({
        clientId: process.env.VUE_APP_GOOGLE_CLIENTID,
        scope: process.env.VUE_APP_GOOGLE_SCOPE,
        discoveryDocs: [process.env.VUE_APP_GOOGLE_DISCOVERYDOCS]
      })
      this.setFBLogin({ value: true })
    } catch (error) {
      this.setError(error)
    }
  }
}
</script>

<style>
  .pointer {
    cursor: pointer;
  }
</style>
