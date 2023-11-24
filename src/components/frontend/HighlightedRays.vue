<script setup lang="ts">


import {onMounted, onUnmounted, ref} from "vue";

let timeInterval: number;
const rayRootEl = ref();

const ray = () => {
    const r = document.createElement('div');
    const baseR = Math.random();
    r.classList.add('ray-item');
    r.style.transform = `rotate(${baseR * 360}deg)`;
    //r.style.width = `${Math.round(5 + Math.random() * 20)}px`;
    rayRootEl.value.appendChild(r);

    setTimeout(() => {
        r.style.transform = `rotate(${baseR * 360}deg) translate(${Math.cos(baseR) * 50}px, ${Math.sin(baseR) * 50}px)`;
        r.style.opacity = `0`;
    }, 10);

    setTimeout(() => {
        r.remove();
    }, 2000);
}

onUnmounted(() => {
    clearTimeout(timeInterval);
});

onMounted(() => {
    //timeInterval = setInterval(ray, 100);
});

</script>

<template>
    <div ref="rayRootEl" class="ray-root">

    </div>
</template>

<style lang="postcss">
    .ray-item {
        @apply absolute h-[5px] w-[5px] rounded-full bg-amber-400 origin-left;
        transition: 0.2s transform, 0.2s 0.15s opacity;
    }
    .ray-item.lunched {

    }
</style>