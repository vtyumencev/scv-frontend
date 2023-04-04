<script setup lang="ts">

import {onBeforeMount, ref} from "vue";
import {type FilterNames, useLibrary} from "@/stores/library";
import {type RouteLocationRaw, useRoute, useRouter} from "vue-router";
import FilterAttributeCheckbox from "@/components/frontend/FilterAttributeCheckboxes.vue";

const library = useLibrary();
const router = useRouter();
const route = useRoute();

defineProps<{
    query: Record<string, string>,
    backtrackRoute?: RouteLocationRaw
}>();

const isFilterSelectorShown = ref(false);

onBeforeMount(() => {
    Object.entries(route.query).forEach((query) => {
        const key = query[0] as FilterNames;
        const string = query[1] as string;
        if (! string) {
            return;
        }
        if (key in library.filters) {
            isFilterSelectorShown.value = true;
            library.filters[key].is_active = true;
            library.filters[key].selected = string.split(',');
        }
    });
});

const filterChange = (e: SubmitEvent) => {
    const formEl = e.currentTarget as HTMLFormElement;

    const form = new FormData(formEl);

    Object.entries(library.filters).forEach((filter) => {
        filter[1].selected = form.getAll(filter[0]) as string[];
    });

    filterApply();
}

const filterApply = () => {
    let query = {} as Record<string, string | null>;
    Object.entries(library.filters).forEach((filter) => {
        if (! filter[1].selected?.length) {
            delete query[filter[0]];
            return;
        }
        query[filter[0]] = filter[1].selected.join(',');
    });
    router.push({ query: query });
}

</script>

<template>
    <div>
        <div class="mt-10">
            <div class="space-y-5">
                <div>
                    <button class="flex items-center uppercase" @click="isFilterSelectorShown = !isFilterSelectorShown">
                        <span class="relative">
                            <img class="mr-4 w-7" src="/icons/library.svg" alt="">
                            <img class="absolute left-0 top-0 opacity-0 dark:opacity-100 transition" src="/icons/library-white.svg" alt="">
                        </span>
                        <span>Filtern</span>
                    </button>
                    <Transition name="filter">
                        <form v-if="isFilterSelectorShown" class="ml-11 mt-3 space-y-2" @submit.prevent="filterChange" @change="filterChange">
                            <div class="">
                                <button class="uppercase font-light" type="button" @click="library.filters.genres.is_active = !library.filters.genres.is_active">Genre</button>
                                <Transition name="filter">
                                    <div v-show="library.filters.genres.is_active" class="mt-4 mb-6">
                                        <FilterAttributeCheckbox attribute-name="genres" :attributes="library.attributes.genres" :selected="library.filters['genres'].selected" />
                                    </div>
                                </Transition>
                            </div>
                            <div class="">
                                <button class="uppercase font-light" type="button" @click="library.filters.styles.is_active = !library.filters.styles.is_active">Stil</button>
                                <Transition name="filter">
                                    <div v-show="library.filters.styles.is_active" class="mt-4 mb-6">
                                        <FilterAttributeCheckbox attribute-name="styles" :attributes="library.attributes.styles" :selected="library.filters['styles'].selected" />
                                    </div>
                                </Transition>
                            </div>
                            <div class="">
                                <button class="uppercase font-light" type="button" @click="library.filters.regions.is_active = !library.filters.regions.is_active">Region</button>
                                <Transition name="filter">
                                    <div v-show="library.filters.regions.is_active" class="mt-4 mb-6">
                                        <FilterAttributeCheckbox attribute-name="regions" :attributes="library.attributes.regions" :selected="library.filters.regions.selected" />
                                    </div>
                                </Transition>
                            </div>
                        </form>
                    </Transition>
                </div>
                <div class="flex items-center uppercase">
                    <div class="relative">
                        <img class="mr-4 w-7" src="/icons/info.svg" alt="">
                        <img class="absolute left-0 top-0 w-7 opacity-0 dark:opacity-100 transition" src="/icons/info-white.svg" alt="">
                    </div>
                    <span>Info</span>
                </div>
                <div v-if="backtrackRoute">
                    <router-link :to="backtrackRoute" class="uppercase flex text-left">
                        <span class="relative mt-1">
                            <img class="mr-4 w-7" src="/icons/prev.svg" alt="">
                            <img class="absolute left-0 top-0 w-7 opacity-0 dark:opacity-100 transition" src="/icons/prev-white.svg" alt="">
                        </span>
                        <span>zurück zur<br>Mediathek</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
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