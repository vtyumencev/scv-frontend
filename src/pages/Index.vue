<script setup lang="ts">
import { defineAsyncComponent, h, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from "vue";
import { useIdle, useIntersectionObserver } from '@vueuse/core'
import { useRouter, useRoute } from "vue-router";
import LibraryLayout from "@/layouts/LibraryLayout.vue";
import type { BookObject } from "@/types/BookObject";
import VideoModal from "@/components/frontend/VideoModal.vue";
import LibraryButton from "@/components/frontend/LibraryButton.vue";

import LeipzigMask from '../../public/images/homepage/masks/desk/leipzig.svg';
import LeipzigMapMask from '../../public/images/homepage/masks/map/leipzig.svg';
import DresdenMask from '../../public/images/homepage/masks/desk/dresden.svg';
import DresdenMapMask from '../../public/images/homepage/masks/map/dresden.svg';
import ChemnitzMask from '../../public/images/homepage/masks/desk/chemnitz.svg';
import ChemnitzMapMask from '../../public/images/homepage/masks/map/chemnitz.svg';
import OstMask from '../../public/images/homepage/masks/desk/ost.svg';
import OstMapMask from '../../public/images/homepage/masks/map/ost.svg';
import WestMask from '../../public/images/homepage/masks/desk/west.svg';
import WestMapMask from '../../public/images/homepage/masks/map/west-2.svg';
import NorthMask from '../../public/images/homepage/masks/desk/nord.svg';
import NorthMapMask from '../../public/images/homepage/masks/map/north.svg';

import KinderYouthMask from '../../public/images/homepage/masks/desk/kinder-jugend.svg';
import RehearsalMask from '../../public/images/homepage/masks/desk/proberaum.svg';
import LibraryMask from '../../public/images/homepage/masks/desk/mediathek.svg';
import NeutralMask from '../../public/images/homepage/masks/desk/neutral.svg';

const router = useRouter();
const route = useRoute();

const introSlide = ref<HTMLElement>();
const deskSlide = ref<HTMLElement>();

const { idle } = useIdle(3000);

const dataIsReady = ref(false);
const isIntroVideoShown = ref(false);
const deskSlideView = ref(false);
const deskShakeTimeout = ref();
const hintsEnabled = ref(false);

const links = [
    {
        name: null,
        is_in_book: false,
        route: null,
        order: 0,
        front_object: {
            left: 1,
            bottom: 1,
            width: 90,
            asset_url: '/images/homepage/Book.png',
            asset_mask_component: null
        },
        map_mask: null
    },
    {
        name: 'Leipzig',
        is_in_book: true,
        route: { name: 'presets-show', params: { presetName: 'leipzig' } },
        order: 6,
        front_object: {
            left: 34,
            bottom: 42,
            width: 25,
            asset_url: '/images/homepage/Leipzig.png',
            asset_mask_component: LeipzigMask
        },
        map_mask: {
            left: 18.5,
            bottom: 19.65,
            width: 1.7,
            asset_component: LeipzigMapMask,
        }
    },
    {
        name: 'Dresden',
        is_in_book: true,
        route: { name: 'presets-show', params: { presetName: 'dresden' } },
        order: 7,
        front_object: {
            left: 48,
            bottom: 40,
            width: 21.5,
            asset_url: '/images/homepage/Dresden.png',
            asset_mask_component: DresdenMask
        },
        map_mask: {
            left: 24.8,
            bottom: 15.9,
            width: 2.3,
            asset_component: DresdenMapMask,
        }
    },
    {
        name: 'Ostsachsen',
        is_in_book: true,
        route: { name: 'presets-show', params: { presetName: 'east' } },
        order: 8,
        front_object: {
            left: 57.5,
            bottom: 38.3,
            width: 12,
            asset_url: '/images/homepage/SachsenOst.png',
            asset_mask_component: OstMask
        },
        map_mask: {
            left: 22.8,
            bottom: 12.95,
            width: 11.3,
            asset_component: OstMapMask,
        }
    },
    {
        name: 'Seasonal',
        is_in_book: true,
        route: null,
        order: 9,
        front_object: {
            left: 68,
            bottom: 34,
            width: 14,
            asset_url: '/images/homepage/Seasonal1.png',
            asset_mask_component: NeutralMask
        },
        map_mask: null
    },
    {
        name: 'Kinder Jugend',
        is_in_book: true,
        route: { name: 'presets-show', params: { presetName: 'kinder-youth' } },
        order: 3,
        front_object: {
            left: 23.5,
            bottom: 39.8,
            width: 16,
            asset_url: '/images/homepage/KinderJugend.png',
            asset_mask_component: KinderYouthMask
        },
        map_mask: null
    },
    {
        name: 'Nordsachsen',
        is_in_book: true,
        route: { name: 'presets-show', params: { presetName: 'north' } },
        order: 2,
        front_object: {
            left: 19.3,
            bottom: 35.5,
            width: 13,
            asset_url: '/images/homepage/SachsenNord.png',
            asset_mask_component: NorthMask
        },
        map_mask: {
            left: 17.78,
            bottom: 16.45,
            width: 6.3,
            asset_component: NorthMapMask,
        }
    },
    {
        name: 'Chemnitz',
        is_in_book: true,
        route: { name: 'presets-show', params: { presetName: 'chemnitz' } },
        order: 4,
        front_object: {
            left: 31,
            bottom: 38.7,
            width: 9,
            asset_url: '/images/homepage/Chemnitz.png',
            asset_mask_component: ChemnitzMask
        },
        map_mask: {
            left: 19.5,
            bottom: 13.91,
            width: 1.75,
            asset_component: ChemnitzMapMask,
        }
    },
    {
        name: 'Westsachsen',
        is_in_book: true,
        route: { name: 'presets-show', params: { presetName: 'west' } },
        order: 5,
        front_object: {
            left: 34.6,
            bottom: 34,
            width: 21,
            asset_url: '/images/homepage/SachsenWest.png',
            asset_mask_component: WestMask
        },
        map_mask: {
            left: 13.8,
            bottom: 7.6,
            width: 10.6,
            asset_component: WestMapMask,
        }
    },
    {
        name: 'Mediathek',
        is_in_book: false,
        route: { name: 'library-index' },
        order: 1,
        front_object: {
            left: -1,
            bottom: 17,
            width: 14,
            asset_url: '/images/homepage/Mediathek.png',
            asset_mask_component: LibraryMask
        },
        map_mask: null
    },
    {
        name: 'Proberaum',
        is_in_book: false,
        route: null,
        order: 10,
        front_object: {
            left: 79,
            bottom: 8,
            width: 21,
            asset_url: '/images/homepage/Proberaum.png',
            asset_mask_component: RehearsalMask
        },
        map_mask: null
    },
] as Array<BookObject>;

useIntersectionObserver(
    deskSlide,
    ([{ isIntersecting }]) => {
        deskSlideView.value = isIntersecting;
    },
    {
        threshold: [0.5]
    }
);

onMounted( async () => {

    // document.querySelector('#desk')?.addEventListener('mouseover', (e) => {
    //
    //     console.log(1)
    //
    //     const objectInteract = (e.target as HTMLElement).closest('.object-interact') as HTMLElement;
    //     if (objectInteract) {
    //         objectMaskMouseEnter.call(objectInteract);
    //         return;
    //     }
    //
    //     const mapInteract = (e.target as HTMLElement).closest('.map-mask') as HTMLElement;
    //     if ((e.target as HTMLElement).closest('.map-mask')) {
    //         mapMaskMouseEnter.call(mapInteract);
    //         return;
    //     }
    //
    //
    // });
    //
    // document.querySelector('#desk')?.addEventListener('mouseout', (e) => {
    //     const objectInteract = (e.target as HTMLElement).closest('.object-interact') as HTMLElement;
    //     if (objectInteract) objectMaskMouseLeave.call(objectInteract);
    //     console.log(2)
    // });

    const maskElms = document.querySelectorAll<HTMLElement>('.object-interact');
    maskElms.forEach((maskEl) => {
        const maskID = parseInt(maskEl.getAttribute('data-object-id') ?? '');
        const maskPathEl = maskEl?.querySelector(`svg path`);
        maskPathEl?.addEventListener('mouseenter', objectMaskMouseEnter.bind(maskEl));
        maskPathEl?.addEventListener('mouseleave', objectMaskMouseLeave.bind(maskEl));
        maskPathEl?.addEventListener('click', routeToPreset.bind(null, maskID));
    });

    const mapMaskElms = document.querySelectorAll<HTMLElement>('.map-mask');
    mapMaskElms.forEach((mapMaskEl) =>{
        const mapMaskID = parseInt(mapMaskEl.getAttribute('data-map-mask') ?? '');
        const mapMaskPathEl = mapMaskEl?.querySelector(`path`);
        mapMaskPathEl?.addEventListener('mouseenter', mapMaskMouseEnter.bind(mapMaskEl));
        mapMaskPathEl?.addEventListener('mouseleave', mapMaskMouseLeave.bind(mapMaskEl));
        mapMaskPathEl?.addEventListener('click', routeToPreset.bind(null, mapMaskID));
    });
});

onUnmounted(() => {
    const masksElms = document.querySelectorAll<HTMLElement>('.object-mask');
    masksElms.forEach((maskEl) => {
        const maskID = parseInt(maskEl.getAttribute('data-object-id') ?? '');
        maskEl.removeEventListener('mouseenter', objectMaskMouseEnter.bind(maskEl));
        maskEl.removeEventListener('mouseleave', objectMaskMouseLeave.bind(maskEl));
        maskEl?.addEventListener('click', routeToPreset.bind(null, maskID));
    });
    /**
     *
     *
     */

    clearTimeout(deskShakeTimeout.value);
});

watch(idle, (idleValue) => {
    clearTimeout(deskShakeTimeout.value);
    if (idleValue) {
        shakeDesk();
    } else {
        const objectsElms = document.querySelectorAll<HTMLElement>('.object-interact');
        objectsElms.forEach( (objectEl) => {
            objectEl.classList.remove('object-interact--active-idle');
        });
    }
});

const shakeDesk = () => {
    const objectsElms = document.querySelectorAll<HTMLElement>('.object-interact');
    objectsElms.forEach( (objectEl) => {
        const order = parseInt(objectEl.getAttribute('data-order') ?? '0');
        setTimeout(() => {
            if (idle.value) {
                objectEl.classList.add('object-interact--active-idle');
            }
        }, order * 1000);
        setTimeout(() => {
            objectEl.classList.remove('object-interact--active-idle');
        }, 12000 + order * 300);
    });

    deskShakeTimeout.value = setTimeout(shakeDesk, 18000)
}

const onDataIsReady = () => {

    setTimeout(() => {
        dataIsReady.value = true;
    }, 0);

    setTimeout(() => {
        if (route.hash === '#desk') {
            router.replace({ hash: '' })
            deskSlide.value?.scrollIntoView({  });
        }
    }, 100);

}

const objectMaskMouseEnter = function (this: HTMLElement) {
    if (hintsEnabled.value) {
        return;
    }
    this.classList.add('object-interact--active');
    const objectID = this.getAttribute('data-object-id');
    const mapMaskEl = document.querySelector<HTMLElement>(`.map-mask[data-map-mask="${ objectID }"]`);
    mapMaskEl?.classList.add('opacity-100');
}
const objectMaskMouseLeave = function (this: HTMLElement) {
    if (hintsEnabled.value) {
        return;
    }
    this.classList.remove('object-interact--active');
    const objectID = this.getAttribute('data-object-id');
    const mapMaskEl = document.querySelector<HTMLElement>(`.map-mask[data-map-mask="${ objectID }"]`);
    mapMaskEl?.classList.remove('opacity-100');
}

const mapMaskMouseEnter = function (this: HTMLElement) {
    if (hintsEnabled.value) {
        return;
    }
    const objectID = this.getAttribute('data-map-mask');
    const objectMaskEl = document.querySelector<HTMLElement>(`.object-interact[data-object-id="${ objectID }"]`);
    objectMaskEl?.classList.add('object-interact--active');
    this.classList.add('opacity-100');
}
const mapMaskMouseLeave = function (this: HTMLElement) {
    if (hintsEnabled.value) {
        return;
    }
    const objectID = this.getAttribute('data-map-mask');
    const objectMaskEl = document.querySelector<HTMLElement>(`.object-interact[data-object-id="${ objectID }"]`);
    objectMaskEl?.classList.remove('object-interact--active');
    this.classList.remove('opacity-100');
}

const routeToPreset = function (objectID: number) {
    const routeObject = links[objectID].route;
    if (routeObject !== null) {
        router.push(routeObject);
    }
}

const scrollToDesk = () => {
    deskSlide.value?.scrollIntoView({ behavior: "smooth" });
}

const deskHelpHint = () => {
    const maskElms = document.querySelectorAll('.object-interact');
    if (hintsEnabled.value) {
        maskElms.forEach( (maskEl) => {
            setTimeout(() => {
                maskEl.classList.remove('object-interact--active');
            }, Math.random() * 400);
        });
        hintsEnabled.value = false;
    } else {
        maskElms.forEach( (maskEl) => {
            setTimeout(() => {
                maskEl.classList.add('object-interact--active');
            }, Math.random() * 400);
        });
        hintsEnabled.value = true;
    }
}

</script>

<template>

    <LibraryLayout @on-data-is-ready="onDataIsReady">
        <div class="relative">
            <div ref="introSlide" class="lg:h-screen flex justify-center pt-20 lg:pt-0 lg:items-center lg:min-h-[900px] relative">
                <div class="absolute bottom-[0] flex items-end overflow-hidden lg:top-0 lg:bottom-auto lg:h-screen">
                    <img
                        class="w-screen transition duration-[2500ms] delay-200 opacity-0"
                        :class="{ 'scale-125': !dataIsReady, 'scale-100 opacity-100': dataIsReady }"
                        src="/images/landing/Clouds.jpg"
                        alt="">
                </div>
                <div
                    class="relative max-w-6xl mx-auto duration-[1000ms] delay-300 opacity-0"
                    :class="{ 'scale-110': !dataIsReady, 'scale-100 opacity-100': dataIsReady }">
                    <div
                        class="grid lg:grid-cols-[2fr_1fr]">
                        <div class="">
                            <div class="p-5 lg:p-10 bg-white bg-opacity-60">
                                <div class="relative">
                                    <h1 class="text-[1.5rem] sm:text-[2rem] lg:text-[3.4rem] font-serif mr-[140px] lg:mr-0">Deine Reise Beginnt hier!</h1>
                                    <div class="absolute top-0 right-0 flex justify-end lg:hidden balloonWrapper">
                                        <div class="balloon">
                                            <img class="w-[100px] relative" src="/images/landing/Balloon_Play.png" alt="">
                                            <button
                                                class="absolute w-[37%] h-[30%] top-[25%] left-[27%] rounded-full"
                                                @click="isIntroVideoShown = true"></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="space-y-10 mt-8 font-light lg:text-lg">
                                    <p>Willkommen in der Chorwelt Sachsens!</p>
                                    <p>Wir möchten Sie auf eine kleine Reise durch die Vielfalt der Sächsischen Chorlandschaft einladen. Erleben Sie unsere Chöre und lassen Sie sich einen kurzen Moment aus dem Alltag entführen. Reisen Sie in die eher ländlich geprägten Regionen Sachsens - Nordsachsen, Ostsachsen oder Westsachsen - oder in eine der drei größten Städte Sachsens nach Chemnitz, Dresden oder Leipzig. Lassen Sie sich von der Freude am Chorsingen von den dort ansässigen Chören anstecken. Als Besonderheit können Sie den Chören beim Proben im Probenraum zusehen. Alle Videos, die nicht an einem der Auftrittsorte präsentiert werden, finden Sie in unserer Mediathek.</p>
                                    <p>Herzlich begrüßen möchte Sie die Präsidentin des Sächsischen Chorverbands, Luise Neuhaus-Wartenberg.</p>
                                </div>
                            </div>
                        </div>
                        <div class="hidden lg:block">
                            <div class="flex justify-end balloonWrapper">
                                <div class="balloon">
                                    <img class="max-w-[300px] relative" src="/images/landing/Balloon_Play.png" alt="">
                                    <button
                                        class="absolute w-[37%] h-[30%] top-[25%] left-[27%] rounded-full"
                                        @click="isIntroVideoShown = true"></button>
                                </div>
                            </div>
                        </div>
                        <Teleport to="body">
                            <Transition>
                                <VideoModal v-if="isIntroVideoShown" video-id="KsdAb06ZBTI" @close-modal="isIntroVideoShown = false" />
                            </Transition>
                        </Teleport>
                    </div>
                    <div class="mt-[60px] flex justify-center">
                        <div class="relative">
                            <LibraryButton @click="scrollToDesk">Reise beginnen</LibraryButton>
                            <div class="absolute w-full flex justify-center bottom-[-120px]">
                                <div class="grid pointer-events-none double-arrow">
                                    <img src="/images/icons/blue-arrow.svg" alt="">
                                    <img class="mt-[-20px]" src="/images/icons/blue-arrow.svg" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="h-[200px]"></div>
            <div id="desk" class="snap-center flex justify-center relative">
                <div class="flex items-end pointer-events-none">
                    <img class="w-screen " src="/images/homepage/Sky.jpg" alt="">
                    <img class=" absolute bottom-0" src="/images/homepage/Desk.png" alt="">
                </div>
                <div
                    id="desk-objects"
                    ref="deskSlide"
                    class="absolute w-full h-full group"
                    :class="{
                        'book-objects--shown': deskSlideView,
                        'book-objects--idle': idle
                    }">
                    <div
                        v-for="(object, key) in links"
                        :key="object"
                        :data-object-id="key"
                        class="group absolute pointer-events-none"
                        :class="{'object-interact' : object.route}"
                        :data-order="object.order"
                        :style="{
                                left: object.front_object.left + '%',
                                bottom: object.front_object.bottom + '%',
                                width: object.front_object.width + '%'
                            }">
                        <div
                            class="
                                transition
                                group-[.object-interact--active-idle]:-translate-y-1
                                group-[.object-interact--active]:-translate-y-1
                                group-[.book-objects--idle]:duration-[2000ms]">
                            <img
                                class="w-full"
                                :class="{ 'book-inner-object': object.is_in_book }"
                                :src="object.front_object.asset_url"
                                alt="">
                        </div>
                        <div
                            class="
                                object-hint
                                absolute
                                top-[-70px]
                                lg:top-[-80px]
                                w-full
                                flex
                                justify-center
                                opacity-0
                                group-[.object-interact--active-idle]:opacity-100
                                group-[.object-interact--active]:opacity-100
                                transition
                                group-[.book-objects--idle]:duration-[2000ms]">
                            <div class="flex flex-col items-center">
                                <span class="bg-white bg-opacity-80 px-3 py-1 text-xs lg:text-base">{{ object.name }}</span>
                                <img class="w-[15px] lg:w-[30px] mt-[10px]" src="/images/icons/double-arrow.svg" alt="">
                            </div>
                        </div>
                        <component
                            :is="object.front_object.asset_mask_component"
                            v-if="object.front_object.asset_mask_component"
                            :data-object-mask="key"
                            class="object-mask absolute top-0 opacity-0 pointer-events-auto"
                        />
                    </div>

                    <template
                        v-for="(object, key) in links">
                        <component
                            :is="object.map_mask.asset_component"
                            v-if="object.map_mask"
                            :key="object"
                            :data-map-mask="key"
                            class="absolute map-mask opacity-0 transition"
                            :style="{
                                left: object.map_mask.left + '%',
                                bottom: object.map_mask.bottom + '%',
                                width: object.map_mask.width + '%'
                            }"
                        />
                    </template>
                </div>
            </div>
        </div>
        <template #footer-left>
            <button class="grid grid-flow-col gap-3 items-center uppercase" @click="deskHelpHint">
                <img class="w-3.5 lg:w-5" src="/images/icons/question-mark-box.svg" alt="">
                <span class="">Hilfe</span>
            </button>
        </template>
    </LibraryLayout>
</template>
<style lang="scss">

.balloon {
    animation: linear balloon 3s infinite;
}

.balloonWrapper {
    animation: linear balloonWrapper 8s infinite both;
}

@keyframes balloonWrapper {
    0% { transform: rotate(-1deg); }
    50%   { transform: rotate(1deg); }
    100%   { transform: rotate(-1deg); }
}
@keyframes balloon {
    from { transform: rotate(0deg) translateX(2px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(2px) rotate(-360deg); }
}


.double-arrow {
    img:first-child {
        animation: arrow-bouncing 3s 0.1s infinite;
    }
    img:last-child {
        animation: arrow-bouncing 3s infinite;
    }
}

@keyframes arrow-bouncing {
    0% {
        transform: translateY(0);
    }
    30% {
        transform: translateY(4px);
    }
    100% {
        transform: translateY(0);
    }
}

.object-interact {
    z-index: 5;
    .book-inner-object {
        transform: perspective(1000px) rotateX(90deg);
        opacity: 0;
        transform-origin: bottom;
    }
    @for $i from 1 through 20 {
        &:nth-child(#{$i}) .book-inner-object {
            transition: #{$i * 0.05 + 0.6}s #{$i * 0.02}s cubic-bezier(0, 0, 0.28, 1.34);
        }
    }

    .book-objects--shown & .book-inner-object {
        opacity: 1;
        transform: perspective(1000px) rotateX(0);
    }
}

#desk-objects {
    svg {
        pointer-events: none;
    }
    svg path {
        cursor: pointer;
        pointer-events: auto;
    }
}

</style>