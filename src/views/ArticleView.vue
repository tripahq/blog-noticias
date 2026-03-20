<template>
  <div class="container mt-5 mb-5" style="max-width: 800px;">
    
    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-muted">Cargando artículo...</p>
    </div>

    <div v-else-if="!article" class="alert alert-danger text-center">
      La noticia que buscas no existe o fue eliminada.
      <br><br>
      <router-link to="/" class="btn btn-outline-danger">Volver al inicio</router-link>
    </div>

    <div v-else>
      <h1 class="display-4 fw-bold mb-3">{{ article.title }}</h1>
      
      <div class="d-flex flex-wrap align-items-center mb-4 text-muted">
        <span class="badge bg-primary me-3 fs-6">{{ article.category }}</span>
        <span>Escrito por <strong>{{ article.author.split('@')[0] }}</strong> | {{ formatDate(article.createdAt) }}</span>
      </div>

      <img 
        v-if="article.imageUrl" 
        :src="article.imageUrl" 
        class="img-fluid rounded mb-4 w-100 shadow-sm" 
        style="max-height: 400px; object-fit: cover;" 
        alt="Imagen de la noticia"
      >

      <p class="lead fw-semibold text-secondary mb-4 border-start border-4 border-primary ps-3">
        {{ article.summary }}
      </p>

      <div class="fs-5 article-content mb-5" style="white-space: pre-line;">
        {{ article.content }}
      </div>

      <hr>
      <div class="d-flex justify-content-between mt-4">
        <router-link to="/" class="btn btn-outline-secondary">&larr; Volver al inicio</router-link>
      </div>

      <CommentSection :articleId="route.params.id" />
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
// Importamos el nuevo componente de comentarios
import CommentSection from '../components/CommentSection.vue'

const route = useRoute()

const article = ref(null)
const isLoading = ref(true)

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute:'2-digit' 
  })
}

onMounted(async () => {
  const articleId = route.params.id

  try {
    const docRef = doc(db, 'articles', articleId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      article.value = { id: docSnap.id, ...docSnap.data() }
    } else {
      console.log("No se encontró el documento en Firebase")
    }
  } catch (error) {
    console.error("Error al obtener la noticia:", error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.article-content {
  line-height: 1.8;
  color: #333;
}
</style>