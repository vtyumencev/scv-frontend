<script setup lang="ts">
import NavLink from '@/components/NavLink.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';

const navigation = [
    {
        'name': 'Genres',
        'slug': 'genres',
    },
    {
        'name': 'Stile',
        'slug': 'styles',
    },
    {
        'name': 'Chortyp',
        'slug': 'choir_types',
    },
];

</script>

<template>
    <div class="flex justify-between w-full items-center">
        <div class="flex h-full">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight inline-flex items-center">
                Attributes
            </h2>
            <div
                class="space-x-5 ml-10 flex">
                <router-link
                    v-for="attribute in navigation"
                    v-slot="{ href, isActive, navigate }"
                    :key="attribute"
                    :to="{ name: 'attribute', params: { attributeName: attribute.slug } }"
                    custom>
                    <NavLink
                        :href="href"
                        :active="isActive"
                        @click="navigate">
                        {{ attribute.name }}
                    </NavLink>
                </router-link>
            </div>
        </div>
        <router-link 
            :to="{ name: 'attribute-values-new' }"
            class="">
            <PrimaryButton>Add new value</PrimaryButton>
        </router-link>
    </div>
</template>