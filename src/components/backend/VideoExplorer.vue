<script setup lang="ts">
import {onMounted, type PropType, ref} from 'vue'
import type { Video } from '@/types/Video'
import TextInput from '@/components/TextInput.vue'
import InputLabel from '@/components/InputLabel.vue'
import { initTooltips } from 'flowbite'
import PrimaryButton from '@/components/PrimaryButton.vue'
import { useRouter } from 'vue-router'
import {useAPI} from "@/composables/fetch";

const fetch = useAPI();

const router = useRouter()

const emits = defineEmits(['updateVideos'])
const props = defineProps({
    items: {
        type: Array as PropType<Video[]>,
        default: undefined
    },
    choirID: {
        type: Number,
        default: null
    }
})

const newVideoURL = ref('')
const newVideoProcessing = ref(false)

onMounted(() => {
    initTooltips()
})

const submitVideo = async (event : Event) => {
    await fetch.store('videos', { video_url: newVideoURL.value, choir_id: props.choirID }, {
        processing: newVideoProcessing,
        formEl: <Element>event.target,
        async onSuccess(response) {
            newVideoURL.value = ''
            emits('updateVideos')
            await router.push({ name: 'choirs-edit-videos-edit', params: { 'videoID': response.data.id } })
        }
    });
}
</script>

<template>
    <div class="">
        <div class="grid grid-cols-3 gap-5">
            <div v-for="item in items" :key="item" class="relative max-w-sm bg-white border border-gray-200 rounded-lg shadow">
                <div class="relative">
                    <img class="rounded-t-lg" :src="item.source_thumbnail_url" alt="" />
                    <div class="p-3">
                        <h5 class=" font-bold tracking-tight text-gray-900">
                            {{ item.title }}
                        </h5>
                    </div>
                    <router-link :to="{ name: 'choirs-edit-videos-edit', params: { 'videoID': item.id } }" class="absolute top-0 left-0 w-full h-full"></router-link>
                </div>
            </div>
        </div>
        <div class="mt-5">
            <InputLabel for="video_explorer_input" value="Add a new video via YouTube" />
            <form class="grid grid-flow-col gap-2 grid-cols-[1fr_auto] mt-1" @submit.prevent="submitVideo">
                <div class="relative">
                    <TextInput id="video_explorer_input" v-model="newVideoURL" type="text" class="block w-full" placeholder="YouTube URL" />
                    <div class="absolute right-0 top-0 h-full flex items-center justify-center w-10" data-tooltip-target="tooltip-youtube-input">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" color="rgba(0,0,0,0.5)" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path>
                        </svg>
                    </div>
                </div>
                <PrimaryButton type="submit" button-style="outline" :processing="newVideoProcessing">Add video</PrimaryButton>
            </form>
            <div id="tooltip-youtube-input" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
                <div class="text-xs">
                    <div class="">Examples of URLs:</div>
                    <pre>https://www.youtube.com/watch?v=pkWrunMCQ-0</pre>
                    <pre>https://youtu.be/pkWrunMCQ-0</pre>
                </div>
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
        </div>
    </div>
</template>