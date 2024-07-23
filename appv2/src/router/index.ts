import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import {useUserStore} from '@/store';

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
        meta: {requiresAdmin: true},
        component: () => import('../views/AdminInterface.vue'),
    },
    {
        path: '/associationManagerInterface',
        name: 'AssociationManagerInterface',
        meta: {requiresAssociationManager: true},
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
    }
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