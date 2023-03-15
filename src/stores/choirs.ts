import axios from '@/lib/axios'
import type { Choir } from '@/types/Choir';
import type { AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { useFetch } from '@/composables/fetch';

const fetch = useFetch();

export declare type ChoirOrderOptions = 'name_asc' | 'name_desc' | 'date_asc' | 'date_desc'

export const useChoirs = defineStore('choirs', {

    state: () => {
        return {
            filterSearchInput: '',
            filterOrder: 'name_asc' as ChoirOrderOptions,
            filterOrderOptions: [
                { 'id': 'name_asc', 'name': 'Name ASC' },
                { 'id': 'name_desc', 'name': 'Name DESC' },
                { 'id': 'date_asc', 'name': 'Oldest' },
                { 'id': 'date_desc', 'name': 'Newest' },
            ],
            choirs: [] as Choir[],
        }
    },

    getters: {
        
    },

    actions: {
        changeOrder(name: ChoirOrderOptions) {
            this.filterOrder = name
        },
        async getChoirs() {
            const response = await fetch.index<Choir[]>('choirs');
            this.choirs = response.data ?? [];
        },
        async getChoir(id: number) {
            return await axios
                .get('/api/choirs/' + id)
                .then(response => {
                    return response.data
                })
                .catch(error => {
                    return error.response
                })
        },
        async saveChoir(id: number, data: Choir) : Promise<AxiosResponse> {
            return await axios
                .put('/api/choirs/' + id, data)
                .then(response => {
                    return response
                })
                .catch(error => {
                    return error.response
                })
        },
        async storeChoir(data: object) : Promise<AxiosResponse> {
            return await axios
                .post('/api/choirs', data)
                .then(response => {
                    return response
                })
                .catch(error => {
                    return error.response
                })
        },
        async deleteChoir(choirID: number) : Promise<AxiosResponse> {
            return await axios
                .delete('/api/choirs/' + choirID)
                .then(response => {
                    return response
                })
                .catch(error => {
                    return error.response
                })
        },
        async getVideos(choirID: number) : Promise<AxiosResponse> {
            return await axios
                .get('/api/videos?no_limit=1&choir_id=' + choirID)
                .then(response => {
                    return response
                })
                .catch(error => {
                    return error.response
                })
        }
    }
});