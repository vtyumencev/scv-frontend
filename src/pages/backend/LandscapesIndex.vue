<script setup lang="ts">
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout.vue';
import { type LandscapeNames, useLibrary } from "@/stores/library";
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import { useSortable } from "@vueuse/integrations/useSortable";
import PrimaryButton from "@/components/PrimaryButton.vue";
import { useAPI } from "@/composables/fetch";
import Skeleton from "@/components/backend/Skeleton.vue";

const route = useRoute();
const library = useLibrary();
const api = useAPI();

const el = ref<HTMLElement | null>(null);

const processing = ref(false);

const currentLandscape = computed(() => {
    return route.params.landscapeName as LandscapeNames
});

const list = computed(() => {
    return  library.presets[currentLandscape.value]?.videos_filter() ?? [];
});

useSortable(el, list, {
    animation: 100,
    handle: '.handle',
});

const saveList = () => {
    const landscapeId = list.value[0].landscape_id;
    const orderedList = [] as number[];
    list.value.forEach(video => {
        orderedList.push(video.id);
    });

    const order = {
        landscapeId: landscapeId,
        videos: orderedList
    }

    api.store('videos/order', order, {
        processing: processing,
        disableNotify: true
    });
}


</script>

<template>
    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    Landscapes
                </h2>
            </div>
        </template>
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="px-10 py-10 bg-white border-b border-gray-200 grid grid-cols-[1fr_5fr]">
                        <div class="border-r-2">
                            <ul>
                                <li v-for="(item, index) in Object.entries(library.presets)" :key="index">
                                    <router-link
                                            :to="{ name: 'landscapes-show', params: { landscapeName: item[0] } }"
                                            class="group block py-[1px]">
                                        <span
                                                class="
                                                group-[.router-link-active]:text-indigo-600
                                                group-[.router-link-active]:bg-indigo-50
                                                hover:bg-indigo-50
                                                flex
                                                justify-between
                                                rounded-bl
                                                rounded-tl
                                                border-r-2
                                                group-[.router-link-active]:border-indigo-600
                                                transition
                                                -mr-[2px]
                                                py-1
                                                px-3">
                                            <span class="">{{ item[1].name }}</span>
                                            <span class="text-sm opacity-40">
                                                {{ item[1].videos_filter().length > 0 ? item[1].videos_filter().length : '' }}
                                            </span>
                                        </span>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                        <div class="pl-10">
                            <Skeleton v-if="!library.dataIsReady">

                            </Skeleton>
                            <div v-show="library.dataIsReady">
                                <div v-show="list.length">
                                    <div class="text-xl">Reihenfolge der Einträge</div>
                                    <div ref="el" class="mt-5">
                                        <div
                                                v-for="(item, index) in list"
                                                :key="index"
                                                class="bg-white px-3 -mx-3 py-2 flex items-center rounded">
                                            <div class="handle pr-5 cursor-move">
                                                <div class="w-[13px] h-[2px] bg-gray-500 my-[2px] rounded"></div>
                                                <div class="w-[13px] h-[2px] bg-gray-500 my-[2px] rounded"></div>
                                                <div class="w-[13px] h-[2px] bg-gray-500 my-[2px] rounded"></div>
                                            </div>
                                            <div class="">
                                                <router-link
                                                        v-if="item.choir_id"
                                                        :to="{ name: 'choirs-edit-videos-edit', params: { id: item.choir_id, videoID: item.id }}"
                                                        class="text-indigo-500">
                                                    {{ item.title }}
                                                </router-link>
                                                <div class="text-sm uppercase">{{ item.choir_name }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div  class="mt-10">
                                        <PrimaryButton :processing="processing" @click="saveList">
                                            Speichern
                                        </PrimaryButton>
                                    </div>
                                </div>
                                <div v-if="currentLandscape && list.length === 0" class="">
                                    <div class="">There's no videos for this landscape.</div>
                                    <div class="">You can assign a video on the <router-link :to="{ name: 'videos' }" class="text-indigo-500">videos page</router-link>.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<style >
</style>