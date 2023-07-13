import { createWebHistory, createRouter } from 'vue-router';
import { useUsers } from '@/stores/user';
import Stage from '@/pages/Stage.vue';
import PageNotFound from '@/pages/errors/404.vue';
import Dashboard from '@/pages/backend/Dashboard.vue';
import Login from '@/pages/auth/Login.vue';
import CollectionUpload from "@/pages/backend/CollectionUpload.vue";
// import Register from '@/pages/auth/Register.vue';
// import ForgotPassword from '@/pages/auth/ForgotPassword.vue';
// import ResetPassword from '@/pages/auth/ResetPassword.vue';
// import VerifyEmail from '@/pages/auth/VerifyEmail.vue';
import type { RouteRecordRaw } from 'vue-router';
import Index from "@/pages/Index.vue";

import PresetsShow from "@/pages/StagePreset.vue";

import Choirs from '@/pages/backend/Choirs.vue';
import ChoirsIndex from '@/pages/backend/ChoirsIndex.vue';
import ChoirsEdit from '@/pages/backend/ChoirsEdit.vue';
import ChoirsNew from '@/pages/backend/ChoirsNew.vue';

import Attributes from '@/pages/backend/Attributes.vue';
import Attribute from '@/pages/backend/Attribute.vue';
import Library from "@/pages/Library.vue";
import LibraryChoir from "@/pages/LibraryChoir.vue";
import Settings from "@/pages/backend/Settings.vue";
import SettingsSeason from "@/pages/backend/SettingsSeason.vue";
import SettingsTranslations from "@/pages/backend/SettingsTranslations.vue";
import Article from "@/pages/Article.vue";
import VideosIndex from "@/pages/backend/VideosIndex.vue";
import Landscapes from "@/pages/backend/Landscapes.vue";
import LandscapesIndex from "@/pages/backend/LandscapesIndex.vue";
import SettingsTranslationsShow from "@/pages/backend/SettingsTranslationsShow.vue";
import SettingsTranslationsIndex from "@/pages/backend/SettingsTranslationsIndex.vue";
import SettingsTranslationsNew from "@/pages/backend/SettingsTranslationsNew.vue";
import SettingsTranslationsSettings from "@/pages/backend/SettingsTranslationsSettings.vue";



const APP_NAME = import.meta.env.VITE_APP_NAME;

const routes : Array<RouteRecordRaw> = [
    // {
    //     path: '/test',
    //     name: 'test',
    //     component: () => import("@/pages/backend/TestPage.vue"),
    // },
    {
        path: '/',
        name: 'index',
        component: Index,
    },
    {
        path: '/datenschutz',
        name: 'datenschutz',
        component: Article,
        props: { translationName: 'datenschutz' },
        meta: {
            title: 'Datenschutz',
        },
    },
    {
        path: '/impressum',
        name: 'impressum',
        component: Article,
        props: { translationName: 'impressum' },
        meta: {
            title: 'Impressum',
        },
    },
    {
        path: '/library',
        name: 'library',
        children: [
            {
                path: '',
                name: 'library-index',
                component: Library,
                props: route => ({ query: route.query }),
            },
            {
                path: 'choirs/:choirId',
                name: 'library-choirs-show',
                component: LibraryChoir,
                props: route => ({ query: route.query, choirId: route.params.choirId, videoId: route.params.videoId }),
                children: [
                    {
                        path: 'video/:videoId',
                        name: 'library-choirs-show-video',
                        component: LibraryChoir,
                        props: route => ({ videoId: route.params.videoId }),
                    }
                ]
            }
        ]
    },
    {
        path: '/presets/:presetName',
        name: 'presets-show',
        component: PresetsShow,
        props: true,
    },
    {
        path: '/presets/:presetName/stage/:videoID(\\d+)?',
        name: 'preset-stage',
        component: Stage,
        props: true,
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
        path: '/export-import',
        name: 'export-import',
        props: route => ({ filePath: route.query['file-path'] }),
        component: CollectionUpload,
        meta: {
            title: 'Export & Import',
            guard: 'auth',
        },
    },
    {
        path: '/videos',
        name: 'videos',
        component: VideosIndex,
        meta: {
            title: 'Videos',
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
        path: '/settings',
        name: 'settings',
        component: Settings,
        meta: {
            title: 'Einstellungen',
        },
        children: [
            {
                path: '',
                name: 'settings-index',
                redirect: { name: 'settings-season' }
            },
            {
                path: 'season',
                name: 'settings-season',
                component: SettingsSeason
            },
            {
                path: 'translations',
                name: 'settings-translations',
                component: SettingsTranslations,
                children: [
                    {
                        path: '',
                        name: 'settings-translations-index',
                        component: SettingsTranslationsIndex,
                    },
                    {
                        path: ':lang/show',
                        name: 'settings-translations-show',
                        component: SettingsTranslationsShow,
                        props: true,
                    },
                    {
                        path: ':lang/settings',
                        name: 'settings-translations-settings',
                        component: SettingsTranslationsSettings,
                        props: true,
                    },
                    {
                        path: 'new',
                        name: 'settings-translations-new',
                        component: SettingsTranslationsNew,
                        props: true,
                    }
                ]
            },
        ]
    },
    {
        path: '/landscapes',
        name: 'landscapes',
        component: Landscapes,
        meta: {
            title: 'Landscapes',
            guard: 'auth',
        },
        children: [
            {
                path: '',
                name: 'landscapes-index',
                redirect: { name: 'landscapes-show', params: { landscapeName: 'leipzig' } }
            },
            {
                path: ':landscapeName',
                name: 'landscapes-show',
                component: LandscapesIndex,
                props: true,
            },
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
    // {
    //     path: '/register',
    //     name: 'register',
    //     component: Register,
    //     meta: {
    //         title: 'Register',
    //         guard: 'guest',
    //     },
    // },
    // {
    //     path: '/forgot-password',
    //     name: 'forgot-password',
    //     component: ForgotPassword,
    //     meta: {
    //         title: 'Forget Password',
    //         guard: 'guest',
    //     },
    // },
    // {
    //     path: '/password-reset/:token',
    //     name: 'password-reset',
    //     component: ResetPassword,
    //     // query: {
    //     //     email: 'email',
    //     // },
    //     meta: {
    //         title: 'Reset Password',
    //         guard: 'guest',
    //     },
    // },
    // {
    //     path: '/verify-email',
    //     name: 'verify-email',
    //     component: VerifyEmail,
    //     // query: {
    //     //     resend: 'resend',
    //     // },
    //     meta: {
    //         title: 'Email Verification',
    //         guard: 'auth',
    //     },
    // },
    {
        path: '/:pathMatch(.*)*',
        name: 'page-not-found',
        component: PageNotFound,
        meta: {
            title: 'Page Not Found',
        },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            if (to.path !== from.path) {
                return { top: 0 }
            }
        }
    },
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
