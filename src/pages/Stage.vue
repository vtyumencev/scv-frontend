<script setup lang="ts">
import { useStage } from '../stores/stage'
import { onMounted, onUnmounted, ref, reactive, watch, computed } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter, type RouteLocationNormalized } from 'vue-router';
import Select from '../components/Select.vue';
import type { PaginatedRecordsList } from '@/types/PaginatedRecordsList';
import type { Video } from '@/types/Video';

const stageStore = useStage();
const router = useRouter();
const route = useRoute();

const isStageWindowEnabled = ref(false);

const filters = reactive<Record<string, string>>({
    'style': route.query.style as string ?? '',
    'genre': route.query.genre as string ?? '' ,
    'place': route.query.place as string ?? '' ,
    'season': route.query.season as string ?? '' ,
});

const videos = ref<PaginatedRecordsList<Video[]>>();

const currentRoute = computed(() => route.query);

watch(filters,  (newFilters) => {
    const query = { ...route.query, ...newFilters };

    Object.keys(query).forEach(function(key) {
        if (!query[key]) {
            delete query[key];
        }
    });

    router.push({ query: query });
    applyFilters();
});

watch(() => route.query, async () => {
    Object.keys(filters).forEach(function(key) {
        filters[key] = route.query[key] as string ?? '';
    })
})

onMounted(() => {
    window.addEventListener('resize', () => stageSize());
    stageSize();
    applyStage(route.query.preset as string);
    stageStore.getAttributes();
    applyFilters();
});

onUnmounted(() => {
    window.removeEventListener('resize', () => stageSize())
});

onBeforeRouteUpdate((to: RouteLocationNormalized) => {
    const presetName = to.query.preset as string;
    applyStage(presetName);
})

const applyFilters = async () => {
    const response = await stageStore.getVideos();
    videos.value = response.data;
}

const applyStage = (presetName: string) : void => {
    const stageEl = document.querySelector('.stage') as HTMLElement;
    if (! stageEl) {
        return;
    }
    const preset = stageStore.presets.find(obj => {
        return obj.slug === presetName;
    })
    if (! preset) {
        stageEl.style.backgroundColor = ``;
        stageEl.style.backgroundImage = ``;
        isStageWindowEnabled.value = false;
        return;
    }
    isStageWindowEnabled.value = true;
    stageEl.style.backgroundColor = preset.color;
    if (preset.background) {
        stageEl.style.backgroundImage = `url(${ preset.background })`;
    }
}

const stageSize = () : void => {
    const stageWrapperEl = document.querySelector('.stage-wrapper') as HTMLElement;
    const stageEl = document.querySelector('.stage') as HTMLElement;
    if (! stageWrapperEl || ! stageEl) {
        return;
    }
    const ar = 16/9;
    const sw = stageWrapperEl.clientWidth;
    const ch = window.innerHeight;
    let clh = sw / ar;
    if (clh > ch) {
        clh = ch;
        stageEl.style.width = (clh * ar) + 'px';
    } else {
        stageEl.style.width = '';
    }
    stageEl.style.height = clh + 'px';
}

const getCurrentVideo = computed(() : string => {
    if (!videos.value) {
        return '';
    }
    return videos.value?.data.find((video) => video.id === parseInt(route.query.watch as string))?.source_vid ?? '';
});

</script>
<template>
    <div class="bg-white h-screen">
        <div class="stage-container max-w-7xl- mx-auto h-full">
            <div class="stage-container__wrapper stage-wrapper h-full flex justify-center items-center">
                <div class="stage w-full">
                    <div class="stage-presets" v-if="!isStageWindowEnabled">
                        <template v-for="preset in stageStore.presets">
                            <router-link :to="{ query: { 'preset': preset.slug } }" class="text-sm text-black">
                                {{ preset.name }}
                            </router-link>
                        </template>
                    </div>
                    <div v-else class="relative stage-inner flex flex-col h-full">
                        <div class="stage-body absolute w-full grow-1 h-full flex justify-center items-center">
                            <div class="aspect-video -mt-[10%] w-[42%] border-2 border-black bg-white">
                                <div class="h-full overflow-auto">
                                    <template v-if="route.query.watch">
                                        <iframe class="h-full w-[calc(100%+1px)]" :src="'https://www.youtube-nocookie.com/embed/' + getCurrentVideo + '?autoplay=1&controls=0'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                                    </template>
                                    <template v-else>
                                        <div class="sticky top-1 z-10 flex justify-center">
                                            <div class="grid grid-flow-col gap-5 py-2 px-5 bg-white bg-opacity-80 backdrop-blur-sm rounded-md">
                                                <button class="flex items-center">
                                                    <svg class="mr-1 w-3.5 h-3.5" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4 5.49683V18.5032C4 20.05 5.68077 21.0113 7.01404 20.227L18.0694 13.7239C19.384 12.9506 19.384 11.0494 18.0694 10.2761L7.01404 3.77296C5.68077 2.98869 4 3.95 4 5.49683Z" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                    Play
                                                </button>
                                                <button class="flex items-center">
                                                    <svg class="mr-1 w-4 h-4" fill="#000000" width="800px" height="800px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M237.65723,178.34277a8.00122,8.00122,0,0,1,0,11.31446l-24,24A8.00066,8.00066,0,0,1,200,208V191.98584a72.13911,72.13911,0,0,1-57.65332-30.13721L100.63379,103.4502A56.11029,56.11029,0,0,0,55.06445,80H32a8,8,0,0,1,0-16H55.06445a72.14126,72.14126,0,0,1,58.58887,30.15137l41.71289,58.39843A56.0996,56.0996,0,0,0,200,175.97168V160a8.00065,8.00065,0,0,1,13.65723-5.65723Zm-94.64356-71.36132a7.99621,7.99621,0,0,0,11.15918-1.86036l1.19336-1.67089A56.0996,56.0996,0,0,1,200,80.02832V96a8.00053,8.00053,0,0,0,13.65723,5.65723l24-24a8.00122,8.00122,0,0,0,0-11.31446l-24-24A8.00065,8.00065,0,0,0,200,48V64.01416a72.13911,72.13911,0,0,0-57.65332,30.13721l-1.19336,1.6709A7.9986,7.9986,0,0,0,143.01367,106.98145Zm-30.02734,42.0371a7.99642,7.99642,0,0,0-11.15918,1.86036l-1.19336,1.67089A56.11029,56.11029,0,0,1,55.06445,176H32a8,8,0,0,0,0,16H55.06445a72.14126,72.14126,0,0,0,58.58887-30.15137l1.19336-1.6709A7.9986,7.9986,0,0,0,112.98633,149.01855Z"/>
                                                    </svg>
                                                    Shuffle
                                                </button>
                                            </div>
                                        </div>
                                        <div class="p-3 grid grid-cols-2 gap-3">
                                            <router-link 
                                                v-for="video in videos?.data" :to="{ query: { ...currentRoute, watch: video.id } }"
                                                class="relative block">
                                                <img :src="video.source_thumbnail_url" class="block">
                                                <div class="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-black to-transparent"></div>
                                                <div class="absolute bottom-0 left-0 w-full text-[12px] leading-normal text-white px-3 py-3">
                                                    <div class="">{{ video.title }}</div>
                                                </div>
                                            </router-link>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="w-full absolute flex justify-between items-center py-5 px-8">
                            <router-link :to="{ query: { } }" class="rounded-md border border-gray-300 bg-white bg-opacity-60 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                Hauptmenü
                            </router-link>
                            <div class="grid grid-flow-col gap-4">
                                <Select name="Stil" :items="stageStore.attributes.styles" v-model="filters.style"></Select>
                                <Select name="Genre" :items="stageStore.attributes.genres" v-model="filters.genre"></Select>
                                <Select name="Veranstaltungsort" :items="stageStore.attributes.places" v-model="filters.place"></Select>
                                <Select name="Saison" :items="stageStore.attributes.seasons" v-model="filters.season"></Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .stage-container {
        &__wrapper {
            
        }
    }
    .stage {
        background-color: rgba($color: #fff, $alpha: 0.2);
        transition: background-color 0.2s, background-image 0.2s;
        background-size: cover;
        background-position: center;
        position: relative;
    }
    .stage-presets {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>