<script setup lang="ts">
import LibraryVideosLayout from "@/layouts/LibraryVideosLayout.vue";
import {useLibrary} from "@/stores/library";
import {computed, type PropType, ref, watch} from "vue";
import type {Preset} from "@/types/Preset";
import { useRoute, useRouter } from "vue-router";
import type {Choir} from "@/types/Choir";
import type {Video} from "@/types/Video";
import LibraryVideosSlider from "@/components/frontend/LibraryVideosSlider.vue";
import LibraryButton from "@/components/frontend/LibraryButton.vue";

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
    },
    videoId: {
        type: String,
        default: null
    }
});

const preset = ref<Preset>();
const choir = ref<Choir>();
const relatedVideos = ref<Video[]>([]);
const originalLibraryQuery = ref(route.query);

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

const selectedVideo = computed(() => {
    return relatedVideos.value.find((video) => {
        return video.id === parseInt(props.videoId);
    });
});

watch(selectedVideo, (value) => {
    if (value) document.title = value.title;
})

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
    <LibraryVideosLayout
        :background-img="preset?.backgroundImage"
        :backtrack-route="{ title: 'Mediathek', name: 'library-index', query: originalLibraryQuery }"
        filter-route-name="library-choirs-show"
        @on-data-is-ready="onDataIsReady">
        <template #sidebarContent>
            <h1 class="text-3xl mb-10 font-serif">{{ choir?.name }}</h1>
            <div class="space-y-4 font-light" v-html="choir?.description">
            </div>
            <a v-if="choir?.contact_website" :href="choir?.contact_website" target="_blank">
                <LibraryButton class="mt-5 text-black">
                    Zur Chorseite
                </LibraryButton>
            </a>
        </template>
        <template #sidebarInfo>
            <div class="space-y-8 font-light">
                <div class="text-lg">
                    {{ choir?.name }}
                </div>
                <div v-if="choir?.description">
                    <h5 class="text-lg">Über den Chor</h5>
                    <div v-html="choir?.description"></div>
                </div>
                <div v-if="choir?.direction">
                    <h5 class="text-lg">Chorleitung</h5>
                    <div>{{ choir?.direction }}</div>
                </div>
                <div v-if="choir?.contact_address">
                    <h5 class="text-lg">Adresse</h5>
                    <p class="whitespace-pre-wrap">{{ choir?.contact_address }}</p>
                </div>
                <div v-if="choir?.contact_phone">
                    <h5 class="text-lg">Telefonnumer</h5>
                    <div>
                        <a :href="'tel:' + choir?.contact_phone">
                            {{ choir?.contact_phone }}
                        </a>
                    </div>
                </div>
                <div v-if="choir?.contact_email">
                    <h5 class="text-lg">Mailadresse</h5>
                    <div>
                        <a :href="'mailto:' + choir?.contact_email">
                            {{ choir?.contact_email }}
                        </a>
                    </div>
                </div>
            </div>
        </template>
        <div class="">
            <LibraryVideosSlider :videos="relatedVideos" />
            <div v-if="selectedVideo" class="relative pb-[56.25%] mt-10">
                <iframe class="absolute w-full h-full" :src="'https://www.youtube.com/embed/' + selectedVideo?.source_vid + '?autoplay=1'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        </div>
    </LibraryVideosLayout>
</template>