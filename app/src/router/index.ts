import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '../store/usersStore';
import Home from '../views/Home.vue';
import DisplayAssociationDetails from '@/views/DisplayAssociationDetails.vue';

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
    path: '/updateProfile',
    name: 'UpdateProfile',
    component: () => import('../views/UpdateProfile.vue'),
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
  {
    path: '/displayEvents',
    name: 'DisplayEvents',
    component: () => import('../views/DisplayEvents.vue'),
  },
  {
    path: '/displayAssociations',
    name: 'DisplayAssociations',
    component: () => import('../views/DisplayAssociations.vue'),
  },
  {
    path: '/displayAssociation/:id',
    name: 'AssociationDetails',
    component: DisplayAssociationDetails,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isAuthenticated;
  const isAdmin = userStore.isAdmin;
  const isAssociationManager = userStore.isAssociationManager;

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