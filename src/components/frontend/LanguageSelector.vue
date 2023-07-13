<script setup lang="ts">
import { useSettings } from "@/stores/settings";
import {toRef, useStorage} from "@vueuse/core";
import {computed, type Ref} from "vue";
import type {LanguageProfile} from "@/types/LanguageProfile";

defineProps<{
    icon?: boolean
    styled?: boolean,
    white?: boolean,
    uppercase?: boolean,
}>();

const settings = useSettings();
const currentLanguageCode = useStorage<null | string>('language', null);

const profiles: Ref<LanguageProfile[]> = toRef(settings.general.translation_profiles, 'value');

const selectedProfile = computed(() => {
    return profiles.value.find(profile => profile.code === currentLanguageCode.value);
});

const change = async (e: Event) => {
    const el = e.target as HTMLFormElement;
    currentLanguageCode.value = el.value;
    await settings.fetchTranslations(currentLanguageCode.value as string);
}

</script>

<template>
    <div
        v-if="profiles.length"
        class="flex overflow-hidden"
        :class="{
            'border rounded py-[0.4em] pl-[0.5em]': styled,
        }">
        <template v-if="icon">
            <img
                v-if="white"
                src="/images/icons/language-white.svg"
                class="w-[1.6em] mr-[5px]"
                alt="">
            <img
                v-else
                src="/images/icons/language.svg"
                class="w-[1.6em] mr-[5px]"
                alt="">
        </template>
        <select
            class="appearance-none p-0 border-0 focus:ring-0 bg-transparent bg-none text-size-inherit"
            :class="{
                'mr-[-2.5rem]': ! styled,
                'uppercase': uppercase
            }"
            @change="change">
            <template v-for="profile in settings.general.translation_profiles.value">
                <option
                    v-if="! profile.is_hidden"
                    :key="profile.code"
                    :selected="selectedProfile && selectedProfile.code === profile.code"
                    :value="profile.code">
                    {{ profile.name }}
                </option>
            </template>
        </select>
    </div>
</template>