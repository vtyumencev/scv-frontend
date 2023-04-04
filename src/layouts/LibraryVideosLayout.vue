<script setup lang="ts">

import {useStorage} from "@vueuse/core";
import LibraryLayout from "@/layouts/LibraryLayout.vue";
import LibrarySidebar from "@/components/frontend/LibrarySidebar.vue";
import {onBeforeMount, type PropType, ref, watch} from "vue";
import {onBeforeRouteLeave, type RouteLocationRaw} from "vue-router";

const isDarkModeEnabled = useStorage('isDarkModeEnabled', false);
const dataIsReady = ref(false);
const toggleShift = () => {
    isDarkModeEnabled.value = !isDarkModeEnabled.value;
}

defineProps({
    query: {
        type: Object as PropType<Record<string, string>>,
        default: { } as object
    },
    backgroundImg: {
        type: String,
        default: null
    },
    backtrackRoute: {
        type: Object as PropType<RouteLocationRaw>,
        default: null
    }
});

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
                <div class="flex dark:text-white transition">
                    <div class="w-full max-w-[350px] mr-[50px]">
                        <div class="">
                            <slot name="sidebarContent"></slot>
                        </div>
                        <LibrarySidebar v-if="dataIsReady" :query="query" :backtrack-route="backtrackRoute" />
                    </div>
                    <div class="w-full max-w-5xl">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
    </LibraryLayout>
</template>