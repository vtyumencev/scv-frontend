<script setup lang="ts">
import {
    computed,
    type Ref
} from "vue";
import { useSettings } from "@/stores/settings";
import SettingsTranslationProfileForm from "@/components/backend/SettingsTranslationProfileForm.vue";
import {toRef} from "@vueuse/core";
import type { LanguageProfile} from "@/types/LanguageProfile";

const settings = useSettings();

const props = defineProps<{
    lang: string
}>();

const profiles: Ref<LanguageProfile[]> = toRef(settings.general.translation_profiles, 'value');

const languageProfile = computed(() => {
    if (! profiles.value) {
        return;
    }
    return profiles.value.find(profile => profile.code === props.lang)
});

</script>

<template>
    <div class="">
        <div v-if="languageProfile" class="">
            <h2 class="mb-5 text-xl">Editing the language profile “{{ props.lang }}: {{ languageProfile?.name }}”</h2>
            <SettingsTranslationProfileForm :profile="languageProfile" />
        </div>
        <div v-else>
            This language profile does not exist.
        </div>
    </div>
</template>