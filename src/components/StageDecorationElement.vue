<script setup lang="ts">

import type {PropType} from "vue";

type Mode = 'dark' | 'light';

defineProps({
    element: {
        type: Object,
        default: Object
    },
    mode: {
        type: String as PropType<Mode>,
        required: true
    }
})
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