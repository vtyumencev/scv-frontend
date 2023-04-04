<script setup lang="ts">
import type {Attribute} from "@/types/Attribute";

defineProps<{
    attributeName: string,
    attributes: Attribute[],
    selected?: string[]
}>();

</script>

<template>
    <div class="">
        <div
            v-for="attr in attributes"
            :key="attr"
            class="flex items-center mb-4">
            <input
                :id="'filter-checkbox-' + attributeName + '-' + attr.id"
                type="checkbox"
                :name="attributeName"
                :value="attr.id"
                :checked="selected.includes('' + attr.id)"
                class="w-4 h-4 text-theme-alpha bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition">
            <label :for="'filter-checkbox-' + attributeName + '-' + attr.id" class="ml-2 text-sm uppercase text-gray-900 dark:text-gray-300 transition">{{ attr.name }}</label>
        </div>
    </div>
</template>