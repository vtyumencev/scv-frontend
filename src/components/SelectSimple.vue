<script setup lang="ts">

import type { PropType } from "vue";

defineProps<{
    items: {
        id: number|string,
        name: string,
    }[],
    nullOption?: string,
    modelValue?: string|number|null
}>();

// defineProps({
//     items: {
//         type: Array as PropType<Array<{
//             id: number,
//             name: string,
//         }>>,
//         default: null
//     },
//     nullOption: {
//         type: String,
//         default: null
//     },
//     modelValue: {
//         type: [ String, Number ],
//         default: null,
//     }
// })

const emit = defineEmits(['update:modelValue'])

const onChange = (event: Event) => {
    emit('update:modelValue', (<HTMLTextAreaElement>event.target).value)
}
</script>

<template>
    <select 
        :value="modelValue" 
        class="rounded-md border border-gray-300 bg-white bg-opacity-60 py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        @change="onChange">
        <option v-if="nullOption" value="" selected>{{ nullOption }}</option>
        <option v-for="option in items" :key="option.id" :value="option.id">
            {{ option.name }}
        </option>
    </select>
</template>