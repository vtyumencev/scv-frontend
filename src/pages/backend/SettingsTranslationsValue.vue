<script setup lang="ts">
import PrimaryButton from "@/components/PrimaryButton.vue";
import {computed, onMounted, type Ref, ref} from "vue";
import Editor from '@tinymce/tinymce-vue';
import { useSettings } from "@/stores/settings";
import TextareaInput from "@/components/TextareaInput.vue";
import type {LanguageProfile} from "@/types/LanguageProfile";
import {toRef} from "@vueuse/core";
import {useRoute} from "vue-router";
import type { TranslationStrings } from "@/types/TranslationStrings";
import {useAPI} from "@/composables/fetch";

const props = defineProps<{
    lang: string,
}>();

const route = useRoute();

const api = useAPI();
const settings = useSettings();

const isReady = ref(false);
const currentLanguageString = settings.translations[route.query.key as TranslationStrings];
const processing = ref(false);
const profiles: Ref<LanguageProfile[]> = toRef(settings.general.translation_profiles, 'value');

onMounted(async () => {
    await settings.fetchTranslations(props.lang);
    isReady.value = true;
});


const save = async () => {
    await api.store('translation-strings', {
        lang: props.lang,
        key:  route.query.key,
        text: currentLanguageString.value,
    }, { successMsg: 'Translations are saved', processing: processing });
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
        <h2 class="mb-0 text-xl">
            <router-link
                class="text-blue-600"
                :to="{ name: 'settings-translations-show' }">
                    Translations of the “<code class="font-mono bg-gray-100 px-1">{{ props.lang }}</code>: {{ languageProfile?.name }}” profile
            </router-link>
        </h2>
        <form v-if="isReady" @submit.prevent="save">
            <h3 class="mb-5 text-lg">Key: {{ route.query.key }}</h3>
            <div class="mb-5">
                <Editor
                    v-if="currentLanguageString.type === 'editor'"
                    v-model="currentLanguageString.value"
                    :initial-value="currentLanguageString.value"
                    :name="route.query.key"
                    api-key="op3eberm4qqzqgzve9vd9r6yltyha972vb406vlc4n53tc9d"
                    :init="{
                            plugins: 'lists link image table code fullscreen autoresize',
                            toolbar: 'undo redo | fullscreen | styles | bold italic underline link | backcolor | numlist bullist | image | code',
                            menubar: false
                        }"
                />
                <TextareaInput v-else v-model="currentLanguageString.value" class="w-full" :name="route.query.key" />
            </div>
            <div class="py-3 border-t bg-white sticky bottom-0">
                <PrimaryButton :processing="processing">Speichern</PrimaryButton>
                <router-link :to="{ name: 'settings-translations-show' }" >
                    <PrimaryButton type="button" button-style="outline" class="ml-5">
                        Go back
                    </PrimaryButton>
                </router-link>
            </div>
        </form>
    </div>
</template>