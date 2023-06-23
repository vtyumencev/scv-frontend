<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import LibraryLayout from "@/layouts/LibraryLayout.vue";
import { onBeforeMount, ref, watch } from "vue";
import { onBeforeRouteLeave, type RouteLocationRaw, useRoute } from "vue-router";
import LibraryFilter from "@/components/frontend/LibraryFilter.vue";
import { useFuse } from "@vueuse/integrations/useFuse";
import { useLibrary } from "@/stores/library";
import LibraryVideoPreview from "@/components/frontend/LibraryVideoPreview.vue";
import type { Video } from "@/types/Video";
import { useFrontend } from "@/stores/frontend";

defineProps<{
    backgroundImg?: string | null,
    backtrackRoute: RouteLocationRaw,
    filterRouteName?: string
}>();

const isDarkModeEnabled = useStorage('isDarkModeEnabled', false);
const dataIsReady = ref(false);
const route = useRoute();
const isFilterSelectorShown = ref(!!Object.entries(route.query).length);
const isInfoSelectorShown = ref(false);
const searchInput = ref('');

const library = useLibrary();
const frontend = useFrontend();

const { results, fuse } = useFuse(searchInput, [] as Video[], {
    fuseOptions: {
        keys: [ "title", "composer", "choir_name" ]
    }
});

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

const onDataIsReady = () => {
    fuse.value.setCollection([...library.videos]);
    dataIsReady.value = true;
};

</script>

<template>
    <LibraryLayout @on-data-is-ready="onDataIsReady">
        <div class="">
            <img class="absolute mt-[-50px] w-[1000px] top-0 left-0 rotate-180 -scale-x-100" src="/images/mix/colorful-corner.png" alt="">
        </div>
        <div class="">
            <img class="absolute mt-[-50px] w-[1000px] bottom-0 right-0 -scale-x-100" src="/images/mix/colorful-corner.png" alt="">
        </div>
        <div v-if="backgroundImg" class="absolute w-full h-full">
            <div class="overflow-hidden h-full flex items-end">
                <img class="block w-full mb-[-20%] opacity-10 dark:mix-blend-multiply dark:opacity-70 transition" :src="backgroundImg" alt="">
            </div>
        </div>
        <div class="relative max-w-site-container mx-auto pb-[120px]">
            <div class="flex justify-end sticky z-10 xl:top-0">
                <div class="mt-5 mr-container-library-inline absolute w-[250px] flex items-center">
                    <img class="absolute ml-4 h-5" src="/images/icons/search-icon.svg" alt="">
                    <input
                            v-model="searchInput"
                            class="focus:ring-theme-alpha bg-black transition border-0 text-white rounded-full pl-12 pr-10 py-2 w-full"
                            placeholder="Suchen"
                            type="text" />
                    <Transition name="search-clear-button">
                        <button
                                v-if="searchInput.length"
                                class="ml-3 text-theme-alpha uppercase absolute right-[10px]"
                                @click="searchInput = ''">
                                    <svg class="w-7 h-7 rotate-45" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                                    </svg>
                        </button>
                    </Transition>
                </div>
            </div>
            <div class="flex justify-end sticky mix-blend-difference z-10 xl:top-0 mr-container-library-inline">
                <div class="mt-5 mr-[280px] absolute">
                    <button class="text-white" @click="toggleShift">
                        <img class="h-[40px]" src="/images/icons/shift-icon.svg" alt="">
                    </button>
                </div>
            </div>
            <div class="pt-[200px] px-container-library-inline min-h-[700px]">
                <div v-if="searchInput">
                    <div class="max-w-5xl mx-auto">
                        <div class="uppercase mb-5 text-center">
                            <div class="text-black dark:text-white text-opacity-70 dark:text-opacity-70 transition">Suchergebnis für</div>
                            <div class="text-2xl text-black dark:text-white transition">{{ searchInput }}</div>
                        </div>
                        <div
                                class="grid grid-cols-3 gap-10"
                                :class="{ 'gap-[14px]': frontend.isMobile, 'gap-[38px]': !frontend.isMobile }">
                            <LibraryVideoPreview v-for="video in results" :key="video" :video="video.item" />
                        </div>
                    </div>
                </div>
                <div v-else class="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,_4fr)] gap-y-5 gap-x-16 dark:text-white transition">
                    <div class="">
                        <div class="">
                            <slot name="sidebarContent"></slot>
                        </div>
                        <div class="mt-10 space-y-5">
                            <div>
                                <button class="flex items-center uppercase" @click="isFilterSelectorShown = !isFilterSelectorShown">
                                    <span class="relative">
                                        <img class="mr-4 w-7" src="/images/icons/library.svg" alt="">
                                        <img class="absolute left-0 top-0 opacity-0 dark:opacity-100 transition" src="/images/icons/library-white.svg" alt="">
                                    </span>
                                    <span>Filtern</span>
                                </button>
                                <Transition name="filter">
                                    <LibraryFilter v-if="isFilterSelectorShown" class="ml-11 mt-3" :filter-route-name="filterRouteName" />
                                </Transition>
                            </div>
                            <div v-if="$slots.sidebarInfo">
                                <div class="">
                                    <button class="flex items-center uppercase" @click="isInfoSelectorShown = !isInfoSelectorShown">
                                        <span class="relative">
                                            <img class="mr-4 w-7" src="/images/icons/info.svg" alt="">
                                            <img class="absolute left-0 top-0 w-7 opacity-0 dark:opacity-100 transition" src="/images/icons/info-white.svg" alt="">
                                        </span>
                                        <span>Info</span>
                                    </button>
                                    <Transition name="filter">
                                        <div v-if="isInfoSelectorShown" class="ml-11 mt-3">
                                            <slot name="sidebarInfo" />
                                        </div>
                                    </Transition>
                                </div>
                            </div>
                            <div v-if="backtrackRoute">
                                <router-link :to="backtrackRoute" class="uppercase flex text-left">
                                    <span class="relative mt-1">
                                        <img class="mr-4 w-7" src="/images/icons/prev.svg" alt="">
                                        <img class="absolute left-0 top-0 w-7 opacity-0 dark:opacity-100 transition" src="/images/icons/prev-white.svg" alt="">
                                    </span>
                                    <span>zurück zur<br>{{ backtrackRoute.title }}</span>
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="max-w-5xl mt-8 xl:mt-0">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
    </LibraryLayout>
</template>

<style scoped>
.filter-enter-active {
    animation: bounce-in 0.3s;
    transform-origin: top left;
}
.filter-leave-active {
    animation: bounce-in 0.1s reverse;
    transform-origin: top left;
}
@keyframes bounce-in {
    0% {
        transform: translateY(-5px);
    }
    50% {
        transform: translateY(5px);
    }
    100% {
        transform: translateY(0);
    }
}

.search-clear-button-enter-active,
.search-clear-button-leave-active {
    transition: 0.2s;
}

.search-clear-button-enter-from,
.search-clear-button-leave-to {
    transform: scale(0.9) rotate(10deg);
    opacity: 0;
}
</style>