import { createWebHashHistory, createRouter } from 'vue-router'
import { auth } from '../firebase/config' //

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
    // Agregamos esta meta-información para marcarla como protegida
    meta: { requiresAuth: true } 
  }
]

const router = createRouter({
  // Se cambia createWebHistory por createWebHashHistory para compatibilidad con GitHub Pages
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

// Configuramos el "Portero" (Navigation Guard)
router.beforeEach((to, from, next) => {
  // Verificamos si la ruta a la que queremos ir (to) tiene la etiqueta requiresAuth
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // Verificamos en Firebase si hay un usuario logueado actualmente
  const isAuthenticated = auth.currentUser

  // Lógica del portero
  if (requiresAuth && !isAuthenticated) {
    // Si la ruta requiere autenticación y NO estás logueado, redirige al Login
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Si estás logueado e intentas ir al Login, redirige al Inicio
    next('/')
  } else {
    // En cualquier otro caso, permite el acceso
    next()
  }
})

export default router