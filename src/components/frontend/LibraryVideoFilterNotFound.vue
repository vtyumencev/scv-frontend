<template>
    <div class="flex xl:justify-center items-center h-full xl:text-center">
        <div class="text-dark dark:text-white dark:text-opacity-70 transition">
            <div class="text-xl">Videos mit Filtern wurden nicht gefunden</div>
            <div class=""><router-link class="text-theme-alpha" :to="{ query: { } }">Filter zurücksetzen</router-link></div>
        </div>
    </div>
</template>
<script setup lang="ts">
</script>