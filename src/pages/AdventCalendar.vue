<script setup lang="ts">
import ConcertLayout from "@/layouts/ConcertLayout.vue";
import {computed, reactive, ref} from "vue";
import HighlightedRays from "@/components/frontend/HighlightedRays.vue";
import StageVideoPlayer from "@/components/frontend/StageVideoPlayer.vue";
import type {VideoController} from "@/types/VideoController";
import type {Video} from "@/types/Video";
import {useRouter} from "vue-router";
import StageNavigation from "@/components/frontend/StageNavigation.vue";
import {useLibrary} from "@/stores/library";
import type {Landscape} from "@/types/Landscape";

interface AdventDay {
    id: number,
    pos: number,
    dayIndex: number,
    video: null|Video,
    notesStreamPos: number,
    picture: {
        top: number,
        left: number,
        width: number,
    },
    active?: boolean,
}

const dataIsReady = ref(false);

const router = useRouter();
const libraryStore = useLibrary();
const isMobile = ref(false);
const adventDays = ref();
const navigationComponent = ref();
let adventVideos: Video[] = [];

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
    const currentVideoIndex = adventVideos.findIndex(video => video.id === currentVideo.value?.id);
    if (currentVideoIndex === 0) {
        navigateToVideo(adventVideos[adventVideos.length - 1]);
    } else {
        navigateToVideo(adventVideos[currentVideoIndex - 1]);
    }
}

const navigateNext = () => {
    const currentVideoIndex = adventVideos.findIndex(video => video.id === currentVideo.value?.id);
    if (currentVideoIndex === adventVideos.length - 1) {
        navigateToVideo(adventVideos[0]);
    } else {
        navigateToVideo(adventVideos[currentVideoIndex + 1]);
    }
}

const navigateToVideo = async (video: Video) => {
    await router.push({ params: { videoId: video.id } });
}

const currentVideo = computed(() : Video | null => {
    const videoId = props.videoId;
    if (! videoId || parseInt(videoId) === 0) {
        return null;
    }
    return libraryStore.videos?.find((video) => video.id === parseInt(videoId)) || null;
});

const currentLandscape = computed(() : Landscape => {
    return libraryStore.presets.advent;
});

const backAction = () => {
    router.push({ name: 'advent' });
}

const toggleMobile = (value: boolean) => {
    isMobile.value = value;
}

const closeVideo = () => {
    router.push({ name: 'advent' });
}

const adventDates = [
    {
        id: 20,
        dayIndex: 13,
        pos: 6,
        video: null as null|Video,
        picture: {
            top: 42.4,
            left: 26.3,
            width: 8,
        }
    },
    {
        id: 21,
        dayIndex: 10,
        pos: 6,
        notesStreamPos: 80,
        video: null as null|Video,
        picture: {
            top: 43.1,
            left: 61.8,
            width: 6.8,
        }
    },
    {
        id: 22,
        dayIndex: 4,
        pos: 7,
        video: null as null|Video,
        notesStreamPos: 80,
        picture: {
            top: 43.1,
            left: 69.8,
            width: 7,
        }
    },
    {
        id: 23,
        dayIndex: 24,
        pos: 5,
        video: null as null|Video,
        picture: {
            top: 46.1,
            left: 46.8,
            width: 7,
        }
    },
    {
        id: 13,
        dayIndex: 7,
        pos: 6,
        video: null as null|Video,
        picture: {
            top: 47.4,
            left: 21.2,
            width: 7.2,
        }
    },
    {
        id: 14,
        dayIndex: 1,
        pos: 5,
        video: null as null|Video,
        picture: {
            top: 51.2,
            left: 30.5,
            width: 8,
        }
    },
    {
        id: 15,
        dayIndex: 5,
        pos: 4,
        video: null as null|Video,
        picture: {
            top: 49.2,
            left: 37.4,
            width: 9.1,
        }
    },
    {
        id: 16,
        dayIndex: 17,
        pos: 3,
        notesStreamPos: 80,
        video: null as null|Video,
        picture: {
            top: 52.1,
            left: 46.5,
            width: 7.1,
        }
    },
    {
        id: 17,
        dayIndex: 20,
        pos: 4,
        notesStreamPos: 80,
        video: null as null|Video,
        picture: {
            top: 51.6,
            left: 55.1,
            width: 8,
        }
    },
    {
        id: 18,
        dayIndex: 22,
        pos: 5,
        notesStreamPos: 80,
        video: null as null|Video,
        picture: {
            top: 51.3,
            left: 66.2,
            width: 7.4,
        }
    },
    {
        id: 19,
        dayIndex: 18,
        pos: 6,
        video: null as null|Video,
        notesStreamPos: 80,
        picture: {
            top: 51.9,
            left: 74.1,
            width: 7.9,
        }
    },
    {
        id: 3,
        dayIndex: 3,
        pos: 5,
        video: null as null|Video,
        picture: {
            top: 60.6,
            left: 20,
            width: 8.4,
        }
    },
    {
        id: 2,
        dayIndex: 11,
        pos: 6,
        video: null as null|Video,
        picture: {
            top: 58.7,
            left: 14,
            width: 9.2,
        }
    },
    {
        id: 1,
        dayIndex: 15,
        pos: 7,
        notesStreamPos: 10,
        video: null as null|Video,
        picture: {
            top: 59,
            left: 8.7,
            width: 8,
        }
    },
    {
        id: 4,
        dayIndex: 19,
        video: null as null|Video,
        pos: 4,
        picture: {
            top: 60.7,
            left: 26.2,
            width: 9.2,
        }
    },
    {
        id: 5,
        dayIndex: 9,
        pos: 3,
        video: null as null|Video,
        picture: {
            top: 60.6,
            left: 34,
            width: 8.5,
        }
    },
    {
        id: 6,
        dayIndex: 21,
        pos: 2,
        video: null as null|Video,
        picture: {
            top: 59.2,
            left: 40.9,
            width: 8.5,
        }
    },
    {
        id: 7,
        dayIndex: 16,
        pos: 2,
        notesStreamPos: 80,
        video: null as null|Video,
        picture: {
            top: 61.5,
            left: 50.9,
            width: 9.1,
        }
    },
    {
        id: 8,
        dayIndex: 2,
        notesStreamPos: 80,
        video: null as null|Video,
        pos: 3,
        picture: {
            top: 60.7,
            left: 58.3,
            width: 7.9,
        }
    },
    {
        id: 9,
        dayIndex: 8,
        pos: 4,
        notesStreamPos: 80,
        video: null as null|Video,
        picture: {
            top: 61.6,
            left: 64.7,
            width: 8.6,
        }
    },
    {
        id: 10,
        dayIndex: 14,
        pos: 5,
        notesStreamPos: 80,
        video: null as null|Video,
        picture: {
            top: 61.6,
            left: 72,
            width: 7,
        }
    },
    {
        id: 11,
        dayIndex: 12,
        pos: 6,
        notesStreamPos: 80,
        video: null as null|Video,
        picture: {
            top: 58.6,
            left: 77.9,
            width: 9,
        }
    },
    {
        id: 12,
        dayIndex: 23,
        pos: 7,
        notesStreamPos: 80,
        video: null as null|Video,
        picture: {
            top: 58.7,
            left: 85.2,
            width: 8.7,
        }
    },
    {
        id: 24,
        dayIndex: 6,
        pos: 1,
        notesStreamPos: 40,
        video: null as null|Video,
        picture: {
            top: 67.4,
            left: 43.8,
            width: 11.1,
        }
    },
] as AdventDay[];

const onFrontendDataIsReady = async () => {
    const currentDate = new Date();

    adventVideos = currentLandscape.value.videos_filter()
        .filter((video) => {
            const videoDate = new Date(video.published_at);

            if (
                videoDate.getMonth() === 11 &&
                videoDate <= currentDate
            ) {
                return video;
            }
        })
        .sort(function(a, b) {
            return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
        });

    for (const video of adventVideos) {
        const videoDate = new Date(video.published_at);

        for (const adventDate of adventDates) {
            if (adventDate.dayIndex === videoDate.getDate()) {
                adventDate.video = video;

                if (
                    videoDate.getFullYear() === currentDate.getFullYear() &&
                    videoDate.getMonth() === currentDate.getMonth() &&
                    videoDate.getDate() === currentDate.getDate()
                ) {
                    adventDate.active = true;
                }
            }
            //adventDate.active = true;
        }

    }
    dataIsReady.value = true;

    navigationComponent.value?.onDataIsReady();

    setTimeout(() => {
        adventDays.value.classList.add('shown');
    }, 0);
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
                <img class="h-full w-full absolute" src="/advent/background.png" alt="">
                <div class="top-[1%] left-[2%] w-[28%] absolute">
                    <img class="h-full w-full" src="/advent/star.png" alt="">
                    <div class="absolute flex items-center justify-center w-full h-full top-0 left-0">
                        <div class="relative text-[1.8em]">
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
                            <div class="relative">Zur Chorwelt</div>
                        </div>
                    </div>
                    <RouterLink class="w-full h-full absolute top-0 left-0" :to="{ name: 'index' }"/>
                </div>
                <img
                    class="top-[2%] left-[1%] w-[98%] absolute pointer-events-none"
                    data-depth
                    data-depth-strength-x="0.15"
                    data-depth-strength-y="0.0"
                    src="/advent/decoration.png"
                    alt="">
                <img
                    class="top-[2%] left-[1%] w-[98%] absolute pointer-events-none"
                    data-depth
                    data-depth-strength-x="0.05"
                    data-depth-strength-y="0.0"
                    src="/advent/arch.png"
                    alt="">
                <img class="top-[54%] left-[5%] w-[90%] absolute" src="/advent/Podest.png" alt="">
                <img class="top-[0] left-[38.6%] w-[23%] absolute" src="/advent/orgel-new.png" alt="">
            </div>
            <div v-if="dataIsReady" ref="adventDays" class="advent-days">
                <div
                    v-for="(day, index) in adventDates"
                    :key="index"
                    :data-id="day.id"
                    :class="{'active': day.active ?? false}"
                    class="day absolute opacity-0 flex justify-center"
                    :style="{
                        '--pos': day.pos ?? 0,
                        top: day.picture.top + '%',
                        left: day.picture.left + '%',
                        width: day.picture.width + '%',
                        }">
                    <div class="date absolute top-[-13%] text-[1.5em]">
                        <div class="bg"></div>
                        <div class="relative">
                            {{ day.dayIndex }}. Dez.
                        </div>
                    </div>
                    <div v-if="day.active ?? false" class="notes-stream" :style="{ left: (day.notesStreamPos ?? 10) + '%' }">
                        <img src="/advent/music-note-1.svg" alt="">
                        <img src="/advent/music-note-2.svg" alt="">
                        <img src="/advent/music-note-1.svg" alt="">
                        <img src="/advent/music-note-2.svg" alt="">
                        <img src="/advent/music-note-1.svg" alt="">
                    </div>
                    <template v-if="day.video">
                        <div v-if="day.active ?? false" class="relative">
                            <img class="reveal-pic-cd" :src="'/advent/angels/' + (day.id) + '.png'" alt="" />
                            <div class="reveal-pic-ph overflow-hidden absolute top-0 left-0 right-0 bottom-0 h-[100%] rounded-[0_20%_20%_0]">
                                <img class="reveal-pic-bw absolute top-0 left-0 right-auto w-full h-auto max-w-none" :src="'/advent/angels/' + (day.id) + ' bw.png'" alt="" />
                            </div>
                        </div>
                        <img v-else class="pic" :src="'/advent/angels/' + (day.id) + '.png'" alt="" />
                        <router-link
                            class="link"
                            :to="{ params: { videoId: day.video.id } }">
                        </router-link>
                    </template>
                    <img v-else class="pic" :src="'/advent/angels/' + (day.id) + ' bw.png'" alt="" />
                </div>

                <div class="absolute top-[65%] left-[20%]">
                    <HighlightedRays />
                </div>
            </div>
        </div>
        <Transition name="video">
            <div v-if="currentVideo" class="absolute w-full grow-1 h-full flex justify-center items-center">
                <div class="bg-[rgb(0_9_36_/_82%)] bg-opacity-90 mix-blend-multiply absolute w-full h-full" @click="closeVideo"></div>
                <div class="frame aspect-video bg-black -mt-[1%] w-[69%] relative text">
                    <div class="h-full">
                        <StageVideoPlayer
                            v-if="currentVideo"
                            class="h-full w-full"
                            :video-id="currentVideo?.source_vid"
                            :video-controller="videoController"
                        />
                        <div class="top-[-41.8%] left-[-42.9%] w-[181.5%] absolute pointer-events-none">
                            <img class="w-full" src="/advent/frame-v2.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
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
    .day {
        transform: translateY(10px) scale(0.9);
        transform-origin: bottom;
        transition: 0.8s calc(var(--pos) * 0.07s) cubic-bezier(0.65, 0.05, 0.36, 1);
    }
    .date {
        pointer-events: none;
        transition: 0.2s;
        .bg {
            position: absolute;
            z-index: 0;
            top: -15%;
            bottom: -15%;
            right: -35%;
            left: -35%;
            background: linear-gradient(45deg, hsl(54.8, 100%, 77.3%) 0%, hsl(33, 89%, 68%) 100%);
            border-radius: 12px 17px/5px 20px;
            transform: skewX(0deg) skewY(-2deg);
            box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.08);
        }
    }
    .day:not(.active):not(:hover) .date {
        opacity: 0;
        transform: translateY(5%);
    }
    .shown .day {
        @apply absolute opacity-100 transform-none;
    }
    .day .link {
        @apply absolute top-0 left-0 w-full h-full;
    }
    .day .pic {
        pointer-events: none;
        width: 100%;
    }

    .reveal-pic-ph {
        transition: 0.6s 1.2s cubic-bezier(0.65, 0.05, 0.36, 1);
    }
    .shown .reveal-pic-ph {
        height: 0;
    }
    .shown .reveal-pic-cd {
        animation: glowing 3s 1.6s infinite;
    }

    .notes-stream {
        --stream-speed: 4;
        position: absolute;
        top: 8%;
        width: 10%;
        height: 10%;
        img {
            position: absolute;
            width: 100%;
            height: 100%;
            max-width: none;
            opacity: 0;
            &:nth-child(1) {
                animation: note-1 calc(var(--stream-speed) * 1s) infinite;
            }
            &:nth-child(2) {
                animation: note-2 calc(var(--stream-speed) * 1s) calc(var(--stream-speed) / 5 * 1s) infinite;
            }
            &:nth-child(3) {
                animation: note-3 calc(var(--stream-speed) * 1s) calc(var(--stream-speed) / 5 * 2s) infinite;
            }
            &:nth-child(4) {
                animation: note-4 calc(var(--stream-speed) * 1s) calc(var(--stream-speed) / 5 * 3s) infinite;
            }
            &:nth-child(5) {
                animation: note-5 calc(var(--stream-speed) * 1s) calc(var(--stream-speed) / 5 * 4s) infinite;
            }
        }
    }

    @keyframes note-1 {
        0% {
            opacity: 1;
        }
        80% {
            transform: translateY(-30px) rotate(-20deg);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 0;
        }
    }
    @keyframes note-2 {
        0% {
            opacity: 1;
        }
        60% {
            transform: translateY(-30px) translateX(10px) rotate(20deg);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 0;
        }
    }
    @keyframes note-3 {
        0% {
            opacity: 1;
        }
        80% {
            transform: translateY(-40px) rotate(-10deg);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 0;
        }
    }
    @keyframes note-4 {
        0% {
            opacity: 1;
        }
        80% {
            transform: translateY(-20px) translateX(-10px) rotate(-20deg);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 0;
        }
    }
    @keyframes note-5 {
        0% {
            opacity: 1;
        }
        90% {
            transform: translateY(-30px) translateX(30px) rotate(30deg);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 0;
        }
    }

    @keyframes glowing {
        0% {
            filter: none;
        }
        30% {
            filter: drop-shadow(0 0 40px rgb(217, 174, 65));
            transform: translateY(-7px) scale(1.05);
        }
        50% {
            filter: drop-shadow(0 0 40px rgb(217, 174, 65));
            transform: translateY(-7px) scale(1.05);
        }
        100% {
            filter: none;
        }
    }

    .video-enter-active,
    .video-leave-active {
        transition: all 0.5s ease-in-out;
    }

    .video-enter-from,
    .video-leave-to {
        opacity: 0;
    }

    .video-enter-active .frame,
    .video-leave-active .frame {
        transition: all 0.5s ease-in-out;
    }

    .video-leave-to .frame {
        transform: scale(0.98);
    }
    .video-enter-from .frame {
        transform: translateY(16px);
    }

    .navigation-wrapper-enter-active,
    .navigation-wrapper-leave-active {
        transition: all 0.4s 0.4s;
    }

    .navigation-wrapper-enter-from,
    .navigation-wrapper-leave-to {
        transform: translateY(100%);
    }
</style>