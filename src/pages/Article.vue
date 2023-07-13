<script setup lang="ts">
import { useSettings } from "@/stores/settings";
import LibraryLayout from "@/layouts/LibraryLayout.vue";
import {computed} from "vue";
import type {TranslationStrings} from "@/types/TranslationStrings";

const props = defineProps<{
    translationName: string
}>();

const settings = useSettings();

const translate = computed(() => {
    return settings.translations[props.translationName as TranslationStrings ].value;
});

</script>
<template>
    <LibraryLayout :enable-language-selector="true">
        <div class="mx-auto max-w-3xl pl-container-library-inline px-10 py-32">
            <div class="article" v-html="translate"></div>
        </div>
    </LibraryLayout>
</template>
<style lang="scss">
.article {
    font-size: 16px;
    > * {
        margin: 1.5em 0 0.6em 0;
    }
    > *:first-child {
        margin-top: 0;
    }
    > *:last-child {
        margin-bottom: 0;
    }
    h1 {
        font-size: 2.5em;
    }
    h2 {
        font-size: 1.6em;
    }
    h3 {
        font-size: 1.4em;
    }

    ul {
       li {
           margin-left: 1.1em;
           list-style: disc;
       }
    }

    a {
        text-decoration: underline;
        @apply text-theme-alpha;
    }
}
</style>