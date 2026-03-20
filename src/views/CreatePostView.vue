<template>
  <div class="container mt-5 mb-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h3 class="mb-0">Publicar Nueva Noticia</h3>
          </div>
          <div class="card-body p-4">
            
            <div v-if="statusMessage" :class="`alert alert-${statusType}`" role="alert">
              {{ statusMessage }}
            </div>

            <form @submit.prevent="handleSubmit">
              
              <div class="mb-3">
                <label for="title" class="form-label fw-bold">Título de la Noticia</label>
                <input type="text" class="form-control" id="title" v-model="title" required placeholder="Ej: Lanzamiento del nuevo cohete...">
              </div>

              <div class="mb-3">
                <label for="category" class="form-label fw-bold">Categoría</label>
                <select class="form-select" id="category" v-model="category" required>
                  <option value="" disabled>Selecciona una categoría...</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Actualidad">Actualidad</option>
                  <option value="Ciencia">Ciencia</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="imageUrl" class="form-label fw-bold">URL de la Imagen</label>
                <input type="url" class="form-control" id="imageUrl" v-model="imageUrl" placeholder="https://ejemplo.com/imagen.jpg">
                <div class="form-text">Pega un enlace a una imagen representativa. Si lo dejas en blanco, se usará una por defecto.</div>
              </div>

              <div class="mb-3">
                <label for="summary" class="form-label fw-bold">Resumen (Copete)</label>
                <textarea class="form-control" id="summary" v-model="summary" rows="2" required placeholder="Breve descripción para la tarjeta de inicio..."></textarea>
              </div>

              <div class="mb-4">
                <label for="content" class="form-label fw-bold">Cuerpo de la Noticia</label>
                <textarea class="form-control" id="content" v-model="content" rows="6" required placeholder="Desarrolla toda la información aquí..."></textarea>
              </div>

              <div class="d-flex justify-content-end">
                <router-link to="/" class="btn btn-outline-secondary me-2">Cancelar</router-link>
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                  {{ isSubmitting ? 'Publicando...' : 'Publicar Noticia' }}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
// Importamos la base de datos de nuestra config y las funciones necesarias de Firestore
import { db } from '../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const router = useRouter()
const store = useStore()

// Variables reactivas para el formulario
const title = ref('')
const category = ref('')
const imageUrl = ref('')
const summary = ref('')
const content = ref('')

// Variables para el estado de la interfaz
const isSubmitting = ref(false)
const statusMessage = ref('')
const statusType = ref('success')

// Función para guardar en Firestore
const handleSubmit = async () => {
  isSubmitting.value = true
  statusMessage.value = ''

  try {
// 1. Obtenemos el usuario actual
const user = store.getters.currentUser
// 2. Extraemos su nombre o la primera parte de su correo
const authorName = user.displayName || user.email.split('@')[0]

const articlesCollection = collection(db, 'articles')

await addDoc(articlesCollection, {
  title: title.value,
  category: category.value,
  imageUrl: imageUrl.value,
  summary: summary.value,
  content: content.value,
  author: authorName, // <-- AQUÍ GUARDAMOS EL NOMBRE LIMPIO
  createdAt: serverTimestamp() 
})

    statusType.value = 'success'
    statusMessage.value = '¡Noticia publicada con éxito! Redirigiendo...'

    // 4. Limpiamos el formulario y redirigimos al inicio tras 1.5 segundos
    setTimeout(() => {
      router.push('/')
    }, 1500)

  } catch (error) {
    console.error("Error al publicar la noticia:", error)
    statusType.value = 'danger'
    statusMessage.value = 'Hubo un error al publicar. Revisa la consola.'
  } finally {
    isSubmitting.value = false
  }
}
</script>