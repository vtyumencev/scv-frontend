import type { Video } from '@/types/Video';
import { defineStore } from 'pinia';
import { useAPI } from "@/composables/fetch";

const fetch = useAPI();

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