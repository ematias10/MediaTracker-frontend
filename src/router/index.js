import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Register.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../pages/Search.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guards para proteger rutas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuth = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuth) {
    // Si la ruta requiere autenticación y el usuario no está logueado
    next('/login');
  } else if (to.meta.guestOnly && isAuth) {
    // Si la ruta es solo para invitados (login/register) y ya está logueado
    next('/');
  } else {
    // En cualquier otro caso, permite la navegación
    next();
  }
});

export default router;
