<script setup lang="ts">
import ConcertLayout from "@/layouts/ConcertLayout.vue";
import {computed, onMounted, reactive, ref, watch} from "vue";
import HighlightedRays from "@/components/frontend/HighlightedRays.vue";
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
const adventDays = ref();

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

}

const navigateNext = () => {

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
        pos: 6,
        video: null as null|Video,
        picture: {
            top: 43.1,
            left: 61.8,
            width: 6.8,
        }
    },
    {
        id: 22,
        pos: 7,
        video: null as null|Video,
        picture: {
            top: 43.1,
            left: 69.8,
            width: 7,
        }
    },
    {
        id: 24,
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
        pos: 3,
        video: null as null|Video,
        picture: {
            top: 52.1,
            left: 46.5,
            width: 7.1,
        }
    },
    {
        id: 17,
        pos: 4,
        video: null as null|Video,
        picture: {
            top: 51.6,
            left: 55.1,
            width: 8,
        }
    },
    {
        id: 18,
        pos: 5,
        video: null as null|Video,
        picture: {
            top: 51.3,
            left: 66.2,
            width: 7.4,
        }
    },
    {
        id: 19,
        pos: 6,
        video: null as null|Video,
        picture: {
            top: 51.9,
            left: 74.1,
            width: 7.9,
        }
    },
    {
        id: 3,
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
        pos: 7,
        video: null as null|Video,
        picture: {
            top: 59,
            left: 8.7,
            width: 8,
        }
    },
    {
        id: 4,
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
        pos: 2,
        video: null as null|Video,
        picture: {
            top: 61.5,
            left: 50.9,
            width: 9.1,
        }
    },
    {
        id: 8,
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
        pos: 4,
        video: null as null|Video,
        picture: {
            top: 61.6,
            left: 64.7,
            width: 8.6,
        }
    },
    {
        id: 10,
        pos: 5,
        video: null as null|Video,
        picture: {
            top: 61.6,
            left: 72,
            width: 7,
        }
    },
    {
        id: 11,
        pos: 6,
        video: null as null|Video,
        picture: {
            top: 58.6,
            left: 77.9,
            width: 9,
        }
    },
    {
        id: 12,
        pos: 7,
        video: null as null|Video,
        picture: {
            top: 58.7,
            left: 85.2,
            width: 8.7,
        }
    },
    {
        id: 23,
        pos: 1,
        video: null as null|Video,
        picture: {
            top: 67.4,
            left: 43.8,
            width: 11.1,
        }
    },
];

const onFrontendDataIsReady = async () => {
    const currentDate = new Date();

    currentLandscape.value.videos_filter().sort(function(a, b){
        return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
    });

    for (const video of currentLandscape.value.videos_filter()) {
        const videoDate = new Date(video.published_at);

        if (videoDate > currentDate) {
            continue;
        }

        if (videoDate.getMonth() !== 11) {
            continue;
        }

        for (const adventDate of adventDates) {
            if (adventDate.id === videoDate.getDate()) {
                adventDate.video = video;

                if (adventDate.id === 1) {
                    adventDate.active = true;
                }
            }
        }

    }
    //console.log(adventDates)
    //console.log(`${videoDate.getFullYear()}-${videoDate.getMonth() + 1}-${videoDate.getDate()}`)
    dataIsReady.value = true;


    setTimeout(() => {
        // adventDays.value.querySelectorAll('.day').forEach((dayEl: HTMLDivElement) => {
        // });
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
        <div class="h-full w-full absolute">
            <img class="h-full w-full absolute" src="/public/advent/background.png" alt="">
            <img class="top-[54%] left-[5%] w-[90%] absolute" src="/public/advent/Podest.png" alt="">
            <img class="top-[0] left-[38%] w-[24%] absolute" src="/public/advent/Orgel.png" alt="">
        </div>
        <div v-if="dataIsReady" ref="adventDays" class="advent-days">
            <div
                v-for="(day, index) in adventDates"
                :key="index"
                :data-id="day.id"
                :class="{'active': day.active ?? false}"
                class="day"
                :style="{
                    '--pos': day.pos ?? 0,
                    top: day.picture.top + '%',
                    left: day.picture.left + '%',
                    width: day.picture.width + '%',
                    }">
                <div class="date">
                    <div class="">
                        {{ day.id }}. Dec
                    </div>
                </div>
                <div v-if="day.active ?? false" class="notes-stream">
                    <img src="/public/advent/music-note-1.svg" alt="">
                    <img src="/public/advent/music-note-2.svg" alt="">
                    <img src="/public/advent/music-note-1.svg" alt="">
                    <img src="/public/advent/music-note-2.svg" alt="">
                    <img src="/public/advent/music-note-1.svg" alt="">
                </div>
                <template v-if="day.video">
                    <img class="pic" :src="'/public/advent/angels/' + (day.id) + '.png'" alt="" />
                    <router-link
                        class="link"
                        :to="{ params: { videoId: day.video.id } }">
                    </router-link>
                </template>
                <img v-else class="pic" :src="'/public/advent/angels/' + (day.id) + ' bw.png'" alt="" />
            </div>
            
            <div class="absolute top-[65%] left-[20%]">
                <HighlightedRays />
            </div>
        </div>
        <Transition name="video">
            <div v-if="currentVideo" class="absolute w-full grow-1 h-full flex justify-center items-center">
                <div class="bg-black bg-opacity-60 absolute w-full h-full" @click="closeVideo"></div>
                <div class="frame aspect-video bg-black -mt-[5%] w-[60%] relative text">
                    <div class="h-full">
                        <StageVideoPlayer
                            v-if="currentVideo"
                            class="h-full w-full"
                            :video-id="currentVideo?.source_vid"
                            :video-controller="videoController"
                        />
                        <div class="top-[-15%] left-[-15%] w-[123%] absolute pointer-events-none">
                            <img class="w-full" src="/public/advent/frame.png" alt="">
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
        @apply absolute opacity-0 flex justify-center;
        transform: translateY(10px) scale(0.9);
        transform-origin: bottom;
        transition: 0.8s calc(var(--pos) * 0.07s) cubic-bezier(0.65, 0.05, 0.36, 1);
        //transform: perspective(1000px) rotateX(90deg);
        //opacity: 0;
    }
    .date {
        font-size: 14px;
        @apply absolute top-[-13%];
        &:before {
            content: "";
            position: absolute;
            z-index: 0;
            top: -15%;
            bottom: -15%;
            right: -35%;
            left: -35%;
            //background: rgba(255, 232, 117, 1);
            background: linear-gradient(45deg, hsl(54.8, 100%, 77.3%) 0%, hsl(33, 89%, 68%) 100%);
            border-radius: 12px 17px/5px 20px;
            //border: 2px solid rgba(255, 232, 117, 1);
            transform: skewX(0deg) skewY(-2deg);
            box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.08);
        }
        div {
            position: relative;
        }
    }
    .day:not(.active) .date {
        opacity: 0;
    }
    .shown .day {
        @apply absolute opacity-100 transform-none;
    }
    .day .link {
        @apply absolute top-0 left-0 w-full h-full;
    }
    .day .pic {
        width: 100%;
    }
    .day.active .pic {
        animation: glowing 3s infinite;
    }

    .notes-stream {
        --stream-speed: 4;
        position: absolute;
        left: 10%;
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
            transform: translateY(-2px);
        }
        50% {
            filter: drop-shadow(0 0 40px rgb(217, 174, 65));
            transform: translateY(-2px);
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