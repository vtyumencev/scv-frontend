<script setup lang="ts">
import LibraryVideoPreview from "@/components/frontend/LibraryVideoPreview.vue";
import { Pagination, Controller, type SwiperOptions } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/scss';
import 'swiper/css/pagination';
import { computed, type PropType, ref } from "vue";
import type { Video } from "@/types/Video";

const props = defineProps({
    videos: {
        type: Array as PropType<Array<Video>>,
        required: true
    },
    rows: {
        type: Number,
        default: 3
    }
});

const controlledSwiper = ref();
const buttonPrev = ref<HTMLElement>();
const buttonNext = ref<HTMLElement>();
const setControlledSwiper = (swiper: SwiperOptions) => {
    controlledSwiper.value = swiper;
};

const videosCountPerSlide = computed(() => {
    return props.rows * 3;
});
const pagesCount = computed(() => {
    return Math.ceil(props.videos.length / videosCountPerSlide.value);
});

const onChange = () => {
    buttonPrev.value?.classList.remove('opacity-30')
    buttonNext.value?.classList.remove('opacity-30')
}
const onReachEnd = () => {
    buttonNext.value?.classList.add('opacity-30')
}
const onReachBeginning = () => {
    buttonPrev.value?.classList.add('opacity-30')
}


</script>

<template>
    <div v-if="videos.length" class="relative">
        <Swiper
            :space-between="38"
            :pagination="{
                dynamicBullets: true,
                clickable: true
            }"
            :mousewheel="true"
            css-mode="css-mode"
            :modules="[Pagination, Controller]"
            @slide-change="onChange"
            @reach-beginning="onReachBeginning"
            @reach-end="onReachEnd"
            @swiper="setControlledSwiper">
            <SwiperSlide v-for="slideId in pagesCount" :key="slideId">
                <div class="grid grid-cols-3 gap-10 text-theme-alpha">
                    <LibraryVideoPreview v-for="video in videos.slice(videosCountPerSlide * (slideId - 1), videosCountPerSlide * slideId)" :key="video" :video="video" />
                </div>
            </SwiperSlide>
        </Swiper>
        <div class="absolute bottom-[0px] z-10 w-full grid grid-flow-col gap-[100px] justify-center pointer-events-none">
            <button ref="buttonPrev" class="pointer-events-auto text-theme-alpha opacity-30" @click="controlledSwiper.slidePrev()">
                <img class="rotate-90 h-[10px]" src="/icons/blue-arrow.svg" alt="">
            </button>
            <button ref="buttonNext" class="pointer-events-auto text-theme-alpha" @click="controlledSwiper.slideNext()">
                <img class="-rotate-90 h-[10px]" src="/icons/blue-arrow.svg" alt="">
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .swiper {
        --swiper-theme-color: #66C6EF;
        padding-bottom: 30px;
        --swiper-pagination-bottom: 0px
    }
    html.dark .swiper {
        --swiper-pagination-bullet-inactive-color: rgb(255 255 255);
    }
</style>