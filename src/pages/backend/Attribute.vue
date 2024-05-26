<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';
import AttributesNavbar from '../../components/backend/AttributesNavbar.vue';
import type { EditableAttributes } from '@/types/EditableAttributes';
import { type PropType, computed } from 'vue';
import Skeleton from '../../components/backend/Skeleton.vue';
import AttributeForm from '../../components/backend/AttributeForm.vue'
import { useRoute } from 'vue-router';
import { useLibrary } from "@/stores/library";
import AttributeNew from "@/components/backend/AttributeNew.vue";

const route = useRoute()
const library = useLibrary();

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
                        <div v-if="library.dataIsReady" class="max-w-3xl mx-auto">
                            <router-link
                                v-for="(attributeItem, index) in (library.attributes ? library.attributes[attributeName] : [])"
                                :key="index"
                                :to="{ name: 'attribute-values', params: { attributeID: attributeItem.id } }"
                                class="block py-3 text-indigo-500 border-b last:border-0">
                                {{ attributeItem.name }}
                            </router-link>
                        </div>
                        <Skeleton v-else />
                    </div>
                </div>
            </div>
        </div>
        <template #modals>
            <AttributeForm
                    v-if="library.dataIsReady && attributeID && library.attributes"
                    :attributeName="attributeName"
                    :attribute-i-d="attributeID"
                    :data="library.attributes[attributeName].find(elm => elm.id === parseInt(attributeID))"
            />
            <AttributeNew
                v-if="library.dataIsReady && isAddNew && library.attributes"
                :attributeName="attributeName"
            />
        </template>
    </AuthenticatedLayout>
</template>