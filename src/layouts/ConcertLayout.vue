<script setup lang="ts">

import FrontendLayout from "@/layouts/FrontendLayout.vue";
import {onMounted, onUnmounted, ref} from "vue";
import ApplicationLogo from "@/components/ApplicationLogo.vue";
import navigation from '../../public/storage/navigation.json';
import type { SiteNavigation } from "@/types/SiteNavigation";

const navigationLinks = navigation as SiteNavigation;

defineProps({
    backgroundImage: {
        type: String,
        default: '',
    },
    backgroundImageDark: {
        type: String,
        default: '',
    },
    isDark: {
        type: Boolean,
        default: false,
    },
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
        window.removeEventListener('resize', concertSize);
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
    concertEl.style.setProperty('--font-size-base', clh / 100 + 'px')
}

</script>

<template>
    <FrontendLayout @on-data-is-ready="onDataIsReady">
        <div class="h-screen">
            <div id="concert-container" class="concert-container mx-auto h-full">
                <div class="concert-container__wrapper concert-wrapper h-full flex justify-center items-center">
                    <div class="concert relative w-full">
                        <div class="pointer-events-none">
                            <img
                                :src="backgroundImage"
                                class="absolute w-full h-full object-cover object-center"
                                alt="">
                            <Transition>
                                <template v-if="isDark && backgroundImageDark">
                                        <img
                                            :src="backgroundImageDark"
                                            class="absolute w-full h-full object-cover object-center"
                                            alt="">
                                </template>
                            </Transition>
                        </div>
                        <slot/>
                        <div class="absolute left-0 top-0">
                            <ApplicationLogo class="mt-5 ml-5" />
                        </div>
                        <div class="absolute bottom-0 flex justify-between text-white text-xs px-3 py-1 font-serif">
                            <div class="grid grid-flow-col gap-2">
                                <router-link
                                    v-for="navLink in navigationLinks.footer"
                                    :key="navLink"
                                    class="bg-black px-1.5 bg-opacity-50 rounded-sm"
                                    :to="{ name: navLink.routeName }">
                                    {{ navLink.name }}
                                </router-link>
                            </div>
                        </div>
                        <div class="absolute right-0 bottom-0 flex justify-between text-white text-xs px-3 py-1 font-serif">
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

.v-enter-active,
.v-leave-active {
    transition: all 1s cubic-bezier(1, 0.5, 0.8, 1);
}
.v-enter-from,
.v-leave-to {
    opacity: 0;
}

</style>