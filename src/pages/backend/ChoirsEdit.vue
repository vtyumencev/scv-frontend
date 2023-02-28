<script setup lang="ts">
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout.vue'
import { useChoirs } from '@/stores/choirs'
import { onMounted, ref } from 'vue'
import ChoirForm from "./components/ChoirForm.vue"
import type { Choir } from '@/types/Choir'
import VideoForm from './components/VideoModal.vue'
import Skeleton from './components/Skeleton.vue'

const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    videoID: {
        type: String,
        default: null
    }
})

const choirID = parseInt(props.id)
const choirsStorage = useChoirs()

const choir = ref<Choir>()
const isVideosProcessing = ref(false)

onMounted(async () => {
    choir.value = await choirsStorage.getChoir(choirID)
})

const updateVideos = async () => {
    isVideosProcessing.value = true
    const response = await choirsStorage.getVideos(choirID)
    isVideosProcessing.value = false
    if (choir.value) {
        choir.value.videos = response.data
    }
}

</script>

<template>
    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Choir {{ choir?.name }}
                </h2>
            </div>
        </template>
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white shadow-sm sm:rounded-lg">
                    <div class="p-6 pt-10 bg-white sm:rounded-lg border-b border-gray-200">
                        <div class="max-w-3xl mx-auto">
                            <ChoirForm v-if="choir" :data="choir" :isVideosProcessing="isVideosProcessing" @update-videos="updateVideos" />
                            <Skeleton v-else/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template #modals>
            <VideoForm v-if="videoID" :videoID="videoID" @update-videos="updateVideos" />
        </template>
    </AuthenticatedLayout>
</template>
