import { defineStore } from "pinia";
import { useAPI } from "@/composables/fetch";
import { computed, type Ref, ref } from "vue";
import type { LanguageProfile } from "@/types/LanguageProfile";
import type {Translation} from "@/types/Translation";
import {toValue} from "@vueuse/core";

interface GroupItem {
    value: Ref
}

export const useSettings = defineStore('settings', () => {

    const t = {
        website_title: {
            type: 'text',
            default: '',
            value: ref('')
        }
    } as Record<string, Translation>;

    const settings = {
        general: {
            current_season: {
                value: ref('')
            },
            is_advent_time: {
                value: ref(false)
            },
            translation_profiles: {
                type: 'list',
                default: '',
                value: ref<LanguageProfile[]>([])
            },
        } as Record<string, GroupItem>,

    }

    const translations = {
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
            default: 'Library',
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
        leipzig: {
            type: 'text',
            default: 'Leipzig',
            value: ref(''),
        },
        seasonal: {
            type: 'text',
            default: 'Seasonal',
            value: ref(''),
        },
        west_sachsen: {
            type: 'text',
            default: 'West Sachsen',
            value: ref(''),
        },
        east_sachsen: {
            type: 'text',
            default: 'East Sachsen',
            value: ref(''),
        },
        north_sachsen: {
            type: 'text',
            default: 'North Sachsen',
            value: ref(''),
        },
        children_youth: {
            type: 'text',
            default: 'Children Youth',
            value: ref(''),
        },
        proberaum: {
            type: 'text',
            default: 'Proberaum',
            value: ref(''),
        },
        main_page: {
            type: 'text',
            default: 'Startseite',
            value: ref(''),
        },
        back_to: {
            type: 'text',
            default: 'Zurück zur',
            value: ref(''),
        },
        to_choir_website: {
            type: 'text',
            default: 'Zur Chorseite',
            value: ref(''),
        },
    } as Record<string, Translation>;

    const translate = (key: string): string => {
        return translations.hasOwnProperty(key) ? toValue(translations[key].value) : '';
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

    const saveGroup = async (groupName: 'general', processing?: Ref) => {
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

        const response = await api.index<Record<string, string>>(
            'translations',
            { 'lang': langCode }
        );

        Object.entries(translations).forEach((value) => {
            value[1].value.value = value[1].default;
        });

        if (response.data) {
            Object.entries(response.data).forEach((value) => {
                const item = translations[value[0]];
                if (item) {
                    item.value.value = value[1] ?? '';
                }
            });
        }

        return response;
    }

    const saveTranslations = async (langCode: string, processing?: Ref) => {
        const api = useAPI();

        const formData = new FormData();
        formData.set('lang', langCode);
        Object.entries(translations).forEach(item => {
            formData.set(item[0], item[1].value.value);
        });

        await api.store('translations', formData, { successMsg: 'Translations are saved', processing: processing });
    }

    return {
        general: settings.general,
        translations,
        currentSeason,
        fetch,
        fetchTranslations,
        saveTranslations,
        saveGroup,
        translate,
        t,
    }
});