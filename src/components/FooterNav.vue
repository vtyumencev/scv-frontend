<script setup lang="ts">
import navigation from '../../public/storage/navigation.json';
import type { SiteNavigation } from "@/types/SiteNavigation";
const links = navigation as SiteNavigation;

</script>

<template>
    <div class="grid grid-flow-col gap-10">
        <router-link
            v-for="navLink in links.footer"
            :key="navLink"
            :to="{ name: navLink.routeName }">
            {{ navLink.name }}
        </router-link>
    </div>
</template>