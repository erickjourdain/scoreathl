import Vue from 'vue'
import Vuex from 'vuex'

import main from './modules/main'
import user from './modules/user'
import epreuve from './modules/epreuve'
import etiquette from './modules/etiquette'
import categorie from './modules/categorie'
import competition from './modules/competition'
import message from './modules/message'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    main,
    user,
    etiquette,
    epreuve,
    categorie,
    competition,
    message
  },
  strict: debug
})
