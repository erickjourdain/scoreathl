import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Croppa from 'vue-croppa'
import Chat from 'vue-beautiful-chat'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import moment from 'moment'
import vueMoment from 'vue-moment'
import store from './store'

require('moment/locale/fr')

Vue.config.productionTip = false
Vue.use(vueMoment, { moment })
Vue.use(vueMoment)
Vue.use(Croppa)
Vue.use(Chat)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
