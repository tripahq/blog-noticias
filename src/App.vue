<template>
  <div class="d-flex flex-column min-vh-100">
    
    <NavBar />

    <main class="flex-grow-1">
      <router-view></router-view>
    </main>

    <Footer />
    
  </div>
</template>

<script setup>
// Importamos los componentes para poder usarlos en el template
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
</script>

<style>
/* Quitamos márgenes por defecto del body para que encaje bien */
body {
  margin: 0;
  padding: 0;
  background-color: #f8f9fa; /* Un gris muy claro de fondo típico de blogs */
}
</style>