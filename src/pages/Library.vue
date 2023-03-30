<script setup lang="ts">
import LibraryLayout from "@/layouts/LibraryLayout.vue";
import {useStorage} from "@vueuse/core";
import {onBeforeMount, watch, ref} from "vue";
import {onBeforeRouteLeave} from "vue-router";
import {useLibrary} from "@/stores/library";
import type {Video} from "@/types/Video";

const isDarkModeEnabled = useStorage('isDarkModeEnabled', false);

const relatedVideos = ref<Video[]>([]);

const library = useLibrary();

const onDataIsReady = () => {
    let videosCount = 0;
    relatedVideos.value = library.videos.sort(() => {
        return 0.5 - Math.random();
    });
}

const toggleShift = () => {
    isDarkModeEnabled.value = !isDarkModeEnabled.value;
}

onBeforeMount(() => {
    if (isDarkModeEnabled.value) {
        document.documentElement.classList.add('dark');
    }
});


watch(isDarkModeEnabled, (newValue) => {
    if (newValue) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

onBeforeRouteLeave(() => {
    document.documentElement.classList.remove('dark');
});

</script>

<template>
    <LibraryLayout @on-data-is-ready="onDataIsReady">
        <div class="">
            <img class="absolute mt-[-50px] w-[1000px] top-0 left-0 rotate-180 -scale-x-100" src="/images/mix/colorful-corner.png" alt="">
        </div>
        <div class="">
            <img class="absolute mt-[-50px] w-[1000px] bottom-0 right-0 -scale-x-100" src="/images/mix/colorful-corner.png" alt="">
        </div>
        <div class="relative max-w-site-container mx-auto pb-[120px]">
            <div class="flex justify-end sticky z-10 top-0">
                <div class="mt-5 mr-container-inline absolute w-[250px] flex items-center">
                    <img class="absolute ml-4 h-5" src="/icons/search-icon.svg" alt="">
                    <input class="bg-black transition border-0 text-white rounded-full pl-12 pr-5 w-full" placeholder="Suchen" type="text" />
                </div>
            </div>
            <div class="flex justify-end sticky mix-blend-difference z-10 top-0 mr-[280px]">
                <div class="mt-5 mr-container-inline absolute">
                    <button class="text-white" @click="toggleShift">
                        <img src="/icons/shift-icon.svg" alt="">
                    </button>
                </div>
            </div>
            <div class="px-5 pt-[200px] pl-library-left-full min-h-[700px]">
                <div class="flex dark:text-white transition">
                    <div class="w-[350px] mr-[50px]">
                        <h1 class="text-6xl mb-10">Mediathek</h1>
                        <div class="space-y-4">
                            <p>Wilkommen in unserer digitalen Mediathek! sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis?  Magnum Opus Maurenta!</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. ilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo lacus vel facilisis. </p>
                        </div>
                    </div>
                    <div class="w-full max-w-5xl">
                        <div v-if="relatedVideos.length" class="relative pb-[56.25%]">
                            <iframe class="absolute w-full h-full" :src="'https://www.youtube.com/embed/' + relatedVideos[0].source_vid + '?autoplay=1'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                        </div>
                        <div class="mt-10">
                            <h2 class="uppercase mb-2 text-black dark:text-white text-opacity-70 transition">Videos</h2>
                            <div v-if="relatedVideos.length" class="grid grid-cols-3 gap-10">
                                <div
                                    v-for="video in relatedVideos.slice(1, 10)"
                                    :key="video"
                                    class="relative aspect-video">
                                    <img :src="video.source_thumbnail_url" class="absolute top-0 w-full h-full" alt="">
                                    <div class="absolute bottom-0 w-full text-white bg-black bg-opacity-50 py-1 px-2">
                                        <div class="uppercase text-sm leading-4">
                                            {{ video.title }}
                                        </div>
                                        <div class="text-xs text-ellipsis overflow-hidden whitespace-nowrap w-full">
                                            Choir name
                                        </div>
                                    </div>
    <!--                                <router-link-->
    <!--                                    :to="{ name: 'preset-stage', params: { videoID: video.id } }"-->
    <!--                                    class="absolute top-0 left-0 w-full h-full"-->
    <!--                                />-->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </LibraryLayout>
</template>

<style scoped>
</style>