<script setup lang="ts">

import FrontendLayout from "@/layouts/FrontendLayout.vue";
import { onUnmounted, ref } from "vue";
import ApplicationLogo from "@/components/ApplicationLogo.vue";
import navigation from '../../public/storage/navigation.json';
import type { SiteNavigation } from "@/types/SiteNavigation";
import LanguageSelector from "@/components/frontend/LanguageSelector.vue";

const navigationLinks = navigation as SiteNavigation;

defineProps<{
    backgroundImage?: string | null,
    backgroundImageDark?: string | null,
    isDark?: boolean
}>();

const emits = defineEmits<{
    (e: 'toggleMobile', value: boolean): void
}>();

const dataIsReady = ref(false);

const currentMousePostions = { x: 0, y: 0 };
let currentAnimationFrame: number;
const onDataIsReady = () => {
    concertSize();
    window.addEventListener('resize', concertSize);
    document.addEventListener('mousemove', concertParallax);
    dataIsReady.value = true;
    currentAnimationFrame = requestAnimationFrame(animateParallaxStageFrame);
};

onUnmounted(() => {
    if (dataIsReady.value) {
        window.removeEventListener('resize', concertSize);
        document.removeEventListener('mousemove', concertParallax);
        dataIsReady.value = false;
    }
    cancelAnimationFrame(currentAnimationFrame);
});

const concertParallax = (e: MouseEvent) : void => {
    currentMousePostions.x = e.clientX;
    currentMousePostions.y = e.clientY;
}

let _ts: number;
const targets = new Map<number, { x: number, y: number }>();
const followers = new Map<number, { x: number, y: number }>();
const animateParallaxStageFrame = (ts: number) => {
    const dt = _ts ? ts - _ts : 1;
    _ts = ts;

    const elms = document.querySelectorAll<HTMLElement>('[data-depth]');
    elms.forEach((el, i) => {

        const deathStrengthX = parseFloat(el.getAttribute('data-depth-strength-x') || '1');
        const deathStrengthY = parseFloat(el.getAttribute('data-depth-strength-y') || '1');

        const endX = -(deathStrengthX / 20) * ( currentMousePostions.x - window.outerWidth / 2 );
        const endY = -(deathStrengthY / 20) * ( currentMousePostions.y - window.outerHeight / 2 );

        targets.set(i, {
            x: endX,
            y: endY,
        });

        const followerX = (followers.get(i)?.x ?? 0);
        const followerY = (followers.get(i)?.y ?? 0);

        followers.set(i, {
            x: followerX + (((targets.get(i)?.x ?? 0) - followerX) / (dt)),
            y: followerY + (((targets.get(i)?.y ?? 0) - followerY) / (dt)),
        });

        const transformX = followers.get(i)?.x ?? 0;
        const transformY = followers.get(i)?.y ?? 0;

        el.style.transform = `translate(${transformX}px, ${transformY}px)`;
    });

    currentAnimationFrame = requestAnimationFrame(animateParallaxStageFrame);
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
    concertEl.style.setProperty('--font-size-base', clh / 100 + 'px');

    emits('toggleMobile', (concertEl && concertEl.clientWidth < 1000));
}

</script>

<template>
    <FrontendLayout @on-data-is-ready="onDataIsReady">
        <div class="h-screen">
            <div id="concert-container" class="concert-container mx-auto h-full overflow-hidden">
                <div class="concert-container__wrapper concert-wrapper h-full flex justify-center items-center">
                    <div class="concert relative w-full overflow-hidden">
                        <div class="pointer-events-none">
                            <Transition>
                            <img
                                v-if="backgroundImage"
                                :src="backgroundImage"
                                class="absolute w-full h-full object-cover object-center"
                                alt="">
                            </Transition>
                            <Transition>
                                <template v-if="isDark && backgroundImageDark">
                                        <img
                                            v-if="backgroundImageDark"
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
                        <div class="absolute right-0 top-0">
<!--                            <LanguageSelector-->
<!--                                class="mt-5 mr-5 border-[rgba(0,0,0,0.1)] bg-[rgba(255,255,255,0.8)] text-[14px]"-->
<!--                                :icon="true"-->
<!--                                :styled="true" />-->
                        </div>
                        <div class="absolute bottom-0 flex justify-between text-white text-xs px-3 py-1 font-serif">
                            <div class="grid grid-flow-col gap-2">
                                <span v-for="(navLink, index) in navigationLinks.footer" :key="index">
                                    <a
                                        v-if="navLink.remoteLink"
                                        :href="navLink.remoteLink"
                                        class="bg-black px-1.5 bg-opacity-50 rounded-sm"
                                        target="_blank">{{ navLink.name }}
                                    </a>
                                    <router-link
                                        v-else
                                        class="bg-black px-1.5 bg-opacity-50 rounded-sm"
                                        :to="{ name: navLink.routeName }">
                                        {{ navLink.name }}
                                    </router-link>
                                </span>
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