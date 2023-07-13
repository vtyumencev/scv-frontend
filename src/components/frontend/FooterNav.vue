<script setup lang="ts">
import navigation from '../../../public/storage/navigation.json';
import type { SiteNavigation } from "@/types/SiteNavigation";
import LanguageSelector from "@/components/frontend/LanguageSelector.vue";
const links = navigation as SiteNavigation;

</script>

<template>
    <div class="grid grid-flow-col gap-10">
        <span v-for="navLink in links.footer" :key="navLink.name">
            <a
                v-if="navLink.remoteLink"
                :href="navLink.remoteLink"
                target="_blank">{{ navLink.name }}
            </a>
            <router-link
                v-else
                :to="{ name: navLink.routeName }">
                {{ navLink.name }}
            </router-link>
        </span>
        <LanguageSelector :styled="false" :icon="true" :white="true" :uppercase="true" />
    </div>
</template>