<script setup lang="ts">
import SelectSimple from "@/components/SelectSimple.vue";
import InputLabel from "@/components/InputLabel.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import { ref } from "vue";
import { useSettings } from "@/stores/settings";
import CheckboxCustom from "@/components/CheckboxCustom.vue";
import { toRef } from "@vueuse/core";

const settings = useSettings();
const processing = ref(false);
const season = toRef(settings.general.current_season, 'value');

const saveSettings = () => {
    settings.saveGroup('general', processing)
}

</script>

<template>
    <form @submit.prevent="saveSettings">
        <input type="hidden" name="group" value="general">
        <div>
            <InputLabel value="Aktuelle Saison" />
            <SelectSimple
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
        </div>
        <div class="mt-5">
            <InputLabel value="Adventskalender"/>
            <div class="mt-2">
                <CheckboxCustom v-model="settings.general.is_advent_time.value">
                    Is active
                </CheckboxCustom>
            </div>
        </div>
        <PrimaryButton :processing="processing" class="mt-5">Speichern</PrimaryButton>
    </form>
</template>