import { defineStore } from 'pinia'
import type { Attributes } from '@/types/Attributes'
import type { Video } from "@/types/Video";
import type { Choir } from "@/types/Choir";
import {useAPI} from "@/composables/fetch";
import type {Preset} from "@/types/Preset";
import type {Place} from "@/types/Place";
import type {VideosFilter} from "@/types/VideosFilter";
import {ref} from "vue";
import type {Attribute} from "@/types/Attribute";

const fetch = useAPI();

export declare type PresetNames = 'dresden' | 'leipzig' | 'chemnitz' | 'west' | 'north' | 'east';

export declare type Presets = Record<PresetNames, Preset>;

export declare type FilterNames = 'genres' | 'styles' | 'regions';

export const useLibrary = defineStore('library', () => {
    const attributes = ref<Attributes>();
    const videos = ref<Video[]>();
    const choirs = ref<Choir[]>();
    const dataIsReady = ref(false);

    const presets = {
        'leipzig': {
            'name': 'Leipzig',
                'backgroundImage': '/stage/landscapes/SCV_Website_Landschaften_Leipzigs.jpg',
                'backgroundImageDark': '/stage/landscapes/SCV_Website_Landschaften_LeipzigNacht.jpg',
                'source': {
                'type': 'region',
                    'id': 1,
            },
            title_gen: 'Leipziger'
        },
        'dresden': {
            'name': 'Dresden',
                'backgroundImage': '/stage/landscapes/SCV_Website_Landschaften_Dresden.jpg',
                'backgroundImageDark': '/stage/landscapes/SCV_Website_Landschaften_DresdenNight.jpg',
                'source': {
                'type': 'region',
                    'id': 2,
            },
            title_gen: 'Dresdener'
        },
        'chemnitz': {
            'name': 'Chemnitz',
                'backgroundImage': '/stage/landscapes/SCV_Website_Landschaften_Chemnitz.jpg',
                'source': {
                'type': 'region',
                    'id': 3,
            },
            title_gen: 'Chemnitzer'
        },
        'north': {
            'name': 'Nord',
                'backgroundImage': '/stage/landscapes/SCV_Website_Landschaften_Nord.jpg',
                'source': {
                'type': 'region',
                    'id': 4,
            },
            title_gen: 'Norder'
        },
        'west': {
            'name': 'West',
                'backgroundImage': '/stage/landscapes/SCV_Website_Landschaften_West.jpg',
                'source': {
                'type': 'region',
                    'id': 5,
            },
            title_gen: 'Westen'
        },
        'east': {
            'name': 'Ost',
                'backgroundImage': '/stage/landscapes/SCV_Website_Landschaften_SachsenOst.jpg',
                'source': {
                'type': 'region',
                    'id': 6,
            },
            title_gen: 'Osten'
        },
        'kinder-youth': {
            'name': 'Kinder Jugend',
                'backgroundImage': '/stage/landscapes/SCV_Website_Landschaften_KinderJugend.jpg',
                'source': {
                'type': 'kinder_youth',
            },
            title_gen: ''
        },
    } as Presets;
    const places = {
        'concert': {
            'stageElements': [
                {
                    'assets': {
                        'light': '/stage/places/theater/light/SCV-Stage-Kultur-Frame.png',
                        'dark': '/stage/places/theater/dark/SCV-Stage-Kultur-Frame-Dark-withLights.png',
                    },
                    'width': 100,
                    'top': 0,
                    'left': 0,
                    'deathStrengthX': 0,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/stage/places/theater/light/SCV-Stage-Kultur-SeatsB.png',
                        'dark': '/stage/places/theater/dark/SCV-Stage-Kultur-SeatsB-Dark.png',
                    },
                    'width': 80,
                    'top': 75,
                    'left': 10,
                    'deathStrengthX': 0.05,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/stage/places/theater/light/SCV-Stage-Kultur-SeatsA.png',
                        'dark': '/stage/places/theater/dark/SCV-Stage-Kultur-SeatsA-Dark.png',
                    },
                    'width': 100,
                    'top': 85,
                    'left': 0,
                    'deathStrengthX': 0.12,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/stage/places/theater/light/SCV-Stage-Kultur-BalconyM.png',
                        'dark': '/stage/places/theater/dark/SCV-Stage-Kultur-BalconyM-Dark.png',
                    },
                    'width': 80,
                    'top': 80,
                    'left': 10,
                    'deathStrengthX': 0.5,
                    'deathStrengthY': 0.5,
                },
                {
                    'assets': {
                        'light': '/stage/places/theater/light/SCV-Stage-Kultur-BalconyL.png',
                        'dark': '/stage/places/theater/dark/SCV-Stage-Kultur-BalconyL-Dark.png',
                    },
                    'width': 30,
                    'top': -13,
                    'left': -3,
                    'deathStrengthX': 0.25,
                    'deathStrengthY': 0.1,
                },
                {
                    'assets': {
                        'light': '/stage/places/theater/light/SCV-Stage-Kultur-BalconyR.png',
                        'dark': '/stage/places/theater/dark/SCV-Stage-Kultur-BalconyR-Dark.png',
                    },
                    'width': 30,
                    'top': -13,
                    'left': 73,
                    'deathStrengthX': 0.25,
                    'deathStrengthY': 0.1,
                },
                {
                    'assets': {
                        'light': '/stage/places/theater/light/SCV-Stage-Kultur-DreamVignetteWhite.png',
                        'dark': '/stage/places/theater/light/SCV-Stage-Kultur-DreamVignetteWhite.png',
                    },
                    'width': 100,
                    'top': 0,
                    'left': 0,
                    'deathStrengthX': 0,
                    'deathStrengthY': 0,
                },
            ]
        },
        'open_air': {
            'stageElements': [
                {
                    'assets': {
                        'light': '/stage/places/open-air/light/Background.png',
                        'dark': '/stage/places/open-air/dark/BackgroundDark.png',
                    },
                    'width': 100,
                    'top': 46.3,
                    'left': 0,
                    'deathStrengthX': 0,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/stage/places/open-air/light/Foodtruck.png',
                        'dark': '/stage/places/open-air/dark/FoodtruckDark.png',
                    },
                    'width': 23,
                    'top': 50,
                    'left': -2,
                    'deathStrengthX': 0.02,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/stage/places/open-air/light/KidWithDog.png',
                        'dark': '/stage/places/open-air/dark/KidWithDogDark.png',
                    },
                    'width': 19,
                    'top': 56.8,
                    'left': 80,
                    'deathStrengthX': 0.02,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/stage/places/open-air/light/Girlande_1.png',
                        'dark': '/stage/places/open-air/dark/Girlande_1Dark.png',
                    },
                    'width': 26.1,
                    'top': 27.1,
                    'left': -2,
                    'deathStrengthX': 0.05,
                    'deathStrengthY': 0.02,
                },
                {
                    'assets': {
                        'light': '/stage/places/open-air/light/Girlande_2.png',
                        'dark': '/stage/places/open-air/dark/Girlande_2Dark.png',
                    },
                    'width': 26.1,
                    'top': 27.1,
                    'left': 76.3,
                    'deathStrengthX': 0.05,
                    'deathStrengthY': 0.02,
                },
                {
                    'assets': {
                        'light': '/stage/places/open-air/light/Stage.png',
                        'dark': '/stage/places/open-air/dark/StageDark_Lights.png',
                    },
                    'width': 83,
                    'top': 3.4,
                    'left': 9.4,
                    'deathStrengthX': 0,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/stage/places/open-air/light/Humans.png',
                        'dark': '/stage/places/open-air/dark/HumansDark.png',
                    },
                    'width': 74,
                    'top': 65,
                    'left': 15,
                    'deathStrengthX': 0.2,
                    'deathStrengthY': 0.05,
                },
                {
                    'assets': {
                        'light': '/stage/places/open-air/light/BushL.png',
                        'dark': '/stage/places/open-air/dark/BushLDark.png',
                    },
                    'width': 30,
                    'top': 71,
                    'left': -3,
                    'deathStrengthX': 0.4,
                    'deathStrengthY': 0.1,
                },
                {
                    'assets': {
                        'light': '/stage/places/open-air/light/BushR.png',
                        'dark': '/stage/places/open-air/dark/BushRDark.png',
                    },
                    'width': 30,
                    'top': 71,
                    'left': 73,
                    'deathStrengthX': 0.4,
                    'deathStrengthY': 0.1,
                },
                {
                    'assets': {
                        'light': null,
                        'dark': '/stage/places/open-air/dark/FireflyL.png',
                    },
                    'width': 24,
                    'top': 60,
                    'left': 0,
                    'deathStrengthX': 0.6,
                    'deathStrengthY': 0.2,
                },
                {
                    'assets': {
                        'light': null,
                        'dark': '/stage/places/open-air/dark/FireflyR.png',
                    },
                    'width': 28,
                    'top': 50,
                    'left': 69,
                    'deathStrengthX': 0.6,
                    'deathStrengthY': 0.2,
                },
                {
                    'assets': {
                        'light': '/stage/misc/SCV-Stage-Kultur-DreamVignetteWhite.png',
                        'dark': '/stage/misc/SCV-Stage-Kultur-DreamVignetteWhite.png',
                    },
                    'width': 100,
                    'top': 0,
                    'left': 0,
                    'deathStrengthX': 0,
                    'deathStrengthY': 0,
                },
            ]
        }
    } as Record<string, Place>;

    const filters = {
        genres: {
            selected: [] as string[],
                is_active: false,
                filterCallback: (video, selectedAttributes) => selectedAttributes.includes(video.genre_id + '')
        },
        styles: {
            selected: [] as string[],
                is_active: false,
                filterCallback: (video, selectedAttributes) => selectedAttributes.includes(video.style_id + '')
        },
        regions: {
            selected: [] as string[],
                is_active: false,
                filterCallback: (video, selectedAttributes) => {
                    const regionId = choirs.value?.find(choir => choir.id === video.choir_id)?.region_id;
                    return selectedAttributes.includes(regionId + '');
                }
        }
    } as Record<string, VideosFilter>;

    const getVideos = async () => {
        const response = await fetch.index<Video[]>('videos', { 'no_limit': 1 });
        if (! response.error) {
            videos.value = response.data ?? [];
        }
        return response;
    };

    const getChoirs = async () => {
        const response = await fetch.index<Choir[]>('choirs', { 'no_limit': 1 });
        if (! response.error) {
            choirs.value = response.data ?? [];
        }
        return response;
    };

    const getAttributes = async () => {
        const response = await fetch.index<Attributes>('attributes');
        if (! response.error) {
            attributes.value = response.data;
        }
        return response;
    };

    const dataReady = () => {
        dataIsReady.value = true;
    };

    const getChoirByID = (choirID: number): Choir | null => {
        return choirs.value?.find(choir => choir.id === choirID) || null
    };

    const getRegionByID = (regionID: number): Attribute | null => {
        return attributes.value?.regions.find(attr => attr.id === regionID) || null
    };

    const getPresetByRegion = (regionID: number): Preset | null => {

        const regionSlug = getRegionByID(regionID)?.slug as PresetNames;
        if (! regionSlug) {
            return null;
        }
        return presets[regionSlug];
    }

    return {
        dataIsReady,
        attributes,
        videos,
        choirs,
        presets,
        places,
        filters,
        getVideos,
        getChoirs,
        getAttributes,
        dataReady,
        getChoirByID,
        getPresetByRegion
    }
});