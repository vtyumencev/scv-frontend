<script setup lang="ts">
import { useStage } from '../stores/stage'
import { onMounted, onUnmounted, ref, reactive, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import Select from '../components/Select.vue'

const stageStore = useStage()
const router = useRouter()
const route = useRoute()

const isStageWindowEnabled = ref(false);

const filters = reactive({
    'style': route.query.style ?? '',
    'genre': route.query.genre ?? '',
    'place': route.query.place ?? '',
});

watch(filters, async (newFilters) => {
    const query = { ...route.query, ...newFilters };

    Object.keys(query).forEach(function(key) {
        if (!query[key]) {
            delete query[key]
        }
    })

    router.push({ query: query })
    applyFilters()
})

watch(() => route.query, async () => {
    Object.keys(filters).forEach(function(key) {
        filters[key] = route.query[key] ?? ''
    })
})

onMounted(() => {
    window.addEventListener('resize', () => stageSize())
    stageSize()
    applyStage(useRoute().query.preset)
    stageStore.getAttributes()
    applyFilters()
});

onUnmounted(() => {
    window.removeEventListener('resize', () => stageSize())
});

onBeforeRouteUpdate((to) => {
    const presetName = to.query.preset;
    applyStage(presetName);
})

const applyFilters = () => {
    stageStore.getVideos()
}

const applyStage = (presetName) => {
    const stageEl = document.querySelector('.stage');
    const preset = stageStore.presets.find(obj => {
        return obj.slug === presetName
    })
    if (!preset) {
        stageEl.style.backgroundColor = ``;
        stageEl.style.backgroundImage = ``
        isStageWindowEnabled.value = false;
        return;
    }
    isStageWindowEnabled.value = true;
    stageEl.style.backgroundColor = preset.color;
    if (preset.background) {
        stageEl.style.backgroundImage = `url(${ preset.background })`
    }
}

const stageSize = () => {
    const stageWrapperEl = document.querySelector('.stage-wrapper');
    const stageEl = document.querySelector('.stage');
    const ar = 16/9;
    const sw = stageWrapperEl.clientWidth;
    const ch = window.innerHeight;
    let clh = sw / ar;
    if (clh > ch) {
        clh = ch;
        stageEl.style.width = (clh * ar) + 'px';
    } else {
        stageEl.style.width = '';
    }
    stageEl.style.height = clh + 'px';
}
</script>
<template>
    <div class="bg-black h-screen">
        <div class="stage-container max-w-7xl mx-auto h-full">
            <div class="stage-container__wrapper stage-wrapper h-full flex justify-center items-center">
                <div class="stage w-full">
                    <div class="stage-presets" v-if="!isStageWindowEnabled">
                        <template v-for="preset in stageStore.presets">
                            <router-link :to="{ query: { 'preset': preset.slug } }" class="text-sm text-white">
                                {{ preset.name }}
                            </router-link>
                        </template>
                    </div>
                    <div v-else class="relative stage-inner flex flex-col h-full">
                        <div class="stage-body absolute w-full grow-1 h-full flex justify-center items-center">
                            <div class="aspect-video -mt-[10%] w-[42%] border-2 border-black">
                                <div class="bg-white h-full py-5">
                                    <router-link v-for="video in stageStore.videos" :to="{ query: { ...this.$route.query, watch: video.id } }" class="block px-5 py-1 cursor-pointer hover:bg-indigo-50 text-indigo-500">
                                        {{ video.name }}
                                    </router-link>
                                </div>
                            </div>
                        </div>
                        <div class="w-full absolute flex justify-between items-center py-5 px-8">
                            <router-link :to="{ query: { } }" class="rounded-md border border-gray-300 bg-white bg-opacity-60 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                Go back
                            </router-link>
                            <div class="grid grid-flow-col gap-4">
                                <Select name="Style" :items="stageStore.attributes.styles" v-model="filters.style"></Select>
                                <Select name="Genre" :items="stageStore.attributes.genres" v-model="filters.genre"></Select>
                                <Select name="Place" :items="stageStore.attributes.places" v-model="filters.place"></Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .stage-container {
        &__wrapper {
            
        }
    }
    .stage {
        background: rgba($color: #fff, $alpha: 0.2);
        transition: background-color 0.2s, background-image 0.2s;
        background-size: cover;
        background-position: center;
        position: relative;
    }
    .stage-presets {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>