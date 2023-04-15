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
import { LANDSCAPES } from "@/enums/landscapes";

const fetch = useAPI();

export declare type PresetNames = 'dresden' | 'leipzig' | 'chemnitz' | 'west' | 'north' | 'east';

export declare type Presets = Record<PresetNames, Preset>;

export declare type FilterNames = 'genres' | 'styles' | 'regions';

export const useLibrary = defineStore('library', () => {
    const attributes = ref<Attributes>();
    const videos = ref<Video[]>([]);
    const choirs = ref<Choir[]>([]);
    const dataIsReady = ref(false);

    const landscapes = {
        [LANDSCAPES.LEIPZIG]: {
            name: 'Leipzig',
            backgroundImage: '/images/stage/landscapes/SCV_Website_Landschaften_Leipzigs.jpg',
            backgroundImageDark: '/images/stage/landscapes/SCV_Website_Landschaften_LeipzigNacht.jpg',
            title_gen: 'Leipziger',
            videosFilter: () => {
                return videos.value.filter(video =>
                    video.landscape_id === getLandscapeBySlug(LANDSCAPES.LEIPZIG)?.id
                );
            }
        },
        [LANDSCAPES.DRESDEN]: {
            name: 'Dresden',
            backgroundImage: '/images/stage/landscapes/SCV_Website_Landschaften_Dresden.jpg',
            backgroundImageDark: '/images/stage/landscapes/SCV_Website_Landschaften_DresdenNight.jpg',
            title_gen: 'Dresdener',
            videosFilter: () => {
                return videos.value.filter(video =>
                    video.landscape_id === getLandscapeBySlug(LANDSCAPES.DRESDEN)?.id
                );
            }
        },
        [LANDSCAPES.CHEMNITZ]: {
            name: 'Chemnitz',
            backgroundImage: '/images/stage/landscapes/SCV_Website_Landschaften_Chemnitz.jpg',
            backgroundImageDark: '/images/stage/landscapes/SCV_Website_Landschaften_ChemnitzNacht.jpg',
            title_gen: 'Chemnitzer',
            videosFilter: () => {
                return videos.value.filter(video =>
                    video.landscape_id === getLandscapeBySlug(LANDSCAPES.CHEMNITZ)?.id
                );
            }
        },
        [LANDSCAPES.NORTH]: {
            name: 'Nord',
            backgroundImage: '/images/stage/landscapes/SCV_Website_Landschaften_Nord.jpg',
            backgroundImageDark: '/images/stage/landscapes/SCV_Website_Landschaften_NordNacht.jpg',
            title_gen: 'Norder',
            videosFilter: () => {
                return videos.value.filter(video =>
                    video.landscape_id === getLandscapeBySlug(LANDSCAPES.NORTH)?.id
                );
            }
        },
        [LANDSCAPES.WEST]: {
            name: 'West',
            backgroundImage: '/images/stage/landscapes/SCV_Website_Landschaften_West.jpg',
            backgroundImageDark: '/images/stage/landscapes/SCV_Website_Landschaften_WestNacht.jpg',
            title_gen: 'Westen',
            videosFilter: () => {
                return videos.value.filter(video =>
                    video.landscape_id === getLandscapeBySlug(LANDSCAPES.WEST)?.id
                );
            }
        },
        [LANDSCAPES.EAST]: {
            name: 'Ost',
            backgroundImage: '/images/stage/landscapes/SCV_Website_Landschaften_SachsenOst.jpg',
            backgroundImageDark: '/images/stage/landscapes/SCV_Website_Landschaften_SachsenOstNacht.jpg',
            title_gen: 'Osten',
            videosFilter: () => {
                return videos.value.filter(video =>
                    video.landscape_id === getLandscapeBySlug(LANDSCAPES.EAST)?.id
                );
            }
        },
        [LANDSCAPES.KINDER_YOUTH]: {
            name: 'Kinder Jugend',
            backgroundImage: '/images/stage/landscapes/SCV_Website_Landschaften_KinderJugend.jpg',
            backgroundImageDark: '/images/stage/landscapes/SCV_Website_Landschaften_KinderJugendNacht.jpg',
            title_gen: '',
            videosFilter: () => {
                return videos.value.filter(video =>
                    video.landscape_id === getLandscapeBySlug(LANDSCAPES.KINDER_YOUTH)?.id
                );
            }
        },
        [LANDSCAPES.SEASON_NEUTRAL]: {
            name: 'Kinder Jugend',
            backgroundImage: '/images/stage/landscapes/SCV_Website_Landschaften_KinderJugend.jpg',
            title_gen: '',
            videosFilter: () => {
                return videos.value.filter(video =>
                    video.landscape_id === getLandscapeBySlug(LANDSCAPES.SEASON_NEUTRAL)?.id
                );
            }
        },
        [LANDSCAPES.REHEARSAL]: {
            name: 'Kinder Jugend',
            backgroundImage: '/images/stage/landscapes/SCV_Website_Landschaften_KinderJugend.jpg',
            title_gen: '',
            has_no_enter_room: true,
            videosFilter: () => {
                return videos.value.filter(video =>
                    video.landscape_id === getLandscapeBySlug(LANDSCAPES.REHEARSAL)?.id
                );
            }
        },
    } as Presets;
    const places = {
        'cultural_stage': {
            'stageElements': [
                {
                    'assets': {
                        'light': '/images/stage/places/theater/light/SCV-Stage-Kultur-Frame.png',
                        'dark': '/images/stage/places/theater/dark/SCV-Stage-Kultur-Frame-Dark-withLights.png',
                    },
                    'width': 100,
                    'top': 0,
                    'left': 0,
                    'deathStrengthX': 0,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/theater/light/SCV-Stage-Kultur-SeatsB.png',
                        'dark': '/images/stage/places/theater/dark/SCV-Stage-Kultur-SeatsB-Dark.png',
                    },
                    'width': 80,
                    'top': 75,
                    'left': 10,
                    'deathStrengthX': 0.05,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/theater/light/SCV-Stage-Kultur-SeatsA.png',
                        'dark': '/images/stage/places/theater/dark/SCV-Stage-Kultur-SeatsA-Dark.png',
                    },
                    'width': 100,
                    'top': 85,
                    'left': 0,
                    'deathStrengthX': 0.12,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/theater/light/SCV-Stage-Kultur-BalconyM.png',
                        'dark': '/images/stage/places/theater/dark/SCV-Stage-Kultur-BalconyM-Dark.png',
                    },
                    'width': 80,
                    'top': 80,
                    'left': 10,
                    'deathStrengthX': 0.5,
                    'deathStrengthY': 0.5,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/theater/light/SCV-Stage-Kultur-BalconyL.png',
                        'dark': '/images/stage/places/theater/dark/SCV-Stage-Kultur-BalconyL-Dark.png',
                    },
                    'width': 30,
                    'top': -13,
                    'left': -3,
                    'deathStrengthX': 0.25,
                    'deathStrengthY': 0.1,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/theater/light/SCV-Stage-Kultur-BalconyR.png',
                        'dark': '/images/stage/places/theater/dark/SCV-Stage-Kultur-BalconyR-Dark.png',
                    },
                    'width': 30,
                    'top': -13,
                    'left': 73,
                    'deathStrengthX': 0.25,
                    'deathStrengthY': 0.1,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/theater/light/SCV-Stage-Kultur-DreamVignetteWhite.png',
                        'dark': '/images/stage/places/theater/light/SCV-Stage-Kultur-DreamVignetteWhite.png',
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
                        'light': '/images/stage/places/open-air/light/Background.png',
                        'dark': '/images/stage/places/open-air/dark/BackgroundDark.png',
                    },
                    'width': 100,
                    'top': 46.3,
                    'left': 0,
                    'deathStrengthX': 0,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/open-air/light/Foodtruck.png',
                        'dark': '/images/stage/places/open-air/dark/FoodtruckDark.png',
                    },
                    'width': 23,
                    'top': 50,
                    'left': -2,
                    'deathStrengthX': 0.02,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/open-air/light/KidWithDog.png',
                        'dark': '/images/stage/places/open-air/dark/KidWithDogDark.png',
                    },
                    'width': 19,
                    'top': 56.8,
                    'left': 80,
                    'deathStrengthX': 0.02,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/open-air/light/Girlande_1.png',
                        'dark': '/images/stage/places/open-air/dark/Girlande_1Dark.png',
                    },
                    'width': 26.1,
                    'top': 27.1,
                    'left': -2,
                    'deathStrengthX': 0.05,
                    'deathStrengthY': 0.02,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/open-air/light/Girlande_2.png',
                        'dark': '/images/stage/places/open-air/dark/Girlande_2Dark.png',
                    },
                    'width': 26.1,
                    'top': 27.1,
                    'left': 76.3,
                    'deathStrengthX': 0.05,
                    'deathStrengthY': 0.02,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/open-air/light/Stage.png',
                        'dark': '/images/stage/places/open-air/dark/StageDark_Lights.png',
                    },
                    'width': 83,
                    'top': 3.4,
                    'left': 9.4,
                    'deathStrengthX': 0,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/open-air/light/Humans.png',
                        'dark': '/images/stage/places/open-air/dark/HumansDark.png',
                    },
                    'width': 74,
                    'top': 65,
                    'left': 15,
                    'deathStrengthX': 0.2,
                    'deathStrengthY': 0.05,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/open-air/light/BushL.png',
                        'dark': '/images/stage/places/open-air/dark/BushLDark.png',
                    },
                    'width': 30,
                    'top': 71,
                    'left': -3,
                    'deathStrengthX': 0.4,
                    'deathStrengthY': 0.1,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/open-air/light/BushR.png',
                        'dark': '/images/stage/places/open-air/dark/BushRDark.png',
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
                        'dark': '/images/stage/places/open-air/dark/FireflyL.png',
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
                        'dark': '/images/stage/places/open-air/dark/FireflyR.png',
                    },
                    'width': 28,
                    'top': 50,
                    'left': 69,
                    'deathStrengthX': 0.6,
                    'deathStrengthY': 0.2,
                },
                {
                    'assets': {
                        'light': '/images/stage/misc/SCV-Stage-Kultur-DreamVignetteWhite.png',
                        'dark': '/images/stage/misc/SCV-Stage-Kultur-DreamVignetteWhite.png',
                    },
                    'width': 100,
                    'top': 0,
                    'left': 0,
                    'deathStrengthX': 0,
                    'deathStrengthY': 0,
                },
            ]
        },
        'sacred': {
            'stageElements': [
                {
                    'assets': {
                        'light': '/images/stage/places/church/light/BackgorundSakral.png',
                        'dark': '/images/stage/places/church/dark/BackgorundSakralDark_candles.png',
                    },
                    'width': 100,
                    'top': 0,
                    'left': 0,
                    'deathStrengthX': 0,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/church/light/path.png',
                        'dark': '/images/stage/places/church/dark/path.png',
                    },
                    'width': 35,
                    'top': 60,
                    'left': 33.5,
                    'deathStrengthX': 0,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/church/light/bank5l.png',
                        'dark': '/images/stage/places/church/dark/bank5l.png',
                    },
                    'width': 23.7,
                    'top': 61.3,
                    'left': 24.3,
                    'deathStrengthX': 0.02,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/church/light/bank5r.png',
                        'dark': '/images/stage/places/church/dark/bank5r.png',
                    },
                    'width': 21,
                    'top': 61.8,
                    'left': 51.9,
                    'deathStrengthX': 0.02,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/church/light/bank4l.png',
                        'dark': '/images/stage/places/church/dark/bank4l.png',
                    },
                    'width': 26.8,
                    'top': 66.5,
                    'left': 20.1,
                    'deathStrengthX': 0.04,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/church/light/bank4r.png',
                        'dark': '/images/stage/places/church/dark/bank4r.png',
                    },
                    'width': 24,
                    'top': 66.4,
                    'left': 52.9,
                    'deathStrengthX': 0.04,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/church/light/bank3l.png',
                        'dark': '/images/stage/places/church/dark/bank3l.png',
                    },
                    'width': 30.6,
                    'top': 70.7,
                    'left': 15.4,
                    'deathStrengthX': 0.06,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/church/light/bank3r.png',
                        'dark': '/images/stage/places/church/dark/bank3r.png',
                    },
                    'width': 27.4,
                    'top': 70.4,
                    'left': 53.7,
                    'deathStrengthX': 0.06,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/church/light/bank2l.png',
                        'dark': '/images/stage/places/church/dark/bank2l.png',
                    },
                    'width': 34.1,
                    'top': 76.7,
                    'left': 10.7,
                    'deathStrengthX': 0.08,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/church/light/bank2r.png',
                        'dark': '/images/stage/places/church/dark/bank2r.png',
                    },
                    'width': 30.9,
                    'top': 76.2,
                    'left': 54.8,
                    'deathStrengthX': 0.08,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/church/light/bank1l.png',
                        'dark': '/images/stage/places/church/dark/bank1l.png',
                    },
                    'width': 50,
                    'top': 85.8,
                    'left': -6.3,
                    'deathStrengthX': 0.12,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/church/light/bank1r.png',
                        'dark': '/images/stage/places/church/dark/bank1r.png',
                    },
                    'width': 50,
                    'top': 83.5,
                    'left': 56,
                    'deathStrengthX': 0.12,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/church/light/SauleV1L.png',
                        'dark': '/images/stage/places/church/dark/SauleV1L.png',
                    },
                    'width': 30.6,
                    'top': 0,
                    'left': -11.5,
                    'deathStrengthX': 0.2,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/places/church/light/SauleV1R.png',
                        'dark': '/images/stage/places/church/dark/SauleV1R.png',
                    },
                    'width': 30.6,
                    'top': 0,
                    'left': 80.2,
                    'deathStrengthX': 0.2,
                    'deathStrengthY': 0,
                },
                {
                    'assets': {
                        'light': '/images/stage/misc/SCV-Stage-Kultur-DreamVignetteWhite.png',
                        'dark': '/images/stage/misc/SCV-Stage-Kultur-DreamVignetteWhite.png',
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

    const relatedVideos = ref<Video[]>([]);

    const filters = {
        genres: {
            filterCallback: (video, selectedAttributes) => selectedAttributes.includes(video.genre_id + '')
        },
        styles: {
            filterCallback: (video, selectedAttributes) => selectedAttributes.includes(video.style_id + '')
        },
        choir_types: {
            filterCallback: (video, selectedAttributes) => {
                const typeId = choirs.value?.find(choir => choir.id === video.choir_id)?.type_id;
                return selectedAttributes.includes(typeId + '');
            }
        },
        regions: {
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
        return choirs.value?.find(choir => choir.id === choirID) || null;
    };

    const getRegionByID = (regionID: number): Attribute | null => {
        return attributes.value?.regions.find(attr => attr.id === regionID) || null;
    };

    const getLandscapeBySlug = (landscapeSlug: string): Attribute | null => {
        return attributes.value?.landscapes.find(attr => attr.slug === landscapeSlug) || null;
    }

    const getPresetByRegion = (regionID: number): Preset | null => {

        const regionSlug = getRegionByID(regionID)?.slug as PresetNames;
        if (! regionSlug) {
            return null;
        }
        return landscapes[regionSlug];
    }

    return {
        dataIsReady,
        attributes,
        videos,
        choirs,
        presets: landscapes,
        places,
        filters,
        relatedVideos,
        getVideos,
        getChoirs,
        getAttributes,
        dataReady,
        getChoirByID,
        getPresetByRegion
    }
});