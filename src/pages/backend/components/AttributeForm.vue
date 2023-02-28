<script setup lang="ts">

import { type PropType, computed, ref, onMounted, onUnmounted } from 'vue';
import { useAttributes, type EditableAttributes } from '@/stores/attributes';
import { Modal } from 'flowbite';
import Skeleton from './Skeleton.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { useRouter } from 'vue-router';
import InputLabel from '@/components/InputLabel.vue';
import TextInput from '@/components/TextInput.vue';
import type { Attribute } from '@/types/Attribute';
import { fetchStatusHandler } from '@/helpers/fetchStatusHandler';

let attributesStorage = useAttributes();
const router = useRouter();

const props = defineProps({
    attributeName: {
        type: String as PropType<EditableAttributes>,
        default: ''
    },
    attributeID: {
        type: String,
        default: null
    },
    isAddNew: {
        type: Boolean,
        default: true
    }
});

const attributeID = parseInt(props.attributeID);

const processing = ref(false);
const deleteProcessing = ref(false);

let modal : Modal

onMounted(async () => {
    modal = new Modal(document.getElementById('attributeEditModal'), {
        onHide: () => {
            router.push({ name: 'attribute' })
        }
    })
    modal.show()
})

onUnmounted(() => {
    if (modal.isVisible()) {
        modal.hide() // It also removes all listeners https://github.com/themesberg/flowbite/blob/main/src/components/modal/index.ts
    }
})

const closeModal = () => {
    modal.hide();
};

const data = computed(() => {
    if (props.isAddNew) {
        return ref<Attribute>({
            'id': 0,
            'name': ''
        }).value
    } else {
        const namedAttributes = attributesStorage.list[props.attributeName];
        if (namedAttributes !== undefined) {
            return namedAttributes.find(elm => elm.id === attributeID);
        }
    }
});

const saveRecord = async () => {
    if (! data.value) {
        return;
    }
    processing.value = true;
    if (props.isAddNew) {
        const response = await attributesStorage.storeAttributeValue(props.attributeName, data.value);
        fetchStatusHandler(response, 'store');
        if (response.status === 201) {
            attributesStorage.getAttributes()
            router.push({ name: 'attribute' })
        }
    } else {
        const response = await attributesStorage.updateAttributeValue(props.attributeName, data.value);
        fetchStatusHandler(response, 'update');
        if (response.status === 204) {
            attributesStorage.getAttributes()
        }
    }
    processing.value = false;
};

const deleteRecord = async () => {
    if (! data.value?.id) {
        return;
    }
    deleteProcessing.value = true
    const response = await attributesStorage.deleteAttributeValue(props.attributeName, data.value?.id)
    fetchStatusHandler(response, 'delete')
    if (response.status === 204) {
        attributesStorage.getAttributes()
        router.push({ name: 'attribute' })
    }
    deleteProcessing.value = false
};

</script>

<template>
    <div id="attributeEditModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div class="relative w-full h-full max-w-2xl md:h-auto">
            <!-- Modal content -->
            <form @submit.prevent="saveRecord" class="relative bg-white rounded-lg shadow">
                <!-- Modal header -->
                <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        <template v-if="data && props.isAddNew && !data.name">
                            New value
                        </template>
                        <template v-else-if="data">
                            Edit {{ data.name }}
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
                    <div class="mb-5">
                        <InputLabel value="Name" />
                        <TextInput
                            type="text"
                            class="mt-1 block w-full"
                            v-model="data.name"
                            autofocus
                            autocomplete="title" />
                    </div>
                </div>
                <Skeleton v-else />
                <!-- Modal footer -->
                <div class="flex items-center justify-between p-6 space-x-2 border-t border-gray-200 rounded-b">
                    <div class="">
                        <PrimaryButton type="submit" :processing="processing">Save</PrimaryButton>
                        <PrimaryButton type="button" buttonStyle="simple" @click="closeModal" class="ml-2">Close</PrimaryButton>
                    </div>
                    <PrimaryButton v-if="! isAddNew" type="button" buttonStyle="danger" @click="deleteRecord" :processing="deleteProcessing" class="ml-2">Delete value</PrimaryButton>
                </div>
            </form>
        </div>
    </div>
</template>