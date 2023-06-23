<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, type VNode, ref, h } from 'vue';

const props = defineProps<{
    name: string
}>();

const emits = defineEmits<{
    (e: 'onRendered', el: HTMLElement): void,
    (e: 'onUnRendered', el: HTMLElement): void,
}>();

const ic = ref();
const el = ref();

const dynamicComponent = defineAsyncComponent( () => {
    const iName = props.name;
    return import(`@/masks/desk/${iName}`);
});
const rendered = (e: VNode) => {
    const el = e.el as HTMLElement;
    if (el) {
        emits('onRendered', el);
    }
}

const unrendered = (e: VNode) => {
    const el = e.el as HTMLElement;
    if (el) {
        emits('onUnRendered', el);
    }
}

onMounted(async () => {
    // const i = await import(`/images/homepage/${ props.name }?raw`);
    // ic.value = i.default;
    // console.log(ic.value)
    //emits('onRendered', el.value);
})


</script>

<template>
    <div class=""></div>
<!--    <component :is="h('div')"></component>-->
<!--    <template ref="el" v-html="ic"></template>-->
    <component :is="dynamicComponent" @vue:mounted="rendered" @vue:unmounted="unrendered" />
</template>