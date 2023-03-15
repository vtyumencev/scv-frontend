<script setup lang="ts">
import ConcertLayout from "@/layouts/ConcertLayout.vue";
import { onBeforeMount, ref, type PropType, computed } from "vue";
import { useLibrary, type Presets } from "@/stores/library";
import { useRouter } from "vue-router";
import type { Preset } from "@/types/Preset";
import type { Video } from "@/types/Video";
import type { Choir } from "@/types/Choir";
import type { Attribute } from "@/types/Attribute";

const libraryStore = useLibrary();
const router = useRouter();

const props = defineProps({
    presetName: {
        type: String as PropType<Presets>,
        required: true
    }
});

const preset = ref<Preset>();

onBeforeMount(() => {
    if (!(props.presetName in libraryStore.presets)) {
        router.push({ name: 'page-not-found' });
    }

    preset.value = libraryStore.presets[props.presetName];
});

const relatedVideos = computed(() : Video[] => {
    return libraryStore.videos
        .filter(video => video.choir_id !== null)
        .filter(video => getChoirByVideo(video)?.region_id === currentRegion.value?.id);
});

const currentRegion = computed( () : Attribute | undefined => {
    if (! libraryStore.attributes.regions) {
        return undefined;
    }
    return libraryStore.attributes.regions.find(region => region.id === libraryStore.presets[props.presetName].source.id);
});

const getChoirByVideo = (video: Video) : Choir | undefined => {
    if (! video.choir_id) {
        return undefined;
    }
    return libraryStore.getChoirByID(video.choir_id) || undefined;
};


const onDataIsReady = () => {

}

</script>

<template>
    <ConcertLayout :background-image="preset?.backgroundImage" @on-data-is-ready="onDataIsReady">
        <div class="pointer-events-none">
            <img
                data-depth
                data-depth-strength-x="0.1"
                data-depth-strength-y="0"
                src="/public/presets/misc/Wegweiser.png"
                class="absolute top-[2%] left-[5%] w-[30%]"
                alt="">
            <img
                src="/public/presets/misc/Mauer.png"
                class="absolute bottom-0"
                alt="">
        </div>
        <div class="">
            <div
                data-depth
                data-depth-strength-x="0.1"
                data-depth-strength-y="0"
                class="absolute top-[28%] left-[7%] w-[9%] h-[9%]">
                <router-link
                    :to="{ name: 'index' }"
                    class="block -rotate-[13deg] h-full">
                </router-link>
            </div>
        </div>
        <div class="absolute right-[5%] top-0 h-full w-[65%] overflow-auto">
            <div class="grid grid-cols-3 gap-6 pt-[45%] pb-[20px] px-5">
                <div
                    v-for="video in relatedVideos"
                    :key="video"
                    class="relative">
                    <img :src="video.source_thumbnail_url" class="aspect-video object-cover" alt="">
                    <div class="font-serif mt-2">
                        <div class="text-sm">
                            {{ getChoirByVideo(video)?.name }}
                        </div>
                        <div class="uppercase text-md">
                            {{ video.title }}
                        </div>
                    </div>
                    <router-link
                        :to="{ name: 'stage', params: { videoID: video.id } }"
                        class="absolute top-0 left-0 w-full h-full"
                    />
                </div>
            </div>
        </div>
    </ConcertLayout>
</template>