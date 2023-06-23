import { defineStore } from 'pinia';
import { ref } from "vue";

export declare type ChoirOrderOptions = 'name_asc' | 'name_desc' | 'date_asc' | 'date_desc' | 'videos_asc' | 'videos_desc';

export const useBackend = defineStore('backend', () => {
    const choirsFilterSearchInput = ref('');
    const choirsFilterOrder = ref<ChoirOrderOptions>('name_asc');
    const choirsFilterOrderOptions = ref([
        { 'id': 'name_asc', 'name': 'Name ASC' },
        { 'id': 'name_desc', 'name': 'Name DESC' },
        { 'id': 'date_asc', 'name': 'Oldest' },
        { 'id': 'date_desc', 'name': 'Newest' },
        { 'id': 'videos_asc', 'name': 'Videos ASC' },
        { 'id': 'videos_desc', 'name': 'Videos DESC' },
    ]);

    const videosFilterSearchInput = ref('');

    return {
        choirsFilterSearchInput,
        choirsFilterOrder,
        choirsFilterOrderOptions,
        videosFilterSearchInput,
    }
});