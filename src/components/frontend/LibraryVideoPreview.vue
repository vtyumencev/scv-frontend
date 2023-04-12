<script setup lang="ts">
import type {Video} from "@/types/Video";
import {useLibrary} from "@/stores/library";
import {computed} from "vue";
import { useRoute } from "vue-router";

const library = useLibrary();

const props = defineProps<{
    video: Video,
}>();

const route = useRoute();

const choir = computed(() => {
    const video = props.video;

    if (! video.choir_id) {
        return;
    }

    return library.getChoirByID(video.choir_id);
});

</script>

<template>
    <div class="relative aspect-video">
        <img :src="video.source_thumbnail_url" class="absolute top-0 w-full h-full" alt="">
        <div class="absolute bottom-0 w-full text-white bg-black bg-opacity-50 py-1 px-2">
            <div class="uppercase text-sm leading-4">
                {{ choir?.name }}
            </div>
            <div class="relative text-xs text-ellipsis overflow-hidden whitespace-nowrap w-full">
                {{ video?.title }}
            </div>
        </div>
        <router-link
            v-if="choir"
            class="absolute top-0 left-0 w-full h-full"
            :to="{ name: 'library-choirs-show-video', params: { choirId: choir.id, videoId: video?.id }, query: route.query }"
        />
    </div>
</template>