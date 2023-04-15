<script setup lang="ts">
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import { useAPI } from "@/composables/fetch";
import { ref } from "vue";
import Select from "@/components/Select.vue";
import type { Video } from "@/types/Video";


interface NewEntries {
    rows_count: number,
    entries:  Video[],
    errors: {
        row: number,
        message: string
    }[]
}

interface UploadResponse {
    file_path: string,
    has_choirs_sheet: boolean,
    has_videos_sheet: boolean
}

const api = useAPI();

const source = ref();
const processing = ref();
const validatingProcessing = ref(false);
const savingProcessing = ref(false);
const fileSelector = ref<HTMLInputElement>();
const uploadResult = ref<UploadResponse>();
const newEntriesResult = ref<NewEntries>();

const uploadFile = async () => {
    newEntriesResult.value = undefined;
    uploadResult.value = undefined;

    if (! fileSelector.value?.files) {
        return;
    }
    const formData = new FormData();
    formData.append('file', fileSelector.value.files[0]);
    const { data } = await api.store<UploadResponse>('collection-upload', formData, {
        processing: processing,
        disableNotify: true
    });

    uploadResult.value = data;
}

const selectDataSource = async (e: Event) => {
    newEntriesResult.value = undefined;
    const el = e.target as HTMLInputElement;

    if (! el.value) {
        source.value = null;
        return;
    }

    source.value = el.value;

    const { data } = await api.store<NewEntries>('collection-upload/validate/' + source.value, {
        file_path: uploadResult.value?.file_path
    }, {
        processing: validatingProcessing,
        disableNotify: true
    });

    newEntriesResult.value = data;
}

const saveEntries = async () => {
    if (! source.value) {
        return;
    }

    await api.store<NewEntries>('collection-upload/store/' + source.value, {
        entries: newEntriesResult.value?.entries
    }, {
        processing: savingProcessing,
        successMsg: 'New entries added',
        onSuccess() {
            uploadResult.value = undefined;
            newEntriesResult.value = undefined;
        }
    });
}

</script>

<template>
    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    Uploading list from a file
                </h2>
            </div>
        </template>
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white shadow-sm sm:rounded-lg">
                    <div class="p-6 pt-10 bg-white sm:rounded-lg border-b border-gray-200">
                        <div class="max-w-3xl mx-auto">
                            <form @submit.prevent="uploadFile">
                                <label class="block mb-2 text-sm font-medium text-gray-900" for="file_input">Upload file (XLSX file format only)</label>
                                <div class="flex w-full">
                                    <div class="mr-3 grow">
                                        <input ref="fileSelector" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:placeholder-gray-400" type="file">
                                    </div>
                                    <PrimaryButton :processing="processing" button-style="outline">Upload</PrimaryButton>
                                </div>
                            </form>
                            <div v-if="uploadResult" class="mt-5">
                                <Select
                                    class="w-full"
                                    null-option="Select data for saving" :items="[
                                    { id: 'choirs', name: 'Choirs' },
                                    { id: 'videos', name: 'Videos' },
                                ]" @change="selectDataSource"/>
                            </div>
                            <div v-if="validatingProcessing" class="mt-5">
                                Validating the data...
                            </div>
                            <div v-if="newEntriesResult" class="mt-5">
                                <div class="grid grid-cols-2">
                                    <div class="">
                                        <div class="">
                                            Entries in the file: {{ newEntriesResult.rows_count }}
                                        </div>
                                        <div class="">
                                            Possible to create: {{ newEntriesResult.entries.length }}
                                        </div>
                                    </div>
                                </div>
                                <div v-if="newEntriesResult.errors.length" class="mt-5 border-t pt-5">
                                    <h3 class="text-red-600">Some errors have occurred</h3>
                                    <p>Listed below entries from the file can't be added.</p>
                                    <div class="font-bold mt-5 grid grid-cols-[100px_5fr]">
                                        <div class="">Row</div>
                                        <div class="">Error message</div>
                                    </div>
                                    <div
                                        v-for="error in newEntriesResult.errors"
                                        :key="error"
                                        class="grid grid-cols-[100px_5fr]">
                                        <div class="">{{ error.row }}</div>
                                        <div class="">{{ error.message }}</div>
                                    </div>
                                </div>
                                <PrimaryButton :processing="savingProcessing" class="mt-5" @click="saveEntries">
                                    Save {{ newEntriesResult.entries.length }} / {{ newEntriesResult.rows_count }} entries
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>