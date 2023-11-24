<script setup lang="ts">
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { computed, onMounted } from 'vue';
import Skeleton from '../../components/backend/Skeleton.vue';
import TextInput from "@/components/TextInput.vue";
import SelectSimple from "@/components/SelectSimple.vue";
import type { Choir } from "@/types/Choir";
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { useLibrary } from "@/stores/library";
import { useBackend } from "@/stores/backend";
import type { ChoirOrderOptions } from "@/stores/backend";

const library = useLibrary();
const backend = useBackend();

onMounted(async () => {
    //
});

const changeOrder = (name: ChoirOrderOptions) => {
    backend.choirsFilterOrder = name;
};

const dateCalc = (date: string) => {
    return formatDistanceToNow(new Date(date), {
        locale: de,
        addSuffix: true
    })
}

const filteredList = computed(() : Choir[] => {
    if (!library.choirs) {
        return [];
    }
    let result = [...library.choirs].sort((firstItem, secondItem) => {
        switch (backend.choirsFilterOrder) {
            case 'name_asc':
                return firstItem.name.localeCompare(secondItem.name);
            case "name_desc":
                return secondItem.name.localeCompare(firstItem.name);
            case "date_asc":
                return firstItem.created_at.localeCompare(secondItem.created_at);
            case "date_desc":
                return secondItem.created_at.localeCompare(firstItem.created_at);
            case "videos_asc":
                return (firstItem.videos?.length ?? 0) - (secondItem.videos?.length ?? 0) ;
            case "videos_desc":
                return (secondItem.videos?.length ?? 0) - (firstItem.videos?.length ?? 0) ;
        }
        return 0;
    })

    result = result.filter(item => {
        return item.name.toLowerCase().includes(backend.choirsFilterSearchInput.toLowerCase())
    })

    return result;
});

</script>

<template>
    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    Choirs
                </h2>
                <router-link 
                    :to="{ name: 'choirs-new' }"
                    class="">
                    <PrimaryButton>Add new</PrimaryButton>
                </router-link>
            </div>
        </template>
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="px-6 py-10 bg-white border-b border-gray-200">
                        <div class="max-w-3xl mx-auto">
                            <div class="mb-5 grid grid-flow-col gap-4 grid-cols-[1fr_auto]">
                                <TextInput v-model="backend.choirsFilterSearchInput" type="text" class="block w-full" placeholder="Filter name" autocomplete="name" />
                                <SelectSimple v-model="backend.choirsFilterOrder" :items="backend.choirsFilterOrderOptions"></SelectSimple>
                            </div>
                            <div class="grid grid-cols-[3fr_1fr_1fr] font-bold mb-2">
                                <div
                                    class="cursor-pointer"
                                    @click="backend.choirsFilterOrder !== 'name_asc' ? changeOrder('name_asc') : changeOrder('name_desc')">Name</div>
                                <div
                                    class="cursor-pointer"
                                    @click="backend.choirsFilterOrder !== 'date_desc' ? changeOrder('date_desc') : changeOrder('date_asc')">Created</div>

                                <div
                                    class="cursor-pointer"
                                    @click="backend.choirsFilterOrder !== 'videos_desc' ? changeOrder('videos_desc') : changeOrder('videos_asc')">Videos</div>
                            </div>
                            <template v-if="library.choirs.length">
                                <div v-if="filteredList.length" >
                                    <li v-for="item in filteredList" :key="item" class="py-3 border-b last:border-0 grid grid-cols-[3fr_1fr_1fr]">
                                        <router-link
                                            :to="{ name: 'choirs-edit', params: { id: item.id }}"
                                            class="text-indigo-500">
                                            {{ item.name }}
                                        </router-link>
                                        <span class="text-gray-500">
                                            {{ dateCalc(item.created_at) }}
                                        </span>
                                        <span class="text-gray-500">
                                            {{ item.videos?.length ?? '-' }}
                                        </span>
                                    </li>
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

<style scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
    position: absolute;
}
</style>