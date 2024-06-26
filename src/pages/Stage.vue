<script setup lang="ts">
import { type LandscapeNames, type PlacesNames, useLibrary } from '@/stores/library'
import {
    ref,
    reactive,
    computed,
    type PropType
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Video } from '@/types/Video';
import StageVideoPlayer from "@/components/frontend/StageVideoPlayer.vue";
import ConcertLayout from "@/layouts/ConcertLayout.vue";
import StageDecorationElement from "@/components/frontend/StageDecorationElement.vue";
import StageNavigation from "@/components/frontend/StageNavigation.vue";
import type { Place } from "@/types/Place";
import type { Landscape } from "@/types/Landscape";
import type { VideoController } from "@/types/VideoController";
import TextBoxPopup from "@/components/frontend/TextBoxPopup.vue";
import { useSettings } from "@/stores/settings";

const settings = useSettings();
const libraryStore = useLibrary();

const router = useRouter();
const route = useRoute();

const props = defineProps({
    presetName: {
        type: String as PropType<LandscapeNames>,
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

const isMobile = ref(false);
const dataIsReady = ref(false);
const navigationComponent = ref();
const textBoxIsOpen = ref(false);
const textBoxBodyText = ref('');

const videoID = computed(() => {
    return parseInt(props.videoID);
});

const videoController = reactive({
    isPlaying: false,
    videoToggle: () => null,
    pause: () => null,
    play: () => null,
    navigatePrev: () => navigatePrev(),
    navigateNext: () => navigateNext()
} as VideoController);

const onDataIsReady = async () => {
    if (currentPreset.value.has_no_enter_room !== true && ! currentVideo.value) {
        await router.replace({
            name: 'page-not-found',
            params: { pathMatch: route.path.substring(1).split('/')},
            query: route.query,
            hash: route.hash,
        });
        return;
    }
    dataIsReady.value = true;
    navigationComponent.value?.onDataIsReady();

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

const currentPreset = computed(() : Landscape => {
    return libraryStore.presets[props.presetName];
});

const currentPlace = computed(() : Place | null => {
    if (currentPreset.value.bound_place) {
        return currentPreset.value.bound_place;
    }
    if (! dataIsReady.value) {
        return null;
    }
    const placeSlug = libraryStore.attributes?.places.find(place => place.id === (currentVideo.value ? currentVideo.value.place_id : 0 ))?.slug;
    if (! placeSlug) {
        return null;
    }
    return libraryStore.places[placeSlug as PlacesNames] ?? null;
});

const currentVideo = computed(() : Video | undefined => {
    return libraryStore.videos?.find((video) => video.id === videoID.value) || undefined;
});

const navigatePrev = () => {
    const videos = currentPreset.value.videos_filter();
    const currentVideoIndex = videos.findIndex(video => video.id === videoID.value);
    if (currentVideoIndex === 0) {
        navigateToVideo(videos[videos.length - 1]);
    } else {
        navigateToVideo(videos[currentVideoIndex - 1]);
    }
}
const navigateNext = () => {
    const videos = currentPreset.value.videos_filter();
    const currentVideoIndex = videos.findIndex(video => video.id === videoID.value);
    if (currentVideoIndex === videos.length - 1) {
        navigateToVideo(videos[0]);
    } else {
        navigateToVideo(videos[currentVideoIndex + 1]);
    }
}

const navigateToVideo = async (video: Video) => {

    let place: Place;
    if (currentPreset.value.bound_place) {
        place = currentPreset.value.bound_place
    } else {
        const placeSlug = libraryStore.attributes?.places.find(place => place.id === video.place_id)?.slug;

        if (! placeSlug) {
            return null;
        }
        place = libraryStore.places[placeSlug as PlacesNames] ?? null;
    }

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

const background = computed(() => {

    let landscape = currentPreset.value as Landscape | null;

    if (! currentPreset.value.background_image) {
        if (! currentVideo.value) {
            return;
        }
        const choir = libraryStore.getChoirByID(currentVideo.value?.choir_id);

        if (!choir) {
            return;
        }

        landscape = libraryStore.getPresetByRegion(choir.region_id);
    }

    return {
        light: landscape?.background_image,
        dark: landscape?.background_image_dark,
    };
});

const toggleMobile = (value: boolean) => {
    isMobile.value = value;
}

const backAction = () => {
    if (currentPreset.value.has_no_enter_room) {
        router.push({ name: 'preset-stage', params: { presetName: props.presetName } });
    } else {
        router.push({ name: 'presets-show', params: { presetName: props.presetName } });
    }
};

const textBoxOpen = (text: string) => {
    textBoxBodyText.value = text;
    textBoxIsOpen.value = true;
}

const textBoxClose = () => {
    textBoxIsOpen.value = false;
}

</script>
<template>
    <ConcertLayout
        :background-image="background?.light"
        :background-image-dark="background?.dark"
        :is-dark="videoController.isPlaying"
        @on-data-is-ready="onDataIsReady"
        @toggle-mobile="toggleMobile">
        <div id="concert-view" class="relative flex flex-col h-full">
            <div class="absolute w-full grow-1 h-full flex justify-center items-center">
                <div class="aspect-video bg-black -mt-[10%] ml-[-11px] w-[42%] text">
                    <div class="h-full">
                        <StageVideoPlayer
                            v-if="currentVideo"
                            class="h-full w-full"
                            :video-id="currentVideo?.source_vid"
                            :video-controller="videoController"
                        />
                        <div
                            v-else
                            class="h-full w-full bg-white overflow-auto">
                            <div class="grid grid-cols-2 gap-2 p-3" style="font-size: var(--font-size-base, 16px);">
                                <div
                                    v-for="video in currentPreset.videos_filter()"
                                    :key="video.id"
                                    class="aspect-video relative">
                                    <img
                                        :src="video.source_thumbnail_url"
                                        class="absolute w-full h-full object-cover"
                                        alt="">
                                    <div class="absolute bottom-0 text-white font-serif bg-black px-2 py-1 bg-opacity-50 w-full">
                                        <div class="text-[1.8em] uppercase leading-none">{{ video.choir_name }}</div>
                                        <div class="text-[1.5em] leading-none">{{ video.title }}</div>
                                    </div>
                                    <router-link
                                        :to="{ params: { videoID: video.id } }"
                                        class="absolute top-0 left-0 w-full h-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="currentPlace" class="stage-elements absolute w-full h-full overflow-hidden pointer-events-none">
                <Transition name="stage-elements-light">
                    <div v-show="!videoController.isPlaying">
                        <StageDecorationElement
                            v-for="(element, index) in currentPlace.stageElements"
                            :key="index"
                            :element="element"
                            mode="light"
                        />
                    </div>
                </Transition>
                <Transition name="stage-elements-dark">
                    <div v-show="videoController.isPlaying">
                        <StageDecorationElement
                            v-for="(element, index) in currentPlace.stageElements"
                            :key="index"
                            :element="element"
                            mode="dark"
                        />
                    </div>
                </Transition>
            </div>
            <template v-if="currentPlace">
                <template v-for="(element, index) in currentPlace.stageElements">
                    <template v-if="element.textBoxTranslation">
                        <button
                            :key="index"
                            class="absolute"
                            :style="{
                                    'left': element.left + '%',
                                    'top': element.top + '%',
                                    'width': element.width + '%',
                                }"
                            @click="textBoxOpen(settings.translate(element.textBoxTranslation))">
                            <img class="opacity-0" :src="element.assets.light" alt="">
                        </button>
                    </template>
                </template>
            </template>
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
            <TextBoxPopup
                v-if="textBoxIsOpen"
                :body-text="textBoxBodyText"
                :is-mobile="isMobile"
                @close-window="textBoxClose" />
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

    .navigation-wrapper-enter-active,
    .navigation-wrapper-leave-active {
        transition: all 0.4s 0.4s;
    }

    .navigation-wrapper-enter-from,
    .navigation-wrapper-leave-to {
        transform: translateY(100%);
    }
</style>