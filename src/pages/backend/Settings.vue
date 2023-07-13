<script setup lang="ts">
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout.vue";
import NavLink from "@/components/NavLink.vue";
import { onMounted } from "vue";
import { useSettings } from "@/stores/settings";

const settings = useSettings();

onMounted(async () => {
    await settings.fetch();
});

</script>

<template>
    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between w-full items-center">
                <div class="flex h-full">
                    <h2 class="font-semibold text-xl text-gray-800 leading-tight inline-flex items-center">
                        Einstellungen
                    </h2>
                    <div
                        class="space-x-5 ml-10 flex">
                        <router-link
                            v-slot="{ href, isActive, navigate }"
                            :to="{ name: 'settings-season' }" custom>
                            <NavLink
                                :href="href"
                                :active="isActive"
                                @click="navigate">
                                Saison
                            </NavLink>
                        </router-link>
                        <router-link
                            v-slot="{ href, isActive, navigate }"
                            :to="{ name: 'settings-translations-index' }" custom>
                            <NavLink
                                :href="href"
                                :active="isActive"
                                @click="navigate">
                                Translations
                            </NavLink>
                        </router-link>
                    </div>
                </div>
            </div>
        </template>
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white shadow-sm sm:rounded-lg">
                    <div class="px-6 py-10 bg-white sm:rounded-lg border-b border-gray-200">
                        <div class="max-w-3xl mx-auto">
                            <router-view></router-view>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
