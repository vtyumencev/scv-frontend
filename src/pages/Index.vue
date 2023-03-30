<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import { useIntersectionObserver } from '@vueuse/core'
import ChemnitzMask from '../../public/homepage/Masks/ChemnitzMask.svg';
import ChemnitzMapMask from '../../public/homepage/Masks/ChemnitzMapMask.svg';
import {useRouter} from "vue-router";
import LibraryLayout from "@/layouts/LibraryLayout.vue";
import type {RouteLocationRaw} from "vue-router";

const router = useRouter();

const introSlide = ref<HTMLElement>();
const deskSlide = ref<HTMLElement>();

const dataIsReady = ref(false);
const deskSlideView = ref(false);

interface Link {
    name: string | null,
    is_in_book: boolean,
    route: RouteLocationRaw | null,
    front_object: {
        left: number,
        bottom: number,
        width: number,
        asset_url: string,
    },
    map_mask: {
        left: number,
        bottom: number,
        width: number,
        asset_component: string,
    } | null
}

const links = [
    {
        name: null,
        is_in_book: false,
        route: null,
        front_object: {
            left: 1,
            bottom: 1,
            width: 90,
            asset_url: '/homepage/Book.png',
        },
        map_mask: null
    },
    {
        name: 'Leipzig',
        is_in_book: true,
        route: { name: 'presets-show', params: { presetName: 'leipzig' } },
        front_object: {
            left: 34,
            bottom: 42,
            width: 25,
            asset_url: '/homepage/Leipzig.png',
        },
        map_mask: null
    },
    {
        name: 'Dresden',
        is_in_book: true,
        route: { name: 'presets-show', params: { presetName: 'dresden' } },
        front_object: {
            left: 48,
            bottom: 40,
            width: 21.5,
            asset_url: '/homepage/Dresden.png',
        },
        map_mask: null
    },
    {
        name: 'Sachsen Ost',
        is_in_book: true,
        route: { name: 'presets-show', params: { presetName: 'sachsen-ost' } },
        front_object: {
            left: 57.5,
            bottom: 38.3,
            width: 12,
            asset_url: '/homepage/SachsenOst.png',
        },
        map_mask: null
    },
    {
        name: 'Seasonal',
        is_in_book: true,
        route: { name: 'presets-show', params: { presetName: 'seasonal' } },
        front_object: {
            left: 68,
            bottom: 34,
            width: 14,
            asset_url: '/homepage/Seasonal1.png',
        },
        map_mask: null
    },
    {
        name: 'Kinder Jugend',
        is_in_book: true,
        route: { name: 'presets-show', params: { presetName: 'kinder-jugend' } },
        front_object: {
            left: 23.5,
            bottom: 39.8,
            width: 16,
            asset_url: '/homepage/KinderJugend.png',
        },
        map_mask: null
    },
    {
        name: 'Chemnitz',
        is_in_book: true,
        route: { name: 'presets-show', params: { presetName: 'leipzig' } },
        front_object: {
            left: 31,
            bottom: 38.7,
            width: 9,
            asset_url: '/homepage/Chemnitz.png',
            asset_mask: '/homepage/Masks/ChemnitzMask.svg',
            mask_component: ChemnitzMask
        },
        map_mask: {
            left: 18.5,
            bottom: 19.5,
            width: 1.7,
            asset_component: ChemnitzMapMask,
        }
    },
    {
        name: 'Sachsen Nord',
        is_in_book: true,
        route: { name: 'presets-show', params: { presetName: 'sachsen-nord' } },
        front_object: {
            left: 19.3,
            bottom: 35.5,
            width: 13,
            asset_url: '/homepage/SachsenNord.png',
        },
        map_mask: null
    },
    {
        name: 'Sachsen West',
        is_in_book: true,
        route: { name: 'presets-show', params: { presetName: 'sachsen-west' } },
        front_object: {
            left: 34.6,
            bottom: 34,
            width: 21,
            asset_url: '/homepage/SachsenWest.png',
        },
        map_mask: null
    },
    {
        name: 'Mediathek',
        is_in_book: false,
        route: null,
        front_object: {
            left: -1,
            bottom: 17,
            width: 14,
            asset_url: '/homepage/Mediathek.png',
        },
        map_mask: null
    },
    {
        name: 'Proberaum',
        is_in_book: false,
        route: null,
        front_object: {
            left: 79,
            bottom: 8,
            width: 21,
            asset_url: '/homepage/Proberaum.png',
        },
        map_mask: null
    },
] as Array<Link>;

useIntersectionObserver(
    deskSlide,
    ([{ isIntersecting }]) => {
        deskSlideView.value = isIntersecting;
    },
    {
        threshold: 0.5
    }
);

onMounted(() => {
    const maskElms = document.querySelectorAll('.object-interact');
    maskElms.forEach((maskEl) => {
        const maskID = parseInt(maskEl.getAttribute('data-object-id') ?? '');
        const maskPathEl = maskEl?.querySelector(`svg path`);
        maskPathEl?.addEventListener('mouseenter', objectMaskMouseEnter.bind(maskEl));
        maskPathEl?.addEventListener('mouseleave', objectMaskMouseLeave.bind(maskEl));
        maskPathEl?.addEventListener('click', routeToPreset.bind(null, maskID));
    });

    const mapMaskElms = document.querySelectorAll('.map-mask');
    mapMaskElms.forEach((mapMaskEl) =>{

        const mapMaskID = parseInt(mapMaskEl.getAttribute('data-map-mask') ?? '');
        const mapMaskPathEl = mapMaskEl?.querySelector('path');
        mapMaskPathEl?.addEventListener('mouseenter', mapMaskMouseEnter.bind(mapMaskEl));
        mapMaskPathEl?.addEventListener('mouseleave', mapMaskMouseLeave.bind(mapMaskEl));
        mapMaskPathEl?.addEventListener('click', routeToPreset.bind(null, mapMaskID));
    });
});

onUnmounted(() => {
    const masksElms = document.querySelectorAll<HTMLElement>('.object-mask');
    masksElms.forEach((maskEl) => {
        maskEl.removeEventListener('mouseenter', objectMaskMouseEnter);
        maskEl.removeEventListener('mouseleave', objectMaskMouseLeave);
    });
    /**
     *
     *
     */
});

const onDataIsReady = () => {
    setTimeout(() => {
        dataIsReady.value = true;
    }, 0);
}

const objectMaskMouseEnter = function (this: HTMLElement) {
    this.classList.add('object-interact--active');
    const objectID = this.getAttribute('data-object-id');
    const mapMaskEl = document.querySelector<HTMLElement>(`.map-mask[data-map-mask="${ objectID }"]`);
    mapMaskEl?.classList.add('opacity-100');
}
const objectMaskMouseLeave = function (this: HTMLElement) {
    this.classList.remove('object-interact--active');
    const objectID = this.getAttribute('data-object-id');
    const mapMaskEl = document.querySelector<HTMLElement>(`.map-mask[data-map-mask="${ objectID }"]`);
    mapMaskEl?.classList.remove('opacity-100');
}

const mapMaskMouseEnter = function (this: HTMLElement) {
    const objectID = this.getAttribute('data-map-mask');
    const objectMaskEl = document.querySelector<HTMLElement>(`.object-interact[data-object-id="${ objectID }"]`);
    objectMaskEl?.classList.add('object-interact--active');
    this.classList.add('opacity-100');
}
const mapMaskMouseLeave = function (this: HTMLElement) {
    const objectID = this.getAttribute('data-map-mask');
    const objectMaskEl = document.querySelector<HTMLElement>(`.object-interact[data-object-id="${ objectID }"]`);
    objectMaskEl?.classList.remove('object-interact--active');
    this.classList.remove('opacity-100');
}

const routeToPreset = function (objectID: number) {
    const route = links[objectID].route;
    if (route !== null) {
        router.push(route);
    }
}

const scrollToDesk = () => {
    deskSlide.value?.scrollIntoView({ behavior: "smooth" });
}

const deskHelpHint = () => {
    const maskElms = document.querySelectorAll('.object-interact');
    maskElms.forEach( (maskEl, index) => {
        setTimeout(() => {
            maskEl.classList.add('object-interact--active');
        }, Math.random() * 400)
    });
}

</script>

<template>
    <LibraryLayout @on-data-is-ready="onDataIsReady" @on-click-help-button="deskHelpHint">
        <div class="relative snap-mandatory">
            <div ref="introSlide" class="h-screen flex justify-center items-center snap-center min-h-[900px]">
                <div class="absolute h-screen flex items-end overflow-hidden">
                    <img
                        class="w-screen transition duration-[2500ms] delay-200 opacity-0"
                        :class="{ 'scale-125': !dataIsReady, 'scale-100 opacity-100': dataIsReady }"
                        src="/landing/Clouds.jpg"
                        alt="">
                </div>
                <div
                    class="relative max-w-6xl mx-auto duration-[1000ms] delay-300 opacity-0"
                    :class="{ 'scale-110': !dataIsReady, 'scale-100 opacity-100': dataIsReady }">
                    <div
                        class="grid grid-cols-[2fr_1fr]">
                        <div class="">
                            <div class="p-10 bg-white bg-opacity-60">
                                <h1 class="text-5xl">Deine Reise Beginnt hier!</h1>
                                <div class="space-y-10 mt-12">
                                    <p>
                                        <b>Wilkommen in unserer digitalen Chorlandschaft!</b> sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis?  Magnum Opus Maurenta!
                                    </p>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Wilkommensvideo klicken viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel fasan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo Mediathek oder den <b>Proberaum</b> lacus vel facilisis.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="">
                            <div id="balloonWrapper" class="flex justify-end">
                                <img id="balloon" class="max-w-[300px]" src="/landing/Balloon_Play.png" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="mt-[100px] flex justify-center mr-10">
                        <div class="relative">
                            <button
                                class="bg-gradient-to-b to-[#F8C300] from-[#FFF9E3] p-[2px] shadow-[8px_7px_7px_rgba(0,18,52,0.45)] group"
                                @click="scrollToDesk">
                                        <span class="group-hover:bg-white transition block py-2 px-8">
                                            Reise beginnen
                                        </span>
                            </button>
                            <div class="absolute w-full flex justify-center bottom-[-120px]">
                                <div class="grid pointer-events-none double-arrow">
                                    <img src="/icons/blue-arrow.svg" alt="">
                                    <img class="mt-[-20px]" src="/icons/blue-arrow.svg" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="h-[200px]"></div>
            <div ref="deskSlide" class="snap-center flex justify-center relative">
                <div class="flex items-end pointer-events-none">
                    <img class="w-screen " src="/homepage/Sky.jpg" alt="">
                    <img class=" absolute bottom-0" src="/homepage/Desk.png" alt="">
                </div>
                <div id="book-objects" class="absolute w-full h-full" :class="{ 'book-objects--shown': deskSlideView }">
                    <div
                        v-for="(object, key) in links"
                        :key="object"
                        :data-object-id="key"
                        class="group absolute pointer-events-none"
                        :class="{'object-interact' : object.route}"
                        :style="{
                                left: object.front_object.left + '%',
                                bottom: object.front_object.bottom + '%',
                                width: object.front_object.width + '%'
                            }">
                        <div class="transition group-[.object-interact--active]:-translate-y-1">
                            <img
                                class="w-full"
                                :class="{ 'book-inner-object': object.is_in_book }"
                                :src="object.front_object.asset_url"
                                alt="">
                        </div>
                        <div class="object-hint absolute top-[-80px] w-full flex justify-center  opacity-0 group-[.object-interact--active]:opacity-100 transition">
                            <div class="flex flex-col items-center">
                                <span class="bg-white bg-opacity-80 px-3 py-1">{{ object.name }}</span>
                                <img class="w-[30px] mt-[10px]" src="/icons/double-arrow.svg" alt="">
                            </div>
                        </div>
                        <component
                            :is="object.front_object.mask_component"
                            v-if="object.front_object.mask_component"
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
    </LibraryLayout>
</template>
<style lang="scss">

#balloon {
    animation: linear balloon 3s infinite;
}

#balloonWrapper {
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
    transform-origin: bottom;
    .book-objects--shown & .book-inner-object {
        opacity: 1;
        transform: perspective(1000px) rotateX(0);
    }
}

svg path {
    cursor: pointer;
}

</style>