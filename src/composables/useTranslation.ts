import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { translations } from '@/locales/translation'

type LanguageCode = keyof typeof translations
type TranslationObject = typeof translations.en

export function useTranslation() {
  const authStore = useAuthStore()

  const currentLanguage = computed<LanguageCode>(() => {
    const lang = authStore.language as LanguageCode
    return translations[lang] ? lang : 'en'
  })

  const currentTranslations = computed<TranslationObject>(() => {
    return translations[currentLanguage.value]
  })

  function t(path: string, defaultValue?: string): string {
    // Access language reactively each time
    const lang = (authStore.language as LanguageCode) || 'en'
    const translationSet = translations[lang] || translations.en

    const keys = path.split('.')
    let value: any = translationSet

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        return defaultValue || path
      }
    }

    return typeof value === 'string' ? value : path
  }

  return {
    currentLanguage,
    currentTranslations,
    t,
  }
}
