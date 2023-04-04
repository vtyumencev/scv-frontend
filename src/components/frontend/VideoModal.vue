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
            <div ref="container" class="w-full">
                <div class="bg-black h-full">
                    <iframe class="w-full h-full" :src="'https://www.youtube.com/embed/' + videoId + '?autoplay=1'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    </div>
</template>