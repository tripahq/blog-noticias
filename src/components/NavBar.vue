<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">📰 NewsBlog</router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Últimas Noticias</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Tecnología</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Deportes</a>
          </li>
        </ul>
        
        <ul class="navbar-nav align-items-center">
          
          <template v-if="isAuthenticated">
            <li class="nav-item text-light me-3 d-none d-lg-block">
              <small>Hola, {{ currentUser.displayName || currentUser.email.split('@')[0] }}</small>
            </li>
            <li class="nav-item me-2 mb-2 mb-lg-0">
              <router-link class="btn btn-outline-light w-100" to="/create-post">Publicar Noticia</router-link>
            </li>
            <li class="nav-item">
              <button class="btn btn-danger w-100" @click="handleLogout">Salir</button>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <router-link class="btn btn-primary w-100" to="/login">Ingresar / Registro</router-link>
            </li>
          </template>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { auth } from '../firebase/config'
import { signOut } from 'firebase/auth'

const store = useStore()
const router = useRouter()

// Usamos 'computed' para que la interfaz se actualice en tiempo real si el estado cambia
const isAuthenticated = computed(() => store.getters.isAuthenticated)
const currentUser = computed(() => store.getters.currentUser)

// Función para cerrar sesión en Firebase
const handleLogout = async () => {
  try {
    await signOut(auth) // Le decimos a Firebase que cierre la sesión
    // Vuex se actualizará automáticamente gracias a onAuthStateChanged en main.js
    router.push('/') // Redirigimos al inicio
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>