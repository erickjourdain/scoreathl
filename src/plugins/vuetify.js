import Vue from 'vue'
import Vuetify, { VLayout } from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import fr from 'vuetify/es5/locale/fr'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify, {
  components: {
    VLayout
  },
  iconfont: 'mdi',
  lang: {
    locales: { fr },
    current: 'fr'
  },
  theme: {
    primary: colors.indigo.darken4,
    secondary: colors.blue.darken2,
    accent: colors.pink.lighten1,
    error: colors.red.darken3,
    warning: colors.deepOrange.darken1,
    info: colors.lightBlue.darken1,
    success: colors.green.lighten1
  },
  options: {
    customProperties: true
  }
})
