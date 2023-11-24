<script setup lang="ts">
import type {Attribute} from "@/types/Attribute";
import {useSettings} from "@/stores/settings";

const settings = useSettings();

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
            :key="attr.id"
            class="flex items-center mb-4">
            <input
                :id="'filter-checkbox-' + attributeName + '-' + attr.id"
                type="checkbox"
                :name="attributeName"
                :value="attr.id"
                :checked="selected?.includes('' + attr.id)"
                class="
                w-4
                h-4
                text-theme-alpha
                border-black
                border-opacity-20
                rounded
                focus:ring-1
                focus:ring-theme-beta
                dark:ring-offset-theme-omega
                dark:bg-theme-omega
                dark:border-white
                dark:border-opacity-20
                transition">
            <label :for="'filter-checkbox-' + attributeName + '-' + attr.id" class="ml-2 text-sm uppercase text-gray-900 dark:text-gray-300 transition">
                {{ attr.name }}
            </label>
        </div>
    </div>
</template>