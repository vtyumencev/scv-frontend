<script setup lang="ts">

import FrontendLayout from "@/layouts/FrontendLayout.vue";
import {onMounted, onUnmounted, ref} from "vue";

defineProps({
    backgroundImage: {
        type: String,
        default: ''
    }
});

const dataIsReady = ref(false);
const onDataIsReady = () => {
    concertSize();
    window.addEventListener('resize', concertSize);
    document.addEventListener('mousemove', concertParallax);
    dataIsReady.value = true;
};

onMounted( () => {
});

onUnmounted(() => {
    if (dataIsReady.value) {
        window.removeEventListener('resize', () => concertSize());
        document.removeEventListener('mousemove', concertParallax);
        dataIsReady.value = false;
    }
});

const concertParallax = (e: MouseEvent) : void => {
    const elms = document.querySelectorAll<HTMLElement>('[data-depth]');
    elms.forEach((el) => {
        const deathStrengthX = parseFloat(el.getAttribute('data-depth-strength-x') || '1');
        const deathStrengthY = parseFloat(el.getAttribute('data-depth-strength-y') || '1');
        const transformX = -(deathStrengthX / 20) * ( e.clientX - window.outerWidth / 2 );
        const transformY = -(deathStrengthY / 20) * ( e.clientY - window.outerHeight / 2 );
        el.style.transform = `translate(${transformX}px, ${transformY}px)`;
    });
}

const concertSize = () : void => {
    const concertWrapperEl = document.querySelector('.concert-wrapper') as HTMLElement;
    const concertEl = document.querySelector('.concert') as HTMLElement;
    if (! concertWrapperEl || ! concertEl) {
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
    <FrontendLayout @on-data-is-ready="onDataIsReady">
        <div class="h-screen">
            <div id="concert-container" class="concert-container mx-auto h-full">
                <div class="concert-container__wrapper concert-wrapper h-full flex justify-center items-center">
                    <div class="concert relative w-full">
                        <img
                            :src="backgroundImage"
                            class="absolute w-full h-full object-cover object-center"
                            alt="">
                        <slot/>
                        <div class="absolute left-0 top-0">
                            <router-link
                                :to="{ name: 'index' }"
                                class="block w-[150px] mt-5 ml-5">
                                <img src="/public/logo.png" class="w-full" alt="">
                            </router-link>
                        </div>
                        <div class="absolute bottom-0 w-full flex justify-between text-white text-xs px-3 py-1 font-serif">
                            <div class="grid grid-flow-col gap-2">
                                <router-link
                                    to=""
                                    class="bg-black px-1.5 bg-opacity-50 rounded-sm">
                                    Datenschutz
                                </router-link>
                                <router-link
                                    to=""
                                    class="bg-black px-1.5 bg-opacity-50 rounded-sm">
                                    Impressum
                                </router-link>
                            </div>
                            <div class="bg-black px-1.5 bg-opacity-50 rounded-sm">
                                © Sächsischer Chorverband e.V.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </FrontendLayout>
</template>

<style lang="scss">

.concert {
    background-color: rgba($color: #fff, $alpha: 0.2);
    transition: background-color 0.2s, background-image 0.2s;
    background-size: cover;
    background-position: center;
    position: relative;
}
</style>