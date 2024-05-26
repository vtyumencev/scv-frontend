<script setup lang="ts">
import { type PropType, ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'flowbite';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { useRouter } from 'vue-router';
import InputLabel from '@/components/InputLabel.vue';
import TextInput from '@/components/TextInput.vue';
import { useAPI } from "@/composables/fetch";
import { useLibrary } from "@/stores/library";
import type { EditableAttributes } from "@/types/EditableAttributes";

const router = useRouter();
const library = useLibrary();
const api = useAPI();

const props = defineProps({
    attributeName: {
        type: String as PropType<EditableAttributes>,
        default: ''
    },
});

const valueName = ref('');
const processing = ref(false);

let modal: Modal;

onMounted(async () => {
    modal = new Modal(document.getElementById('attributeEditModal'), {
        onHide: () => {
            router.push({ name: 'attribute' });
        }
    })
    modal.show();
})

onUnmounted(() => {
    if (modal.isVisible()) {
        modal.hide(); // It also removes all listeners https://github.com/themesberg/flowbite/blob/main/src/components/modal/index.ts
    }
})

const closeModal = () => {
    modal.hide();
};

const saveRecord = async () => {
    processing.value = true;

    await api.store(`attributes/${props.attributeName}`, {
        name: valueName.value
    },{
        onSuccess() {
            library.getAttributes();
            router.push({ name: 'attribute' });
        }
    });

    processing.value = false;
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
                        <h3>New value</h3>
                    </div>
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" @click="closeModal">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div class="p-6 space-y-6 max-h-[calc(100vh-220px)] overflow-auto">
                    <div class="mb-5">
                        <InputLabel value="Name" />
                        <TextInput
                            v-model="valueName"
                            type="text"
                            class="mt-1 block w-full" />
                    </div>
                </div>
                <!-- Modal footer -->
                <div class="flex items-center justify-between p-6 space-x-2 border-t border-gray-200 rounded-b">
                    <PrimaryButton type="submit" :processing="processing">Add value</PrimaryButton>
                    <PrimaryButton type="button" button-style="simple" class="ml-2" @click="closeModal">Close</PrimaryButton>
                </div>
            </form>
        </div>
    </div>
</template>