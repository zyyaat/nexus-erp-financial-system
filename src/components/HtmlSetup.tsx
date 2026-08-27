'use client'

import { useEffect } from 'react'

export default function HtmlSetup() {
  useEffect(() => {
    // Get language from localStorage
    const savedLang = localStorage.getItem('dashboard-language')
    const lang = savedLang || 'ar' // Default to Arabic
    
    // Determine direction
    const isRTL = lang === 'ar'
    
    // Update HTML element
    const html = document.documentElement
    html.lang = lang
    html.dir = isRTL ? 'rtl' : 'ltr'
    
    // Also set proper attributes for PWA
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#000000')
  }, [])

  return null
}
