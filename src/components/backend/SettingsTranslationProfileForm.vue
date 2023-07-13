<script setup lang="ts">

import PrimaryButton from "@/components/PrimaryButton.vue";
import InputLabel from "@/components/InputLabel.vue";
import TextInput from "@/components/TextInput.vue";
import {type Ref, ref} from "vue";
import {toast} from "vue3-toastify";
import {useSettings} from "@/stores/settings";
import type {LanguageProfile} from "@/types/LanguageProfile";
import {useRouter} from "vue-router";
import {toRef} from "@vueuse/core";
import Checkbox from "@/components/Checkbox.vue";
import {useAPI} from "@/composables/fetch";

const settings = useSettings();
const router = useRouter();
const api = useAPI();

const processing = ref(false);

const props = defineProps<{
    profile?: LanguageProfile,
    duplicateSourceLang?: string
}>();

const profiles: Ref<LanguageProfile[]> = toRef(settings.general.translation_profiles, 'value');

const save = (e: Event) => {

    const el = e.target as HTMLFormElement;
    const formData = new FormData(el);
    const langName = formData.get('name');
    const isDefault = !!formData.get('is_default');
    const isHidden = !!formData.get('is_hidden');
    const langCode = props.profile?.code ?? formData.get('code');
    if (! langName) {
        return;
    }

    if (isDefault) {
        profiles.value.forEach((profile) => {
            profile.is_default = false;
        });
    }

    if (props.profile) {
        const searchResult = profiles.value.find((profile) => profile.code === props.profile?.code);
        if (! searchResult) {
            return;
        }

        searchResult.name = langName as string;
        searchResult.is_default = isDefault;
        searchResult.is_hidden = isHidden;


    } else {

        if (! langCode) {
            return;
        }

        const searchResult = profiles.value.find((profile) => profile.code === langCode);

        if (searchResult) {
            toast('A language profile with this code already exists', { type: 'error' })
            return;
        }

        profiles.value.push({
            code: langCode as string,
            name: langName as string,
            is_default: isDefault,
            is_hidden: isHidden,
        });

        if (props.duplicateSourceLang) {
            api.store(`translations/duplicate?sourceLang=${ props.duplicateSourceLang }&targetLang=${ langCode }`);
        }

    }

    settings.saveGroup('general', processing);

    router.push({ name: 'settings-translations-settings', params: { lang: langCode as string } })
}

const deleteProfile = () => {

    if (confirm('Profile language will be deleted')) {
        profiles.value = profiles.value.filter((profile) => profile.code !== props.profile?.code);

        router.push({ name: 'settings-translations-index' });

        settings.saveGroup('general');
    }
}

</script>

<template>
    <form @submit.prevent="save">
        <div class="mb-5">
            <InputLabel value="Language name" />
            <TextInput name="name" type="text" :model-value="profile?.name" class="mt-1 block w-full" autocomplete="name" />
        </div>
        <div v-if="! profile" class="mb-5">
            <InputLabel value="Language code" />
            <TextInput name="code" type="text" class="mt-1 block w-full" autocomplete="name" />
            <div class="text-sm mt-1">For example: <b>de-DE</b>, <b>de-AT</b>, <b>en-US</b>, <b>en-UK</b>, etc.</div>
        </div>
        <div class="mb-2 flex items-center">
            <Checkbox id="is_default" :checked="profile?.is_default" name="is_default" />
            <label class="ml-3" for="is_default">Default profile</label>
        </div>
        <div class="mb-5 flex items-center">
            <Checkbox id="is_hidden" :checked="profile?.is_hidden" name="is_hidden" />
            <label class="ml-3" for="is_hidden">Is hidden</label>
        </div>
        <div class="flex justify-between">
            <div class="">
                <PrimaryButton :processing="processing">
                    <template v-if="profile">
                        Save profile
                    </template>
                    <template v-else>
                        Save and add
                    </template>
                </PrimaryButton>
                <router-link v-if="profile" :to="{ name: 'settings-translations-show' }" >
                    <PrimaryButton type="button" button-style="outline" class="ml-5">
                        Translations
                    </PrimaryButton>
                </router-link>
            </div>
            <PrimaryButton v-if="profile" button-style="danger" type="button" @click="deleteProfile">
                Delete
            </PrimaryButton>
        </div>
    </form>
</template>