<script setup lang="ts">
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout.vue';
import { useChoirs } from '@/stores/choirs';
import PrimaryButton from '@/components/PrimaryButton.vue';
import {computed, onMounted} from 'vue';
import Skeleton from '../../components/backend/Skeleton.vue';
import TextInput from "@/components/TextInput.vue";
import Select from "@/components/Select.vue";
import type { Choir } from "@/types/Choir";
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

const choirsStorage = useChoirs();

onMounted(async () => {
    if (choirsStorage.choirs.length) {
        return;
    }
    await choirsStorage.getChoirs();
});

const dateCalc = (date: string) => {
    return formatDistanceToNow(new Date(date), {
        locale: de,
        addSuffix: true
    })
}

const filteredList = computed(() : Choir[] => {
    if (!choirsStorage.choirs) {
        return [];
    }
    let result = [...choirsStorage.choirs].sort((firstItem, secondItem) => {
        if (choirsStorage.filterOrder === 'name_asc') {
            return firstItem.name.localeCompare(secondItem.name);
        } else if (choirsStorage.filterOrder === 'name_desc') {
            return secondItem.name.localeCompare(firstItem.name);
        } else if (choirsStorage.filterOrder === 'date_asc') {
            return firstItem.created_at.localeCompare(secondItem.created_at);
        } else if (choirsStorage.filterOrder === 'date_desc') {
            return secondItem.created_at.localeCompare(firstItem.created_at);
        }
        return 0;
    })

    result = result.filter(item => {
        return item.name.toLowerCase().includes(choirsStorage.filterSearchInput.toLowerCase())
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
                                <TextInput v-model="choirsStorage.filterSearchInput" type="text" class="block w-full" placeholder="Filter name" autocomplete="name" />
                                <Select v-model="choirsStorage.filterOrder" :items="choirsStorage.filterOrderOptions"></Select>
                            </div>
                            <div class="grid grid-cols-[3fr_1fr] font-bold mb-2">
                                <div
                                    class="cursor-pointer"
                                    @click="choirsStorage.filterOrder !== 'name_asc' ? choirsStorage.changeOrder('name_asc') : choirsStorage.changeOrder('name_desc')">Name</div>
                                <div
                                    class="cursor-pointer"
                                    @click="choirsStorage.filterOrder !== 'date_desc' ? choirsStorage.changeOrder('date_desc') : choirsStorage.changeOrder('date_asc')">Created At</div>
                            </div>
                            <template v-if="choirsStorage.choirs.length">
                                <div v-if="filteredList.length" >
                                    <li v-for="item in filteredList" :key="item" class="py-3 border-b last:border-0 grid grid-cols-[3fr_1fr]">
                                        <router-link
                                            :to="{ name: 'choirs-edit', params: { id: item.id }}"
                                            class="text-indigo-500">
                                            {{ item.name }}
                                        </router-link>
                                        <span class="text-gray-500">
                                            {{ dateCalc(item.created_at) }}
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