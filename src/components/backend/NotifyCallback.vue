<script setup lang="ts">
import type { ToastOptions } from 'vue3-toastify';
import { ref, type PropType } from 'vue';
import type {NotifyCallbackOptions} from "@/types/NotifyCallbackOptions";

const processing = ref(false);

const props = defineProps({
    closeToast: {
        type: Function as PropType<(e?: MouseEvent) => void>,
        default: () => undefined
    },
    toastProps: {
        type: Object as PropType<ToastOptions<NotifyCallbackOptions>>,
        default: null
    },
});

const restoreRecord = async () => {
    if (props?.toastProps?.data) {
        processing.value = true;
        props.toastProps.data?.onClick()
    }
};

</script>

<template>
    <div class="">{{ toastProps?.data?.comment }}</div>
    <button class="text-indigo-700 uppercase text-sm" :class="{'opacity-80' : processing}" :disabled="processing" @click="restoreRecord">
        {{ toastProps?.data?.buttonName ?? 'Undo' }}
    </button>
</template>