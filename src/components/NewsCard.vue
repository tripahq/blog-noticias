<template>
  <div class="card h-100 shadow-sm hover-effect">
    <img :src="article.imageUrl || 'https://via.placeholder.com/300x200'" class="card-img-top object-fit-cover" height="200" alt="Imagen de la noticia">
    
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ article.title }}</h5>
      <p class="card-text text-muted small mb-2">Publicado: {{ formatDate(article.createdAt) }}</p>
      <p class="card-text">{{ article.summary }}</p>
      
      <router-link :to="`/article/${article.id}`" class="btn btn-outline-primary mt-auto">Leer más</router-link>
    </div>
  </div>
</template>

<script setup>
// Definimos que este componente recibe un objeto 'article' obligatorio
defineProps({
  article: {
    type: Object,
    required: true
  }
})

// Función sencilla para formatear la fecha
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}
</script>

<style scoped>
/* Un pequeño efecto visual al pasar el mouse sobre la tarjeta */
.hover-effect {
  transition: transform 0.2s ease-in-out;
}
.hover-effect:hover {
  transform: translateY(-5px);
}
</style>