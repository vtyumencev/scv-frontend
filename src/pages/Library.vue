<script setup lang="ts">
import {watch, ref, type PropType, computed} from "vue";
import {useLibrary} from "@/stores/library";
import type {Video} from "@/types/Video";
import LibraryVideoPreview from "@/components/frontend/LibraryVideoPreview.vue";
import LibraryVideosLayout from "@/layouts/LibraryVideosLayout.vue";
import {useRoute} from "vue-router";
import LibraryVideosSlider from "@/components/frontend/LibraryVideosSlider.vue";

type Query = Record<string, string>;

const relatedVideos = ref<Video[]>([]);
const filteredVideos = ref<Video[]>([]);
const dataIsReady = ref(false);

const route = useRoute();

const library = useLibrary();

const props = defineProps({
    query: {
        type: Object as PropType<Query>,
        default: { } as object
    }
});

const onDataIsReady = () => {
    dataIsReady.value = true;
    relatedVideos.value = library.videos?.sort(() => {
        return 0.5 - Math.random();
    }) ?? [];
    applyFilters(route.query as Query);
};

watch(() => props.query, (newValue) => {
    applyFilters(newValue);
});

const applyFilters = (value: Query) => {

    filteredVideos.value = library.videos ?? [];

    Object.entries(library.filters).forEach(filter => {

        const attr = value[filter[0]];

        if (! attr) {
            return;
        }

        const selectedAttr = attr.split(',');

        filteredVideos.value = filteredVideos.value.filter(video => {
            return filter[1].filterCallback(video, selectedAttr);
        });
    });
};

const isFilteredMode = computed(() => {
    return Object.keys(props.query).length !== 0;
});

</script>

<template>
    <LibraryVideosLayout :query="query" @on-data-is-ready="onDataIsReady">
        <template #sidebarContent>
            <h1 class="text-6xl mb-10 font-serif">Mediathek</h1>
            <div class="space-y-4 font-light">
                <p>Wilkommen in unserer digitalen Mediathek! sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis?  Magnum Opus Maurenta!</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. ilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo lacus vel facilisis. </p>
            </div>
        </template>
        <div v-if="isFilteredMode">
            <div v-if="filteredVideos.length" class="relative pb-[56.25%]">
                <iframe class="absolute w-full h-full" :src="'https://www.youtube.com/embed/' + filteredVideos[0].source_vid + '?autoplay=1'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
            <div class="mt-10">
                <h2 class="uppercase mb-2 text-black dark:text-white text-opacity-70 dark:text-opacity-70 transition">
                    Filter Ergebnisse
                </h2>
                <div v-if="filteredVideos.length" class="grid grid-cols-3 gap-10">
                    <LibraryVideoPreview v-for="video in filteredVideos" :key="video" :video="video" />
                </div>
                <div v-else>
                    Videos not found
                </div>
            </div>
        </div>
        <div v-else>
            <div v-if="relatedVideos.length" class="relative pb-[56.25%]">
                <iframe class="absolute w-full h-full" :src="'https://www.youtube.com/embed/' + relatedVideos[0].source_vid + '?autoplay=1'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
            <div class="mt-10">
                <h2 class="uppercase mb-2 text-black dark:text-white text-opacity-70 dark:text-opacity-70 transition">
                    Videos
                </h2>
                <div v-if="relatedVideos.length" class="grid grid-cols-3 gap-10">
                    <LibraryVideoPreview v-for="video in relatedVideos.slice(1, 10)" :key="video" :video="video" />
                </div>
            </div>
            <div class="mt-10">
                <h2 class="uppercase mb-2 text-black dark:text-white text-opacity-70 dark:text-opacity-70 transition">
                    Saisonales
                </h2>
                <LibraryVideosSlider :videos="relatedVideos.slice(10, 20)" />
            </div>
        </div>
    </LibraryVideosLayout>
</template>