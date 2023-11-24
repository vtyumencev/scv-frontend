<script setup lang="ts">

import type {StageElement} from "@/types/StageElement";

type Mode = 'dark' | 'light';

defineProps<{
    element: StageElement,
    mode: Mode
}>();

</script>

<template>
    <img
        data-depth
        :data-depth-strength-x="element.deathStrengthX"
        :data-depth-strength-y="element.deathStrengthY"
        :src="element.assets[mode]"
        class="absolute"
        alt=""
        :style="{
                'left': element.left + '%',
                'top': element.top + '%',
                'width': element.width + '%',
            }">
</template>