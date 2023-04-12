<script setup lang="ts">
import ConcertLayout from "@/layouts/ConcertLayout.vue";
import {onBeforeMount, ref, type PropType, computed, onMounted} from "vue";
import { useLibrary, type PresetNames } from "@/stores/library";
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router";
import type { Preset } from "@/types/Preset";
import type { Video } from "@/types/Video";
import type { Choir } from "@/types/Choir";
import type { Attribute } from "@/types/Attribute";

const libraryStore = useLibrary();
const router = useRouter();
const route = useRoute();

const props = defineProps({
    presetName: {
        type: String as PropType<PresetNames>,
        required: true
    }
});

const preset = ref<Preset>();

onBeforeMount(() => {
    if (!(props.presetName in libraryStore.presets)) {
        router.replace({
            name: 'page-not-found',
            params: { pathMatch: route.path.substring(1).split('/')},
            query: route.query,
            hash: route.hash,
        });
        return;
    }

    preset.value = libraryStore.presets[props.presetName];

    if (preset.value?.has_no_enter_room) {

    }
});

onMounted(() => {
    document.getElementById('preset-view')?.classList.add('entered');
});

const relatedVideos = computed(() : Video[] => {
    if (! libraryStore.videos) {
        return [];
    }

    const currentPreset = preset.value;
    if (currentPreset === undefined) {
        return [];
    }

    return currentPreset.videosFilter();
});

const getChoirByVideo = (video: Video) : Choir | undefined => {
    if (! video.choir_id) {
        return undefined;
    }
    return libraryStore.getChoirByID(video.choir_id) || undefined;
};

onBeforeRouteLeave(async () => {
    document.getElementById('preset-view')?.classList.remove('entered');
    // await new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve(true);
    //     }, 1000);
    // });
});

</script>

<template>
    <ConcertLayout :background-image="preset?.backgroundImage">
        <div id="preset-view">
            <div class="pointer-events-none">
                <div id="decoration-wegweiser-image">
                    <img
                        data-depth
                        data-depth-strength-x="0.1"
                        data-depth-strength-y="0"
                        src="/public/presets/misc/Wegweiser.png"
                        class="absolute top-[2%] left-[5%] w-[30%]"
                        alt="">
                </div>
                <img
                    id="decoration-wall-image"
                    src="/public/presets/misc/Mauer.png"
                    class="absolute bottom-0"
                    alt="">
                <img
                    id="decoration-automat-image"
                    src="/public/presets/misc/Automat.png"
                    class="absolute bottom-0 right-0 w-[75%]"
                    alt="">
            </div>
            <div class="">
                <div
                    data-depth
                    data-depth-strength-x="0.1"
                    data-depth-strength-y="0"
                    class="absolute top-[28%] left-[7%] w-[9%] h-[9%]">
                    <router-link
                        :to="{ name: 'index', hash: '#desk' }"
                        class="block -rotate-[13deg] h-full">
                    </router-link>
                </div>
            </div>
            <div id="video-explorer" class="absolute right-[8%] bottom-0 h-[47%] w-[64%] overflow-auto">
                <div v-if="relatedVideos.length" class="grid grid-cols-3 gap-6 pb-[20px] px-5">
                    <div
                        v-for="video in relatedVideos"
                        :key="video"
                        class="relative">
                        <img :src="video.source_thumbnail_url" class="aspect-video object-cover" alt="">
                        <div class="font-serif mt-2">
                            <div class="text-xs text-ellipsis overflow-hidden whitespace-nowrap w-full">
                                {{ getChoirByVideo(video)?.name }}
                            </div>
                            <div class="uppercase text-sm">
                                {{ video.title }}
                            </div>
                        </div>
                        <router-link
                            :to="{ name: 'preset-stage', params: { videoID: video.id } }"
                            class="absolute top-0 left-0 w-full h-full"
                        />
                    </div>
                </div>
                <div v-else class="font-serif w-full h-full flex justify-center items-center">
                    <div class="">There's no videos yet</div>
                </div>
            </div>
            <div class="transition-bg pointer-events-none absolute top-0 left-0 w-full h-full opacity-100 bg-white"></div>
        </div>
    </ConcertLayout>
</template>
<style scoped lang="scss">
#preset-view {
    .transition-bg {
        transition: 1s linear;
    }
    &.entered {
        .transition-bg {
            opacity: 0;
        }
    }
    //#decoration-automat-image {
    //    transition: 2.2s 0.2s;
    //}
    //#decoration-wegweiser-image {
    //    transition: 2s;
    //    transform: translateY(0);
    //}
    //#video-explorer {
    //    transition: 2.2s 0.2s;
    //}
    //#decoration-wall-image {
    //    transition: 1.5s 0.3s;
    //}
    //&.leave {
    //    #decoration-wall-image,
    //    #video-explorer,
    //    #decoration-wegweiser-image,
    //    #decoration-automat-image {
    //        transform: translateY(90vh);
    //    }
    //}
}
</style>