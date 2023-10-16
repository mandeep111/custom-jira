import i18n from 'i18next';
import enTranslation from './locales/en.json';
import thTranslation from './locales/th.json';
import { initReactI18next } from 'react-i18next';

const storedLanguage: string | null = localStorage.getItem('language');

void i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: enTranslation
        },
        th: {
            translation: thTranslation
        }
    },
    lng: storedLanguage || 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    }
});

export default i18n;