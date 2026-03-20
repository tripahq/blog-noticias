<template>
  <div class="mt-5 pt-4 border-top">
    <h3 class="mb-4">Comentarios ({{ comments.length }})</h3>

    <div v-if="isAuthenticated" class="card mb-4 shadow-sm">
      <div class="card-body">
        <form @submit.prevent="submitComment">
          <div class="mb-3">
            <label for="commentText" class="form-label">
              Escribe un comentario como <strong>{{ currentUser.displayName || currentUser.email.split('@')[0] }}</strong>
            </label>
            <textarea 
              class="form-control" 
              id="commentText" 
              v-model="newComment" 
              rows="3" 
              required 
              placeholder="¿Qué opinas sobre esta noticia?"
            ></textarea>
          </div>
          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting || !newComment.trim()">
              {{ isSubmitting ? 'Enviando...' : 'Comentar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-else class="alert alert-secondary text-center mb-4">
      <router-link to="/login" class="text-decoration-none fw-bold">Inicia sesión</router-link> o regístrate para dejar un comentario.
    </div>

    <div v-if="isLoading" class="text-center text-muted my-3">
      Cargando comentarios...
    </div>
    
    <div v-else-if="comments.length === 0" class="text-center text-muted my-4">
      No hay comentarios aún. ¡Sé el primero en opinar!
    </div>

    <div v-else class="comment-list">
      <div v-for="comment in comments" :key="comment.id" class="card mb-3 border-0 bg-light">
        <div class="card-body py-2 px-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-bold text-primary">{{ comment.author }}</span>
            <small class="text-muted">{{ formatDate(comment.createdAt) }}</small>
          </div>
          <p class="mb-0 text-dark" style="white-space: pre-line;">{{ comment.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { db } from '../firebase/config'
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'

const props = defineProps({
  articleId: {
    type: String,
    required: true
  }
})

const store = useStore()

const comments = ref([])
const newComment = ref('')
const isLoading = ref(true)
const isSubmitting = ref(false)

const isAuthenticated = computed(() => store.getters.isAuthenticated)
const currentUser = computed(() => store.getters.currentUser)

const formatDate = (timestamp) => {
  if (!timestamp) return 'Justo ahora'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' 
  })
}

onMounted(() => {
  const commentsRef = collection(db, 'articles', props.articleId, 'comments')
  const q = query(commentsRef, orderBy('createdAt', 'desc'))

  onSnapshot(q, (snapshot) => {
    const fetchedComments = []
    snapshot.forEach((doc) => {
      fetchedComments.push({ id: doc.id, ...doc.data() })
    })
    comments.value = fetchedComments
    isLoading.value = false
  }, (error) => {
    console.error("Error al obtener comentarios:", error)
    isLoading.value = false
  })
})

const submitComment = async () => {
  if (!newComment.value.trim()) return

  isSubmitting.value = true
  try {
    const commentsRef = collection(db, 'articles', props.articleId, 'comments')
    
    await addDoc(commentsRef, {
      text: newComment.value,
      // AQUÍ GUARDAMOS EL DISPLAY NAME EN LA BASE DE DATOSSZZZZZZ
      author: currentUser.value.displayName || currentUser.value.email.split('@')[0],
      createdAt: serverTimestamp()
    })

    newComment.value = ''
  } catch (error) {
    console.error("Error al publicar el comentario:", error)
  } finally {
    isSubmitting.value = false
  }
}
</script>