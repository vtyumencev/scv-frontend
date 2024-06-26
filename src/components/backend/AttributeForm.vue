<script setup lang="ts">
import { type PropType, ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'flowbite';
import Skeleton from './Skeleton.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { useRouter } from 'vue-router';
import InputLabel from '@/components/InputLabel.vue';
import TextInput from '@/components/TextInput.vue';
import type { Attribute } from '@/types/Attribute';
import { useAPI } from "@/composables/fetch";
import { useLibrary } from "@/stores/library";
import type { EditableAttributes } from "@/types/EditableAttributes";
import {useSettings} from "@/stores/settings";
import type {LanguageProfile} from "@/types/LanguageProfile";
import {toRef} from "@vueuse/core";

const router = useRouter();
const library = useLibrary();
const api = useAPI();
const settings = useSettings();

const props = defineProps({
    attributeName: {
        type: String as PropType<EditableAttributes>,
        default: ''
    },
    attributeID: {
        type: String,
        default: null
    },
    data: {
        type: Object as PropType<Attribute>,
        default: null
    },
});

interface AttributeExtended {
    name: Record<string, string>;
    id: number|null,
}

const attributeExtended = ref<AttributeExtended>();
const selectedLanguageCode = ref();
const processing = ref(false);
const deleteProcessing = ref(false);

let modal: Modal;

onMounted(async () => {
    modal = new Modal(document.getElementById('attributeEditModal'), {
        onHide: () => {
            router.push({ name: 'attribute' });
        }
    })
    modal.show();

    await settings.fetch();

    const defaultProfile = settings.general.translation_profiles.value.find((profile: LanguageProfile) => profile.is_default);

    if (defaultProfile) {
        selectedLanguageCode.value = defaultProfile.code;
    }

    const response = await api.show<AttributeExtended>(`attributes/${props.attributeName}`, parseInt(props.attributeID));
    attributeExtended.value = response.data;

    if (! attributeExtended.value) {
        return;
    }

    if (
        typeof attributeExtended.value.name !== 'object' ||
        Array.isArray(attributeExtended.value.name) ||
        attributeExtended.value.name === null
    ) {
        attributeExtended.value.name = {};
    }
})

onUnmounted(() => {
    if (modal.isVisible()) {
        modal.hide(); // It also removes all listeners https://github.com/themesberg/flowbite/blob/main/src/components/modal/index.ts
    }
})

const closeModal = () => {
    modal.hide();
};

const attribute = toRef(props, 'data');

const saveRecord = async () => {
    processing.value = true;

    const post = {
      ...attributeExtended.value,
    };

    await api.update(`attributes/${props.attributeName}`, attribute.value.id, post,{
        onSuccess() {
            library.getAttributes();
        }
    });

    processing.value = false;
};

const deleteRecord = async () => {
    await api.delete(`attributes/${props.attributeName}`, attribute.value.id, {
        processing: deleteProcessing,
        onSuccess() {
            library.getAttributes();
            router.push({ name: 'attribute' });
        }
    });
};

</script>

<template>
    <div id="attributeEditModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div class="relative w-full h-full max-w-2xl md:h-auto">
            <!-- Modal content -->
            <form class="relative bg-white rounded-lg shadow" @submit.prevent="saveRecord">
                <!-- Modal header -->
                <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <div class="text-xl font-semibold text-gray-900 dark:text-white">
                        <h3 v-if="attribute">
                            Edit {{ data.name }}
                        </h3>
                        <div v-else role="status" class="max-w-sm animate-pulse">
                            <div class="h-2.5 bg-gray-200 rounded-full w-64 mt-3"></div>
                        </div>
                    </div>
                    <select
                        v-model="selectedLanguageCode"
                        class="ml-5 rounded-md border border-gray-300 bg-white bg-opacity-60 py-1.5 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        name="lang">
                        <option
                            v-for="translation in settings.general.translation_profiles.value"
                            :key="translation"
                            :value="translation.code">
                          {{ translation.name }}
                        </option>
                    </select>
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" @click="closeModal">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div v-if="attributeExtended" class="p-6 space-y-6 max-h-[calc(100vh-220px)] overflow-auto">
                    <div class="mb-5">
                        <InputLabel value="Name" />
                        <TextInput
                            v-model="attributeExtended.name[selectedLanguageCode]"
                            type="text"
                            class="mt-1 block w-full" />
                    </div>
                </div>
                <Skeleton v-else />
                <!-- Modal footer -->
                <div class="flex items-center justify-between p-6 space-x-2 border-t border-gray-200 rounded-b">
                    <div class="">
                        <PrimaryButton type="submit" :processing="processing">Save</PrimaryButton>
                        <PrimaryButton type="button" button-style="simple" class="ml-2" @click="closeModal">Close</PrimaryButton>
                    </div>
                    <PrimaryButton type="button" button-style="danger" :processing="deleteProcessing" class="ml-2" @click="deleteRecord">Delete value</PrimaryButton>
                </div>
            </form>
        </div>
    </div>
</template>