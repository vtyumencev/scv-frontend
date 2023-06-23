<script setup lang="ts">
import PrimaryButton from "@/components/PrimaryButton.vue";
import { ref } from "vue";
import Editor from '@tinymce/tinymce-vue';
import { useSettings } from "@/stores/settings";
import TextareaInput from "@/components/TextareaInput.vue";

const settings = useSettings();

const processing = ref(false);

const saveSettings = async () => {
    await settings.saveGroup('translations', processing);
}

</script>

<template>
    <form @submit.prevent="saveSettings">
        <div v-for="block in Object.entries(settings.translations)">
            <div class="mb-5 grid grid-cols-[1fr_3fr]">
                <div class="mb-1">{{ block[0] }}</div>
                <Editor
                    v-if="block[1].type === 'editor'"
                    v-model="block[1].value"
                    api-key="op3eberm4qqzqgzve9vd9r6yltyha972vb406vlc4n53tc9d"
                    :init="{
                        height: 200,
                        plugins: 'lists link image table code fullscreen',
                        toolbar: 'undo redo | fullscreen | styles | bold italic underline link | backcolor | numlist bullist | image | code',
                        menubar: false
                    }"
                />
                <TextareaInput v-else v-model="block[1].value" />
            </div>
        </div>
        <PrimaryButton :processing="processing" class="mt-5">Speichern</PrimaryButton>
    </form>
</template>