import type { Choir } from '@/types/Choir';
import { defineStore } from 'pinia';
import { useAPI } from '@/composables/fetch';

const fetch = useAPI();

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
            this.filterOrder = name;
        },
        async getChoirs() {
            const response = await fetch.index<Choir[]>('choirs');
            this.choirs = response.data ?? [];
        }
    }
});