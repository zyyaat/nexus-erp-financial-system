'use client'

import { useState } from 'react'
import { 
  LayoutDashboard, 
  Cog, 
  Package, 
  CreditCard, 
  BarChart3, 
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Cog, label: 'Operations', active: false },
  { icon: Package, label: 'Inventory', active: false },
  { icon: CreditCard, label: 'Financials', active: false },
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: Settings, label: 'Settings', active: false },
]

const bottomNavItems = [
  { icon: HelpCircle, label: 'Support' },
  { icon: LogOut, label: 'Logout' },
]

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard')

  return (
    <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-r border-white/40 shadow-lg shadow-indigo-500/5 z-40 flex-col h-full p-6 space-y-4">
      {/* Logo Section */}
      <div className="flex items-center space-x-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <LayoutDashboard className="text-indigo-600" />
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
          const isActive = activeItem === item.label
          return (
            <a
              key={item.label}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveItem(item.label) }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                isActive
                  ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20 scale-[0.98]'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 scale-[0.98] hover:scale-95'
              }`}
            >
              <Icon className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} fontSize="small" />
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
                className="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:text-slate-700 font-medium text-sm hover:bg-slate-100/50 transition-all duration-200 rounded-xl scale-[0.98] hover:scale-95 group"
              >
                <Icon className="group-hover:scale-110 transition-transform" fontSize="small" />
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
