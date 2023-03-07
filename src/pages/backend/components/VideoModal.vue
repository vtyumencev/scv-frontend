<script setup lang="ts">
import type { Video } from '@/types/Video';
import { Modal } from 'flowbite';
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router'
import InputLabel from '@/components/InputLabel.vue'
import TextInput from '@/components/TextInput.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import Select from '@/components/Select.vue'
import { useStage } from '@/stores/stage';
import Editor from '@tinymce/tinymce-vue';
import Skeleton from './Skeleton.vue'
import Checkbox from '@/components/Checkbox.vue';
import { useFetch } from "@/composables/fetch";

const emits = defineEmits(['updateVideos']);
const props = defineProps({
    videoID: {
        type: String,
        default: null
    }
});

const fetch = useFetch();

const stageStore = useStage();

const router = useRouter()

let modal : Modal

const data = ref<Video>()
const processing = ref(false)
const deleteProcessing = ref(false)

const videoID = parseInt(props.videoID)

onMounted(async () => {
    modal = new Modal(document.getElementById('videoEditModal'), {
        backdrop: 'static',
        onHide: () => {
            router.push({ name: 'choirs-edit' })
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
    const duration = data.value?.duration
    if (duration) {
        const min = Math.floor(duration / 60)
        const sec = duration - min * 60
        return min + ':' + (sec < 10 ? '0' : '') + sec
    } else {
        return '--:--'
    }
})

const closeModal = () => {
    modal.hide()
}

const saveRecord = async (event : Event) => {
    if (!data.value) {
        return
    }

    await fetch.update('videos', videoID, data.value, {
        processing: processing,
        formEl: <Element>event.target,
        onSuccess() {
            emits('updateVideos')
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

</script>

<template>
    <div id="videoEditModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div class="relative w-full h-full max-w-2xl md:h-auto">
            <!-- Modal content -->
            <form @submit.prevent="saveRecord" class="relative bg-white rounded-lg shadow">
                <!-- Modal header -->
                <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        <template v-if="data">
                            {{ data.title }}
                        </template>
                        <div v-else role="status" class="max-w-sm animate-pulse">
                            <div class="h-2.5 bg-gray-200 rounded-full w-64 mt-3"></div>
                        </div>
                    </h3>
                    <button type="button" @click="closeModal" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div class="p-6 space-y-6 max-h-[calc(100vh-220px)] overflow-auto" v-if="data">
                    <div class="mb-5 relative">
                        <img class="aspect-video rounded-md h-[120px] block" :src="data.source_thumbnail_url" alt="">
                        <div class="absolute bottom-2 left-2 text-white text-sm leading-none bg-black bg-opacity-30 px-2 py-0.5 rounded-md">{{ videoDurationText }}</div>
                    </div>
                        <div class="mb-5">
                            <InputLabel value="Lied Name" />
                            <TextInput
                                type="text"
                                class="mt-1 block w-full"
                                v-model="data.title"
                                autofocus
                                autocomplete="title" />
                            <div class="text-sm text-red-600" data-error-for="title"></div>
                        </div>
                        <div class="mb-5">
                            <InputLabel value="Komponist" />
                            <TextInput
                                type="text"
                                class="mt-1 block w-full"
                                v-model="data.composer"
                                autocomplete="title" />
                        </div>
                        <div class="mb-5">
                            <InputLabel value="Veranstaltungsort" />
                            <Select class="mt-1 block w-full" v-model="data.place_id" :items="stageStore.attributes.places"></Select>
                        </div>
                        <div class="mb-5">
                            <InputLabel value="Genre" />
                            <Select class="mt-1 block w-full" v-model="data.genre_id" :items="stageStore.attributes.genres"></Select>
                        </div>
                        <div class="mb-5">
                            <InputLabel value="Stil" />
                            <Select class="mt-1 block w-full" v-model="data.style_id" :items="stageStore.attributes.styles"></Select>
                        </div>
                        <div class="mt-5">
                            <label class="flex items-center">
                                <Checkbox 
                                    :checked="data.is_kids_and_youth"
                                    v-model="data.is_kids_and_youth" />
                                <span class="ml-2 text-sm text-gray-600">Kinder&Jugend</span>
                            </label>
                        </div>
                        <div class="mt-5">
                            <label class="flex items-center">
                                <Checkbox 
                                    :checked="data.is_rehearsal"
                                    v-model="data.is_rehearsal" />
                                <span class="ml-2 text-sm text-gray-600">Probenraum</span>
                            </label>
                        </div>
                        <div class="mb-5">
                            <InputLabel value="Lied Text" />
                            <div class="mt-1">
                            <Editor
                                v-model="data.text"
                                api-key="op3eberm4qqzqgzve9vd9r6yltyha972vb406vlc4n53tc9d"
                                :init="{
                                    height: 200,
                                    plugins: 'lists link image table code',
                                    toolbar: 'undo redo | bold italic underline link | backcolor | numlist bullist | alignleft aligncenter',
                                    menubar: false
                                }"
                                />
                            </div>
                        </div>
                </div>
                <Skeleton v-else />
                <!-- Modal footer -->
                <div class="flex items-center justify-between p-6 space-x-2 border-t border-gray-200 rounded-b">
                    <div class="">
                        <PrimaryButton type="submit" :processing="processing">Save</PrimaryButton>
                        <PrimaryButton type="button" buttonStyle="simple" @click="closeModal" class="ml-2">Close</PrimaryButton>
                    </div>
                    <PrimaryButton type="button" buttonStyle="danger" @click="deleteRecord" :processing="deleteProcessing" class="ml-2">Delete video</PrimaryButton>
                </div>
            </form>
        </div>
    </div>
</template>