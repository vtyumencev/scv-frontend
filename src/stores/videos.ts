import axios from '@/lib/axios'
import type { Choir } from '@/types/Choir';
import type { Video } from '@/types/Video';
import type { AxiosResponse } from 'axios';
import { defineStore, acceptHMRUpdate } from 'pinia'

export const useVideos = defineStore('videos', {

    state: () => {
        return {
            
        }
    },

    getters: {
        
    },

    actions: {
        async getVideos(choirID?: number) : Promise<AxiosResponse> {
            let params = {}
            if (choirID) {
                params = { 'choir_id': choirID }
            }
            return await axios
                .get('/api/videos', { params: params })
                .then(response => {
                    return response
                })
        },
        async getVideo(id: number) : Promise<AxiosResponse> {
            return await axios
                .get('/api/videos/' + id)
                .then(response => {
                    return response
                })
        },
        async addVideo(video_url: string, choir_id: number) : Promise<AxiosResponse> {
            return await axios
                .post('/api/videos', { video_url, choir_id })
                .then(response => {
                    return response
                })
                .catch(error => {
                    return error.response
                })
        },
        async saveVideo(id: number, data: Video) : Promise<AxiosResponse> {
            return await axios
                .put('/api/videos/' + id, data)
                .then(response => {
                    return response
                })
                .catch(error => {
                    return error.response
                })
        },
        async deleteVideo(id: number) : Promise<AxiosResponse> {
            return await axios
                .delete('/api/videos/' + id)
                .then(response => {
                    return response
                })
                .catch(error => {
                    return error.response
                })
        }
    }
});