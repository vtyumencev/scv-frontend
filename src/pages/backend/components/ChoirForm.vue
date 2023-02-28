<script setup lang="ts">
import type { Choir } from '@/types/Choir';
import { onMounted, ref, type PropType } from 'vue';
import TextInput from '@/components/TextInput.vue';
import InputLabel from '@/components/InputLabel.vue';
import Select from '@/components/Select.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { useStage } from '@/stores/stage';
import { useChoirs } from '@/stores/choirs';
import { fetchStatusHandler } from '@/helpers/fetchStatusHandler';
import Editor from '@tinymce/tinymce-vue';
import VideoExplorer from './VideoExplorer.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const stageStore = useStage();
const choirsStore = useChoirs();

const processing = ref(false);
const deleteProcessing = ref(false);
const formEl = ref();

const props = defineProps({
    data: {
        type: Object as PropType<Choir>,
        default: { }
    },
    isVideosProcessing: {
        type: Boolean
    }
});

onMounted(async () => {
    stageStore.getAttributes()
});

const save = async (e : Event) => {
    processing.value = true;
    const response = await choirsStore.saveChoir(props.data.id, props.data);
    fetchStatusHandler(response, 'update', { formEl: formEl.value });
    processing.value = false;
    return response.status;
}

const saveAndNew = async (e : Event) => {
    if (processing.value) {
        return;
    }
    const status = await save(e);
    if (status === 204) {
        router.push({ name: 'choirs-new' });
    }
}

const deleteRecord = async () => {
    deleteProcessing.value = true
    const response = await choirsStore.deleteChoir(props.data.id);
    fetchStatusHandler(response, 'delete', {
        restore: {
            title: '',
            onRestore: async () => {
                const response = await choirsStore.restoreChoir(props.data.id);
                fetchStatusHandler(response, 'restore');
                if (response.status === 204) {
                    router.push({ name: 'choirs-edit', params: { id: props.data.id } });
                }
            }
        }
    });
    if (response.status === 204) {
        router.push({ name: 'choirs-index' });
    }
    deleteProcessing.value = false
}

</script>

<template>
    <form ref="formEl" @submit.prevent="save" action="">
        <div class="mb-5">
            <InputLabel for="name" value="Name" />
            <TextInput type="text" class="mt-1 block w-full" v-model="data.name" autocomplete="name" />
            <div class="text-sm text-red-600" data-error-for="name"></div>
        </div>
        <div class="mb-5">
            <InputLabel value="Region" />
            <Select class="mt-1 block w-full" name="Region is not selected" :items="stageStore.attributes.regions" v-model="data.region_id"></Select>
        </div>
        <div class="mb-5">
            <InputLabel value="Chortyp" />
            <Select class="mt-1 block w-full" name="Type is not selected" :items="stageStore.attributes.choir_types" v-model="data.type_id"></Select>
        </div>
        <div class="mb-5">
            <InputLabel value="Videos" />
            <div class="mt-1 p-4 border rounded-md relative">
                <VideoExplorer :items="data.videos" :choirID="data.id" v-bind="$attrs"></VideoExplorer>
                <template v-if="isVideosProcessing">
                    <div class="absolute top-0 left-0 h-full w-full rounded-md bg-white bg-opacity-80"></div>
                    <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                        <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </template>
            </div>
        </div>
        <div class="mb-5">
            <InputLabel for="name" value="Chorleitung" />
            <TextInput type="text" class="mt-1 block w-full" v-model="data.director" />
        </div>
        <div class="mb-5">
            <InputLabel for="name" value="Adresse" />
            <TextInput type="text" class="mt-1 block w-full" v-model="data.contact_address" />
        </div>
        <div class="mb-5">
            <InputLabel for="name" value="Probenzeit" />
            <TextInput type="text" class="mt-1 block w-full" v-model="data.rehearsal_time" />
        </div>
        <div class="mb-5">
            <InputLabel for="name" value="Telefonnumer" />
            <TextInput type="text" class="mt-1 block w-full" v-model="data.contact_phone" />
        </div>
        <div class="mb-5">
            <InputLabel for="name" value="Mailadresse" />
            <TextInput type="text" class="mt-1 block w-full" v-model="data.contact_email" />
        </div>
        <div class="mb-5">
            <InputLabel for="name" value="Website" />
            <TextInput type="text" class="mt-1 block w-full" v-model="data.contact_website" />
        </div>
        <div class="mb-5">
            <InputLabel value="Beschreibung" />
            <div class="mt-1">
            <Editor
                v-model="data.description"
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
        <div class="flex justify-between mb-5 sticky bottom-0 py-3 bg-white z-[2] border-t">
            <div class="">
                <PrimaryButton type="submit" :processing="processing">Save</PrimaryButton>
                <PrimaryButton @click="saveAndNew" type="button" class="ml-2" :class="{'opacity-80' : processing}">Save and add new</PrimaryButton>
            </div>
            <PrimaryButton @click="deleteRecord" type="button" button-style="danger" :processing="deleteProcessing">Delete</PrimaryButton>
        </div>
    </form>
</template>