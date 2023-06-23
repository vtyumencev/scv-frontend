<script setup lang="ts">

import { onMounted, onUnmounted, ref } from "vue";
import { Modal } from "flowbite";
import { useAPI } from "@/composables/fetch";
import PrimaryButton from "@/components/PrimaryButton.vue";

const emits = defineEmits<{
    (e: 'closeModal'): void
}>();

interface ListItem {
    id: number,
    title: string,
    choir_id: number,
    source_vid: string,
    source_error: boolean,
    source_error_message?: string,
}

let modal : Modal;

const loading = ref(false);
const api = useAPI();
const list = ref<ListItem[]>([]);
const isActive = ref(false);

onMounted( () => {
    modal = new Modal(document.getElementById('checkForVideosModal'), {
        backdrop: "static",
        onHide: () => {
            emits('closeModal');
        }
    })
    modal.show();

});

const check = async () => {

    isActive.value = true;

    const response = await api.index<ListItem[]>('videos/check-broken-links', {}, {
        processing: loading,
        disableNotify: true
    });

    list.value = response.data ?? [];
}

onUnmounted(() => {
    modal.hide();
});

const closeModal = () => {
    modal.hide();
}

</script>

<template>
    <div id="checkForVideosModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div class="relative w-full h-full max-w-5xl md:h-auto">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow">
                <!-- Modal header -->
                <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        Check for broken YouTube links
                    </h3>
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" @click="closeModal">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div class="p-6 space-y-6 max-h-[calc(100vh-220px)] overflow-auto">
                    <div class="border px-3 py-2 bg-gray-50">
                        <p class="">
                            This tool scans every existing video in the database, fetches its YouTube source video and detects problems such as deleted video, hidden video or not embeddable video.
                        </p>
                    </div>
                    <div v-if="! isActive" class="">
                        <PrimaryButton @click="check">
                            Start scanning
                        </PrimaryButton>
                    </div>
                    <template v-else>
                        <div v-if="loading" class="">
                            Checking for all the videos...
                        </div>
                        <div v-else-if="list.length" class="">
                            <div class="mb-4 text-lg">List of problems</div>
                            <div class="grid grid-cols-[3fr_2fr_2fr] font-extrabold">
                                <div>Video title</div>
                                <div>Video URL</div>
                                <div>Error message</div>
                            </div>
                            <ul>
                                <li
                                    v-for="item in list" :key="item"
                                    class="mt-2 grid grid-cols-[3fr_2fr_2fr]">
                                    <router-link
                                        v-if="item.choir_id"
                                        :to="{ name: 'choirs-edit-videos-edit', params: { id: item.choir_id, videoID: item.id }}"
                                        class="text-indigo-500">
                                        {{ item.title }}
                                    </router-link>
                                    <a
                                        :href="'https://youtu.be/' + item.source_vid"
                                        target="_blank"
                                        class="text-indigo-600">
                                        https://youtu.be/{{ item.source_vid }}
                                    </a>
                                    <span>{{ item.source_error_message }}</span>
                                </li>
                            </ul>
                        </div>
                        <div v-else>
                            <div class="">Checking is finished</div>
                            <div class="">Broken links not found</div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>