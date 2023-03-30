import axios from '@/lib/axios';
import { useStorage } from '@vueuse/core';
import { defineStore, acceptHMRUpdate } from 'pinia';
import type {Ref} from "vue";
import {useAPI} from "@/composables/fetch";

const csrf = () => axios.get('/sanctum/csrf-cookie');

const api = useAPI();

export const useUsers = defineStore('users', {
    state: () => ({
        userToken: useStorage('userToken', '' as string | null),
        userData: {},
    }),

    getters: {
        authUser: state => state.userToken,
        hasUserData: state => Object.keys(state.userData).length > 0
    },

    actions: {
        async getData() {
            const { data, error } = await api.index<Record<string, string>>(
                'user',
                {},
                { disableNotify: true }
            );

            if (error) {
                this.userToken = null;
                this.router.push({ name: 'login' });
                return;
            }

            if (data) {
                this.userData = data;
            }
        },

        async login(form: Ref<object>, processing: Ref<boolean>) {

            processing.value = true;

            await csrf();

            const { error, data } = await api.login<{token: string}>(form.value);

            if (error || ! data) {
                processing.value = false;
                return;
            }

            this.userToken = data.token;

            await this.getData();

            processing.value = false;

            this.router.push({ name: 'choirs-index' });
        },

        // async register(form, setErrors, processing) {
        //     await csrf()
        //
        //     processing.value = true
        //
        //     axios
        //         .post('/register', form.value)
        //         .then(response => {
        //             this.authStatus = response.status
        //             processing.value = false
        //
        //             this.router.push({ name: 'dashboard' })
        //         })
        //         .catch(error => {
        //             if (error.response.status !== 422) throw error
        //
        //             setErrors.value = Object.values(
        //                 error.response.data.errors,
        //             ).flat()
        //             processing.value = false
        //         })
        // },

        // async forgotPassword(form, setStatus, setErrors, processing) {
        //     await csrf()
        //
        //     processing.value = true
        //
        //     axios
        //         .post('/forgot-password', form.value)
        //         .then(response => {
        //             setStatus.value = response.data.status
        //             processing.value = false
        //         })
        //         .catch(error => {
        //             if (error.response.status !== 422) throw error
        //
        //             setErrors.value = Object.values(
        //                 error.response.data.errors,
        //             ).flat()
        //             processing.value = false
        //         })
        // },
        //
        // async resetPassword(form, setErrors, processing) {
        //     await csrf()
        //
        //     processing.value = true
        //
        //     axios
        //         .post('/reset-password', form.value)
        //         .then(response => {
        //             this.router.push(
        //                 '/login?reset=' + btoa(response.data.status),
        //             )
        //             processing.value = false
        //         })
        //         .catch(error => {
        //             if (error.response.status !== 422) throw error
        //
        //             setErrors.value = Object.values(
        //                 error.response.data.errors,
        //             ).flat()
        //             processing.value = false
        //         })
        // },
        //
        // resendEmailVerification(setStatus, processing) {
        //     processing.value = true
        //
        //     axios.post('/email/verification-notification').then(response => {
        //         setStatus.value = response.data.status
        //         processing.value = false
        //     })
        // },

        async logout() {
            this.userToken = '';
            this.router.push({ name: 'login' });
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUsers, import.meta.hot))
}
