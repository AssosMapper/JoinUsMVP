import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';
import MyAssociations from '@/views/MyAssociations.vue'

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
        props: true
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
        props: true
    },
    {
        path: '/eventsManagerInterface',
        name: 'EventsManagerInterface',
        meta: { requiresEventsManager: true },
        component: () => import('../views/EventsManagerInterface.vue'),
    },
    {
        path: '/my-associations',
        name: 'my-associations',
        component: MyAssociations,
        meta: { requiresAuth: true }
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const isAuthenticated = userStore.isAuthenticated;
    const isAdmin = userStore.isAdmin;
    const isAssociationManager = userStore.isAssociationManager;
    const isEventsManager = userStore.isEventsManager;

    if (to.meta.requiresAdmin && (!isAuthenticated || !isAdmin)) {
        // TODO : envoyer vers page 404
        next('/login');
        alert("Vous devez être administrateur pour accéder à cette page. Veuillez vous connecter.");
    } else if (to.meta.requiresAssociationManager && (!isAuthenticated || (!isAssociationManager && !isAdmin))) {
        // TODO : envoyer vers page 404
        next('/login');
        alert("Vous devez être gestionnaire d'association pour accéder à cette page. Veuillez vous connecter.");
    } else if (to.meta.requiresEventsManager && (!isAuthenticated || (!isEventsManager && !isAdmin))) {
        // TODO : envoyer vers page 404
        next('/login');
        alert("Vous devez être gestionnaire d'events pour accéder à cette page. Veuillez vous connecter.");
    } else {
        next();
    }
});

export default router;
