<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import LibraryLayout from "@/layouts/LibraryLayout.vue";
import { onBeforeMount, type PropType, ref, watch } from "vue";
import { onBeforeRouteLeave, type RouteLocationRaw, useRoute } from "vue-router";
import LibraryFilter from "@/components/frontend/LibraryFilter.vue";
import { useLibrary } from "@/stores/library";

defineProps({
    backgroundImg: {
        type: String,
        default: null
    },
    backtrackRoute: {
        type: Object as PropType<RouteLocationRaw>,
        default: null
    },
    filterRouteName: {
        type: String,
        default: null
    }
});

const isDarkModeEnabled = useStorage('isDarkModeEnabled', false);
const dataIsReady = ref(false);
const route = useRoute();
const isFilterSelectorShown = ref(!!Object.entries(route.query).length);
const isInfoSelectorShown = ref(false);

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
                <div class="grid grid-cols-1 xl:grid-cols-[1fr_minmax(0,_4fr)] gap-y-5 gap-x-16 dark:text-white transition">
                    <div class="">
                        <div class="">
                            <slot name="sidebarContent"></slot>
                        </div>
                        <div class="mt-10 space-y-5">
                            <div>
                                <button class="flex items-center uppercase" @click="isFilterSelectorShown = !isFilterSelectorShown">
                                    <span class="relative">
                                        <img class="mr-4 w-7" src="/icons/library.svg" alt="">
                                        <img class="absolute left-0 top-0 opacity-0 dark:opacity-100 transition" src="/icons/library-white.svg" alt="">
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
                                            <img class="mr-4 w-7" src="/icons/info.svg" alt="">
                                            <img class="absolute left-0 top-0 w-7 opacity-0 dark:opacity-100 transition" src="/icons/info-white.svg" alt="">
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
                                        <img class="mr-4 w-7" src="/icons/prev.svg" alt="">
                                        <img class="absolute left-0 top-0 w-7 opacity-0 dark:opacity-100 transition" src="/icons/prev-white.svg" alt="">
                                    </span>
                                    <span>zurück zur<br>{{ backtrackRoute.title }}</span>
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="max-w-6xl pr-10">
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
</style>