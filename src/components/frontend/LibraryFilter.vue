<script setup lang="ts">

import { type FilterNames, useLibrary } from "@/stores/library";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount } from "vue";
import FilterAttributeCheckbox from "@/components/frontend/FilterAttributeCheckboxes.vue";

const library = useLibrary();
const router = useRouter();
const route = useRoute();

const props = defineProps({
    filterRouteName: {
        type: String,
        default: null
    }
});

interface Filter {
    isEnabled?: boolean,
    selectedValues?: string []
}

const filters = library.filters as Record<string, Filter>

Object.entries(filters).forEach((pair) => {
        pair[1].isEnabled = false;
        pair[1].selectedValues = []
    }
);

onBeforeMount(() => {
    Object.entries(route.query).forEach((query) => {
        const key = query[0] as FilterNames;
        const string = query[1] as string;
        if (! string) {
            return;
        }
        if (key in filters) {
            filters[key].isEnabled = true;
            filters[key].selectedValues = string.split(',');
        }
    });
});

const filterChange = (e: SubmitEvent) => {
    const formEl = e.currentTarget as HTMLFormElement;

    const form = new FormData(formEl);

    Object.entries(filters).forEach((filter) => {
        filter[1].selectedValues = form.getAll(filter[0]) as string[];
    });

    filterApply();
}

const filterApply = () => {
    let query = { ...route.query } as Record<string, string | null>;
    Object.entries(filters).forEach((filter) => {
        if (! filter[1].selectedValues?.length) {
            delete query[filter[0]];
            return;
        }
        query[filter[0]] = filter[1].selectedValues.join(',');
    });
    router.push({ name: props.filterRouteName ?? '', query: query });
}

</script>

<template>
    <form v-if="library.attributes" class="space-y-2" @submit.prevent="filterChange" @change="filterChange">
        <div class="">
            <button class="uppercase font-light" type="button" @click="filters.genres.isEnabled = !filters.genres.isEnabled">Genre</button>
            <Transition name="filter">
                <div v-show="filters.genres.isEnabled" class="mt-4 mb-6">
                    <FilterAttributeCheckbox attribute-name="genres" :attributes="library.attributes.genres" :selected="filters['genres'].selectedValues" />
                </div>
            </Transition>
        </div>
        <div class="">
            <button class="uppercase font-light" type="button" @click="filters.styles.isEnabled = !filters.styles.isEnabled">Stil</button>
            <Transition name="filter">
                <div v-show="filters.styles.isEnabled" class="mt-4 mb-6">
                    <FilterAttributeCheckbox attribute-name="styles" :attributes="library.attributes.styles" :selected="filters['styles'].selectedValues" />
                </div>
            </Transition>
        </div>
        <div class="">
            <button class="uppercase font-light" type="button" @click="filters.regions.isEnabled = !filters.regions.isEnabled">Region</button>
            <Transition name="filter">
                <div v-show="filters.regions.isEnabled" class="mt-4 mb-6">
                    <FilterAttributeCheckbox attribute-name="regions" :attributes="library.attributes?.regions" :selected="filters.regions.selectedValues" />
                </div>
            </Transition>
        </div>
    </form>
</template>