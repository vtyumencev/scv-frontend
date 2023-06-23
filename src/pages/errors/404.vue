<script setup lang="ts">

import ApplicationLogo from '@/components/ApplicationLogo.vue'
import FooterNav from "@/components/frontend/FooterNav.vue";
import LibraryButton from "@/components/frontend/LibraryButton.vue";

</script>

<template>
    <div
        class="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="absolute bottom-[0] h-full flex items-end">
            <img
                class="w-screen transition"
                src="/images/landing/Clouds.jpg"
                alt="">
        </div>
        <div class="max-w-xs w-full relative">
            <div
                class="mx-auto flex items-center h-12">
                <router-link to="/">
                    <ApplicationLogo
                        class="w-52 mb-10" />
                </router-link>
            </div>
            <h2
                class="mt-2 text-3xl font-extrabold text-gray-900 uppercase">
                Nichts gefunden
            </h2>
            <p class="mt-4 text-lg font-medium text-gray-500">
                Die von Dir gesuchte Seite existiert leider nicht oder nicht mehr.
            </p>
            <div class="mt-10">
                <router-link
                    to="/">
                    <LibraryButton class="shadow-none">
                            Startseite
                    </LibraryButton>
                </router-link>
            </div>
            <FooterNav class="mt-10 inline-grid gap-4 text-theme-alpha uppercase" />
        </div>
    </div>
</template>
