import { defineStore } from 'pinia';
import type { Attributes } from '@/types/Attributes';
import type { AxiosResponse } from 'axios';
import {useAPI} from "@/composables/fetch";

export declare type EditableAttributes = 'genres' | 'styles' | 'choir_types' | 'places';

const api = useAPI();

export const useAttributes = defineStore('attributes', {

    state: () => {
        return {
            navigation: [
                {
                    'name': 'Genres',
                    'slug': 'genres',
                },
                {
                    'name': 'Stile',
                    'slug': 'styles',
                },
                {
                    'name': 'Chortyp',
                    'slug': 'choir_types',
                },
            ],
            list: { } as Attributes
        }
    },

    getters: {
        
    },

    actions: {
        async getAttributes() {
            await api.index(`attributes`, {}, {
                onSuccess: (response: AxiosResponse) => {
                    this.list = response.data
                }
            });
        }
    }
});