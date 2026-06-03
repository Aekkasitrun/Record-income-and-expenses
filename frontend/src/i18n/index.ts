import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import 'dayjs/locale/en'
import en from './locales/en.json'
import th from './locales/th.json'

const savedLang = localStorage.getItem('language') ?? 'th'
dayjs.locale(savedLang === 'en' ? 'en' : 'th')

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    th: { translation: th },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
  dayjs.locale(lng === 'th' ? 'th' : 'en')
})

export default i18n
