<script setup lang="ts">

import LibraryVideoPreview from "@/components/frontend/LibraryVideoPreview.vue";
import { Controller, type SwiperOptions } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/scss';
import { type PropType, ref } from "vue";
import type { Video } from "@/types/Video";

defineProps({
    videos: {
        type: Array as PropType<Array<Video>>,
        required: true
    }
});

const controlledSwiper = ref();
const buttonPrev = ref<HTMLElement>();
const buttonNext = ref<HTMLElement>();
const setControlledSwiper = (swiper: SwiperOptions) => {
    controlledSwiper.value = swiper;
};

const onChange = () => {
    buttonPrev.value?.classList.remove('opacity-0')
    buttonNext.value?.classList.remove('opacity-0')
}
const onReachEnd = () => {
    buttonNext.value?.classList.add('opacity-0')
}
const onReachBeginning = () => {
    buttonPrev.value?.classList.add('opacity-0')
}

</script>

<template>
    <div v-if="videos.length" class="relative">
        <button ref="buttonPrev" class="absolute left-[-60px] w-[40px] flex h-full items-center swiper-button-prev opacity-0 transition" @click="controlledSwiper.slidePrev()">
            <img class="rotate-90 w-full" src="/icons/blue-arrow.svg" alt="">
        </button>
        <button ref="buttonNext" class="absolute right-[-60px] w-[40px] flex h-full items-center swiper-button-prev transition" @click="controlledSwiper.slideNext()">
            <img class="-rotate-90 w-full" src="/icons/blue-arrow.svg" alt="">
        </button>
        <Swiper
            :slides-per-view="3"
            :slides-per-group="3"
            :space-between="38"
            :mousewheel="true"
            css-mode="css-mode"
            :modules="[Controller]"
            @slide-change="onChange"
            @reach-beginning="onReachBeginning"
            @reach-end="onReachEnd"
            @swiper="setControlledSwiper">
            <SwiperSlide v-for="video in videos" :key="video">
                <LibraryVideoPreview :video="video" />
            </SwiperSlide>
        </Swiper>
    </div>
</template>