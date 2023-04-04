<script setup lang="ts">
import {
    onMounted,
    onUnmounted,
    ref
} from "vue";
import {useCookies} from "@vueuse/integrations/useCookies";

defineProps({
    videoController: {
        type: Object,
        required: true
    },
    backAction: {
        type: Object,
        required: true
    }
});

const isShown = ref(false);
const stageMenuEl = ref<HTMLElement>();
const stageMenuPreviewWrapperEl = ref<HTMLElement>();
const stageMenuPreviewEl = ref<HTMLElement>();

onMounted(() => {
    document.addEventListener('mousemove', menuParallax);
    stageMenuPreviewEl.value?.addEventListener('click', showMenu);
});

onUnmounted(() => {
    document.removeEventListener('mousemove', menuParallax);
    stageMenuPreviewEl.value?.removeEventListener('click', showMenu);
});

const showMenu = () => {
    isShown.value = true;
}

const menuParallax = (e: MouseEvent) => {
    if (! stageMenuEl.value || ! stageMenuPreviewEl.value) {
        return;
    }

    if (isShown.value === true) {
        return;
    }

    const transformY = -0.02 * e.clientY;
    //const transformX = -0.005 * e.clientX;
    stageMenuPreviewEl.value.style.transform = `translate(0, ${transformY}px)`;
}

</script>

<template>
    <div class="absolute w-full bottom-0 h-[39%] overflow-hidden">
        <div ref="stageMenuEl" class="w-full h-full flex justify-center">
            <Transition name="menu">
                <div
                    v-show="isShown"
                    ref="stageMenuWrapperEl"
                    class="w-[58%] flex justify-center absolute">
                    <img
                        class="w-full relative pointer-events-none"
                        src="/stage/navigation/Menu_offen_full.png"
                        alt="">
                    <router-link
                        :to="backAction"
                        class="bottom-[10%] left-[6%] w-[20%] h-[60%] absolute z-[20] skew-y-[12deg]" />
                    <button
                        class="bottom-[58%] right-[10%] w-[18%] h-[13%] absolute z-[20] -skew-y-[16deg]"
                        @click="isShown = false"></button>
                    <button
                        v-if="videoController.isPlaying"
                        class="bottom-[23%] left-[43.1%] w-[11.7%] h-[26%] rounded-full absolute z-[20]"
                        @click="videoController.videoToggle()">
                        <img src="/stage/navigation/Button_Pause.png" alt="">
                    </button>
                    <button
                        v-if="!videoController.isPlaying"
                        class="bottom-[20%] left-[43.3%] w-[11%] h-[28%] rounded-full absolute z-[20]"
                        @click="videoController.videoToggle()"></button>
                    <div
                        class="bottom-[23%] left-[34.2%] w-[7.2%] h-[18.5%] rounded-full absolute z-[20]"></div>
                    <div
                        class="bottom-[23%] left-[56.5%] w-[7.2%] h-[18.5%] rounded-full absolute z-[20]"></div>
                </div>
            </Transition>
            <div class="w-full h-full left-0 top-0 flex justify-center translate-y-[76%] hover:translate-y-[30%] transition absolute">
                <Transition name="menu-preview">
                    <div
                        v-show="!isShown"
                        ref="stageMenuPreviewWrapperEl"
                        class="w-full flex justify-center absolute">
                        <img
                            ref="stageMenuPreviewEl"
                            class="w-[30%] cursor-pointer"
                            src="/stage/navigation/Menu_zu_border.png"
                            alt="">
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

    .menu-enter-active {
        animation: bounce-in 0.5s 0.5s;
        transform: translateY(100%);
    }
    .menu-leave-active {
        animation: bounce-in 0.5s reverse;
    }



    .menu-preview-enter-active {
        animation: bounce-in-2 0.5s 0.5s;
        transform: translateY(100%);
    }
    .menu-preview-leave-active {
        animation: bounce-in-2 0.5s reverse;
    }

    @keyframes bounce-in {
        0% {
            transform: translateY(100%) scale(0.2);
        }
        50% {
            transform: translateY(0) scale(1.02);
        }
        100% {
            transform: translateY(0);
        }
    }
    @keyframes bounce-in-2 {
        0% {
            transform: translateY(100%) scale(0.2);
        }
        50% {
            transform: translateY(-5%) scale(1.02);
        }
        100% {
            transform: translateY(0);
        }
    }
</style>