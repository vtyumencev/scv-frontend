import axios from './../lib/axios'
import { defineStore } from 'pinia'
import type { Attributes } from '@/types/Attributes'
import type { AxiosResponse } from 'axios';

export const useStage = defineStore('stage', {

    state: () => {
        return {
            presets: [
                {
                    'slug': 'dresden',
                    'name': 'Dresden',
                    'color': '#FFFFFF',
                },
                {
                    'slug': 'leipzig',
                    'name': 'Leipzig',
                    'color': '#FFFFFF',
                    'background': '/bg-1.jpg',
                },
                {
                    'slug': 'chemnitz',
                    'name': 'Chemnitz',
                    'color': '#FFFFFF',
                },
                {
                    'slug': 'nord-sachsen',
                    'name': 'Nord-Sachsen',
                    'color': '#FFFFFF',
                },
                {
                    'slug': 'west-sachsen',
                    'name': 'West-Sachsen',
                    'color': '#FFFFFF',
                },
                {
                    'slug': 'ost-sachsen',
                    'name': 'Ost-Sachsen',
                    'color': '#FFFFFF',
                },
            ],
            attributes: { } as Attributes,
            videos: []
        }
    },

    getters: {
        
    },

    actions: {
        getAttributes() {
            axios
                .get('/api/attributes')
                .then(response => {
                    this.attributes = response.data
                })
                .catch(error => {
                    if (error.response.status !== 409) throw error
                })
        },
        async getVideos() : Promise<AxiosResponse> {
            return await axios
                .get('/api/videos')
                .then(response => {
                    return response
                })
                .catch(error => {
                    return error.response
                })
        }
    }
});