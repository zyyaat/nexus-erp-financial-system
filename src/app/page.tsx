'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import OperationsPage from '@/components/dashboard/OperationsPage'
import KPICard from '@/components/dashboard/KPICard'
import RevenueChart from '@/components/dashboard/RevenueChart'
import SystemHealth from '@/components/dashboard/SystemHealth'
import { Download, Plus } from 'lucide-react'

// Page types
type PageType = 'dashboard' | 'operations' | 'inventory' | 'financials' | 'analytics' | 'settings'

// Dashboard Component (Original Content)
function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2 tracking-tight">
            Executive{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              Overview
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500">Real-time performance metrics and system health.</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white/70 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all flex items-center justify-center space-x-2 backdrop-blur-md shadow-sm">
            <Download size={18} />
            <span>Export PDF</span>
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center space-x-2">
            <Plus size={18} />
            <span>New Widget</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row - Full Width Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <KPICard
          title="Total Revenue"
          value="$1.2M"
          change={14.2}
          changeLabel="vs. last month ($1.05M)"
          icon="revenue"
        />
        <KPICard
          title="Net Profit"
          value="$320k"
          change={8.4}
          changeLabel="vs. last month ($295k)"
          icon="profit"
        />
        <KPICard
          title="Active Users"
          value="14,289"
          change={-2.1}
          changeLabel="vs. last month (14,590)"
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

// Placeholder pages for other tabs
function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-300">
      <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
        <Plus size={40} className="text-indigo-500" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-3">{title}</h2>
      <p className="text-lg text-slate-500 max-w-md text-center">{description}</p>
      <button className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all">
        Coming Soon
      </button>
    </div>
  )
}

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')

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
      case 'operations':
        return <OperationsPage />
      case 'inventory':
        return (
          <PlaceholderPage 
            title="Inventory Management" 
            description="Track stock levels, manage products, and monitor inventory across all warehouses."
          />
        )
      case 'financials':
        return (
          <PlaceholderPage 
            title="Financial Center" 
            description="View financial reports, manage invoices, and track revenue and expenses."
          />
        )
      case 'analytics':
        return (
          <PlaceholderPage 
            title="Analytics Hub" 
            description="Deep dive into data with advanced charts, reports, and business intelligence."
          />
        )
      case 'settings':
        return (
          <PlaceholderPage 
            title="Settings" 
            description="Configure system preferences, user accounts, and application settings."
          />
        )
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-slate-900 antialiased overflow-x-hidden selection:bg-indigo-500/20 selection:text-indigo-600">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-indigo-100/40 blur-[120px] opacity-60 mix-blend-multiply"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-100/30 blur-[100px] opacity-50 mix-blend-multiply"></div>
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
      <main className="pt-36 md:pt-24 pb-12 px-5 md:px-12 md:ml-64 relative z-10">
        {renderPage()}
      </main>
    </div>
  )
}
