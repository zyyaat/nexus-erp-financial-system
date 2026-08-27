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
  X,
  Users,
  Clock,
  DollarSign,
  Award,
  Calendar
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'

// Page type - Extended with HRIS pages
type PageType = 'dashboard' | 'operations' | 'inventory' | 'financials' | 'analytics' | 'settings' |
  'hris-dashboard' | 'employees' | 'attendance' | 'payroll' | 'performance' | 'leaves'

const navItems = [
  { icon: LayoutDashboard, labelKey: 'nav.dashboard', page: 'dashboard' as PageType },
  
  // HRIS Section
  { icon: Users, labelKey: 'nav.hrisDashboard', page: 'hris-dashboard' as PageType, isSectionHeader: true, sectionLabel: 'الموارد البشرية' },
  { icon: Users, labelKey: 'nav.employees', page: 'employees' as PageType },
  { icon: Clock, labelKey: 'nav.attendance', page: 'attendance' as PageType },
  { icon: DollarSign, labelKey: 'nav.payroll', page: 'payroll' as PageType },
  { icon: Award, labelKey: 'nav.performance', page: 'performance' as PageType },
  { icon: Calendar, labelKey: 'nav.leaves', page: 'leaves' as PageType },
  
  // Operations Section
  { icon: Cog, labelKey: 'nav.operations', page: 'operations' as PageType, isSectionHeader: true, sectionLabel: 'العمليات' },
  { icon: Package, labelKey: 'nav.inventory', page: 'inventory' as PageType },
  { icon: CreditCard, labelKey: 'nav.financials', page: 'financials' as PageType },
  { icon: BarChart3, labelKey: 'nav.analytics', page: 'analytics' as PageType },
  { icon: Settings, labelKey: 'nav.settings', page: 'settings' as PageType },
]

const bottomNavItems = [
  { icon: HelpCircle, labelKey: 'nav.support' },
  { icon: LogOut, labelKey: 'nav.logout' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentPage: PageType
  onNavigate: (page: PageType) => void
}

export default function Sidebar({ isOpen, onClose, currentPage, onNavigate }: SidebarProps) {
  const { t, dir } = useI18n()
  const isRTL = dir === 'rtl'

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
          className="md:hidden fixed inset-0 bg-black/50  z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed ${isRTL ? 'right-0' : 'left-0'} top-0 h-screen w-64 
        bg-white/95 dark:bg-[#000000] 
         
        ${isRTL ? 'border-l' : 'border-r'} border-white/40 
        shadow-xl shadow-indigo-500/10 
        z-50 flex flex-col h-full p-6 space-y-4
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}
        md:translate-x-0 md:z-40 md:bg-white/70 md:dark:bg-[#000000]
        overflow-hidden
      `}>
        {/* Close Button (Mobile Only) */}
        <div className={`md:hidden flex ${isRTL ? 'justify-start' : 'justify-end'} mb-4`}>
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

        {/* Main Navigation - Scrollable */}
        <nav className="flex-1 space-y-2 w-full overflow-y-auto pr-1">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = currentPage === item.page
            
            // Render section header
            if ((item as any).isSectionHeader && index > 0) {
              return (
                <div key={item.labelKey} className="pt-4 pb-2 first:pt-0">
                  <div className="px-4 py-1 text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 rounded-lg mb-2">
                    {(item as any).sectionLabel || t(item.labelKey)}
                  </div>
                </div>
              )
            }
            
            return (
              <a
                key={item.labelKey}
                href="#"
                onClick={(e) => { 
                  e.preventDefault() 
                  onNavigate(item.page)
                }}
                className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20 scale-[0.98]'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 scale-[0.98] hover:scale-95'
                }`}
              >
                <Icon 
                  size={18} 
                  className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} 
                />
                <span>{t(item.labelKey)}</span>
              </a>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-8 border-t border-white/40">
          {/* System Status */}
          <button className="w-full flex justify-between items-center px-4 py-3 text-slate-500 hover:text-slate-700 font-medium text-sm hover:bg-slate-100/50 transition-all duration-200 rounded-xl group">
            <span className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
              <span>{t('nav.systemStatus')}</span>
            </span>
          </button>

          {/* Bottom Nav */}
          <nav className="space-y-1 mt-2">
            {bottomNavItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.labelKey}
                  href="#"
                  onClick={(e) => { 
                    e.preventDefault()
                    if (window.innerWidth < 768) onClose()
                  }}
                  className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} px-4 py-3 text-slate-500 hover:text-slate-700 font-medium text-sm hover:bg-slate-100/50 transition-all duration-200 rounded-xl scale-[0.98] hover:scale-95 group`}
                >
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                  <span>{t(item.labelKey)}</span>
                </a>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
