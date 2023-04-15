<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";

const emits = defineEmits(['closeModal']);
defineProps({
    videoId: {
        type: String,
        required: true
    }
});

const containerWrapper = ref<HTMLElement>();
const container = ref<HTMLElement>();

onMounted( () => {
    window.addEventListener('resize', modalResize);
    modalResize();
});

onUnmounted(() => {
    window.removeEventListener('resize', modalResize);
});

const modalResize = () : void => {
    const concertWrapperEl = containerWrapper.value;
    const concertEl = container.value;
    if (! concertEl || ! concertWrapperEl) {
        return;
    }
    const ar = 16/9;
    const sw = concertWrapperEl.clientWidth;
    const ch = window.innerHeight;
    let clh = sw / ar;
    if (clh > ch) {
        clh = ch;
        concertEl.style.width = (clh * ar) + 'px';
    } else {
        concertEl.style.width = '';
    }
    concertEl.style.height = clh + 'px';
}

</script>

<template>
    <div class="fixed top-0 left-0 w-full h-full z-50">
        <div class="absolute w-full h-full bg-white dark:bg-black bg-opacity-90" @click="emits('closeModal')"></div>
        <div ref="containerWrapper" class="w-full max-w-5xl mx-auto h-full flex justify-center items-center relative">
            <div ref="container" class="w-full relative">
                <div class="bg-black h-full">
                    <iframe class="w-full h-full" :src="'https://www.youtube.com/embed/' + videoId + '?autoplay=1'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
                <button class="absolute p-1 right-1 top-1 rounded bg-white xl:bg-transparent bg-opacity-90 xl:-right-12 xl:-top-2" @click="emits('closeModal')">
                    <svg class="w-10 h-10 rotate-45" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>