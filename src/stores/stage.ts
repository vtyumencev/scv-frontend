import axios from './../lib/axios'
import { defineStore, acceptHMRUpdate } from 'pinia'
import type { Attributes } from '@/types/Attributes'

export const useStage = defineStore('stage', {

    state: () => {
        return {
            presets: [
                {
                    'slug': 'dresden',
                    'name': 'Dresden',
                    'color': '#550C18',
                },
                {
                    'slug': 'leipzig',
                    'name': 'Leipzig',
                    'color': '#443730',
                    'background': '/bg-1.jpg',
                },
                {
                    'slug': 'chemnitz',
                    'name': 'Chemnitz',
                    'color': '#786452',
                },
                {
                    'slug': 'nord-sachsen',
                    'name': 'Nord-Sachsen',
                    'color': '#A5907E',
                },
                {
                    'slug': 'west-sachsen',
                    'name': 'West-Sachsen',
                    'color': '#A5907E',
                },
                {
                    'slug': 'ost-sachsen',
                    'name': 'Ost-Sachsen',
                    'color': '#A5907E',
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
        getVideos() {
            axios
                .get('/api/videos')
                .then(response => {
                    this.videos = response.data.data.data
                })
                .catch(error => {
                    if (error.response.status !== 409) throw error
                })
        }
    }
});