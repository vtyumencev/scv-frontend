<script setup lang="ts">
import PrimaryButton from "@/components/PrimaryButton.vue";
import {computed, onMounted, type Ref, ref} from "vue";
import { useSettings } from "@/stores/settings";
import type {LanguageProfile} from "@/types/LanguageProfile";
import {toRef} from "@vueuse/core";

const props = defineProps<{
    lang: string
}>();

const settings = useSettings();

const isReady = ref(false);

onMounted(async () => {
    await settings.fetchTranslations(props.lang);
    isReady.value = true;
});

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
        <h2 class="mb-5 text-xl">Translations of the “<code class="font-mono bg-gray-100 px-1">{{ props.lang }}</code>: {{ languageProfile?.name }}” profile</h2>
        <div v-if="isReady">
            <div v-for="block in Object.entries(settings.translations)" :key="block[0]">
                <router-link
                    :to="{ name: 'settings-translations-value', query: { key: block[0] } }"
                    class="mb-4 grid grid-cols-[4fr_9fr_1fr] gap-5 hover:bg-gray-100 transition py-2 px-4 -mx-4 rounded-md group cursor-pointer">
                    <div>{{ block[0] }}</div>
                    <div class="line-clamp-3">
                        <div v-html="block[1].value"></div>
                    </div>
                    <div class="opacity-0 group-hover:opacity-100 text-indigo-500 transition">
                        Edit
                    </div>
                </router-link>
            </div>
            <div class="py-3 border-t bg-white sticky bottom-0">
                <router-link :to="{ name: 'settings-translations-index' }" >
                    <PrimaryButton type="button" button-style="outline">
                        Go back
                    </PrimaryButton>
                </router-link>
                <router-link :to="{ name: 'settings-translations-settings' }" >
                    <PrimaryButton type="button" button-style="outline" class="ml-5">
                        Profile Settings
                    </PrimaryButton>
                </router-link>
            </div>
        </div>
    </div>
</template>