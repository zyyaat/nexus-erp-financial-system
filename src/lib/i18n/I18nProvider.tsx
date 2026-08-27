'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, translations, isRTL } from './translations'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar') // Default to Arabic

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('dashboard-language') as Language
    if (savedLang && ['ar', 'en', 'fr', 'es'].includes(savedLang)) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('dashboard-language', lang)
    
    // Update document direction
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr'
      document.documentElement.lang = lang
    }
  }

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) return key // Return key if not found
    return translation[language] || key
  }

  const dir = isRTL(language) ? 'rtl' : 'ltr'

  // Update direction on language change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = dir
      document.documentElement.lang = language
    }
  }, [language, dir])

  // Always provide context - don't wait for mount
  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

// Export types for use in components
export type { Language }
export { translations, isRTL }
