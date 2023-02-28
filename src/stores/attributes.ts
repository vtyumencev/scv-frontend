import axios from './../lib/axios'
import { defineStore } from 'pinia'
import type { Attributes } from '@/types/Attributes'
import type { Attribute } from '@/types/Attribute';
import type { AxiosResponse } from 'axios';

export declare type EditableAttributes = 'genres' | 'styles' | 'choir_types' | 'places';

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
                {
                    'name': 'Veranstaltungsort',
                    'slug': 'places',
                },
            ],
            list: { } as Attributes
        }
    },

    getters: {
        
    },

    actions: {
        getAttributes() {
            axios
                .get('/api/attributes')
                .then(response => {
                    this.list = response.data;
                })
                .catch(error => {
                    return error.response;
                })
        },
        async storeAttributeValue(attrName: string, valueData: Attribute) : Promise<AxiosResponse> {
            return await axios
                .post(`/api/attributes/${ attrName }`, valueData)
                .then(response => {
                    return response;
                })
                .catch(error => {
                    return error.response;
                })
        },
        async updateAttributeValue(attrName: string, valueData: Attribute) : Promise<AxiosResponse> {
            return await axios
                .put(`/api/attributes/${ attrName }/${ valueData.id }`, valueData)
                .then(response => {
                    return response;
                })
                .catch(error => {
                    return error.response;
                })
        },
        async deleteAttributeValue(attrName: string, valueID: number) : Promise<AxiosResponse> {
            return await axios
                .delete(`/api/attributes/${ attrName }/${ valueID }`)
                .then(response => {
                    return response;
                })
                .catch(error => {
                    return error.response;
                })
        }
    }
});