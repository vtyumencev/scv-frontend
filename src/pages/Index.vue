<script setup lang="ts">
import FrontendLayout from "@/layouts/FrontendLayout.vue";
import {useLibrary} from "@/stores/library";
const stageStore = useLibrary();
</script>

<template>
    <FrontendLayout>
        <div class="h-screen">
            <div class="relative h-full flex flex-col justify-center items-center">
                <div class="">
<!--                    <router-link :to="{ name: 'library' }" class="text-sm text-black">-->
<!--                        Library-->
<!--                    </router-link>-->
                </div>
                <div class="flex flex-col justify-center items-center">
                    <div
                        v-for="preset_name in stageStore.presets_list"
                        class="">
                        <router-link
                            v-if="stageStore.presets[preset_name]"
                            :to="{ name: 'presets-show', params: { 'presetName': preset_name } }"
                            class="text-sm text-black">
                            {{ stageStore.presets[preset_name].name }}
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </FrontendLayout>
</template>