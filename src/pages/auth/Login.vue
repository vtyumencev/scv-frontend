<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useUsers } from '@/stores/user';
import {ref} from 'vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import GuestLayout from '@/layouts/GuestLayout.vue';
import TextInput from '@/components/TextInput.vue';
import InputLabel from '@/components/InputLabel.vue';

const store = useUsers();

const form = ref({
    email: '',
    password: '',
})

const processing = ref(false);

//const status = route.query.reset?.length > 0 ? atob(route.query.reset) : null

const submitLogin = () => {
    store.login(form, processing)
}
</script>

<template>
    <GuestLayout>

        <form @submit.prevent="submitLogin">
            <div>
                <InputLabel for="email" value="Email" />
                <TextInput
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="mt-1 block w-full"
                    required
                    autofocus
                    autocomplete="username" />
            </div>

            <div class="mt-4">
                <InputLabel for="password" value="Password" />
                <TextInput
                    id="password"
                    v-model="form.password"
                    type="password"
                    class="mt-1 block w-full"
                    required
                    autocomplete="current-password" />
            </div>

            <div class="flex items-center justify-end mt-4">
                <PrimaryButton class="ml-4" :processing="processing">
                    Login
                </PrimaryButton>
            </div>
        </form>
    </GuestLayout>
</template>