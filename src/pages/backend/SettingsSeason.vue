<script setup lang="ts">
import Select from "@/components/Select.vue";
import InputLabel from "@/components/InputLabel.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import { ref } from "vue";
import { useSettings } from "@/stores/settings";

const settings = useSettings();
const processing = ref(false);

const saveSettings = () => {
    settings.saveGroup('general', processing)
}

</script>

<template>
    <form @submit.prevent="saveSettings">
        <input type="hidden" name="group" value="general">
        <InputLabel value="Aktuelle Saison" />
        <Select
            v-model="settings.general.current_season.value"
            class="mt-1 w-full"
            name="current_season"
            :items="[
            {
                'id': 'winter',
                'name': 'Winter'
            },
            {
                'id': 'spring',
                'name': 'Frühling'
            },
            {
                'id': 'neutral',
                'name': 'Neutral'
            },
        ]" null-option="Keine Saison" />
        <PrimaryButton :processing="processing" class="mt-5">Speichern</PrimaryButton>
    </form>
</template>