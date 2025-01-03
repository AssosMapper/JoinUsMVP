<<<<<<< HEAD
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
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
    path: '/displayEvent/:id',
    name: 'EventDetails',
    component: () => import('../views/DisplayEventDetails.vue'),
    props: true,
  },
  {
    path: '/displayAssociations',
    name: 'DisplayAssociations',
    component: () => import('../views/DisplayAssociations.vue'),
  },
  {
    path: '/displayAssociation/:id',
    name: 'AssociationDetails',
    component: () => import('../views/DisplayAssociationDetails.vue'),
    props: true,
  },
  {
    path: '/eventsManagerInterface',
    name: 'EventsManagerInterface',
    meta: { requiresEventsManager: true },
    component: () => import('../views/EventsManagerInterface.vue'),
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
=======
import { useUserStore } from "@/store";
import MyAssociations from "@/views/MyAssociations.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/aboutUs",
    name: "AboutUs",
    component: () => import("../views/AboutUs.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/updateProfile",
    name: "UpdateProfile",
    component: () => import("../views/UpdateProfile.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/contactUs",
    name: "ContactUs",
    component: () => import("../views/ContactUs.vue"),
  },
  {
    path: "/adminInterface",
    name: "AdminInterface",
    meta: { requiresAdmin: true },
    component: () => import("../views/AdminInterface.vue"),
  },
  {
    path: "/associationManagerInterface",
    name: "AssociationManagerInterface",
    meta: { requiresAssociationManager: true },
    component: () => import("../views/AssociationManagerDashboard.vue"),
  },
  {
    path: "/displayEvents",
    name: "DisplayEvents",
    component: () => import("../views/DisplayEvents.vue"),
  },
  {
    path: "/displayEvent/:id",
    name: "EventDetails",
    component: () => import("../views/DisplayEventDetails.vue"),
    props: true,
  },
  {
    path: "/displayAssociations",
    name: "DisplayAssociations",
    component: () => import("../views/DisplayAssociations.vue"),
  },
  {
    path: "/displayAssociation/:id",
    name: "AssociationDetails",
    component: () => import("../views/DisplayAssociationDetails.vue"),
    props: true,
  },
  {
    path: "/eventsManagerInterface",
    name: "EventsManagerInterface",
    meta: { requiresEventsManager: true },
    component: () => import("../views/EventsManagerInterface.vue"),
  },
  {
    path: "/my-associations",
    name: "my-associations",
    component: MyAssociations,
    meta: { requiresAuth: true },
  },
  {
    path: "/associations/:id/dashboard",
    name: "AssociationDashboard",
    component: () =>
      import("@/views/AssociationDashboard/AssociationDashboard.vue"),
    meta: {
      requiresAuth: true,
    },
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
<<<<<<< HEAD
    const userStore = useUserStore();

    // Si l'utilisateur n'est pas authentifié et que le store n'est pas encore restauré, attendez sa restauration
    if (!userStore.isAuth && userStore.token) {
        try {
            await userStore.refetchUser();  // Récupère les données de l'utilisateur via le token s'il existe
        } catch (error) {
            console.error('Erreur lors de la récupération du profil utilisateur', error);
        }
    }

    const isAuthenticated = userStore.isAuthenticated;
    const isAdmin = userStore.isAdmin;
    const isAssociationManager = userStore.isAssociationManager;
    const isEventsManager = userStore.isEventsManager;

    // Vérification des droits d'accès basés sur les rôles
    if (to.meta.requiresAdmin && (!isAuthenticated || !isAdmin)) {
        next('/login');
        alert("Vous devez être administrateur pour accéder à cette page. Veuillez vous connecter.");
    } else if (to.meta.requiresAssociationManager && (!isAuthenticated || (!isAssociationManager && !isAdmin))) {
        next('/login');
        alert("Vous devez être gestionnaire d'association pour accéder à cette page. Veuillez vous connecter.");
    } else if (to.meta.requiresEventsManager && (!isAuthenticated || (!isEventsManager && !isAdmin))) {
        next('/login');
        alert("Vous devez être gestionnaire d'events pour accéder à cette page. Veuillez vous connecter.");
    } else {
        next();
    }
});

=======
  const userStore = useUserStore();

  // Attendre que le store soit complètement initialisé
  while (!userStore.initialized || userStore.loader) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const isAuthenticated = userStore.isAuthenticated;
  const isAdmin = userStore.isAdmin;
  const isAssociationManager = userStore.isAssociationManager;

  console.log('User roles:', userStore.user?.roles);
  console.log('Is authenticated:', isAuthenticated);
  console.log('Is admin:', isAdmin);
  console.log('Is association manager:', isAssociationManager);

  if (to.meta.requiresAdmin && (!isAuthenticated || !isAdmin)) {
    next('/login');
    alert("Vous devez être administrateur pour accéder à cette page.");
  } else if (to.meta.requiresAssociationManager && (!isAuthenticated || (!isAssociationManager && !isAdmin))) {
    next('/login');
    alert("Vous devez être gestionnaire d'association pour accéder à cette page.");
  } else {
    next();
  }
});
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

export default router;
