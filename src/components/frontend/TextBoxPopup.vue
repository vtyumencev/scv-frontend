<script setup lang="ts">

import {onMounted, ref} from "vue";

defineProps<{
    bodyText: string,
    isMobile: boolean
}>();

const textBoxEl = ref();
const textBoxBodyEl = ref();

const emits = defineEmits<{
    (e: 'closeWindow'): void
}>();

const isReady = ref(false);
const isClosing = ref(false);

onMounted(() => {
    textBoxBodyEl.value.style.width = textBoxEl.value.clientWidth + 'px'
    requestAnimationFrame(() => {
        isReady.value = true;
    });
    setTimeout(() => {
        if (isClosing.value) {
            return;
        }
        textBoxBodyEl.value.style.width = '';
    }, 1000);
});

const closePopup = () => {
    if (isClosing.value === true) {
        return;
    }
    isClosing.value = true;
    isReady.value = false;
    textBoxBodyEl.value.style.width = textBoxEl.value.clientWidth + 'px'
    setTimeout(() => {
        emits('closeWindow');
    }, 700);
}

</script>

<template>
    <div class="z-20 absolute w-full h-full flex justify-center items-center" style="font-size: var(--font-size-base);">
        <div
            class="absolute top-0 left-0 w-full h-full transition duration-700 bg-black"
            :class="{ 'bg-opacity-50': isReady, 'bg-opacity-0': !isReady || isClosing }"
            @click="closePopup">
        </div>
        <div
            ref="textBoxEl"
            class="absolute w-[50%] min-h-[30%] flex items-center justify-center transition duration-300"
            :class="{
                'translate-y-[0] scale-100': isReady,
                'translate-y-[-100vh] scale-75 delay-300': ! isReady,
                'w-[80%]': isMobile
            }">
            <div
                class="absolute h-full bg-white shadow-lg border-[0.35em] border-black transition-all duration-300"
                :class="{ 'w-[100%] delay-500': isReady, 'w-[10%]': ! isReady }">
                <button
                    type="button"
                    class="z-10 absolute top-2 right-2 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition duration-300"
                    :class="{ 'opacity-100 delay-700': isReady, 'opacity-0': ! isReady }"
                    @click="closePopup">
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <div
                class="relative transition-all overflow-hidden duration-300"
                :class="{ 'w-full delay-500': isReady, 'w-[0%] delay-0': ! isReady }">
                <div
                    ref="textBoxBodyEl"
                    class="text-[2em] px-[2em] py-[2em] relative"
                    :class="{ 'text-[3.5em]': isMobile }"
                    v-html="bodyText">

                </div>
            </div>
            <img
                class="absolute pointer-events-none h-[160%] mt-[1%] translate-x-[30%] transition-all duration-300"
                :class="{ 'right-full delay-500': isReady, 'right-[52%] delay-0': ! isReady }"
                src="/images/mix/Scroll-A.png"
                alt="">
            <img
                class="absolute pointer-events-none h-[160%] mt-[1%] translate-x-[-20%] transition-all duration-300"
                :class="{ 'left-full delay-500': isReady, 'left-[52%] delay-0': ! isReady }"
                src="/images/mix/Scroll-B.png"
                alt="">
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>