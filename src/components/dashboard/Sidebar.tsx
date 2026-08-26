'use client'

import { useEffect } from 'react'
import { 
  LayoutDashboard, 
  Cog, 
  Package, 
  CreditCard, 
  BarChart3, 
  Settings,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react'

// Page type
type PageType = 'dashboard' | 'operations' | 'inventory' | 'financials' | 'analytics' | 'settings'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' as PageType },
  { icon: Cog, label: 'Operations', page: 'operations' as PageType },
  { icon: Package, label: 'Inventory', page: 'inventory' as PageType },
  { icon: CreditCard, label: 'Financials', page: 'financials' as PageType },
  { icon: BarChart3, label: 'Analytics', page: 'analytics' as PageType },
  { icon: Settings, label: 'Settings', page: 'settings' as PageType },
]

const bottomNavItems = [
  { icon: HelpCircle, label: 'Support' },
  { icon: LogOut, label: 'Logout' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentPage: PageType
  onNavigate: (page: PageType) => void
}

export default function Sidebar({ isOpen, onClose, currentPage, onNavigate }: SidebarProps) {
  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 
        bg-white/95 dark:bg-slate-900/95 
        backdrop-blur-xl 
        border-r border-white/40 
        shadow-xl shadow-indigo-500/10 
        z-50 flex-col h-full p-6 space-y-4
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:z-40 md:bg-white/70 md:dark:bg-slate-900/80
      `}>
        {/* Close Button (Mobile Only) */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Logo Section */}
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <LayoutDashboard className="text-indigo-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-indigo-600 leading-tight tracking-tight">Nexus ERP</h1>
            <p className="text-xs text-slate-500">Enterprise Core</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-2 w-full">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.page
            return (
              <a
                key={item.label}
                href="#"
                onClick={(e) => { 
                  e.preventDefault() 
                  onNavigate(item.page)
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20 scale-[0.98]'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 scale-[0.98] hover:scale-95'
                }`}
              >
                <Icon 
                  size={18} 
                  className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} 
                />
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-8 border-t border-white/40">
          {/* System Status */}
          <button className="w-full flex justify-between items-center px-4 py-3 text-slate-500 hover:text-slate-700 font-medium text-sm hover:bg-slate-100/50 transition-all duration-200 rounded-xl group">
            <span className="flex items-center space-x-3">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
              <span>System Status</span>
            </span>
          </button>

          {/* Bottom Nav */}
          <nav className="space-y-1 mt-2">
            {bottomNavItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href="#"
                  onClick={(e) => { 
                    e.preventDefault()
                    if (window.innerWidth < 768) onClose()
                  }}
                  className="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:text-slate-700 font-medium text-sm hover:bg-slate-100/50 transition-all duration-200 rounded-xl scale-[0.98] hover:scale-95 group"
                >
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </a>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
