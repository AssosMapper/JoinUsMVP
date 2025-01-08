import { useUserStore } from "@/store";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/aboutUs",
    name: "AboutUs",
    component: () => import("@/views/AboutUs.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/Register.vue"),
  },
  {
    path: "/updateProfile",
    name: "UpdateProfile",
    component: () => import("@/views/UpdateProfile.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/contactUs",
    name: "ContactUs",
    component: () => import("@/views/ContactUs.vue"),
  },
  {
    path: "/adminInterface",
    name: "AdminInterface",
    meta: { requiresAdmin: true },
    component: () => import("@/views/AdminInterface.vue"),
  },
  {
    path: "/associationManagerInterface",
    name: "AssociationManagerInterface",
    meta: { requiresAssociationManager: true },
    component: () => import("@/views/Dashboard/AssociationManagerDashboard.vue"),
  },
  {
    path: "/displayEvents",
    name: "DisplayEvents",
    component: () => import("@/views/Display/DisplayEvents.vue"),
  },
  {
    path: "/displayEvent/:id",
    name: "EventDetails",
    component: () => import("@/views/Display/DisplayEventDetails.vue"),
    props: true,
  },
  {
    path: "/displayAssociations",
    name: "DisplayAssociations",
    component: () => import("@/views/Display/DisplayAssociations.vue"),
  },
  {
    path: "/displayAssociation/:id",
    name: "AssociationDetails",
    component: () => import("@/views/Display/DisplayAssociations.vue"),
    props: true,
  },
  {
    path: "/eventsManagerInterface",
    name: "EventsManagerInterface",
    meta: { requiresEventsManager: true },
    component: () => import("@/views/Dashboard/EventsManagerInterface.vue"),
  },
  {
    path: "/my-associations",
    name: "my-associations",
    component: () => import("@/views/MyAssociations.vue"),
    meta: {
      requiresAuth: true,
      requiresAssociationManager: true
    }
  },
  {
    path: "/associations/:id/dashboard",
    name: "AssociationDashboard",
    component: () => import("@/views/Dashboard/AssociationDashboard.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
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

export default router;
