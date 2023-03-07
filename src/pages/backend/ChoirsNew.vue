<script setup lang="ts">
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout.vue';
import InputLabel from '@/components/InputLabel.vue';
import TextInput from '@/components/TextInput.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useChoirs } from '@/stores/choirs';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { fetchStatusHandler } from '@/helpers/fetchStatusHandler';

const router = useRouter();

const choirsStore = useChoirs();

const choirName = ref('');

const processing = ref(false);

const storeRecord = async () => {

    processing.value = true;

    const response = await choirsStore.storeChoir({
        name: choirName.value
    });

    fetchStatusHandler(response, 'store')

    if (response.status === 201) {
        await router.push({ name: 'choirs-edit', params: { id: response.data.id } })
    }
    processing.value = false;
}

</script>

<template>
    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    New Choir
                </h2>
            </div>
        </template>
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white shadow-sm sm:rounded-lg">
                    <div class="p-6 pt-10 bg-white sm:rounded-lg border-b border-gray-200">
                        <div class="max-w-3xl mx-auto">
                            <form @submit.prevent="storeRecord">
                                <div class="mb-5">
                                    <InputLabel for="name" value="Chor Name" />
                                    <div class="grid grid-flow-col mt-1 grid-cols-[1fr_auto] gap-3">
                                        <TextInput v-model="choirName" type="text" class="block w-full" autocomplete="name" autofocus />
                                        <PrimaryButton type="submit" :processing="processing">Next steps</PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>