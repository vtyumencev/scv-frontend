<script setup lang="ts">
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout.vue';
import { computed, onMounted, ref } from 'vue';
import Skeleton from '../../components/backend/Skeleton.vue';
import TextInput from "@/components/TextInput.vue";
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { useLibrary } from "@/stores/library";
import { useBackend } from "@/stores/backend";
import type { Video } from "@/types/Video";
import PrimaryButton from "@/components/PrimaryButton.vue";
import CheckForBrokenVideos from "@/components/backend/CheckForBrokenVideos.vue";

const library = useLibrary();
const backend = useBackend();
const isCheckForBrokenLinksWindowOpen = ref(false);

onMounted(async () => {
    //
});

const dateCalc = (date: string) => {
    return formatDistanceToNow(new Date(date), {
        locale: de,
        addSuffix: true
    })
}

const filteredList = computed(() : Video[] => {
    if (! library.videos) {
        return [];
    }
    let result = library.videos;

    result = result.filter(item => {
        return item.choir_name !== '';
    })

    result = result.filter(item => {
        return item.title.toLowerCase().includes(backend.videosFilterSearchInput.toLowerCase());
    })

    return result;
});

</script>

<template>
    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    Videos
                </h2>
                <PrimaryButton @click="isCheckForBrokenLinksWindowOpen = !isCheckForBrokenLinksWindowOpen">
                    Check for broken YouTube links
                </PrimaryButton>
                <Teleport v-if="isCheckForBrokenLinksWindowOpen" to="#modals">
                    <CheckForBrokenVideos @close-modal="isCheckForBrokenLinksWindowOpen = false" />
                </Teleport>
            </div>
        </template>
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="px-10 py-10 bg-white border-b border-gray-200">
                        <div class="mx-auto">
                            <div class="mb-5 grid grid-flow-col gap-4 grid-cols-[1fr_auto]">
                                <TextInput v-model="backend.videosFilterSearchInput" type="text" class="block w-full" placeholder="Filter Title" autocomplete="name" />
                            </div>
                            <div class="grid grid-cols-[4fr_3fr_2fr_1fr] gap-4 font-bold mb-2">
                                <div>Video</div>
                                <div>Choir</div>
                                <div>Created</div>
                                <div>Landscape</div>
                            </div>
                            <template v-if="library.choirs.length">
                                <div v-if="filteredList.length" >
                                    <ul>
                                        <li
                                                v-for="item in filteredList"
                                                :key="item"
                                                class="py-3 border-b last:border-0 grid grid-cols-[4fr_3fr_2fr_1fr] gap-4">
                                            <div class="">
                                                <router-link
                                                        v-if="item.choir_id"
                                                        :to="{ name: 'choirs-edit-videos-edit', params: { id: item.choir_id, videoID: item.id }}"
                                                        class="text-indigo-500">
                                                        {{ item.title }}
                                                </router-link>
                                            </div>
                                            <div class="">
                                                <router-link
                                                        v-if="item.choir_id"
                                                        :to="{ name: 'choirs-edit', params: { id: item.choir_id }}"
                                                        class="text-indigo-500">
                                                    {{ item.choir_name }}
                                                </router-link>
                                            </div>
                                            <div class="text-gray-500">
                                                {{ dateCalc(item.created_at) }}
                                            </div>
                                            <div class="text-gray-500">
                                                {{ library.getLandscapeById(item.landscape_id)?.name ?? '' }}
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <template v-else>
                                    No results.
                                </template>
                            </template>
                            <template v-else>
                                <Skeleton class="px-0" />
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>