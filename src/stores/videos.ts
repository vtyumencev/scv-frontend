import type { Video } from '@/types/Video';
import { defineStore } from 'pinia';
import { useFetch } from "@/composables/fetch";

const fetch = useFetch();

export const useVideos = defineStore('videos', {

    state: () => {
        return {
            videos: [] as Video[]
        }
    },

    getters: {
        
    },

    actions: {
        async getVideos() {
            const response = await fetch.index<Video[]>('videos', { 'no_limit': 1 });
            if (! response.error) {
                this.videos = response.data ?? [];
            }
        }
    }
});