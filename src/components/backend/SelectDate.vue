<script setup lang="ts">
import {formatDateForm} from "@/helpers/datetime";

defineProps<{
    modelValue: string
}>();

const emits = defineEmits(['update:modelValue']);

const onUpdated = (event : Event) => {
    emits('update:modelValue', (<HTMLTextAreaElement>event.target).value)
}

</script>

<template>
    <input
        :value="formatDateForm(modelValue)"
        type="date"
        class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
        @input="onUpdated"/>
</template>
