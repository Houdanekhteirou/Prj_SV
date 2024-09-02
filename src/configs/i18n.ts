import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

let defaultLanguage = 'fr'

if (typeof localStorage !== 'undefined' && localStorage.getItem('i18nextLng')) {
  defaultLanguage = localStorage.getItem('i18nextLng') || 'fr'
}

i18n

  // Enables the i18next backend
  .use(Backend)

  // Enable automatic language detection
  .use(LanguageDetector)

  // Enables the hook initialization module
  .use(initReactI18next)
  .init({
    // take the language from the local storage if available
    lng: defaultLanguage,
    backend: {
      /* translation file path */
      loadPath: '/locales/{{lng}}.json'
    },
    debug: false,
    keySeparator: false,
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    }
  })

export default i18n
