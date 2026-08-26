'use client'

import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import KPICard from '@/components/dashboard/KPICard'
import RevenueChart from '@/components/dashboard/RevenueChart'
import SystemHealth from '@/components/dashboard/SystemHealth'
import { Download, Plus } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-slate-900 antialiased overflow-x-hidden selection:bg-indigo-500/20 selection:text-indigo-600">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-indigo-100/40 blur-[120px] opacity-60 mix-blend-multiply"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-100/30 blur-[100px] opacity-50 mix-blend-multiply"></div>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Top Navigation */}
      <TopNav />

      {/* Main Content */}
      <main className="pt-24 pb-12 px-5 md:px-12 md:ml-64 relative z-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-4xl font-semibold text-slate-900 mb-2 tracking-tight">
              Executive{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                Overview
              </span>
            </h2>
            <p className="text-lg text-slate-500">Real-time performance metrics and system health.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white/70 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all flex items-center space-x-2 backdrop-blur-md shadow-sm">
              <Download className="text-[20px]" fontSize="inherit" />
              <span>Export PDF</span>
            </button>
            <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center space-x-2">
              <Plus className="text-[20px]" fontSize="inherit" />
              <span>New Widget</span>
            </button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* KPI Cards Row */}
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

          {/* Revenue Chart */}
          <div className="md:col-span-8">
            <RevenueChart />
          </div>

          {/* System Health */}
          <div className="md:col-span-4">
            <SystemHealth />
          </div>
        </div>
      </main>
    </div>
  )
}
