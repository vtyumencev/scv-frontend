<script setup lang="ts">
import { watch, ref, type PropType, computed } from "vue";
import { useRoute } from "vue-router";
import { useLibrary, type LandscapeNames } from "@/stores/library";
import type { Video } from "@/types/Video";
import LibraryVideosSlider from "@/components/frontend/LibraryVideosSlider.vue";
import LibraryVideoPreview from "@/components/frontend/LibraryVideoPreview.vue";
import LibraryVideosLayout from "@/layouts/LibraryVideosLayout.vue";
import LibraryVideosSliderGrid from "@/components/frontend/LibraryVideosSliderGrid.vue";
import { useSettings } from "@/stores/settings";
import type { RouteLocationRaw } from "vue-router";
import { useFrontend } from "@/stores/frontend";
import LibraryVideoFilterNotFound from "@/components/frontend/LibraryVideoFilterNotFound.vue";

const route = useRoute();
const library = useLibrary();
const settings = useSettings();
const frontend = useFrontend();

type Query = Record<string, string>;

const filteredVideos = ref<Video[]>([]);
const dataIsReady = ref(false);

const props = defineProps({
    query: {
        type: Object as PropType<Query>,
        default: { } as object
    }
});

const onDataIsReady = () => {
    dataIsReady.value = true;
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

const seasonalVideos = computed(() => {
    const seasonName = settings.currentSeason.value as LandscapeNames;
    if (seasonName) {
        return library.presets[seasonName].videos_filter();
    }
    return [];
});

</script>

<template>
    <LibraryVideosLayout
        :query="query"
        :backtrack-route="{ title: settings.translations.main_page.value, name: 'index' } as RouteLocationRaw"
        @on-data-is-ready="onDataIsReady">
        <template #sidebarContent>
            <h1 class="text-6xl mb-10 font-serif">
                {{ settings.translations.library_title.value }}
            </h1>
            <div class="space-y-4 font-light">
                <p class="whitespace-pre-wrap">{{ settings.translations.library_description.value }}</p>
            </div>
        </template>
        <div v-if="isFilteredMode" class="h-full">
            <template v-if="filteredVideos.length">
                <h2 class="uppercase mb-2 text-black dark:text-white text-opacity-70 dark:text-opacity-70 transition">
                    Filter Ergebnisse
                </h2>
                <div
                        class="grid grid-cols-3"
                        :class="{ 'gap-[14px]': frontend.isMobile, 'gap-[38px]': !frontend.isMobile }">
                    <LibraryVideoPreview v-for="video in filteredVideos" :key="video.id" :video="video" />
                </div>
            </template>
            <LibraryVideoFilterNotFound v-else />
        </div>
        <div v-else>
            <div v-if="frontend.personalVideoCompilation.length" class="relative pb-[56.25%]">
                <iframe class="absolute w-full h-full" :src="'https://www.youtube.com/embed/' + frontend.personalVideoCompilation[0].source_vid + '?autoplay=1'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
            <div class="mt-10 relative">
                <h2 class="uppercase mb-2 text-black dark:text-white text-opacity-70 dark:text-opacity-70 transition">
                    Videos
                </h2>
                <LibraryVideosSliderGrid :videos="frontend.personalVideoCompilation.slice(0, 36)" :rows="3" />
                <button
                        ref="buttonNext"
                        class="absolute z-10 bottom-[-4px] left-[calc(50%_+_90px)] cursor-pointer"
                        title="Randomize"
                        @click="frontend.randomizePersonalVideoCompilation()">
                    <img class="h-[16px]" src="/images/icons/shuffle.svg" alt="">
                </button>
<!--                <div v-if="frontend.personalVideoCompilation.length" class="grid grid-cols-3 gap-10">-->
<!--                    <LibraryVideoPreview v-for="video in frontend.personalVideoCompilation.slice(1 + (currentPage - 1) * 9, 10 + (currentPage - 1) * 9)" :key="video" :video="video" />-->
<!--                </div>-->
<!--                <div v-if="frontend.personalVideoCompilation.length > 0" class="mt-4 space-x-1 flex justify-center">-->
<!--                    <LibraryPagination-->
<!--                        :current-page="currentPage"-->
<!--                        :total-pages="Math.ceil(frontend.personalVideoCompilation.length / 9)"-->
<!--                        :max-visible-buttons="9">-->
<!--                    </LibraryPagination>-->
<!--                </div>-->
            </div>
            <div v-if="seasonalVideos.length" class="mt-10">
                <h2 class="uppercase mb-2 text-black dark:text-white text-opacity-70 dark:text-opacity-70 transition">
                    Saisonales
                </h2>
                <LibraryVideosSlider :videos="seasonalVideos" />
            </div>
        </div>
    </LibraryVideosLayout>
</template>