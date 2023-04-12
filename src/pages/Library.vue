<script setup lang="ts">
import { watch, ref, type PropType, computed } from "vue";
import { useRoute } from "vue-router";
import { useLibrary } from "@/stores/library";
import type { Video } from "@/types/Video";
import LibraryVideosSlider from "@/components/frontend/LibraryVideosSlider.vue";
import LibraryVideoPreview from "@/components/frontend/LibraryVideoPreview.vue";
import LibraryVideosLayout from "@/layouts/LibraryVideosLayout.vue";
import LibraryPagination from "@/components/frontend/LibraryPagination.vue";
import LibraryVideosSliderGrid from "@/components/frontend/LibraryVideosSliderGrid.vue";

const route = useRoute();
const library = useLibrary();

type Query = Record<string, string>;

const filteredVideos = ref<Video[]>([]);
const dataIsReady = ref(false);
const currentPage = computed(() => {
    return parseInt(route.query.page + "") || 1;
});

const props = defineProps({
    query: {
        type: Object as PropType<Query>,
        default: { } as object
    }
});

const onDataIsReady = () => {
    dataIsReady.value = true;
    if (library.relatedVideos.length === 0) {
        library.relatedVideos = library.videos?.sort(() => {
            return 0.5 - Math.random();
        }) ?? [];
    }
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
    //return false;
    return Object.keys(props.query).length !== 0;
});

</script>

<template>
    <LibraryVideosLayout
        :query="query"
        :backtrack-route="{ title: 'Startseite', name: 'index' }"
        @on-data-is-ready="onDataIsReady">
        <template #sidebarContent>
            <h1 class="text-6xl mb-10 font-serif">Mediathek</h1>
            <div class="space-y-4 font-light">
                <p>Wilkommen in unserer digitalen Mediathek! sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis?  Magnum Opus Maurenta!</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. ilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo lacus vel facilisis. </p>
            </div>
        </template>
        <div v-if="isFilteredMode" class="h-full">
            <h2 class="uppercase mb-2 text-black dark:text-white text-opacity-70 dark:text-opacity-70 transition">
                Filter Ergebnisse
            </h2>
            <div v-if="filteredVideos.length" class="grid grid-cols-3 gap-10">
                <LibraryVideoPreview v-for="video in filteredVideos" :key="video" :video="video" />
            </div>
            <div v-else class="mt-5">
                <div class="px-10 py-5 border border-black dark:border-white text-dark dark:text-white border-opacity-20 dark:border-opacity-20 text-center transition">
                    <div class="text-lg">Videos not found</div>
                    <div class="">Try to <router-link class="text-theme-alpha" :to="{ query: { } }">reset filters</router-link>.</div>
                </div>
            </div>
        </div>
        <div v-else>
            <div v-if="library.relatedVideos.length" class="relative pb-[56.25%]">
                <iframe class="absolute w-full h-full" :src="'https://www.youtube.com/embed/' + library.relatedVideos[0].source_vid + '?autoplay=1'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
            <div class="mt-10">
                <h2 class="uppercase mb-2 text-black dark:text-white text-opacity-70 dark:text-opacity-70 transition">
                    Videos
                </h2>
                <LibraryVideosSliderGrid :videos="[...library.relatedVideos.slice(1), ...library.relatedVideos.slice(1), ...library.relatedVideos.slice(1), ...library.relatedVideos.slice(1), ...library.relatedVideos.slice(1), ...library.relatedVideos.slice(1)]" :rows="3" />
<!--                <div v-if="library.relatedVideos.length" class="grid grid-cols-3 gap-10">-->
<!--                    <LibraryVideoPreview v-for="video in library.relatedVideos.slice(1 + (currentPage - 1) * 9, 10 + (currentPage - 1) * 9)" :key="video" :video="video" />-->
<!--                </div>-->
<!--                <div v-if="library.relatedVideos.length > 0" class="mt-4 space-x-1 flex justify-center">-->
<!--                    <LibraryPagination-->
<!--                        :current-page="currentPage"-->
<!--                        :total-pages="Math.ceil(library.relatedVideos.length / 9)"-->
<!--                        :max-visible-buttons="9">-->
<!--                    </LibraryPagination>-->
<!--                </div>-->
            </div>
            <div class="mt-10">
                <h2 class="uppercase mb-2 text-black dark:text-white text-opacity-70 dark:text-opacity-70 transition">
                    Saisonales
                </h2>
                <LibraryVideosSlider :videos="library.relatedVideos.slice(10, 20)" />
            </div>
        </div>
    </LibraryVideosLayout>
</template>