<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    modelValue: boolean
}>();

const emit = defineEmits(['update:modelValue']);

const proxyChecked = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit('update:modelValue', val);
    },
});

</script>

<template>
    <label class="flex items-center">
        <input
            v-model="proxyChecked"
            type="checkbox"
            class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2" />
        <slot/>
    </label>
</template>