<script setup lang="ts">
import { type PresetNames, useLibrary } from '@/stores/library'
import {
    ref,
    reactive,
    computed,
    type PropType
} from 'vue';
import { useRouter } from 'vue-router';
import type { Video } from '@/types/Video';
import StageVideoPlayer from "@/components/frontend/StageVideoPlayer.vue";
import ConcertLayout from "@/layouts/ConcertLayout.vue";
import StageDecorationElement from "@/components/frontend/StageDecorationElement.vue";
import StageNavigation from "@/components/frontend/StageNavigation.vue";
import type { Place } from "@/types/Place";

const libraryStore = useLibrary();

const router = useRouter();

const props = defineProps({
    presetName: {
        type: String as PropType<PresetNames>,
        default: null
    },
    videoID: {
        type: String,
        default: ''
    },
    playListIDs: {
        type: String,
        default: ''
    }
});

const dataIsReady = ref(false);

const videoID = computed(() => {
    return parseInt(props.videoID);
});

const videoController = reactive({
    isPlaying: false,
    videoToggle: () => undefined,
    pause: () => undefined,
    play: () => undefined,
    navigatePrev: () => navigatePrev(),
    navigateNext: () => navigateNext()
});

const onDataIsReady = async () => {
    if (!currentVideo.value) {
        await router.push({ name: 'page-not-found' });
        return;
    }
    dataIsReady.value = true;

    /**
     * Preloading the assets
     */
    const place = currentPlace.value;
    if (place) {
        await preloadPlaceAssets(place);
        document.getElementById('concert-view')?.classList.add('entered');
    } else {
        document.getElementById('concert-view')?.classList.add('entered');
    }
};

const preloadPlaceAssets = async (place: Place) => {
    let imagesToBeLoaded = [] as Array<string>;
    place.stageElements.forEach((element) => {
        if (element.assets.dark) {
            imagesToBeLoaded.push(element.assets.dark);
        }
        if (element.assets.light) {
            imagesToBeLoaded.push(element.assets.light);
        }
    });
    const images = imagesToBeLoaded.map(imageSrc => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imageSrc;
            img.onload = resolve;
            img.onerror = reject;
        });
    });
    await Promise
        .all(images)
        .then(() => undefined)
        .catch(error => {
            console.error("Some image(s) failed loading!");
            console.error(error.message)
        });
    return true;
}

const currentPreset = computed(() => {
    if (currentVideo.value) {
        //libraryStore.getChoirByID(currentVideo.value.choir_id);
    }
    return libraryStore.presets[props.presetName];
});


const currentVideo = computed(() : Video | undefined => {
    return libraryStore.videos?.find((video) => video.id === videoID.value) || undefined;
});


const navigatePrev = () => {
    const videos = currentPreset.value.videosFilter();
    const currentVideoIndex = videos.findIndex(video => video.id === videoID.value);
    if (currentVideoIndex === 0) {
        navigateToVideo(videos[videos.length - 1]);
    } else {
        navigateToVideo(videos[currentVideoIndex - 1]);
    }
}
const navigateNext = () => {
    const videos = currentPreset.value.videosFilter();
    const currentVideoIndex = videos.findIndex(video => video.id === videoID.value);
    if (currentVideoIndex === videos.length - 1) {
        navigateToVideo(videos[0]);
    } else {
        navigateToVideo(videos[currentVideoIndex + 1]);
    }
}

const navigateToVideo = async (video: Video) => {

    const placeSlug = libraryStore.attributes?.places.find(place => place.id === video.place_id)?.slug;
    if (! placeSlug) {
        return null;
    }
    const place = libraryStore.places[placeSlug] ?? null;

    document.getElementById('concert-view')?.classList.remove('entered');

    videoController.pause();

    await preloadPlaceAssets(place);

    await new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 500)
    });

    document.getElementById('concert-view')?.classList.add('entered');
    await router.push({ params: { videoID: video.id } });
}

const currentPlace = computed(() : Place | null => {
    if (! dataIsReady.value) {
        return null;
    }
    const placeSlug = libraryStore.attributes?.places.find(place => place.id === (currentVideo.value ? currentVideo.value.place_id : 0 ))?.slug;
    if (! placeSlug) {
        return null;
    }
    return libraryStore.places[placeSlug] ?? null;
});


const playlist = computed(() : Video[] => {
    if (!dataIsReady.value) {
        return [];
    }

    const playListRawIDs = props.playListIDs.split(',');

    return playListRawIDs
        .map(item => Number.parseInt(item))
        .filter(item => !isNaN(item))
        .map(item => libraryStore.videos?.find(video => video.id === item) as Video)
        .filter(item => item !== undefined);
});

</script>
<template>
    <ConcertLayout
        :background-image="currentPreset.backgroundImage"
        :background-image-dark="currentPreset.backgroundImageDark"
        :is-dark="videoController.isPlaying" @on-data-is-ready="onDataIsReady">
        <div id="concert-view" class="relative flex flex-col h-full">
            <div class="absolute w-full grow-1 h-full flex justify-center items-center">
                <div class="aspect-video bg-black -mt-[10%] ml-[-11px] w-[42%] text">
                    <div class="h-full overflow-auto">
                        <StageVideoPlayer
                            v-if="currentVideo"
                            class="h-full w-full"
                            :video-id="currentVideo.source_vid"
                            :video-controller="videoController"
                        />
                    </div>
                </div>
            </div>
            <div v-if="currentPlace" class="stage-elements absolute w-full h-full overflow-hidden pointer-events-none">
                <Transition name="stage-elements-light">
                    <div v-show="!videoController.isPlaying">
                        <StageDecorationElement
                            v-for="element in currentPlace.stageElements"
                            :key="element"
                            :element="element"
                            mode="light"
                        />
                    </div>
                </Transition>
                <Transition name="stage-elements-dark">
                    <div v-show="videoController.isPlaying">
                        <StageDecorationElement
                            v-for="element in currentPlace.stageElements"
                            :key="element"
                            :element="element"
                            mode="dark"
                        />
                    </div>
                </Transition>
            </div>
            <!-- Stage Navigation -->
            <StageNavigation
                :video-controller="videoController"
                :back-action="{ name: 'presets-show', params: { presetName: presetName } }"
                :video-data="currentVideo"
            />
            <!-- Stage Navigation -->
            <div class="w-full absolute flex justify-between items-center py-5 px-8">
                <div class=""></div>
                <div class="flex space-x-2">
                    <div v-show="playlist.length">
                        <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                            Playlist
                            <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <!-- Dropdown menu -->
                        <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-[300px] dark:bg-gray-700">
                            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                <li
                                    v-for="item in playlist"
                                    :key="item"
                                    class="px-5 py-1 flex space-x-2 hover:bg-gray-100 cursor-pointer">
                                    <img :src="item.source_thumbnail_url" class="h-[40px] rounded-md" alt="">
                                    <div class="">
                                        {{ item.title }}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="transition-bg pointer-events-none absolute top-0 left-0 w-full h-full opacity-100 bg-white z-[100]"></div>
        </div>
    </ConcertLayout>
</template>

<style scoped lang="scss">

    #concert-view {
        .transition-bg {
            transition: 0.5s linear;
        }

        &.entered {
            .transition-bg {
                opacity: 0;
            }
        }
    }

    .stage-elements-light-enter-active {
        transition: all 0.2s 0s cubic-bezier(1, 0.5, 0.8, 1);
    }
    .stage-elements-light-leave-active {
        transition: all 1s 1s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .stage-elements-dark-enter-active,
    .stage-elements-dark-leave-active {
        transition: all 1s 0s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .stage-elements-dark-enter-from,
    .stage-elements-dark-leave-to,
    .stage-elements-light-enter-from,
    .stage-elements-light-leave-to {
        opacity: 0;
    }
</style>