<script setup lang="ts">
import type { ToastOptions } from 'vue3-toastify';
import { ref, type PropType } from 'vue';
import { useChoirs } from '@/stores/choirs';

const choirsStore = useChoirs();

type RestoreToastOptions = {
    comment: string,
    recordID: number,
    onRestore(): void
};

const processing = ref(false);

const props = defineProps({
    closeToast: Function as PropType<(e?: MouseEvent) => void>,
    toastProps: Object as PropType<ToastOptions<RestoreToastOptions>>,
});

const restoreRecord = async () => {
    if (props?.toastProps?.data) {
        processing.value = true;
        props.toastProps.data?.onRestore()
    }
};

</script>

<template>
    <div class="">{{ toastProps?.data?.comment }}</div>
    <button @click="restoreRecord" class="text-indigo-700 uppercase text-sm" :class="{'opacity-80' : processing}" :disabled="processing">Undo</button>
</template>