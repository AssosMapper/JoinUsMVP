import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import store from '../store';
import Home from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/aboutUs',
    name: 'AboutUs',
    component: () => import('../views/AboutUs.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/contactUs',
    name: 'ContactUs',
    component: () => import('../views/ContactUs.vue'),
  },
  {
    path: '/adminInterface',
    name: 'AdminInterface',
    meta: { requiresAdmin: true },
    component: () => import('../views/AdminInterface.vue'),
  },
  {
    path: '/associationManagerInterface',
    name: 'AssociationManagerInterface',
    meta: { requiresAssociationManager: true },
    component: () => import('../views/AssociationManagerInterface.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['user/isAuthenticated'];
  const isAdmin = store.getters['user/isAdmin'];
  const isAssociationManager = store.getters['user/isAssociationManager'];

  if (to.name === 'AdminInterface' && (!isAuthenticated || !isAdmin)) {
    next('/login');
    alert("Veuillez vous connecter.");
  } else if (to.name === 'AssociationManagerInterface' && (!isAuthenticated || (!isAssociationManager && !isAdmin))) {
    next('/login');
    alert("Veuillez vous connecter.");
  } else {
    next();
  }
});

export default router;
