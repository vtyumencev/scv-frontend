import { defineStore } from "pinia";
import { ref } from "vue";
import type { Video } from "@/types/Video";
import { useLibrary } from "@/stores/library";

export const useFrontend = defineStore('frontend', () => {

    const library = useLibrary();

    const personalVideoCompilation = ref<Video[]>([]);
    const isMobile = ref(false);

    const randomizePersonalVideoCompilation = () => {
        personalVideoCompilation.value = library.videos?.sort(() => {
            return 0.5 - Math.random();
        }) ?? [];
    }

    return {
        isMobile,
        personalVideoCompilation,
        randomizePersonalVideoCompilation
    }
});