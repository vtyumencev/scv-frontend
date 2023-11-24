<script setup lang="ts">
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import { useAPI } from "@/composables/fetch";
import { computed, onBeforeMount, ref, watch } from "vue";
import SelectSimple from "@/components/SelectSimple.vue";
import type { Video } from "@/types/Video";
import { useRouter } from "vue-router";
import Checkbox from "@/components/Checkbox.vue";

const exportLink = import.meta.env.VITE_PUBLIC_BACKEND_URL + '/api/collection-export';

interface NewEntries {
    rows_count: number,
    entries:  Video[],
    skipped_count: number,
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

const props = defineProps<{
    filePath?: string
}>();

const router = useRouter();

const api = useAPI();

const source = ref();
const processing = ref(false);
const validatingProcessing = ref(false);
const savingProcessing = ref(false);
const fileSelector = ref<HTMLInputElement>();
const uploadResult = ref<UploadResponse>();
const newEntriesResult = ref<NewEntries>();

onBeforeMount(async () => {
    if (props.filePath) {
        await validateFile(props.filePath);
    }
});

watch(() => props.filePath, (newValue) => {
    if (newValue) {
        validateFile(newValue);
    } else {
        uploadResult.value = undefined;
    }
})

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

    if (data) {
        await router.push({ query: { 'file-path': data.file_path } });
    }
}

const validateFile = async (filePath: string) => {
    const { data } = await api.index<UploadResponse>('collection-upload/validate/file', {
        file_path: filePath
    });

    if (data) {
        uploadResult.value = data;
    }
}

const selectDataSource = async (e: SubmitEvent) => {
    newEntriesResult.value = undefined;
    const el = e.currentTarget as HTMLFormElement;

    const formData = new FormData(el);
    const dataSource = formData.get('data_source');
    const dataIgnoreExisting = !!formData.get('ignore_existing');

    if (! dataSource) {
        source.value = null;
        return;
    }

    source.value = dataSource;

    const { data } = await api.store<NewEntries>('collection-upload/validate/' + source.value, {
        file_path: uploadResult.value?.file_path,
        ignore_existing: dataIgnoreExisting
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
            //uploadResult.value = undefined;
            //newEntriesResult.value = undefined;
        }
    });
}

const resetUpload = () => {
    router.push({ query: { 'file-path': null } });
}

</script>

<template>
    <AuthenticatedLayout>
        <template #header>
            <div class="flex w-full justify-between items-center">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    Export & Import
                </h2>
                <a :href="exportLink" target="_blank" download="">
                    <PrimaryButton>Export choirs & videos</PrimaryButton>
                </a>
            </div>
        </template>
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white shadow-sm sm:rounded-lg">
                    <div class="p-6 pt-10 bg-white sm:rounded-lg border-b border-gray-200">
                        <div class="max-w-3xl mx-auto">
                            <div class="mb-8">
                                <h1 class="text-lg">Import data</h1>
                            </div>
                            <div class="mb-5 pb-2 border-b">Step 1</div>
                            <div v-if="uploadResult">
                                <div class="">Selected file: {{ uploadResult.file_path }}</div>
                                <div class="mt-1">
                                    <button class="text-indigo-600" @click="resetUpload">Upload another file</button>
                                </div>
                            </div>
                            <form v-else @submit.prevent="uploadFile">
                                <label class="block mb-2 text-sm font-medium text-gray-900" for="file_input">Upload file (XLSX file format only)</label>
                                <div class="flex w-full">
                                    <div class="mr-3 grow">
                                        <input ref="fileSelector" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:placeholder-gray-400" type="file">
                                    </div>
                                    <PrimaryButton :processing="processing" button-style="outline">Upload</PrimaryButton>
                                </div>
                            </form>
                            <div v-if="uploadResult" class="mt-5">
                                <div class="mb-5 pb-2 border-b">Step 2</div>
                                <form @submit.prevent="selectDataSource">
                                    <SelectSimple
                                        class="w-full"
                                        name="data_source"
                                        null-option="Select data for saving" :items="[
                                        { id: 'choirs', name: 'Choirs' },
                                        { id: 'videos', name: 'Videos' },
                                    ]"/>
                                    <div class="mt-3 flex items-center">
                                        <Checkbox id="ignoreExisting" name="ignore_existing" checked />
                                        <label class="ml-3" for="ignoreExisting">Ignore existing entries</label>
                                    </div>
                                    <div class="mt-5">
                                        <PrimaryButton :processing="processing" button-style="outline">Validate data</PrimaryButton>
                                    </div>
                                </form>
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
                                            Skipped entries: {{ newEntriesResult.skipped_count }}
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
                                <div v-if="newEntriesResult.entries.length" class="mt-5">
                                    <div class="mb-5 pb-2 border-b">Step 3</div>
                                    <PrimaryButton :processing="savingProcessing" @click="saveEntries">
                                        Save {{ newEntriesResult.entries.length }} / {{ newEntriesResult.rows_count }} entries
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>