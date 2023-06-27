import { defineStore } from "pinia";
import { useAPI } from "@/composables/fetch";
import { computed, type Ref, ref } from "vue";

interface GroupItem {
    value: Ref<string>
}
interface Translation extends GroupItem {
    type: string,
    default: string
}

export const useSettings = defineStore('settings', () => {

    const settings = {
        general: {
            current_season: {
                value: ref<string>()
            }
        } as Record<string, GroupItem>,

        translations: {
            website_title: {
                type: 'text',
                default: '',
                value: ref('')
            },
            cookies_warning: {
                type: 'text',
                default: '',
                value: ref('')
            },
            impressum: {
                type: 'editor',
                default: '',
                value: ref('')
            },
            datenschutz: {
                type: 'editor',
                default: '',
                value: ref('')
            },
            welcome_title: {
                type: 'text',
                default: '',
                value: ref('')
            },
            welcome_description: {
                type: 'editor',
                default: '',
                value: ref('')
            },
            welcome_video: {
                type: 'text',
                default: 'KsdAb06ZBTI',
                value: ref('')
            },
            library_title: {
                type: 'text',
                default: '',
                value: ref('')
            },
            library_description: {
                type: 'text',
                default: '',
                value: ref('')
            },
            rehearsal_description: {
                type: 'editor',
                default: '',
                value: ref('')
            }
        } as Record<string, Translation>
    }

    const fetch = async () => {
        const api = useAPI();
        const response = await api.index<Record<string, string>>(
            'settings',
            { 'groups': ['general', 'translations'] }
        );
        if (response.data) {
            Object.entries(response.data.general).forEach((value) => {
                settings.general[value[0]].value.value = value[1];
            });
            Object.entries(response.data.translations).forEach((value) => {
                settings.translations[value[0]].value.value = value[1];
            });
        }
        return response;
    }

    const currentSeason = computed(() => {
        return settings.general.current_season.value.value;
    })

    const saveGroup = async (groupName: 'general' | 'translations', processing?: Ref) => {
        const api = useAPI();

        const formData = new FormData();
        formData.set('group', groupName)
        Object.entries(settings[groupName]).forEach(item => {
            formData.set(item[0], item[1].value.value);
        })

        await api.store('settings', formData, { successMsg: 'Settings are saved', processing: processing })
    }

    return {
        general: settings.general,
        translations: settings.translations,
        currentSeason,
        fetch,
        saveGroup
    }
});