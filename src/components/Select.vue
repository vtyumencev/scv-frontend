<script setup lang="ts">

defineProps(['items', 'name', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

const onChange = (event: Event) => {
    emit('update:modelValue', (<HTMLTextAreaElement>event.target).value)
}
</script>

<template>
    <select 
        :value="modelValue" 
        @change="onChange"
        class="rounded-md border border-gray-300 bg-white bg-opacity-60 py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500">
        <option value="" selected>{{ ( name ? name : 'Not selected' ) }}</option>
        <option v-for="option in items" :value="option.id">
            {{ option.name }}
        </option>
    </select>
</template>