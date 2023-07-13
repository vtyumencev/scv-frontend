<script setup lang="ts">
import SettingsTranslationProfileForm from "@/components/backend/SettingsTranslationProfileForm.vue";
import {useRoute} from "vue-router";
import {computed, type Ref} from "vue";
import type {LanguageProfile} from "@/types/LanguageProfile";
import {toRef} from "@vueuse/core";
import {useSettings} from "@/stores/settings";

const settings = useSettings();
const route = useRoute();

const duplicateSourceLang = route.query['duplicateSource'] as string;

const profiles: Ref<LanguageProfile[]> = toRef(settings.general.translation_profiles, 'value');

const languageProfile = computed(() => {
    if (! profiles.value) {
        return;
    }
    return profiles.value.find(profile => profile.code === duplicateSourceLang)
});

</script>

<template>
    <div class="">
        <h2 class="mb-5 text-xl">Adding new language profile</h2>
        <div v-if="languageProfile" class="mb-5">
            <div class="py-4 px-6 border bg-gray-100 rounded-md">
                All translation strings will be copied from the “<b>{{ duplicateSourceLang }}: {{ languageProfile.name }}</b>” profile.
            </div>
        </div>
        <SettingsTranslationProfileForm :duplicate-source-lang="duplicateSourceLang" />
    </div>
</template>