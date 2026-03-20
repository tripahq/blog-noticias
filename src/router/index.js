import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config' // <-- Importamos auth para saber si hay usuario

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: () => import('../views/HomeView.vue') 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: () => import('../views/LoginView.vue') 
  },
  { 
    path: '/article/:id', 
    name: 'Article', 
    component: () => import('../views/ArticleView.vue') 
  },
  { 
    path: '/create-post', 
    name: 'CreatePost', 
    component: () => import('../views/CreatePostView.vue'),
    // 1. Agregamos esta meta-información para marcarla como protegida
    meta: { requiresAuth: true } 
  }
]

const router = createRouter({
  history: createWebHistory('/blog-noticias/'),
  routes
})

// 2. Configuramos el "Portero" (Navigation Guard)
router.beforeEach((to, from, next) => {
  // Verificamos si la ruta a la que queremos ir (to) tiene la etiqueta requiresAuth
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // Verificamos en Firebase si hay un usuario logueado actualmente
  const isAuthenticated = auth.currentUser

  // Lógica del portero:
  if (requiresAuth && !isAuthenticated) {
    // Si la ruta requiere autenticación y NO estás logueado, te mando al Login
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Extra: Si estás logueado e intentas ir al Login, te mando al Inicio (no tiene sentido que te vuelvas a loguear)
    next('/')
  } else {
    // En cualquier otro caso, te dejo pasar a la ruta que pediste
    next()
  }
})

export default router