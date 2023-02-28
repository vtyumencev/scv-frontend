import { createWebHistory, createRouter } from 'vue-router';
import { useUsers } from '@/stores/user';
import Welcome from '@/pages/Welcome.vue';
import Stage from '@/pages/Stage.vue';
import PageNotFound from '@/pages/errors/404.vue';
import Dashboard from '@/pages/Dashboard.vue';
import Login from '@/pages/auth/Login.vue';
import Register from '@/pages/auth/Register.vue';
import ForgotPassword from '@/pages/auth/ForgotPassword.vue';
import ResetPassword from '@/pages/auth/ResetPassword.vue';
import VerifyEmail from '@/pages/auth/VerifyEmail.vue';
import type { RouteRecordRaw } from 'vue-router';

import Choirs from '@/pages/backend/Choirs.vue';
import ChoirsIndex from '@/pages/backend/ChoirsIndex.vue';
import ChoirsEdit from '@/pages/backend/ChoirsEdit.vue';
import ChoirsNew from '@/pages/backend/ChoirsNew.vue';

import Attributes from '@/pages/backend/Attributes.vue';
import AttributesIndex from '@/pages/backend/AttributesIndex.vue';
import Attribute from '@/pages/backend/Attribute.vue';

const APP_NAME = import.meta.env.VITE_APP_NAME;

const routes : Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'welcome',
        component: Welcome,
        meta: {
            title: 'Welcome',
            metaTags: [
                {
                    name: 'Welcome',
                    content:
                        'An application / authentication starter kit frontend in Vue.js 3 for Laravel Breeze.',
                },
                {
                    property: 'og:Welcome',
                    content:
                        'An application / authentication starter kit frontend in Vue.js 3 for Laravel Breeze.',
                },
            ],
        },
    },
    {
        path: '/stage',
        name: 'Stage',
        component: Stage,
        meta: {
            title: 'Stage',
            metaTags: [
                {
                    name: '',
                    content:
                        '',
                },
                {
                    property: '',
                    content:
                        '',
                },
            ],
        },
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
            title: 'Dashboard',
            guard: 'auth',
        },
    },
    {
        path: '/attributes',
        name: 'attributes',
        component: Attributes,
        meta: {
            title: 'Attribute',
        },
        children: [
            {
                path: '',
                name: 'attributes-index',
                redirect: { path: '/attributes/genres' } 
            },
            {
                path: ':attributeName',
                name: 'attribute',
                component: Attribute,
                props: true,
                children: [
                    {
                        path: 'new',
                        name: 'attribute-values-new',
                        component: Attribute,
                        props: true,
                    },
                    {
                        path: ':attributeID',
                        name: 'attribute-values',
                        component: Attribute,
                        props: true,
                    },
                ]
            }
        ]
    },
    {
        path: '/choirs',
        name: 'choirs',
        component: Choirs,
        meta: {
            title: 'Chöre',
            guard: 'auth',
        },
        children: [
            {
                path: '',
                name: 'choirs-index',
                component: ChoirsIndex
            },
            {
                path: 'new',
                name: 'choirs-new',
                component: ChoirsNew
            },
            {
                path: ':id',
                name: 'choirs-edit',
                props: true,
                component: ChoirsEdit,
                meta: {
                    title: 'Edit Choir',
                },
                children: [
                    {
                        path: 'videos/:videoID',
                        name: 'choirs-edit-videos-edit',
                        component: ChoirsEdit,
                        props: true,
                    },
                ]
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        // query: {
        //     reset: 'reset',
        // },
        meta: {
            title: 'Log in',
            guard: 'guest',
        },
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: {
            title: 'Register',
            guard: 'guest',
        },
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPassword,
        meta: {
            title: 'Forget Password',
            guard: 'guest',
        },
    },
    {
        path: '/password-reset/:token',
        name: 'password-reset',
        component: ResetPassword,
        // query: {
        //     email: 'email',
        // },
        meta: {
            title: 'Reset Password',
            guard: 'guest',
        },
    },
    {
        path: '/verify-email',
        name: 'verify-email',
        component: VerifyEmail,
        // query: {
        //     resend: 'resend',
        // },
        meta: {
            title: 'Email Verification',
            guard: 'auth',
        },
    },
    {
        path: '/page-not-found',
        name: 'page-not-found',
        component: PageNotFound,
        meta: {
            title: 'Page Not Found',
        },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/page-not-found',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

// Navigation guard

router.beforeEach((to, from, next) => {
    const store = useUsers();

    const auth = store.authUser;

    if (to.matched.some(route => route.meta.guard === 'guest') && auth)
        next({ name: 'dashboard' });
    else if (to.matched.some(route => route.meta.guard === 'auth') && !auth)
        next({ name: 'login' });
    else next();
});

// Page Title and Metadata

router.beforeEach((to, from, next) => {
    const nearestWithTitle = to.matched
        .slice()
        .reverse()
        .find(r => r.meta && r.meta.title)

    const nearestWithMeta : any = to.matched
        .slice()
        .reverse()
        .find(r => r.meta && r.meta.metaTags)

    if (nearestWithTitle) {
        document.title = nearestWithTitle.meta.title + ' — ' + APP_NAME
    } else {
        document.title = APP_NAME
    }

    Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(
        el => el.parentNode?.removeChild(el),
    )

    if (!nearestWithMeta) return next()

    nearestWithMeta.meta.metaTags
        .map((tagDef : any) => {
            const tag = document.createElement('meta')

            Object.keys(tagDef).forEach(key => {
                tag.setAttribute(key, tagDef[key])
            })

            tag.setAttribute('data-vue-router-controlled', '')

            return tag
        })

        .forEach((tag : any) => document.head.appendChild(tag))

    next()
})

export default router
