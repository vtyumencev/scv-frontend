import axios from '@/lib/axios'
import type { Choir } from '@/types/Choir';
import type { AxiosResponse } from 'axios';
import { defineStore, acceptHMRUpdate } from 'pinia'

export const useChoirs = defineStore('choirs', {

    state: () => {
        return {
            
        }
    },

    getters: {
        
    },

    actions: {
        async getChoirs() {
            return await axios
                .get('/api/choirs')
                .then(response => {
                    return response.data
                })
                .catch(error => {
                    return error.response
                })
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
        async restoreChoir(choirID: number) : Promise<AxiosResponse> {
            return await axios
                .post('/api/choirs/' + choirID + '/restore')
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