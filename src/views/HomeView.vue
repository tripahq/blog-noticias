<template>
  <div class="container mb-5">
    <Hero />
    
    <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom mt-5">
      <h2>Últimas Noticias</h2>
      <span class="badge bg-secondary">Todas</span>
    </div>

    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-muted">Cargando noticias...</p>
    </div>

    <div v-else-if="newsList.length === 0" class="alert alert-info text-center">
      Aún no hay noticias publicadas. ¡Sé el primero en escribir una!
    </div>
    
    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="news in newsList" :key="news.id">
        <NewsCard :article="news" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Hero from '../components/Hero.vue'
import NewsCard from '../components/NewsCard.vue'

// Importamos Firebase
import { db } from '../firebase/config'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'

// Variables reactivas
const newsList = ref([])
const isLoading = ref(true)

// onMounted se ejecuta apenas el componente (la página) se carga en el navegador
onMounted(() => {
  // 1. Apuntamos a la colección "articles"
  const articlesRef = collection(db, 'articles')
  
  // 2. Creamos una "Query" (Consulta) para ordenarlas por fecha de creación de forma descendente (desc)
  const q = query(articlesRef, orderBy('createdAt', 'desc'))

  // 3. onSnapshot escucha en TIEMPO REAL. Si alguien publica una noticia, 
  // aparecerá aquí automáticamente sin tener que recargar la página.
  onSnapshot(q, (snapshot) => {
    const fetchedNews = []
    
    // Recorremos los documentos que nos devuelve Firebase
    snapshot.forEach((doc) => {
      fetchedNews.push({
        id: doc.id, // El ID único generado por Firebase
        ...doc.data() // Los datos: title, summary, imageUrl, etc.
      })
    })
    
    newsList.value = fetchedNews
    isLoading.value = false // Apagamos el indicador de carga
  }, (error) => {
    console.error("Error obteniendo las noticias: ", error)
    isLoading.value = false
  })
})
</script>