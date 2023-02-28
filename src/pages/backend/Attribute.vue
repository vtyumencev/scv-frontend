<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';
import AttributesNavbar from './components/AttributesNavbar.vue';
import { useAttributes, type EditableAttributes } from '@/stores/attributes';
import { type PropType, computed } from 'vue';
import Skeleton from './components/Skeleton.vue';
import AttributeForm from './components/AttributeForm.vue'
import { useRoute } from 'vue-router';

const route = useRoute()

const attributesStorage = useAttributes();

defineProps({
    attributeName: {
        type: String as PropType<EditableAttributes>,
        default: ''
    },
    attributeID: {
        type: String,
        default: null
    }
});

const isAddNew = computed(() => {
    return route.name === 'attribute-values-new'
});

</script>

<template>
    <AuthenticatedLayout>
        <template #header>
            <AttributesNavbar />
        </template>
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white shadow-sm sm:rounded-lg">
                    <div class="px-6 py-10 bg-white sm:rounded-lg border-b border-gray-200">
                        <div class="max-w-3xl mx-auto" v-if="attributesStorage.list">
                            <router-link v-for="attributeItem in attributesStorage.list[attributeName]" :to="{ name: 'attribute-values', params: { attributeID: attributeItem.id } }" class="block py-3 text-indigo-500 border-b last:border-0">
                                {{ attributeItem.name }}
                            </router-link>
                        </div>
                        <Skeleton v-else />
                    </div>
                </div>
            </div>
        </div>
        <template #modals>
            <AttributeForm v-if="attributeID || isAddNew" :isAddNew="isAddNew" :attributeName="attributeName" :attributeID="attributeID" />
        </template>
    </AuthenticatedLayout>
</template>