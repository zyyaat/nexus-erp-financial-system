'use client'

import { useState, useEffect } from 'react'
import { Search, Bell, Menu, Sun, Moon } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useTheme } from '@/lib/ThemeProvider'

interface TopNavProps {
  onMenuClick: () => void
}

export default function TopNav({ onMenuClick }: TopNavProps) {
  const { t, dir } = useI18n()
  const { isDark, toggleTheme } = useTheme()
  const isRTL = dir === 'rtl'
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 
        bg-white/95 dark:bg-[#000000]
        transition-all duration-300 z-30
        ${isScrolled ? 'border-b border-slate-200 dark:border-white/10 shadow-sm' : ''}
      `}
      id="top-nav"
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left Section: Hamburger + Search */}
        <div className={`flex items-center flex-1 min-w-0 gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={onMenuClick}
            className="
              flex-shrink-0 p-2 
              rounded-xl text-slate-600 dark:text-slate-300 
              hover:bg-slate-100 dark:hover:bg-white/[0.05] 
              active:bg-slate-200 dark:active:bg-white/[0.08]
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500/30
            "
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={2} />
          </button>

          {/* Search Bar - Hidden on very small screens, expands on larger */}
          <div className={`hidden sm:flex flex-1 max-w-md transition-all duration-300 ${searchFocused ? 'max-w-lg' : ''}`}>
            <div className={`
              relative w-full group 
              focus-within:ring-2 focus-within:ring-blue-500/30 
              rounded-xl transition-all duration-200
              ${searchFocused ? 'bg-white dark:bg-[#0A0A0A] shadow-sm border border-blue-500/20' : ''}
            `}>
              <span className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                <Search 
                  className={`transition-colors ${searchFocused ? 'text-blue-500' : 'text-slate-400 dark:text-slate-500'}`} 
                  size={18} 
                />
              </span>
              <input
                type="text"
                placeholder={t('search.placeholder')}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`
                  block w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 
                  border border-transparent rounded-xl 
                  leading-5 
                  bg-slate-100/80 dark:bg-white/[0.05]
                  text-slate-900 dark:text-white text-sm 
                  placeholder-slate-400 dark:placeholder-slate-500 
                  focus:outline-none focus:bg-white dark:focus:bg-[#1A1D26] focus:border-blue-500/30 
                  transition-all duration-200
                `}
              />
            </div>
          </div>
        </div>

        {/* Right Section: Actions + Profile */}
        <div className={`flex items-center flex-shrink-0 gap-1 sm:gap-2 ${isRTL ? 'mr-3' : 'ml-3'}`}>
          {/* Notifications Button */}
          <button 
            className="
              relative p-2.5 rounded-xl 
              text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 
              hover:bg-slate-100 dark:hover:bg-white/[0.05] 
              active:bg-slate-200 dark:active:bg-white/[0.08]
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500/30
            "
            aria-label={t('notifications.title')}
          >
            <Bell size={20} strokeWidth={2} />
            {/* Notification Badge */}
            <span className={`absolute top-1.5 ${isRTL ? 'left-1.5' : 'right-1.5'} w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0F1117]`}></span>
          </button>

          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleTheme}
            className="
              p-2.5 rounded-xl 
              text-slate-500 dark:text-yellow-400 hover:text-slate-700 dark:hover:text-yellow-300 
              hover:bg-slate-100 dark:hover:bg-white/[0.05] 
              active:bg-slate-200 dark:active:bg-white/[0.08]
              transition-all duration-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500/30
            "
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={20} strokeWidth={2} className="text-yellow-400" />
            ) : (
              <Moon size={20} strokeWidth={2} />
            )}
          </button>

          {/* User Profile Button - Better Aligned */}
          <button 
            className="
              flex items-center gap-2 
              pl-3 pr-2 py-1.5 
              rounded-full 
              text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white 
              hover:bg-slate-100 dark:hover:bg-white/[0.05] 
              active:bg-slate-200 dark:active:bg-white/[0.08]
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500/30
            "
            aria-label="User menu"
          >
            {/* User Avatar - Fixed Size & Properly Styled */}
            <img
              alt="E. Larson"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoUjdl6JxQ7xr6TtNXNe5yuWpE6JyXvtJdGu5cl3Kgm8IwbLHIqEYhZLg3NzLswZcOlLnobLxo3Yg7JPZLA018Bj05yk3jkudcWtUR_n6scAEQ2NMqU7ew3yCT7_MDdQjp1kNWjGuqCkA0tISPAvTS48joKg2R5yWnI8-AQVfnHc2FVsZoL0-3dZ0UG68X4sSPe-Z5NkSAiWfWulj5eyGYClHXJ1hkm-FxfBr2Dm9ZH9-tTen8NiFi"
              className="
                w-8 h-8 rounded-full object-cover 
                ring-2 ring-white dark:ring-white/10 
                shadow-sm
              "
            />
            {/* Username - Hidden on small mobile */}
            <span className="hidden lg:block text-sm font-medium max-w-[80px] truncate text-slate-700 dark:text-slate-200">
              E. Larson
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (Full Width Below Header) */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative group">
          <span className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
            <Search className="text-slate-400 dark:text-slate-500" size={18} />
          </span>
          <input
            type="text"
            placeholder={`${t('search.placeholder')} ${t('nav.operations').toLowerCase()}, ${t('nav.analytics').toLowerCase()}, ${t('nav.settings').toLowerCase()}...`}
            className={`
              block w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 
              border border-slate-200/50 dark:border-white/10 rounded-xl 
              leading-5 
              bg-slate-50/80 dark:bg-white/[0.05]
              text-slate-900 dark:text-white text-sm 
              placeholder-slate-400 dark:placeholder-slate-500 
              focus:outline-none focus:bg-white dark:focus:bg-[#1A1D26] focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/20
              transition-all duration-200
            `}
          />
        </div>
      </div>
    </header>
  )
}
