import { defineStore } from 'pinia'
import type { Attributes } from '@/types/Attributes'
import type { Video } from "@/types/Video";
import type { Choir } from "@/types/Choir";
import { useAPI } from "@/composables/fetch";
import type { Landscape } from "@/types/Landscape";
import type { Place } from "@/types/Place";
import type { VideosFilter } from "@/types/VideosFilter";
import { ref } from "vue";
import type { Attribute } from "@/types/Attribute";
import { LANDSCAPES } from "@/enums/landscapes";

const fetch = useAPI();

export declare type PlacesNames = 'cultural_stage' | 'open_air' | 'sacred' | 'rehearsal' | 'neutral' | 'spring' | 'winter';

export declare type LandscapeNames = 'dresden' | 'leipzig' | 'chemnitz' | 'west' | 'north' | 'east' | 'rehearsal' | LANDSCAPES.SEASON_NEUTRAL | LANDSCAPES.SEASON_SPRING | LANDSCAPES.SEASON_WINTER | LANDSCAPES.KINDER_YOUTH;

export declare type Places = Record<PlacesNames, Place>;

export declare type Presets = Record<LandscapeNames, Landscape>;

export declare type FilterNames = 'genres' | 'styles' | 'regions';

// class Vdo implements Video {
//     choir_id = 0;
//     choir_leader = '';
//     choir_name = '';
//     composer = '';
//     created_at = '';
//     duration = 0;
//     genre_id = 0;
//     id = 0;
//     landscape_id = null;
//     place_id = 0;
//     season_id = 0;
//     source_id = 0;
//     source_thumbnail_url = '';
//     source_vid = '';
//     style_id = 0;
//     text = '';
//     title = '';
// }

export const useLibrary = defineStore('library', () => {
    const attributes = ref<Attributes>();
    const videos = ref<Video[]>([]);
    const choirs = ref<Choir[]>([]);
    const dataIsReady = ref(false);

    const places = {
        cultural_stage: {
            stageElements: [
                {
                    assets: {
                        light: '/images/stage/places/theater/light/SCV-Stage-Kultur-Frame.png',
                        dark: '/images/stage/places/theater/dark/SCV-Stage-Kultur-Frame-Dark-withLights.png',
                    },
                    width: 100,
                    top: 0,
                    left: 0,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/theater/light/SCV-Stage-Kultur-SeatsB.png',
                        dark: '/images/stage/places/theater/dark/SCV-Stage-Kultur-SeatsB-Dark.png',
                    },
                    width: 80,
                    top: 75,
                    left: 10,
                    deathStrengthX: 0.05,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/theater/light/SCV-Stage-Kultur-SeatsA.png',
                        dark: '/images/stage/places/theater/dark/SCV-Stage-Kultur-SeatsA-Dark.png',
                    },
                    width: 100,
                    top: 85,
                    left: 0,
                    deathStrengthX: 0.12,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/theater/light/SCV-Stage-Kultur-BalconyM.png',
                        dark: '/images/stage/places/theater/dark/SCV-Stage-Kultur-BalconyM-Dark.png',
                    },
                    width: 80,
                    top: 80,
                    left: 10,
                    deathStrengthX: 0.5,
                    deathStrengthY: 0.5,
                },
                {
                    assets: {
                        light: '/images/stage/places/theater/light/SCV-Stage-Kultur-BalconyL.png',
                        dark: '/images/stage/places/theater/dark/SCV-Stage-Kultur-BalconyL-Dark.png',
                    },
                    width: 30,
                    top: -13,
                    left: -3,
                    deathStrengthX: 0.25,
                    deathStrengthY: 0.1,
                },
                {
                    assets: {
                        light: '/images/stage/places/theater/light/SCV-Stage-Kultur-BalconyR.png',
                        dark: '/images/stage/places/theater/dark/SCV-Stage-Kultur-BalconyR-Dark.png',
                    },
                    width: 30,
                    top: -13,
                    left: 73,
                    deathStrengthX: 0.25,
                    deathStrengthY: 0.1,
                },
                {
                    assets: {
                        light: '/images/stage/places/theater/light/SCV-Stage-Kultur-DreamVignetteWhite.png',
                        dark: '/images/stage/places/theater/light/SCV-Stage-Kultur-DreamVignetteWhite.png',
                    },
                    width: 100,
                    top: 0,
                    left: 0,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                },
            ]
        },
        open_air: {
            stageElements: [
                {
                    assets: {
                        light: '/images/stage/places/open-air/light/Background.png',
                        dark: '/images/stage/places/open-air/dark/BackgroundDark.png',
                    },
                    width: 100,
                    top: 46.3,
                    left: 0,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/open-air/light/Foodtruck.png',
                        dark: '/images/stage/places/open-air/dark/FoodtruckDark.png',
                    },
                    width: 23,
                    top: 50,
                    left: -2,
                    deathStrengthX: 0.02,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/open-air/light/KidWithDog.png',
                        dark: '/images/stage/places/open-air/dark/KidWithDogDark.png',
                    },
                    width: 19,
                    top: 56.8,
                    left: 80,
                    deathStrengthX: 0.02,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/open-air/light/Girlande_1.png',
                        dark: '/images/stage/places/open-air/dark/Girlande_1Dark.png',
                    },
                    width: 26.1,
                    top: 27.1,
                    left: -2,
                    deathStrengthX: 0.05,
                    deathStrengthY: 0.02,
                },
                {
                    assets: {
                        light: '/images/stage/places/open-air/light/Girlande_2.png',
                        dark: '/images/stage/places/open-air/dark/Girlande_2Dark.png',
                    },
                    width: 26.1,
                    top: 27.1,
                    left: 76.3,
                    deathStrengthX: 0.05,
                    deathStrengthY: 0.02,
                },
                {
                    assets: {
                        light: '/images/stage/places/open-air/light/Stage.png',
                        dark: '/images/stage/places/open-air/dark/StageDark_Lights.png',
                    },
                    width: 83,
                    top: 3.4,
                    left: 9.4,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/open-air/light/Humans.png',
                        dark: '/images/stage/places/open-air/dark/HumansDark.png',
                    },
                    width: 74,
                    top: 65,
                    left: 15,
                    deathStrengthX: 0.2,
                    deathStrengthY: 0.05,
                },
                {
                    assets: {
                        light: '/images/stage/places/open-air/light/BushL.png',
                        dark: '/images/stage/places/open-air/dark/BushLDark.png',
                    },
                    width: 30,
                    top: 71,
                    left: -3,
                    deathStrengthX: 0.4,
                    deathStrengthY: 0.1,
                },
                {
                    assets: {
                        light: '/images/stage/places/open-air/light/BushR.png',
                        dark: '/images/stage/places/open-air/dark/BushRDark.png',
                    },
                    width: 30,
                    top: 71,
                    left: 73,
                    deathStrengthX: 0.4,
                    deathStrengthY: 0.1,
                },
                {
                    assets: {
                        light: null,
                        dark: '/images/stage/places/open-air/dark/FireflyL.png',
                    },
                    width: 24,
                    top: 60,
                    left: 0,
                    deathStrengthX: 0.6,
                    deathStrengthY: 0.2,
                },
                {
                    assets: {
                        light: null,
                        dark: '/images/stage/places/open-air/dark/FireflyR.png',
                    },
                    width: 28,
                    top: 50,
                    left: 69,
                    deathStrengthX: 0.6,
                    deathStrengthY: 0.2,
                },
                {
                    assets: {
                        light: '/images/stage/misc/SCV-Stage-Kultur-DreamVignetteWhite.png',
                        dark: '/images/stage/misc/SCV-Stage-Kultur-DreamVignetteWhite.png',
                    },
                    width: 100,
                    top: 0,
                    left: 0,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                },
            ]
        },
        sacred: {
            stageElements: [
                {
                    assets: {
                        light: '/images/stage/places/church/light/BackgorundSakral.png',
                        dark: '/images/stage/places/church/dark/BackgorundSakralDark_candles.png',
                    },
                    width: 100,
                    top: 0,
                    left: 0,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/church/light/path.png',
                        dark: '/images/stage/places/church/dark/path.png',
                    },
                    width: 35,
                    top: 60,
                    left: 33.5,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/church/light/bank5l.png',
                        dark: '/images/stage/places/church/dark/bank5l.png',
                    },
                    width: 23.7,
                    top: 61.3,
                    left: 24.3,
                    deathStrengthX: 0.02,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/church/light/bank5r.png',
                        dark: '/images/stage/places/church/dark/bank5r.png',
                    },
                    width: 21,
                    top: 61.8,
                    left: 51.9,
                    deathStrengthX: 0.02,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/church/light/bank4l.png',
                        dark: '/images/stage/places/church/dark/bank4l.png',
                    },
                    width: 26.8,
                    top: 66.5,
                    left: 20.1,
                    deathStrengthX: 0.04,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/church/light/bank4r.png',
                        dark: '/images/stage/places/church/dark/bank4r.png',
                    },
                    width: 24,
                    top: 66.4,
                    left: 52.9,
                    deathStrengthX: 0.04,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/church/light/bank3l.png',
                        dark: '/images/stage/places/church/dark/bank3l.png',
                    },
                    width: 30.6,
                    top: 70.7,
                    left: 15.4,
                    deathStrengthX: 0.06,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/church/light/bank3r.png',
                        dark: '/images/stage/places/church/dark/bank3r.png',
                    },
                    width: 27.4,
                    top: 70.4,
                    left: 53.7,
                    deathStrengthX: 0.06,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/church/light/bank2l.png',
                        dark: '/images/stage/places/church/dark/bank2l.png',
                    },
                    width: 34.1,
                    top: 76.7,
                    left: 10.7,
                    deathStrengthX: 0.08,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/church/light/bank2r.png',
                        dark: '/images/stage/places/church/dark/bank2r.png',
                    },
                    width: 30.9,
                    top: 76.2,
                    left: 54.8,
                    deathStrengthX: 0.08,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/church/light/bank1l.png',
                        dark: '/images/stage/places/church/dark/bank1l.png',
                    },
                    width: 50,
                    top: 85.8,
                    left: -6.3,
                    deathStrengthX: 0.12,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/church/light/bank1r.png',
                        dark: '/images/stage/places/church/dark/bank1r.png',
                    },
                    width: 50,
                    top: 83.5,
                    left: 56,
                    deathStrengthX: 0.12,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/church/light/SauleV1L.png',
                        dark: '/images/stage/places/church/dark/SauleV1L.png',
                    },
                    width: 30.6,
                    top: 0,
                    left: -11.5,
                    deathStrengthX: 0.2,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/church/light/SauleV1R.png',
                        dark: '/images/stage/places/church/dark/SauleV1R.png',
                    },
                    width: 30.6,
                    top: 0,
                    left: 80.2,
                    deathStrengthX: 0.2,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/misc/SCV-Stage-Kultur-DreamVignetteWhite.png',
                        dark: '/images/stage/misc/SCV-Stage-Kultur-DreamVignetteWhite.png',
                    },
                    width: 100,
                    top: 0,
                    left: 0,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                },
            ]
        },
        rehearsal: {
            stageElements: [
                {
                    assets: {
                        light: '/images/stage/places/rehearsal/BG-light.png',
                        dark: '/images/stage/places/rehearsal/BG-dark.png',
                    },
                    width: 100,
                    top: 0,
                    left: 0,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/rehearsal/Piano.png',
                        dark: '/images/stage/places/rehearsal/Piano-dark.png',
                    },
                    width: 20,
                    top: 62,
                    left: 41,
                    deathStrengthX: 0.02,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/rehearsal/Pult.png',
                        dark: '/images/stage/places/rehearsal/Pult-dark.png',
                    },
                    width: 11,
                    top: 51,
                    left: 68,
                    deathStrengthX: 0.02,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/rehearsal/Opus.png',
                        dark: '/images/stage/places/rehearsal/Opus-dark.png',
                    },
                    width: 12,
                    top: 15,
                    left: 13,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                    onClick: () => {
                        console.log(1)
                    }
                },
                {
                    assets: {
                        light: '/images/stage/places/rehearsal/StuhleR3.png',
                        dark: '/images/stage/places/rehearsal/StuhleR3-dark.png',
                    },
                    width: 31,
                    top: 59,
                    left: 52,
                    deathStrengthX: 0.04,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/rehearsal/StuhleR2.png',
                        dark: '/images/stage/places/rehearsal/StuhleR2-dark.png',
                    },
                    width: 32,
                    top: 69.5,
                    left: 60,
                    deathStrengthX: 0.1,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/rehearsal/StuhleR2.png',
                        dark: '/images/stage/places/rehearsal/StuhleR2-dark.png',
                    },
                    width: 33,
                    top: 74,
                    left: 66,
                    deathStrengthX: 0.12,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/rehearsal/StuhleL3.png',
                        dark: '/images/stage/places/rehearsal/StuhleL3-dark.png',
                    },
                    width: 31.5,
                    top: 65,
                    left: 19,
                    deathStrengthX: 0.04,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/rehearsal/StuhleL2.png',
                        dark: '/images/stage/places/rehearsal/StuhleL2-dark.png',
                    },
                    width: 31,
                    top: 66.5,
                    left: 11,
                    deathStrengthX: 0.08,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/rehearsal/StuhleL1.png',
                        dark: '/images/stage/places/rehearsal/StuhleL1-dark.png',
                    },
                    width: 33,
                    top: 81.3,
                    left: 4,
                    deathStrengthX: 0.12,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/rehearsal/Schreibtisch.png',
                        dark: '/images/stage/places/rehearsal/Schreibtisch-dark.png',
                    },
                    width: 49,
                    top: 50,
                    left: 53,
                    deathStrengthX: 0.3,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/rehearsal/Buch.png',
                        dark: '/images/stage/places/rehearsal/Buch-dark.png',
                    },
                    width: 27,
                    top: 83,
                    left: 67,
                    deathStrengthX: 0.3,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/rehearsal/Mediathek.png',
                        dark: '/images/stage/places/rehearsal/Mediathek-dark.png',
                    },
                    width: 13,
                    top: 93,
                    left: 61,
                    deathStrengthX: 0.3,
                    deathStrengthY: 0,
                },
            ]
        },
        neutral: {
            stageElements: [
                {
                    assets: {
                        light: '/images/stage/places/neutral/Background.png',
                        dark: '/images/stage/places/neutral/Background-darkV2.png',
                    },
                    width: 100,
                    top: 0,
                    left: 0,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/neutral/Stage.png',
                        dark: '/images/stage/places/neutral/Stage-dark.png',
                    },
                    width: 100,
                    top: 1,
                    left: 0,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/neutral/Bird.png',
                        dark: '/images/stage/places/neutral/Bird-dark.png',
                    },
                    width: 7,
                    top: 20,
                    left: 18,
                    deathStrengthX: 0.02,
                    deathStrengthY: 0.02,
                },
                {
                    assets: {
                        light: '/images/stage/places/neutral/Doggo.png',
                        dark: '/images/stage/places/neutral/Doggo-dark.png',
                    },
                    width: 14,
                    top: 57,
                    left: 87,
                    deathStrengthX: 0.05,
                    deathStrengthY: 0.05,
                },
                {
                    assets: {
                        light: '/images/stage/places/neutral/Eiscreme.png',
                        dark: '/images/stage/places/neutral/Eiscreme-dark.png',
                    },
                    width: 12.8,
                    top: 42,
                    left: -1,
                    deathStrengthX: 0.05,
                    deathStrengthY: 0.05,
                },
                {
                    assets: {
                        light: '/images/stage/places/neutral/Tische.png',
                        dark: '/images/stage/places/neutral/Tische-dark.png',
                    },
                    width: 78,
                    top: 75,
                    left: 11,
                    deathStrengthX: 0.2,
                    deathStrengthY: 0.1,
                },
            ]
        },
        spring: {
            stageElements: [
                {
                    assets: {
                        light: '/images/stage/places/spring/Background.png',
                        dark: '/images/stage/places/spring/Background-dark.png',
                    },
                    width: 100,
                    top: 0,
                    left: 0,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/spring/Buhne.png',
                        dark: '/images/stage/places/spring/Buhne-dark.png',
                    },
                    width: 100,
                    top: 6,
                    left: 0,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/spring/Ast.png',
                        dark: '/images/stage/places/spring/Ast-dark.png',
                    },
                    width: 32,
                    top: -1,
                    left: 69,
                    deathStrengthX: 0.1,
                    deathStrengthY: 0.1,
                },
                {
                    assets: {
                        light: '/images/stage/places/spring/Paar.png',
                        dark: '/images/stage/places/spring/Paar-dark.png',
                    },
                    width: 10.5,
                    top: 53,
                    left: 0,
                    deathStrengthX: 0.01,
                    deathStrengthY: 0.01,
                },
                {
                    assets: {
                        light: '/images/stage/places/spring/Tische.png',
                        dark: '/images/stage/places/spring/Tische-dark.png',
                    },
                    width: 78,
                    top: 75,
                    left: 11,
                    deathStrengthX: 0.2,
                    deathStrengthY: 0.1,
                },
                {
                    assets: {
                        light: '/images/stage/places/spring/Bluten.png',
                        dark: '/images/stage/places/spring/Bluten-dark.png',
                    },
                    width: 18,
                    top: 80,
                    left: 1,
                    deathStrengthX: 0.4,
                    deathStrengthY: 0.4,
                },
            ]
        },
        winter: {
            stageElements: [
                {
                    assets: {
                        light: '/images/stage/places/winter/Background.png',
                        dark: '/images/stage/places/winter/Background-dark.png',
                    },
                    width: 100,
                    top: 0,
                    left: 0,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/winter/Stage.png',
                        dark: '/images/stage/places/winter/Stage-dark2.png',
                    },
                    width: 100,
                    top: 1,
                    left: 0,
                    deathStrengthX: 0,
                    deathStrengthY: 0,
                },
                {
                    assets: {
                        light: '/images/stage/places/winter/Ornaments2.png',
                        dark: '/images/stage/places/winter/Ornaments2-DARKnew.png',
                    },
                    width: 32,
                    top: -1,
                    left: 69,
                    deathStrengthX: 0.01,
                    deathStrengthY: 0.01,
                },
                {
                    assets: {
                        light: '/images/stage/places/winter/Ornaments1.png',
                        dark: '/images/stage/places/winter/Ornaments1-DARKnew.png',
                    },
                    width: 27,
                    top: -1,
                    left: 1,
                    deathStrengthX: 0.02,
                    deathStrengthY: 0.02,
                },
                {
                    assets: {
                        light: '/images/stage/places/winter/Maronen.png',
                        dark: '/images/stage/places/winter/Maronen-dark.png',
                    },
                    width: 11,
                    top: 45,
                    left: 90,
                    deathStrengthX: 0.03,
                    deathStrengthY: 0.03,
                },
                {
                    assets: {
                        light: '/images/stage/places/winter/Tische.png',
                        dark: '/images/stage/places/winter/Tische-dark.png',
                    },
                    width: 78,
                    top: 75,
                    left: 11,
                    deathStrengthX: 0.2,
                    deathStrengthY: 0.1,
                },
                {
                    assets: {
                        light: '/images/stage/places/winter/Gluhwein.png',
                        dark: '/images/stage/places/winter/Gluhwein-dark.png',
                    },
                    width: 12,
                    top: 58,
                    left: -1,
                    deathStrengthX: 0.03,
                    deathStrengthY: 0.03,
                },
            ]
        }
    } as Places;

    const landscapes = {
        [LANDSCAPES.LEIPZIG]: {
            name: 'Leipzig',
            background_image: '/images/stage/landscapes/SCV_Website_Landschaften_Leipzigs.jpg',
            background_image_dark: '/images/stage/landscapes/SCV_Website_Landschaften_LeipzigNacht.jpg',
            title_gen: 'Leipziger',
            videos_filter: () => sortLandscapeVideos(LANDSCAPES.LEIPZIG)
        },
        [LANDSCAPES.DRESDEN]: {
            name: 'Dresden',
            background_image: '/images/stage/landscapes/SCV_Website_Landschaften_Dresden.jpg',
            background_image_dark: '/images/stage/landscapes/SCV_Website_Landschaften_DresdenNight.jpg',
            title_gen: 'Dresdener',
            videos_filter: () => sortLandscapeVideos(LANDSCAPES.DRESDEN)
        },
        [LANDSCAPES.CHEMNITZ]: {
            name: 'Chemnitz',
            background_image: '/images/stage/landscapes/SCV_Website_Landschaften_Chemnitz.jpg',
            background_image_dark: '/images/stage/landscapes/SCV_Website_Landschaften_ChemnitzNacht.jpg',
            title_gen: 'Chemnitzer',
            videos_filter: () => sortLandscapeVideos(LANDSCAPES.CHEMNITZ)
        },
        [LANDSCAPES.NORTH]: {
            name: 'Nord',
            background_image: '/images/stage/landscapes/SCV_Website_Landschaften_Nord.jpg',
            background_image_dark: '/images/stage/landscapes/SCV_Website_Landschaften_NordNacht.jpg',
            title_gen: 'Norder',
            videos_filter: () => sortLandscapeVideos(LANDSCAPES.NORTH)
        },
        [LANDSCAPES.WEST]: {
            name: 'West',
            background_image: '/images/stage/landscapes/SCV_Website_Landschaften_West.jpg',
            background_image_dark: '/images/stage/landscapes/SCV_Website_Landschaften_WestNacht.jpg',
            title_gen: 'Westen',
            videos_filter: () => sortLandscapeVideos(LANDSCAPES.WEST)
        },
        [LANDSCAPES.EAST]: {
            name: 'Ost',
            background_image: '/images/stage/landscapes/SCV_Website_Landschaften_SachsenOst.jpg',
            background_image_dark: '/images/stage/landscapes/SCV_Website_Landschaften_SachsenOstNacht.jpg',
            title_gen: 'Osten',
            videos_filter: () => sortLandscapeVideos(LANDSCAPES.EAST)
        },
        [LANDSCAPES.KINDER_YOUTH]: {
            name: 'Kinder Jugend',
            background_image: '/images/stage/landscapes/SCV_Website_Landschaften_KinderJugend.jpg',
            background_image_dark: '/images/stage/landscapes/SCV_Website_Landschaften_KinderJugendNacht.jpg',
            title_gen: '',
            videos_filter: () => sortLandscapeVideos(LANDSCAPES.KINDER_YOUTH)
        },
        [LANDSCAPES.SEASON_NEUTRAL]: {
            name: 'Saison Neutral',
            background_image: '/images/landing/Clouds.jpg',
            background_image_dark: null,
            title_gen: '',
            bound_place: places.neutral,
            has_no_enter_room: true,
            videos_filter: () => sortLandscapeVideos(LANDSCAPES.SEASON_NEUTRAL)
        },
        [LANDSCAPES.SEASON_SPRING]: {
            name: 'Saison Frühling',
            background_image: null,
            background_image_dark: null,
            title_gen: '',
            bound_place: places.spring,
            has_no_enter_room: true,
            videos_filter: () => sortLandscapeVideos(LANDSCAPES.SEASON_SPRING)
        },
        [LANDSCAPES.SEASON_WINTER]: {
            name: 'Saison Winter',
            background_image: null,
            background_image_dark: null,
            title_gen: '',
            bound_place: places.winter,
            has_no_enter_room: true,
            videos_filter: () => sortLandscapeVideos(LANDSCAPES.SEASON_WINTER)
        },
        [LANDSCAPES.REHEARSAL]: {
            name: 'Proberaum',
            background_image: null,
            background_image_dark: null,
            title_gen: '',
            has_no_enter_room: true,
            bound_place: places.rehearsal,
            videos_filter: () => sortLandscapeVideos(LANDSCAPES.REHEARSAL)
        },
    } as Presets;

    const sortLandscapeVideos = (landscape: LandscapeNames) => {

        const list = videos.value.filter(video =>
            video.landscape_id === getLandscapeBySlug(landscape)?.id
        );

        return list.sort((v1, v2) => {
            if (v1.order_index !== undefined && v2.order_index !== undefined) {
                return v1.order_index - v2.order_index;
            }
            return 0;
        });
    }

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

    const getLandscapeById = (landscapeId: number): Attribute | null => {
        return attributes.value?.landscapes.find(attr => attr.id === landscapeId) || null;
    }

    const getVideosByChoirID = (videoId: number) => {
        return videos.value.filter(video => video.choir_id === videoId);
    }

    const getPresetByRegion = (regionID: number): Landscape | null => {

        const regionSlug = getRegionByID(regionID)?.slug as LandscapeNames;
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
        getVideos,
        getChoirs,
        getAttributes,
        dataReady,
        getChoirByID,
        getPresetByRegion,
        getVideosByChoirID,
        getLandscapeById,
    }
});