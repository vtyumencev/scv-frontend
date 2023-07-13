<script setup lang="ts">
import PrimaryButton from "@/components/PrimaryButton.vue";
import {computed, onMounted, type Ref, ref} from "vue";
import Editor from '@tinymce/tinymce-vue';
import { useSettings } from "@/stores/settings";
import TextareaInput from "@/components/TextareaInput.vue";
import type {LanguageProfile} from "@/types/LanguageProfile";
import {toRef} from "@vueuse/core";

const settings = useSettings();

const props = defineProps<{
    lang: string
}>();

onMounted(async () => {
    await settings.fetchTranslations(props.lang);
});

const processing = ref(false);

const profiles: Ref<LanguageProfile[]> = toRef(settings.general.translation_profiles, 'value');

const save = async () => {
    await settings.saveTranslations(props.lang, processing);
}

const languageProfile = computed(() => {
    if (! profiles.value) {
        return;
    }
    return profiles.value.find(profile => profile.code === props.lang)
});


</script>

<template>
    <div class="">
        <h2 class="mb-5 text-xl">Translations of the “{{ props.lang }}: {{ languageProfile?.name }}” profile</h2>
        <form @submit.prevent="save">
            <div v-for="block in Object.entries(settings.translations)" :key="block[0]">
                <div class="mb-5 grid grid-cols-[1fr_3fr]" >
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
            <div class="sticky bottom-0 z-10 bg-white py-3 border-t">
                <PrimaryButton :processing="processing">Speichern</PrimaryButton>
                <router-link :to="{ name: 'settings-translations-settings' }" >
                    <PrimaryButton type="button" button-style="outline" class="ml-5">
                        Settings
                    </PrimaryButton>
                </router-link>
            </div>
        </form>
    </div>
</template>