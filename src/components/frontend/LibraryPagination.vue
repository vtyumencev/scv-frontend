<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
    maxVisibleButtons: {
        type: Number,
        required: false,
        default: 5
    },
    totalPages: {
        type: Number,
        required: true
    },
    currentPage: {
        type: Number,
        required: true
    }
});

const visiblePages = computed(() => {
    return Math.min(props.maxVisibleButtons, props.totalPages);
});

const startPage = computed(() => {

    // When on the first page
    if (props.currentPage === 1) {
        return 1;
    }

    // When on the last page
    if (props.currentPage === props.totalPages) {
        return props.totalPages - visiblePages.value + 1;
    }

    // When inbetween
    const countSidePages = Math.floor(visiblePages.value / 2);
    return Math.min(
        Math.max(props.currentPage - countSidePages, 1),
        (props.totalPages - visiblePages.value + 1)
    );
});

const endPage = computed(() => {
    return startPage.value + visiblePages.value - 1;
})

const pages = computed(() => {
    let range = [];

    for (
        let i = startPage.value;
        i <= Math.min(startPage.value + visiblePages.value - 1, props.totalPages);
        i++
    ) {

        range.push({
            name: i,
            isDisabled: i === props.currentPage
        });
    }

    range = range.slice(
        (startPage.value > 1 ? 2 : 0),
        (endPage.value < props.totalPages ? visiblePages.value - 2 : visiblePages.value)
    );

    return range;
});

</script>

<template>
    <ul class="flex">
        <li class="item-container">
            <router-link
                v-if="currentPage > 1"
                class="item-link text-theme-alpha"
                :to="{ query: { page: currentPage - 1 } }">«
            </router-link>
            <div v-else class="item-link text-black dark:text-white opacity-50">
                «
            </div>
        </li>
        <template v-if="startPage !== 1" >
            <li class="item-container">
                <router-link
                    class="item-link text-theme-alpha"
                    :to="{ query: { page: 1 } }"
                >1</router-link>
            </li>
            <li class="item-container">...</li>
        </template>
        <li v-for="page in pages" :key="page" class="item-container">
            <router-link
                class="item-link"
                :class="{
                    'text-theme-alpha': currentPage !== page.name,
                    'text-black dark:text-white pointer-events-none': currentPage === page.name,
                }"
                :to="{ query: { page: page.name } }"
            >{{ page.name }}</router-link>
        </li>
        <template v-if="endPage !== totalPages" >
            <li class="item-container">...</li>
            <li class="item-container">
                <router-link
                    class="item-link text-theme-alpha"
                    :to="{ query: { page: totalPages } }"
                >{{ totalPages }}</router-link>
            </li>
        </template>
        <li class="item-container">
            <router-link
                v-if="currentPage < totalPages"
                class="item-link text-theme-alpha"
                :to="{ query: { page: currentPage + 1 } }">»
            </router-link>
            <div v-else class="item-link text-black dark:text-white opacity-50">
                »
            </div>
        </li>
    </ul>
</template>

<style scoped lang="postcss">
    .item-container {
        @apply w-7 flex justify-center;
    }
    .item-link {
        @apply w-full flex justify-center items-center transition;
    }
</style>