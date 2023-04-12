<script setup lang="ts">
import {
    onMounted,
    onUnmounted, type PropType,
    ref
} from "vue";

import type { Video } from "@/types/Video";
import { useSound } from '@vueuse/sound';
import soundMenuOpen from '../../../public/sounds/menu-open.wav'
import soundMenuClose from '../../../public/sounds/menu-close.wav'
import soundCardIn from '../../../public/sounds/card-in.wav'
import soundCardOut from '../../../public/sounds/card-out.wav'

defineProps({
    videoController: {
        type: Object,
        required: true
    },
    videoData: {
        type: Object as PropType<Video>,
        default: null
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
const stageMenuIDCardEl = ref<HTMLElement>();
const IDShown = ref(false);
const int = ref();

const { play: playSoundsMenuOpen } = useSound(soundMenuOpen);
const { play: playSoundsMenuClose } = useSound(soundMenuClose);
const { play: playSoundsCardIn } = useSound(soundCardIn);
const { play: playSoundsCardOut } = useSound(soundCardOut);

onMounted(() => {
    document.addEventListener('mousemove', menuParallax);
    stageMenuPreviewEl.value?.addEventListener('click', showMenu);
    shakeMenu();
    // int.value = setInterval(() => {
    //     shakeMenu();
    // }, 10000);
});

onUnmounted(() => {
    document.removeEventListener('mousemove', menuParallax);
    stageMenuPreviewEl.value?.removeEventListener('click', showMenu);
    clearInterval(int.value)
});

const shakeMenu = () => {
    stageMenuPreviewWrapperEl.value?.classList.add('stage-menu-preview--shake');
    setTimeout(() => {
        stageMenuPreviewWrapperEl.value?.classList.remove('stage-menu-preview--shake');
    }, 5000);
}

const showMenu = () => {
    isShown.value = true;
    playSoundsMenuOpen();
}
const hideMenu = () => {
    isShown.value = false;
    playSoundsMenuClose();
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

const toggleIDCard = () => {
    IDShown.value = !IDShown.value;
    if (IDShown.value) {
        playSoundsCardIn();
    } else {
        playSoundsCardOut();
    }
}

</script>

<template>
    <div class="absolute w-full bottom-0 h-[39%] overflow-hidden">
        <div ref="stageMenuEl" class="w-full h-full flex justify-center">
            <Transition name="menu" style="font-size: var(--font-size-base);">
                <div
                    v-show="isShown"
                    ref="stageMenuWrapperEl"
                    class="w-[58%] flex justify-center absolute">
                    <Transition name="id-card">
                        <div v-if="IDShown" ref="stageMenuIDCardEl" class="bottom-[20%] left-[96%] w-[36%] absolute">
                            <img
                                class="relative"
                                src="/stage/navigation/Ausweis.png"
                                alt="">
                            <div class="absolute top-[0] ml-[10%] w-[75%] font-serif">
                                <div class="text-[2.4em] text-center mt-[10%]">MITGLIEDER-AUSWEIS</div>
                                <div class="text-[1.4em] gap-[1em] mt-[5%] grid grid-cols-[1fr_4fr]">
                                    <div class="">Name</div>
                                    <div class="">{{ videoData.title }}</div>
                                    <div class="">Ort</div>
                                    <div class="">Musterwitz</div>
                                    <div class="">Leitung</div>
                                    <div class="">{{ videoData.choir_leader }}</div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                    <img
                        class="w-full relative pointer-events-none"
                        src="/stage/navigation/Menu_offen_full.png"
                        alt="">
                    <img
                        class="bottom-[54%] left-[72.5%] w-[3.5%] absolute z-[20]"
                        src="/stage/navigation/Button_close.png"
                        alt="">
                    <router-link
                        :to="backAction"
                        class="bottom-[15%] left-[12%] w-[10%] absolute z-[20]">
                        <img src="/stage/navigation/Button_Back.png" alt="">
                    </router-link>
                    <button
                        class="bottom-[18%] left-[43.1%] w-[11.7%] absolute z-[20]"
                        @click="videoController.videoToggle()">
                        <img v-show="!videoController.isPlaying" src="/stage/navigation/Button_Play.png" alt="">
                        <img v-show="videoController.isPlaying" src="/stage/navigation/Button_Pause.png" alt="">
                    </button>
                    <button
                        class="bottom-[33%] left-[72%] w-[18%] h-[26%] rounded-full absolute z-[20]"
                        @click="toggleIDCard">
                        <img src="/stage/navigation/Button_ID.png" alt="">
                    </button>
                    <button
                        class="bottom-[58%] right-[10%] w-[18%] h-[13%] absolute z-[20] -skew-y-[16deg]"
                        @click="hideMenu"></button>
                    <button
                        class="bottom-[23%] left-[34.2%] w-[7.2%] absolute z-[20]"
                        @click="videoController.navigatePrev()">
                        <img src="/stage/navigation/Button_before.png" alt="">
                    </button>
                    <button
                        class="bottom-[23%] left-[56.5%] w-[7.2%] rounded-full absolute z-[20]"
                        @click="videoController.navigateNext()">
                        <img src="/stage/navigation/Button_next.png" alt="">
                    </button>
                    <div class="bottom-[5%] left-[33%] w-[28%] absolute z-[20]">
                        <div class="font-serif text-[1.4em]">
                            {{ videoData?.title }}
                        </div>
                    </div>
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
                            src="/stage/navigation/Menu_zu_v2.png"
                            alt="">
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

    .stage-menu-preview--shake {
        transform-origin: bottom;
        animation: shake-menu 3s;
    }
    @keyframes shake-menu {
        0% {
            transform: translateY(0) scale(1);
        }
        20% {
            transform: translateY(-60%) scale(1.02);
        }
        40% {
            transform: translateY(-60%) scale(1.02) rotate(2deg);
        }
        45% {
            transform: translateY(-60%) scale(1.02) rotate(-2deg);
        }
        50% {
            transform: translateY(-60%) scale(1.02) rotate(2deg);
        }
        55% {
            transform: translateY(-60%) scale(1.02);
        }
        100% {
            transform: translateY(0) scale(1);
        }
    }

    .id-card-enter-active {
        transition: 0.5s;
    }
    .id-card-leave-active {
        transition: 0.5s;
    }
    .id-card-enter-from,
    .id-card-leave-to {
        transform: translateX(-100%) translateY(20%);
    }

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