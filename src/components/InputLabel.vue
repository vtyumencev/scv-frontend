<script setup lang="ts">
defineProps(['value'])
</script>

<template>
    <label class="font-medium text-sm text-gray-700 block">
        <span v-if="value">{{ value }}</span>
        <span v-else class="flex items-center"><slot /></span>
    </label>
</template>
