<script setup lang="ts">
import { useAttributes } from '@/stores/attributes';
import { onMounted } from 'vue';

const attributesStorage =  useAttributes();

onMounted(() => {
    attributesStorage.getAttributes()
});

</script>

<template>
    <router-view></router-view>
</template>
