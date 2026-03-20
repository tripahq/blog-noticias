import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // <-- 1. Importamos nuestro Store de Vuex

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Importamos Firebase Auth para revisar la sesión
import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

let app

// 2. onAuthStateChanged se dispara cada vez que cambia el estado de la sesión
onAuthStateChanged(auth, (user) => {
  
  // 3. Guardamos la información del usuario en Vuex (null si cerró sesión, datos si está activo)
  store.dispatch('setUser', user)

  // 4. Solo inicializamos la app de Vue la primera vez que Firebase nos responde
  // Esto evita que la página parpadee o intente cargar rutas protegidas antes de saber si hay usuario
  if (!app) {
    app = createApp(App)
    app.use(router)
    app.use(store) // <-- Le decimos a Vue que use Vuex
    app.mount('#app')
  }
})