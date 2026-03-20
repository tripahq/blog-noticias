import { createStore } from 'vuex'

export default createStore({
  // 1. STATE: Las variables globales
  state: {
    user: null // Si es null, no hay nadie logueado. Si tiene datos, hay sesión.
  },
  
  // 2. MUTATIONS: Las únicas funciones que pueden modificar el STATE directamente
  mutations: {
    SET_USER(state, user) {
      state.user = user
    }
  },
  
  // 3. ACTIONS: Funciones asíncronas que llaman a las mutaciones
  actions: {
    setUser({ commit }, user) {
      commit('SET_USER', user)
    }
  },
  
  // 4. GETTERS: Funciones para consultar datos del estado fácilmente
  getters: {
    isAuthenticated: (state) => !!state.user, // Devuelve true o false
    currentUser: (state) => state.user
  }
})