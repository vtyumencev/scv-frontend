<script setup lang="ts">
import {defineAsyncComponent, ref, watch} from 'vue';

const emits = defineEmits(['loaded']);

const iconEl = ref<HTMLElement>();

const isLoaded = ref(false);

const props = defineProps({
    path: {
        type: String,
        required: true,
    },
});

const icon = defineAsyncComponent(() =>
    import("/public/" + props.path)
);

watch(iconEl, () => {
    if (isLoaded.value) {
        return;
    }
    isLoaded.value = true;
    emits('loaded');
})


</script>

<template>
    <component :is="icon" ref="iconEl" class="fill-current" />
</template>