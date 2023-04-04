<script setup lang="ts">
import type {Video} from "@/types/Video";
import {useLibrary} from "@/stores/library";
import {computed} from "vue";

const library = useLibrary();

const props = defineProps<{
    video: Video,
}>();

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
        <router-link
            :to="{ name: 'library', params: { } }"
            class="absolute top-0 left-0 w-full h-full" />
        <div class="absolute bottom-0 w-full text-white bg-black bg-opacity-50 py-1 px-2">
            <div class="uppercase text-sm leading-4">
                <router-link v-if="choir" :to="{ name: 'library-choirs-show', params: { choirId: choir.id } }">
                    {{ choir?.name }}
                </router-link>
            </div>
            <div class="relative text-xs text-ellipsis overflow-hidden whitespace-nowrap w-full">
                <router-link :to="{ name: 'library', params: { } }">
                    {{ video.title }}
                </router-link>
            </div>
        </div>
    </div>
</template>