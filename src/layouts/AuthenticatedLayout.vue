<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useUsers } from '@/stores/user';
import Dropdown from '@/components/Dropdown.vue';
import DropdownLink from '@/components/DropdownLink.vue';
import NavLink from '@/components/NavLink.vue';
import ResponsiveNavLink from '@/components/ResponsiveNavLink.vue';

import 'vue3-toastify/dist/index.css';
import { useLibrary } from "@/stores/library";

const showingNavigationDropdown = ref(false);

const store = useUsers();

const auth = store.authUser;
const library = useLibrary();

onBeforeMount(async () => {
    if (! store.hasUserData) {
        await store.getData()
    }


    if (! library.dataIsReady) {

        const responses = await Promise.all([
            library.getChoirs(),
            library.getAttributes(),
            library.getVideos()
        ]);

        const errors = responses.find(response => response.error);

        if (errors) {
            return;
        }

        await library.videos.forEach((video) => {
            video.choir_name = library.getChoirByID(video.choir_id)?.name ?? '';
        });

        await library.choirs.forEach((choir) => {
            choir.videos = library.getVideosByChoirID(choir.id);
        });

        library.dataReady();
    }
})

const submitLogout = () => {
    store.logout();
}
</script>

<template>
    <div class="">
        <div v-if="auth">
            <div class="min-h-screen bg-gray-100">
                <nav class="bg-white border-b border-gray-100">
                    <!-- Primary Navigation Menu -->
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between h-16">
                            <div class="flex">

                                <!-- Navigation Links -->
                                <div
                                    class="hidden space-x-8 sm:-my-px sm:flex">
                                    <router-link
                                        v-slot="{ href, isActive, navigate }"
                                        to="/choirs"
                                        custom>
                                        <NavLink
                                            :href="href"
                                            :active="isActive"
                                            @click="navigate">
                                            Chöre
                                        </NavLink>
                                    </router-link>
                                    <router-link
                                            v-slot="{ href, isActive, navigate }"
                                            to="/videos"
                                            custom>
                                        <NavLink
                                                :href="href"
                                                :active="isActive"
                                                @click="navigate">
                                            Videos
                                        </NavLink>
                                    </router-link>
                                    <router-link
                                            v-slot="{ href, isActive, navigate }"
                                            to="/landscapes"
                                            custom>
                                        <NavLink
                                                :href="href"
                                                :active="isActive"
                                                @click="navigate">
                                            Landscapes
                                        </NavLink>
                                    </router-link>
                                    <router-link
                                        v-slot="{ href, isActive, navigate }"
                                        to="/attributes"
                                        custom>
                                        <NavLink
                                            :href="href"
                                            :active="isActive"
                                            @click="navigate">
                                            Attribute
                                        </NavLink>
                                    </router-link>
                                    <router-link
                                        v-slot="{ href, isActive, navigate }"
                                        to="/settings"
                                        custom>
                                        <NavLink
                                            :href="href"
                                            :active="isActive"
                                            @click="navigate">
                                            Einstellungen
                                        </NavLink>
                                    </router-link>
                                    <router-link
                                        v-slot="{ href, isActive, navigate }"
                                        to="/export-import"
                                        custom>
                                        <NavLink
                                            :href="href"
                                            :active="isActive"
                                            @click="navigate">
                                            Export & Import
                                        </NavLink>
                                    </router-link>
                                </div>
                            </div>

                            <div class="hidden sm:flex sm:items-center sm:ml-6">
                                <!-- Settings Dropdown -->
                                <div class="ml-3 relative">
                                    <Dropdown align="right" width="48">
                                        <template #trigger>
                                            <span class="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150">
                                                    {{ store.userData.name }}

                                                    <svg
                                                        class="ml-2 -mr-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor">
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </template>

                                        <template #content>
                                            <DropdownLink
                                                @click="submitLogout">
                                                Log Out
                                            </DropdownLink>
                                        </template>
                                    </Dropdown>
                                </div>
                            </div>

                            <!-- Hamburger -->
                            <div class="-mr-2 flex items-center sm:hidden">
                                <button
                                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                    @click="
                                        showingNavigationDropdown =
                                            !showingNavigationDropdown
                                    ">
                                    <svg
                                        class="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <path
                                            :class="{
                                                hidden: showingNavigationDropdown,
                                                'inline-flex':
                                                    !showingNavigationDropdown,
                                            }"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M4 6h16M4 12h16M4 18h16" />
                                        <path
                                            :class="{
                                                hidden: !showingNavigationDropdown,
                                                'inline-flex':
                                                    showingNavigationDropdown,
                                            }"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Responsive Navigation Menu -->
                    <div
                        :class="{
                            block: showingNavigationDropdown,
                            hidden: !showingNavigationDropdown,
                        }"
                        class="sm:hidden">
                        <div class="pt-2 pb-3 space-y-1">
                            <router-link
                                v-slot="{ href, isActive, navigate }"
                                to="/dashboard"
                                custom>
                                <ResponsiveNavLink
                                    :href="href"
                                    :active="isActive"
                                    @click="navigate">
                                    Dashboard
                                </ResponsiveNavLink>
                            </router-link>
                        </div>

                        <!-- Responsive Settings Options -->
                        <div class="pt-4 pb-1 border-t border-gray-200">
                            <div class="px-4">
                                <div class="font-medium text-base text-gray-800">
                                    {{ store.userData.name }}
                                </div>
                                <div class="font-medium text-sm text-gray-500">
                                    {{ store.userData.email }}
                                </div>
                            </div>

                            <div class="mt-3 space-y-1">
                                <router-link
                                    v-slot="{ href, navigate }"
                                    to="/"
                                    custom>
                                    <ResponsiveNavLink
                                        :href="href"
                                        @click="navigate">
                                        Log Out
                                    </ResponsiveNavLink>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </nav>

                <!-- Page Heading -->
                <header v-if="$slots.header" class="bg-white shadow">
                    <div class="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex">
                        <slot name="header" />
                    </div>
                </header>

                <!-- Page Content -->
                <main>
                    <slot />
                </main>
            </div>
        </div>
        <div id="modals">
            <slot v-if="$slots.modals" name="modals" />
        </div>
    </div>
</template>
