<script setup lang="ts">
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout.vue'
import { onMounted, ref } from 'vue'
import ChoirForm from "../../components/backend/ChoirForm.vue"
import type { Choir } from '@/types/Choir'
import VideoForm from '../../components/backend/VideoModal.vue'
import Skeleton from '../../components/backend/Skeleton.vue'
import type {Video} from "@/types/Video";
import { useAPI } from "@/composables/fetch";
import { useRoute, useRouter } from "vue-router";

const fetch = useAPI();

const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    videoID: {
        type: String,
        default: null
    }
});

const router = useRouter();
const route = useRoute();

const choirID = parseInt(props.id);

const choir = ref<Choir>();
const isVideosProcessing = ref(false);

onMounted(async () => {
    const { data } = await fetch.show<Choir>('choirs', choirID);
    choir.value = data;
})

const updateVideos = async () => {
    const response = await fetch.index<Video[]>('videos', { 'no_limit': 1, 'choir_id': choirID }, {
        processing: isVideosProcessing
    })

    if (choir.value) {
        choir.value.videos = response.data
    }
}

const closeVideModal = () => {
    if (route.name === 'choirs-edit-videos-edit') {
        router.push({ name: 'choirs-edit' });
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
                            <template v-if="choir">
                                <ChoirForm :data="choir" :is-videos-processing="isVideosProcessing" @update-videos="updateVideos" />
                                <Teleport v-if="videoID" to="#modals">
                                    <VideoForm :video-id="videoID" @update-videos="updateVideos" @close-modal="closeVideModal" />
                                </Teleport>
                            </template>
                            <Skeleton v-else/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
