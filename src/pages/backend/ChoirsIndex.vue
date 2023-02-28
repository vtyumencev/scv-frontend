<script setup lang="ts">
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout.vue'
import { useChoirs } from '@/stores/choirs'
import PrimaryButton from '@/components/PrimaryButton.vue'
import { onMounted, ref } from 'vue'
import type { PaginatedRecordsList } from '@/types/PaginatedRecordsList'
import type { Choir } from '@/types/Choir'
import Skeleton from './components/Skeleton.vue'

const choirsStorage = useChoirs()

const choirs = ref<PaginatedRecordsList<Choir[]>>()

onMounted(async () => {
    choirs.value = await choirsStorage.getChoirs()
})

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
                            <template v-if="choirs">
                                <router-link 
                                    :to="{ name: 'choirs-edit', params: { id: item.id }}"
                                    v-for="item in choirs?.data" 
                                    class="block py-3 text-indigo-500 border-b last:border-0">
                                    {{ item.name }}
                                </router-link>
                            </template>
                            <template v-else>
                                <Skeleton />
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
