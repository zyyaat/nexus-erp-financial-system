'use client'

import { useState, useEffect } from 'react'
import { Search, Bell, Grid3X3 } from 'lucide-react'

export default function TopNav() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`hidden md:flex fixed top-0 right-0 w-[calc(100%-16rem)] bg-white/70 dark:bg-slate-900/70 backdrop-blur-md transition-all duration-300 z-30 justify-between items-center h-16 px-8 ml-64 ${
        isScrolled ? 'border-b border-white/40 shadow-sm' : 'border-b border-transparent'
      }`}
      id="top-nav"
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group focus-within:ring-2 focus-within:ring-indigo-500/30 rounded-xl transition-all duration-300">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" fontSize="small" />
          </span>
          <input
            type="text"
            placeholder="Search operations, analytics, settings..."
            className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-xl leading-5 bg-slate-100/30 text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-indigo-500/50 sm:text-sm transition-all duration-300"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2 ml-4">
        {/* Notifications */}
        <button className="p-2 rounded-xl text-slate-500 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30 relative">
          <Bell fontSize="small" />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        {/* Apps */}
        <button className="p-2 rounded-xl text-slate-500 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
          <Grid3X3 fontSize="small" />
        </button>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

        {/* User Profile */}
        <button className="flex items-center space-x-2 p-1 pl-2 pr-1 rounded-full text-slate-500 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
          <span className="font-medium text-sm hidden lg:block mr-2">E. Larson</span>
          <img
            alt="User Avatar"
            className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoUjdl6JxQ7xr6TtNXNe5yuWpE6JyXvtJdGu5cl3Kgm8IwbLHIqEYhZLg3NzLswZcOlLnobLxo3Yg7JPZLA018Bj05yk3jkudcWtUR_n6scAEQ2NMqU7ew3yCT7_MDdQjp1kNWjGuqCkA0tISPAvTS48joKg2R5yWnI8-AQVfnHc2FVsZoL0-3dZ0UG68X4sSPe-Z5NkSAiWfWulj5eyGYClHXJ1hkm-FxfBr2Dm9ZH9-tTen8NiFi"
          />
        </button>
      </div>
    </header>
  )
}
