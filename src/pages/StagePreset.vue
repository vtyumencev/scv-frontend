<script setup lang="ts">
import ConcertLayout from "@/layouts/ConcertLayout.vue";
import { onBeforeMount, ref, type PropType, computed, onMounted } from "vue";
import { useLibrary, type LandscapeNames } from "@/stores/library";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import type { Landscape } from "@/types/Landscape";
import type { Video } from "@/types/Video";
import type { Choir } from "@/types/Choir";
import Simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

const libraryStore = useLibrary();
const router = useRouter();
const route = useRoute();

const props = defineProps({
    presetName: {
        type: String as PropType<LandscapeNames>,
        required: true
    }
});

const preset = ref<Landscape>();
const isMobile = ref(false);

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

    return currentPreset.videos_filter();
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

const toggleMobile = (value: boolean) => {
    isMobile.value = value;
}

</script>

<template>
    <ConcertLayout :background-image="preset?.background_image" @toggle-mobile="toggleMobile">
        <div id="preset-view">
            <div class="pointer-events-none">
                <div id="decoration-wegweiser-image">
                    <img
                        data-depth
                        data-depth-strength-x="0.1"
                        data-depth-strength-y="0"
                        src="/images/presets/misc/WegweiserV2.png"
                        class="absolute top-[2%] left-[5%] w-[30%]"
                        alt="">
                </div>
                <img
                    id="decoration-wall-image"
                    src="/images/presets/misc/Mauer.png"
                    class="absolute bottom-0"
                    alt="">
                <img
                    id="decoration-automat-image"
                    src="/images/presets/misc/Automat.png"
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
                <div
                        data-depth
                        data-depth-strength-x="0.1"
                        data-depth-strength-y="0"
                        class="absolute top-[19%] left-[18%] w-[14%] h-[8%]">
                    <router-link
                            :to="{ name: 'library-index' }"
                            class="block -rotate-[9deg] h-full">
                    </router-link>
                </div>
            </div>
            <Simplebar id="video-explorer" class="absolute right-[8%] bottom-0 h-[47%] w-[64%]">
                <div
                        v-if="relatedVideos.length"
                        class="grid gap-[2em] pb-[20px] px-[2em]"
                        :class="{
                            'grid-cols-2': isMobile,
                            'grid-cols-3': !isMobile,
                        }"
                        style="font-size: var(--font-size-base);">
                    <div
                        v-for="video in relatedVideos"
                        :key="video"
                        class="relative">
                        <div class="relative pb-[56.25%]">
                            <img
                                :src="video.source_thumbnail_url"
                                 class="absolute w-full h-full object-cover"
                                alt="">
                        </div>
                        <div class="font-serif mt-2">
                            <div class="text-[2em] text-ellipsis overflow-hidden whitespace-nowrap w-full">
                                {{ getChoirByVideo(video)?.name }}
                            </div>
                            <div class="uppercase text-[2em]">
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
            </Simplebar>
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