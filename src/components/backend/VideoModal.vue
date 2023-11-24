<script setup lang="ts">
import type { Video } from '@/types/Video';
import { Modal } from 'flowbite';
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router'
import InputLabel from '@/components/InputLabel.vue'
import TextInput from '@/components/TextInput.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import SelectSimple from '@/components/SelectSimple.vue'
import { useLibrary } from '@/stores/library';
import Skeleton from './Skeleton.vue'
import { useAPI } from "@/composables/fetch";
import type { Attribute } from "@/types/Attribute";
import {formatDateForm, formatDateTime} from "@/helpers/datetime";
import SelectDate from "@/components/backend/SelectDate.vue";

const emits = defineEmits(['updateVideos', 'closeModal']);
const props = defineProps({
    videoId: {
        type: String,
        default: null
    }
});

const fetch = useAPI();

const stageStore = useLibrary();

const router = useRouter()

let modal : Modal

const data = ref<Video>()
const processing = ref(false)
const deleteProcessing = ref(false)

const videoID = parseInt(props.videoId)

onMounted(async () => {
    modal = new Modal(document.getElementById('videoEditModal'), {
        backdrop: 'static',
        onHide: () => {
            //router.push({ name: 'choirs-edit' })
            emits('closeModal');
        }
    })
    modal.show()

    const response = await fetch.show<Video>('videos', videoID)
    data.value = response.data
})

onUnmounted(() => {
    if (modal.isVisible()) {
        modal.hide() // It also removes all listeners https://github.com/themesberg/flowbite/blob/main/src/components/modal/index.ts
    }
})

const videoDurationText = computed(() => {
    const duration = data.value?.duration;
    if (duration) {
        const min = Math.floor(duration / 60);
        const sec = duration - min * 60;
        return min + ':' + (sec < 10 ? '0' : '') + sec;
    } else {
        return '--:--';
    }
})

const closeModal = () => {
    modal.hide();
}

const saveRecord = async (event : Event) => {
    if (!data.value) {
        return;
    }

    await fetch.update('videos', videoID, data.value, {
        processing: processing,
        formEl: <Element>event.target,
        onSuccess() {
            emits('updateVideos');
        }
    });
}
const deleteRecord = async () => {

    await fetch.delete('videos', videoID, {
        processing: deleteProcessing,
        notifyOptions: {
            onClick: async () => {
                const response = await fetch.restore('videos', videoID);
                if (! response.error) {
                    await router.push({ name: 'choirs-edit-videos-edit', params: { videoID: videoID } });
                }
            }
        },
        onSuccess: async () => {
            emits('updateVideos');
            await router.push({ name: 'choirs-edit' });
        }
    });
}

const showPlaceSelector = computed((): boolean => {
    if (! data.value?.landscape_id) {
        return false;
    }
    const result = stageStore.attributes?.landscapes.find(attr => attr.id == data.value?.landscape_id)?.bound_place_id;
    return !result;

});

const availablePlaces = computed((): Attribute[] => {
    return stageStore.attributes?.places.filter(attr => attr.is_hidden === false) ?? [];
});

</script>

<template>
    <div id="videoEditModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div class="relative w-full h-full max-w-2xl md:h-auto">
            <!-- Modal content -->
            <form class="relative bg-white rounded-lg shadow" @submit.prevent="saveRecord">
                <!-- Modal header -->
                <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white overflow-ellipsis overflow-hidden whitespace-nowrap">
                        <template v-if="data">
                            {{ data.title }}
                        </template>
                        <div v-else role="status" class="max-w-sm animate-pulse">
                            <div class="h-2.5 bg-gray-200 rounded-full w-64 mt-3"></div>
                        </div>
                    </h3>
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" @click="closeModal">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div v-if="data" class="p-6 space-y-6 max-h-[calc(100vh-220px)] overflow-auto">
                    <div class="mb-5 relative">
                        <img class="aspect-video rounded-md h-[120px] block" :src="data.source_thumbnail_url" alt="">
                        <div class="absolute bottom-2 left-2 text-white text-sm leading-none bg-black bg-opacity-30 px-2 py-0.5 rounded-md">{{ videoDurationText }}</div>
                        <a
                            :href="`https://youtu.be/${ data.source_vid }`"
                            target="_blank"
                            class="absolute top-0 left-0 w-full h-full"></a>
                    </div>
                    <div class="mb-5">
                        <InputLabel value="Lied Name" />
                        <TextInput
                            v-model="data.title"
                            type="text"
                            class="mt-1 block w-full"
                            autofocus
                            autocomplete="title" />
                        <div class="text-sm text-red-600" data-error-for="title"></div>
                    </div>
                    <div class="mb-5">
                        <InputLabel value="Komponist" />
                        <TextInput
                            v-model="data.composer"
                            type="text"
                            class="mt-1 block w-full"
                            autocomplete="title" />
                    </div>
                    <div class="mb-5">
                        <InputLabel value="Chorleitung" />
                        <TextInput
                            v-model="data.choir_leader"
                            type="text"
                            class="mt-1 block w-full"
                            autocomplete="title" />
                    </div>
                    <div class="mb-5">
                        <InputLabel value="Genre" />
                        <SelectSimple
                            v-model="data.genre_id"
                            class="mt-1 block w-full"
                            null-option="Genre ist nicht ausgewählt"
                            :items="stageStore.attributes?.genres ?? []" />
                    </div>
                    <div class="mb-5">
                        <InputLabel value="Stil" />
                        <SelectSimple
                            v-model="data.style_id"
                            class="mt-1 block w-full"
                            null-option="Stil ist nicht ausgewählt"
                            :items="stageStore.attributes?.styles ?? []" />
                    </div>
                    <div class="mb-5">
                        <InputLabel value="Published at" />
                        <SelectDate
                            v-model="data.published_at"
                            class="mt-1 block w-full"
                        />
                    </div>
                    <div class="border-t pt-5">
                        <h3 class="text-lg">Stage preferences</h3>
                        <div class="mt-3" :class="{ 'grid grid-cols-2 gap-5' : showPlaceSelector }">
                            <div class="">
                                <InputLabel value="Landscape" />
                                <SelectSimple
                                    v-model="data.landscape_id"
                                    class="mt-1 block w-full"
                                    null-option="Landscape ist nicht ausgewählt"
                                    :items="stageStore.attributes?.landscapes ?? []" />
                            </div>
                            <div v-if="showPlaceSelector" class="">
                                <InputLabel value="Veranstaltungsort" />
                                <SelectSimple
                                    v-model="data.place_id"
                                    class="mt-1 block w-full"
                                    null-option="Veranstaltungsort ist nicht ausgewählt"
                                    :items="availablePlaces ?? []" />
                            </div>
                        </div>
                    </div>
                    <div class="text-sm">
                        <div>
                            Video was added {{ formatDateTime(data.created_at) }}
                        </div>
                        <div>
                            Modified {{ formatDateTime(data.updated_at) }}
                        </div>
                    </div>
                </div>
                <Skeleton v-else />
                <!-- Modal footer -->
                <div class="flex items-center justify-between px-6 py-3 space-x-2 border-t border-gray-200 rounded-b">
                    <div class="">
                        <PrimaryButton type="submit" :processing="processing">Save</PrimaryButton>
                        <PrimaryButton type="button" button-style="simple" class="ml-2" @click="closeModal">Close</PrimaryButton>
                    </div>
                    <PrimaryButton type="button" button-style="danger" :processing="deleteProcessing" @click="deleteRecord" class="ml-2">Delete video</PrimaryButton>
                </div>
            </form>
        </div>
    </div>
</template>