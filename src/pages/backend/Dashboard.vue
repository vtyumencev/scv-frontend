<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import {isReactive, isRef, onMounted, reactive, ref} from "vue";
import {toRef, toValue} from "@vueuse/core";
import {useSettings} from "@/stores/settings";

// const settings = useSettings();
//
// onMounted(async () => {
//     await settings.fetchTranslations('de-DE');
// })
//
// const value = reactive({
//     foo: 1,
//     bar: 2,
//     array: [1, 2]
// });



// const valueR = reactive({
//     foo: 1,
//     bar: 2,
//     array: [1, 2]
// });
// const valueN = ref(1);
//
// const value2 = toRef(value);
// const value3 = toRef(() => value); // readonly
// const value4 = toRef(value, 'foo');
// console.log(value);
// console.log(value2);
// console.log(value3);
// console.log(value4);

</script>

<template>
    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 bg-white border-b border-gray-200">
                        You're logged in!
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
