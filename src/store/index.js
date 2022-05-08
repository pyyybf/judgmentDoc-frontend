import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

import user from './modules/user'
import article from './modules/article'
import editor from './modules/editor'
import document from './modules/document'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    article,
    editor,
    document,
  },
  getters
})

export default store
