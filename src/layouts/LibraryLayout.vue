<script setup lang="ts">
import FrontendLayout from "@/layouts/FrontendLayout.vue";
import FooterNav from "@/components/frontend/FooterNav.vue";

const emits = defineEmits(['onClickHelpButton']);

</script>

<template>
    <FrontendLayout class="relative">
        <div class="min-h-screen">
            <div class="">
                <div class="fixed z-10 w-full pointer-events-none">
                    <div class="max-w-site-container w-full mx-auto px-5 py-5">
                        <router-link
                            class="pointer-events-auto"
                            :to="{ name: 'index' }">
                            <img src="/logo.svg" class="inline" alt="">
                        </router-link>
                    </div>
                </div>
                <div class="absolute z-10 w-full">
                    <div class="max-w-site-container w-full mx-auto px-5 py-5 flex justify-between items-center">
                        <router-link
                            class="block pl-library-left"
                            :to="{ name: 'index' }">
                            <div class="relative">
                                <img src="/logo-title.svg" class="inline dark:opacity-0 transition" alt="">
                                <img src="/logo-title-white.svg" class="inline absolute left-0 opacity-0 dark:opacity-100 transition" alt="">
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
            <slot/>
            <div class="absolute bottom-0 w-full h-[64px] bg-black bg-opacity-50">
                <div class="max-w-site-container px-5 pl-library-left-full w-full mx-auto flex items-center justify-between h-full uppercase text-white">
                    <button class="grid grid-flow-col gap-3 items-center uppercase" @click="emits('onClickHelpButton')">
                        <img src="/icons/question-mark-box.svg" alt="">
                        <span class="">Hilfe</span>
                    </button>
                    <FooterNav />
                </div>
            </div>
        </div>
    </FrontendLayout>
</template>

<style scoped>

</style>