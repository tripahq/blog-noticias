<template>
  <div class="container d-flex justify-content-center align-items-center mt-5">
    <div class="card shadow-sm p-4" style="width: 100%; max-width: 400px;">
      
      <h2 class="text-center mb-4">{{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}</h2>
      
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit">
        
        <div v-if="!isLogin" class="mb-3">
          <label for="displayName" class="form-label">Nombre de Usuario</label>
          <input 
            type="text" 
            class="form-control" 
            id="displayName" 
            v-model="displayName" 
            required 
            placeholder="Ej: PeriodistaNinja"
          >
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input type="email" class="form-control" id="email" v-model="email" required placeholder="nombre@ejemplo.com">
        </div>
        
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" class="form-control" id="password" v-model="password" required placeholder="Mínimo 6 caracteres">
        </div>
        
        <button type="submit" class="btn btn-primary w-100 mt-3">
          {{ isLogin ? 'Ingresar' : 'Registrarme' }}
        </button>
      </form>

      <div class="text-center mt-4">
        <p class="mb-0">
          {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
          <a href="#" @click.prevent="toggleMode" class="text-decoration-none">
            {{ isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí' }}
          </a>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { auth } from '../firebase/config'
// NUEVO: Importamos updateProfile
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'

const router = useRouter()
const store = useStore() // Lo usaremos para forzar la actualización del estado

const email = ref('')
const password = ref('')
const displayName = ref('') // Nueva variable reactiva
const isLogin = ref(true)
const errorMessage = ref('')

const toggleMode = () => {
  isLogin.value = !isLogin.value
  errorMessage.value = ''
}

const handleSubmit = async () => {
  errorMessage.value = ''
  
  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value)
    } else {
      // 1. Creamos el usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
      
      // 2. Le asignamos el nombre de usuario a su perfil de Firebase
      await updateProfile(userCredential.user, {
        displayName: displayName.value
      })
      
      // 3. Forzamos a Vuex a actualizarse para que sepa del nuevo nombre de inmediato
      store.dispatch('setUser', auth.currentUser)
    }
    
    router.push('/')
    
  } catch (error) {
    console.error("Error de autenticación:", error.code)
    if (error.code === 'auth/email-already-in-use') {
      errorMessage.value = 'Este correo ya está registrado.'
    } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      errorMessage.value = 'Correo o contraseña incorrectos.'
    } else if (error.code === 'auth/weak-password') {
      errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.'
    } else {
      errorMessage.value = 'Ocurrió un error. Inténtalo de nuevo.'
    }
  }
}
</script>