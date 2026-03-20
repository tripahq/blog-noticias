import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config'

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
    meta: { requiresAuth: true } 
  }
]

const router = createRouter({
  // Esto usa el valor de 'base' definido en vite.config.js automáticamente
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = auth.currentUser

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router