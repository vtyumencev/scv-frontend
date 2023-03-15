<script setup lang="ts">
import { useLibrary } from '@/stores/library'
import { onMounted, onUnmounted, ref, reactive, watch, computed } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter, type RouteLocationNormalized } from 'vue-router';
import Select from '../components/Select.vue';
import type { Video } from '@/types/Video';
import type { Choir } from "@/types/Choir";
import StageVideoPlayer from "@/components/StageVideoPlayer.vue";
import ConcertLayout from "@/layouts/ConcertLayout.vue";
import StageDecorationElement from "@/components/StageDecorationElement.vue";

const libraryStore = useLibrary();

const router = useRouter();
const route = useRoute();

const props = defineProps({
    videoID: {
        type: String,
        default: ''
    },
    playListIDs: {
        type: String,
        default: ''
    }
});

const dataIsReady = ref(false);
const videoID = parseInt(props.videoID);

const videoController = reactive({
    isPlaying: false,
    videoToggle: () => { },
});

// const filters = reactive<Record<string, string>>({
//     'style': route.query.style as string ?? '',
//     'genre': route.query.genre as string ?? '' ,
//     'place': route.query.place as string ?? '' ,
//     'season': route.query.season as string ?? '' ,
// });
//
// watch(filters,  (newFilters) => {
//     const query = { ...route.query, ...newFilters };
//
//     Object.keys(query).forEach(function(key) {
//         if (!query[key]) {
//             delete query[key];
//         }
//     });
//
//     router.push({ query: query });
//     applyFilters();
// });
//
// watch(() => route.query, async () => {
//     Object.keys(filters).forEach(function(key) {
//         filters[key] = route.query[key] as string ?? '';
//     })
// });

const onDataIsReady = () => {
    if (!currentVideo.value) {
        router.push({ name: 'page-not-found' });
        return;
    }
    dataIsReady.value = true;
};

onMounted( () => {

});

onUnmounted(() => {

});

const currentPreset = computed(() => {
    if (currentVideo.value) {
        libraryStore.getChoirByID(currentVideo.value.choir_id);

    }
    return libraryStore.presets['leipzig'];
});


const currentVideo = computed(() : Video | false => {
    return libraryStore.videos.find((video) => video.id === videoID) || false;
});

const currentChoir = computed(() : Choir | false => {
    return libraryStore.getChoirByID(videoID);
});

const currentPlaceSlug = computed(() : string | false => {
    if (! dataIsReady.value) {
        return false;
    }
    const value = libraryStore.attributes.places.find(place => place.id === (currentVideo.value ? currentVideo.value.place_id : 0 ));
    return value?.slug || false;
});

const playlist = computed(() : Video[] => {
    if (!dataIsReady.value) {
        return [];
    }

    const playListRawIDs = props.playListIDs.split(',');

    return playListRawIDs
        .map(item => Number.parseInt(item))
        .filter(item => !isNaN(item))
        .map(item => libraryStore.videos.find(video => video.id === item) as Video)
        .filter(item => item !== undefined);
});

// const getChoirByID = () => {
//
// }

// onBeforeRouteUpdate((to: RouteLocationNormalized) => {
//     const presetName = to.query.preset as string;
//     applyStage(presetName);
// })
//
// const applyFilters = async () => {
//     //const response = await libraryStore.getVideos();
//     //videos.value = response.data;
// }
//
// const applyStage = (presetName: string) : void => {
//     const stageEl = document.querySelector('.stage') as HTMLElement;
//     const stageBgEl = document.querySelector('.stage-bg') as HTMLElement;
//     if (! stageEl) {
//         return;
//     }
//     const preset = libraryStore.presets.find(obj => {
//         return obj.slug === presetName;
//     })
//     if (! preset) {
//         stageBgEl.style.backgroundColor = ``;
//         stageBgEl.style.backgroundImage = ``;
//         return;
//     }
//     stageBgEl.style.backgroundColor = preset.color;
//     if (preset.background) {
//         stageBgEl.style.backgroundImage = `url(${ preset.background })`;
//     }
// }

</script>
<template>
    <ConcertLayout :background-image="currentPreset.backgroundImage" @on-data-is-ready="onDataIsReady">
        <div class="relative flex flex-col h-full">
            <div class="absolute w-full grow-1 h-full flex justify-center items-center">
                <div class="aspect-video bg-black -mt-[10%] -ml-[4px] w-[42%] text">
                    <div class="h-full overflow-auto">
                        <StageVideoPlayer
                            v-if="currentVideo"
                            class="h-full w-full"
                            :video-id="currentVideo.source_vid"
                            :video-controller="videoController"
                        />
                    </div>
                </div>
            </div>
            <div v-if="currentPlaceSlug" class="stage-elements absolute w-full h-full overflow-hidden pointer-events-none">
                <Transition name="stage-elements-light">
                    <div v-show="!videoController.isPlaying">
                        <StageDecorationElement
                            v-for="element in libraryStore.places[currentPlaceSlug].stageElements"
                            :key="element"
                            :element="element"
                            mode="light"
                        />
                    </div>
                </Transition>
                <Transition name="stage-elements-dark">
                    <div v-show="videoController.isPlaying">
                        <StageDecorationElement
                            v-for="element in libraryStore.places[currentPlaceSlug].stageElements"
                            :key="element"
                            :element="element"
                            mode="dark"
                        />
                    </div>
                </Transition>
            </div>
            <div class="w-full absolute flex justify-between items-center py-5 px-8">
                <div class=""></div>
                <div class="flex space-x-2">
                    <div v-show="playlist.length">
                        <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                            Playlist
                            <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <!-- Dropdown menu -->
                        <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-[300px] dark:bg-gray-700">
                            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                <li
                                    v-for="item in playlist"
                                    class="px-5 py-1 flex space-x-2 hover:bg-gray-100 cursor-pointer">
                                    <img :src="item.source_thumbnail_url" class="h-[40px] rounded-md">
                                    <div class="">
                                        {{ item.title }}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <button
                        class="rounded-md border border-gray-300 bg-white bg-opacity-60 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        @click="videoController.videoToggle">
                        Pause / Play
                    </button>
                </div>
<!--                            <div class="grid grid-flow-col gap-4">-->
<!--                                <Select v-model="filters.style" name="Stil" :items="libraryStore.attributes.styles"></Select>-->
<!--                                <Select v-model="filters.genre" name="Genre" :items="libraryStore.attributes.genres"></Select>-->
<!--                                <Select v-model="filters.place" name="Veranstaltungsort" :items="libraryStore.attributes.places"></Select>-->
<!--                                <Select v-model="filters.season" name="Saison" :items="libraryStore.attributes.seasons"></Select>-->
<!--                            </div>-->
            </div>
        </div>
    </ConcertLayout>
</template>

<style scoped lang="scss">
    .stage-elements-light-enter-active {
        transition: all 0.2s 0s cubic-bezier(1, 0.5, 0.8, 1);
    }
    .stage-elements-light-leave-active {
        transition: all 1s 1s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .stage-elements-dark-enter-active,
    .stage-elements-dark-leave-active {
        transition: all 1s 0s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .stage-elements-dark-enter-from,
    .stage-elements-dark-leave-to,
    .stage-elements-light-enter-from,
    .stage-elements-light-leave-to {
        opacity: 0;
    }
</style>