import { defineStore } from "pinia";
import { useAPI } from "@/composables/fetch";
import { computed, type Ref, ref } from "vue";
import type { LanguageProfile } from "@/types/LanguageProfile";
import type { TranslationStrings } from "@/types/TranslationStrings";

interface GroupItem {
    value: Ref
}
interface Translation {
    type: string,
    default: string,
    value: Ref<string>
}

export const useSettings = defineStore('settings', () => {

    const settings = {
        general: {
            current_season: {
                value: ref('')
            },
            translation_profiles: {
                type: 'list',
                default: '',
                value: ref<LanguageProfile[]>([])
            },
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
            welcome_start_label: {
                type: 'text',
                default: '',
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
            },
            filter: {
                type: 'text',
                default: '',
                value: ref('')
            },
            search: {
                type: 'text',
                default: '',
                value: ref('')
            },
            footer_help_button: {
                type: 'text',
                default: '',
                value: ref('')
            },
        } as Record<TranslationStrings, Translation>
    }

    const fetch = async () => {
        const api = useAPI();

        const response = await api.index<Record<string, string>>(
            'settings',
            { 'groups': ['general'] }
        );
        if (response.data) {
            Object.entries(response.data.general).forEach((value) => {
                settings.general[value[0]].value.value = JSON.parse(value[1]);
            });
        }
        return response;
    }

    const currentSeason = computed(() => {
        return settings.general.current_season.value;
    })

    const saveGroup = async (groupName: 'general' | 'translations', processing?: Ref) => {
        const api = useAPI();

        const formData = new FormData();
        formData.set('group', groupName);
        Object.entries(settings[groupName]).forEach(item => {
            const value = item[1].value.value;
            formData.set(item[0], JSON.stringify(value));
        })

        await api.store('settings', formData, { successMsg: 'Settings are saved', processing: processing });
    }


    const fetchTranslations = async (langCode: string) => {
        const api = useAPI();

        Object.entries(settings.translations).forEach((value) => {
            //value[1].value.value = value[1].default;
        });

        const response = await api.index<Record<string, string>>(
            'translations',
            { 'lang': langCode }
        );
        if (response.data) {
            Object.entries(response.data).forEach((value) => {
                const string = settings.translations[value[0] as TranslationStrings];
                if (! string) {
                    return;
                }
                string.value.value = value[1] ?? "";
            });
        }
        return response;
    }
    const saveTranslations = async (langCode: string, processing?: Ref) => {
        const api = useAPI();

        const formData = new FormData();
        formData.set('lang', langCode);
        Object.entries(settings.translations).forEach(item => {
            formData.set(item[0], item[1].value.value);
        })

        await api.store('translations', formData, { successMsg: 'Translations are saved', processing: processing });
    }

    return {
        general: settings.general,
        translations: settings.translations,
        currentSeason,
        fetch,
        fetchTranslations,
        saveTranslations,
        saveGroup,
    }
});