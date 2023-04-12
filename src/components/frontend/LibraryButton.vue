<script setup lang="ts">

</script>

<template>
    <button
        class="bg-gradient-to-b to-[#F8C300] from-[#FFF9E3] p-[2px] shadow-[8px_7px_7px_rgba(0,18,52,0.45)] group">
            <span class="group-hover:bg-white transition block py-2 px-8">
                <slot />
            </span>
    </button>
</template>