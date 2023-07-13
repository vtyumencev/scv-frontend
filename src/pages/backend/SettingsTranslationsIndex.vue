<script setup lang="ts">
import PrimaryButton from "@/components/PrimaryButton.vue";
import { useSettings } from "@/stores/settings";

const settings = useSettings();

</script>

<template>
    <div class="">
        <div class="text-xl mb-5">Language profiles</div>
        <ul>
            <li
                v-for="profile in settings.general.translation_profiles.value"
                :key="profile"
                class="block mb-2 pb-2 border-b last-of-type:border-0">
                <router-link
                    class="block text-indigo-500 text-lg"
                    :to="{ name: 'settings-translations-show', params: { lang: profile.code } }">
                    {{ profile.name }}
                </router-link>
                <div class="space-x-2 flex items-center text-sm">
                    <router-link
                        class="hover:text-indigo-500"
                        :to="{ name: 'settings-translations-show', params: { lang: profile.code } }">
                        Translations
                    </router-link>
                    <router-link
                        class="hover:text-indigo-500"
                        :to="{ name: 'settings-translations-settings', params: { lang: profile.code } }">
                        Settings
                    </router-link>
                    <router-link
                        class="hover:text-indigo-500"
                        :to="{ name: 'settings-translations-new', query: { 'duplicateSource': profile.code } }">
                        Duplicate
                    </router-link>
                    <span v-if="profile.is_default" class="text-white bg-indigo-500 px-3 py-0.5 rounded-md uppercase text-xs">Default</span>
                    <span v-if="profile.is_hidden" class="text-white bg-gray-500 px-3 py-0.5 rounded-md uppercase text-xs">Hidden</span>
                </div>
            </li>
        </ul>
        <router-link :to="{ name: 'settings-translations-new' }">
            <PrimaryButton class="mt-5">Add new profile</PrimaryButton>
        </router-link>
    </div>
</template>