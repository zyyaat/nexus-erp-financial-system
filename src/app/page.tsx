'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import OperationsPage from '@/components/dashboard/OperationsPage'
import InventoryPage from '@/components/dashboard/InventoryPage'
import FinancialsPage from '@/components/dashboard/FinancialsPage'
import AnalyticsPage from '@/components/dashboard/AnalyticsPage'
import SettingsPage from '@/components/dashboard/SettingsPage'
import KPICard from '@/components/dashboard/KPICard'
import RevenueChart from '@/components/dashboard/RevenueChart'
import SystemHealth from '@/components/dashboard/SystemHealth'
// HRIS Pages
import HRISDashboard from '@/components/hris/HRISDashboard'
import EmployeesPage from '@/components/employees/EmployeesPage'
import AttendancePage from '@/components/hris/AttendancePage'
import PayrollPage from '@/components/hris/PayrollPage'
import PerformancePage from '@/components/hris/PerformancePage'
import LeavePage from '@/components/hris/LeavePage'
import { Download, Plus } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

// Page types - Extended with HRIS pages
type PageType = 'dashboard' | 'operations' | 'inventory' | 'financials' | 'analytics' | 'settings' |
  'hris-dashboard' | 'employees' | 'attendance' | 'payroll' | 'performance' | 'leaves'

// Dashboard Component (Original Content)
function DashboardPage() {
  const { t } = useI18n()
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2 tracking-tight">
            {t('common.welcome')}{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              {t('nav.dashboard').toLowerCase()}
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500">{t('analytics.subtitle')}</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white/70 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all flex items-center justify-center space-x-2 backdrop-blur-md shadow-sm">
            <Download size={18} />
            <span>{t('common.export')} PDF</span>
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center space-x-2">
            <Plus size={18} />
            <span>{t('common.add')} Widget</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row - Full Width Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <KPICard
          titleKey="kpi.totalRevenue"
          value="$1.2M"
          change={14.2}
          changeLabelKey="kpi.vsLastMonth"
          icon="revenue"
        />
        <KPICard
          titleKey="kpi.netProfit"
          value="$320k"
          change={8.4}
          changeLabelKey="kpi.vsLastMonth"
          icon="profit"
        />
        <KPICard
          titleKey="kpi.activeUsers"
          value="14,289"
          change={-2.1}
          changeLabelKey="kpi.vsLastMonth"
          icon="users"
        />
      </div>

      {/* Charts Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-8">
          <RevenueChart />
        </div>

        {/* System Health */}
        <div className="lg:col-span-4">
          <SystemHealth />
        </div>
      </div>

      {/* Mobile Bottom Spacing */}
      <div className="md:hidden h-20"></div>
    </div>
  )
}

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')
  const { dir } = useI18n()
  const isRTL = dir === 'rtl'

  // Handle page navigation
  const handleNavigate = (page: PageType) => {
    setCurrentPage(page)
    setIsSidebarOpen(false) // Close sidebar on mobile after navigation
  }

  // Render current page content
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />
      // HRIS Pages
      case 'hris-dashboard':
        return <HRISDashboard />
      case 'employees':
        return <EmployeesPage />
      case 'attendance':
        return <AttendancePage />
      case 'payroll':
        return <PayrollPage />
      case 'performance':
        return <PerformancePage />
      case 'leaves':
        return <LeavePage />
      // Original Pages
      case 'operations':
        return <OperationsPage />
      case 'inventory':
        return <InventoryPage />
      case 'financials':
        return <FinancialsPage />
      case 'analytics':
        return <AnalyticsPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden selection:bg-indigo-500/20 selection:text-indigo-600 transition-colors duration-300">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-indigo-100/40 dark:bg-indigo-900/20 blur-[120px] opacity-60 mix-blend-multiply"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-100/30 dark:bg-blue-900/20 blur-[100px] opacity-50 mix-blend-multiply"></div>
      </div>

      {/* Sidebar (Mobile Responsive) */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Top Navigation */}
      <TopNav onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Main Content - Extra padding on mobile for search bar */}
      <main className={`pt-36 md:pt-24 pb-12 px-5 md:px-12 ${isRTL ? 'md:mr-64' : 'md:ml-64'} relative z-10`}>
        {renderPage()}
      </main>
    </div>
  )
}
