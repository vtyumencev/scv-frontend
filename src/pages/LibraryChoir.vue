<script setup lang="ts">
import LibraryVideosLayout from "@/layouts/LibraryVideosLayout.vue";
import {useLibrary} from "@/stores/library";
import {computed, onBeforeMount, type PropType, ref, watch} from "vue";
import type {Preset} from "@/types/Preset";
import {useRoute, useRouter} from "vue-router";
import type {Choir} from "@/types/Choir";
import type {Video} from "@/types/Video";
import LibraryVideosSlider from "@/components/frontend/LibraryVideosSlider.vue";

const library = useLibrary();
const router = useRouter();
const route = useRoute();
type Query = Record<string, string>;

const props = defineProps({
    query: {
        type: Object as PropType<Query>,
        default: { } as object
    },
    choirId: {
        type: String,
        default: null
    }
});

const preset = ref<Preset>();
const choir = ref<Choir>();
const relatedVideos = ref<Video[]>([]);

const onDataIsReady = () => {

    choir.value = library.getChoirByID(parseInt(props.choirId)) ?? undefined;

    if (! choir.value) {
        router.replace({
            name: 'page-not-found',
            params: { pathMatch: route.path.substring(1).split('/')},
            query: route.query,
            hash: route.hash,
        });
        return;
    }

    preset.value = library.getPresetByRegion(choir.value.region_id) ?? undefined;

    relatedVideos.value = getChoirVideos();

    applyFilters(route.query as Query);
}


watch(() => props.query, (newValue) => {
    applyFilters(newValue);
});

const getChoirVideos = () => {
    return library.videos?.filter(video => {
        return video.choir_id === choir.value?.id;
    }) ?? [];
}
const applyFilters = (value: Query) => {

    relatedVideos.value = getChoirVideos();

    Object.entries(library.filters).forEach(filter => {

        const attr = value[filter[0]];

        if (! attr) {
            return;
        }

        const selectedAttr = attr.split(',');

        relatedVideos.value = relatedVideos.value.filter(video => {
            return filter[1].filterCallback(video, selectedAttr);
        });
    });
};

</script>
<template>
    <LibraryVideosLayout :background-img="preset?.backgroundImage" :backtrack-route="{ name: 'library' }" @on-data-is-ready="onDataIsReady">
        <template #sidebarContent>
            <h1 class="text-3xl mb-10 font-serif">{{ preset?.title_gen }} {{ choir?.name }}</h1>
            <div class="space-y-4 font-light">
                <p><b>Dresden singt und wir singen mit!</b> sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. </p>
            </div>
        </template>
        <div class="">
            <LibraryVideosSlider :videos="relatedVideos" />
            <div v-if="relatedVideos.length" class="relative pb-[56.25%] mt-10">
                <iframe class="absolute w-full h-full" :src="'https://www.youtube.com/embed/' + relatedVideos[0].source_vid + '?autoplay=0'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        </div>
    </LibraryVideosLayout>
</template>