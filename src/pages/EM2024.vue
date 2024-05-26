<script setup lang="ts">
import ConcertLayout from "@/layouts/ConcertLayout.vue";
import {computed, reactive, ref} from "vue";
import StageVideoPlayer from "@/components/frontend/StageVideoPlayer.vue";
import type {VideoController} from "@/types/VideoController";
import type {Video} from "@/types/Video";
import {useRouter} from "vue-router";
import StageNavigation from "@/components/frontend/StageNavigation.vue";
import {useLibrary} from "@/stores/library";
import type {Landscape} from "@/types/Landscape";

const dataIsReady = ref(false);

const router = useRouter();
const libraryStore = useLibrary();
const isMobile = ref(false);
const navigationComponent = ref();
let em2024Videos = ref<Video[]>([]);

const props = defineProps<{
    videoId?: string
}>();

const videoController = reactive({
    isPlaying: false,
    videoToggle: () => null,
    pause: () => null,
    play: () => null,
    navigatePrev: () => navigatePrev(),
    navigateNext: () => navigateNext()
} as VideoController);

const navigatePrev = () => {
    const currentVideoIndex = em2024Videos.value.findIndex(video => video.id === currentVideo.value?.id);
    if (currentVideoIndex === 0) {
        navigateToVideo(em2024Videos.value[em2024Videos.value.length - 1]);
    } else {
        navigateToVideo(em2024Videos.value[currentVideoIndex - 1]);
    }
}

const navigateNext = () => {
    const currentVideoIndex = em2024Videos.value.findIndex(video => video.id === currentVideo.value?.id);
    if (currentVideoIndex === em2024Videos.value.length - 1) {
        navigateToVideo(em2024Videos.value[0]);
    } else {
        navigateToVideo(em2024Videos.value[currentVideoIndex + 1]);
    }
}

const navigateToVideo = async (video: Video) => {
    await router.push({ params: { videoId: video.id } });
}

const currentVideo = computed(() : Video | null => {
    let videoId = props.videoId;
    if (em2024Videos.value.length === 0) {
        return null;
    }
    if ((! videoId || parseInt(videoId) === 0)) {
        videoId = em2024Videos.value[0].id;
    }
    return libraryStore.videos?.find((video: Video) => video.id === parseInt(videoId)) || null;
});

const currentLandscape = computed(() : Landscape => {
    return libraryStore.presets.em2024;
});

const backAction = () => {
    router.push({ name: 'index' });
}

const toggleMobile = (value: boolean) => {
    isMobile.value = value;
}

const onFrontendDataIsReady = async () => {
    em2024Videos.value = currentLandscape.value.videos_filter();
    navigationComponent.value?.onDataIsReady();
}

</script>

<template>
    <ConcertLayout
        :background-image="null"
        :background-image-dark="null"
        :is-dark="false"
        @on-data-is-ready="onFrontendDataIsReady"
        @toggle-mobile="toggleMobile">
        <div :style="{ fontSize: 'var(--font-size-base)' }">
            <div class="h-full w-full absolute">
                <img class="h-full w-full absolute" src="/em2024/stage.png" alt="">
                <RouterLink class="absolute top-[23%] left-[25%] z-10" :to="{ name: 'index' }">
                    <div class="relative text-[1.8em] h-[2em] flex items-center">
                        <div
                            class="
                                    left-[-15%]
                                    right-[-15%]
                                    top-[-5%]
                                    bottom-[-5%]
                                    absolute
                                    bg-[linear-gradient(45deg,_hsl(54.8,100%,77.3%)_0%,_hsl(33,_89%,_68%)_100%)]
                                    rounded-[12px_17px/5px_20px]
                                    transform-[skewX(0deg)_skewY(-2deg)]
                                    shadow-[3px_3px_5px_0_rgba(0,0,0,0.08)]">
                        </div>
                        <div class="relative">← Zur Chorwelt</div>
                    </div>
                </RouterLink>
                <button
                    class="absolute w-[16%] h-[3%] top-[64.5%] left-[42%] z-10"
                    @click="navigationComponent.showMenu()"></button>
            </div>
            <div v-if="dataIsReady" >

            </div>
        </div>
        <div v-if="currentVideo" class="absolute w-full grow-1 h-full flex justify-center items-center">
            <div class="frame aspect-video bg-black -mt-[13%] w-[31%] relative text">
                <div class="h-full">
                    <StageVideoPlayer
                        v-if="currentVideo"
                        class="h-full w-full"
                        :video-id="currentVideo?.source_vid"
                        :video-controller="videoController"
                    />
                </div>
            </div>
        </div>
        <!-- Stage Navigation -->
        <Transition name="navigation-wrapper">
            <StageNavigation
                v-if="currentVideo"
                ref="navigationComponent"
                :video-controller="videoController"
                :video-data="currentVideo"
                :is-mobile="isMobile"
                @back-action="backAction"
            />
        </Transition>
    </ConcertLayout>
</template>

<style scoped lang="postcss">

</style>