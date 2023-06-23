<script setup lang="ts">

import { type PropType } from "vue";
import { type Choir } from "@/types/Choir";

defineProps({
    choirData: {
        type: Object as PropType<Choir>,
        required: true
    }
});

</script>

<template>
    <div>
        <img
            class="relative"
            src="/images/stage/navigation/Ausweis.png"
            alt="">
        <div class="absolute top-[0] ml-[10%] w-[75%] font-serif">
            <div class="text-[2.3em] text-center mt-[10%]">MITGLIEDER-AUSWEIS</div>
            <div class="text-[1.3em] gap-[1em] mt-[5%] grid grid-cols-[1fr_4fr]">
                <div class="">Name</div>
                <div class="">{{ choirData.name }}</div>
                <div class="">Ort</div>
                <div class="">{{ choirData.place ?? '-' }}</div>
                <div class="">Leitung</div>
                <div class="">{{ choirData.leader ?? '-' }}</div>
            </div>
        </div>
    </div>
</template>