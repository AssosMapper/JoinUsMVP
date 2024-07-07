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
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutUs.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
  },
  {
    path: '/contactUs',
    name: 'ContactUs',
    component: () => import(/* webpackChunkName: "about" */ '../views/ContactUs.vue'),
  },
  {
    path: '/adminInterface',
    name: 'AdminInterface',
    component: () => import(/* webpackChunkName: "about" */ '../views/AdminInterface.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['user/isAuthenticated'];
  const isAdmin = store.getters['user/isAdmin'];

  if (to.name === 'AdminInterface' && (!isAuthenticated || !isAdmin)) {
    next('/login');
    alert("Veuillez vous connecter.");
  } else {
    next();
  }
});

export default router;
