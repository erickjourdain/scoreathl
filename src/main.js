import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Croppa from 'vue-croppa'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
// import { createProvider } from './vue-apollo'
import moment from 'moment'
import vueMoment from 'vue-moment'
import store from './store'
import { createProvider } from './vue-apollo'

require('moment/locale/fr')

Vue.config.productionTip = false
Vue.use(vueMoment, moment)
Vue.use(Croppa)

new Vue({
  router,

  //  apolloProvider: createProvider(),
  store,

  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
