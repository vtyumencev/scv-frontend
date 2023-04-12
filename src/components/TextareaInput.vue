<script setup lang="ts">
import {ref} from 'vue'

defineProps({
    modelValue: {
        type: String,
        default: ''
    }
});

const emits = defineEmits(['update:modelValue'])

const input = ref<HTMLTextAreaElement | null>(null)

const onUpdated = (event : Event) => {
    emits('update:modelValue', (<HTMLTextAreaElement>event.target).value)
}

</script>

<template>
    <textarea
        ref="input"
        class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
        :value="modelValue"
        @input="onUpdated">
    </textarea>
</template>
