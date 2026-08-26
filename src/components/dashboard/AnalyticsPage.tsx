'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp,
  Users,
  ShoppingCart,
  Eye,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react'

// ============ TYPES ============
interface MetricCard {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: React.ElementType
  color: string
  bgColor: string
  textColor: string
}

interface DataPoint {
  label: string
  value: number
  value2?: number
}

// ============ MOCK DATA ============
const analyticsKPIs: MetricCard[] = [
  {
    title: 'Page Views',
    value: '284.5K',
    change: 18.2,
    changeLabel: 'vs last week',
    icon: Eye,
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-600'
  },
  {
    title: 'Conversion Rate',
    value: '3.24%',
    change: 0.8,
    changeLabel: 'vs last week',
    icon: Target,
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600'
  },
  {
    title: 'Active Users',
    value: '14,289',
    change: -2.1,
    changeLabel: 'vs last week',
    icon: Users,
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600'
  },
  {
    title: 'Revenue/User',
    value: '$84.02',
    change: 5.4,
    changeLabel: 'vs last week',
    icon: Zap,
    color: 'violet',
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-600'
  }
]

const weeklyTrafficData: DataPoint[] = [
  { label: 'Mon', value: 42000, value2: 38000 },
  { label: 'Tue', value: 48000, value2: 42000 },
  { label: 'Wed', value: 52000, value2: 45000 },
  { label: 'Thu', value: 45000, value2: 40000 },
  { label: 'Fri', value: 58000, value2: 50000 },
  { label: 'Sat', value: 35000, value2: 32000 },
  { label: 'Sun', value: 32000, value2: 28000 }
]

const topPages = [
  { path: '/dashboard', views: 45230, bounceRate: 23.5, avgTime: '4m 32s' },
  { path: '/products', views: 38920, bounceRate: 31.2, avgTime: '3m 15s' },
  { path: '/pricing', views: 28750, bounceRate: 45.8, avgTime: '2m 48s' },
  { path: '/about', views: 18430, bounceRate: 52.1, avgTime: '1m 55s' },
  { path: '/contact', views: 12340, bounceRate: 38.7, avgTime: '2m 12s' }
]

const deviceBreakdown = [
  { device: 'Desktop', percentage: 58, users: 8287, color: 'bg-indigo-500' },
  { device: 'Mobile', percentage: 35, users: 5001, color: 'bg-violet-500' },
  { device: 'Tablet', percentage: 7, users: 1000, color: 'bg-blue-500' }
]

const trafficSources = [
  { source: 'Organic Search', visits: 98520, percentage: 42, color: 'bg-green-500' },
  { source: 'Direct', visits: 62340, percentage: 27, color: 'bg-blue-500' },
  { source: 'Social Media', visits: 45680, percentage: 19, color: 'bg-pink-500' },
  { source: 'Referral', visits: 18920, percentage: 8, color: 'bg-amber-500' },
  { source: 'Email', visits: 8030, percentage: 4, color: 'bg-purple-500' }
]

// ============ SUB-COMPONENTS ============

function AnalyticsKPICard({ kpi }: { kpi: MetricCard }) {
  const Icon = kpi.icon
  const isPositive = kpi.change >= 0

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden shadow-lg shadow-indigo-500/4">
      <div className={`absolute top-0 right-0 w-32 h-32 ${kpi.bgColor} rounded-full blur-2xl -mr-10 -mt-10 opacity-60 pointer-events-none`}></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 ${kpi.bgColor} rounded-xl ${kpi.textColor}`}>
          <Icon size={24} />
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isPositive 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownLeft size={14} className="mr-1" />}
          {Math.abs(kpi.change)}%
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-500 mb-1">{kpi.title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
        <p className="text-xs text-slate-400 mt-1">{kpi.changeLabel}</p>
      </div>
    </div>
  )
}

function MiniChart({ data, height = 60 }: { data: DataPoint[]; height?: number }) {
  const maxValue = Math.max(...data.map(d => d.value))
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - (d.value / maxValue) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M 0,100 L ${points} L 100,100 Z`} fill="url(#chartGradient)" />
      <path d={`M ${points}`} fill="none" stroke="#6366f1" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

// ============ MAIN COMPONENT ============
export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('week')
  const [selectedMetric, setSelectedMetric] = useState('traffic')

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2 tracking-tight">
            Analytics{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              Hub
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500">
            Deep dive into data with advanced charts and business intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 bg-white/70 backdrop-blur-md border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {analyticsKPIs.map((kpi) => (
          <AnalyticsKPICard key={kpi.title} kpi={kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Traffic Chart Section - Takes 2 columns on XL */}
        <div className="xl:col-span-2 space-y-6">
          {/* Main Traffic Chart */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-lg shadow-indigo-500/4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Activity size={20} className="text-indigo-500" />
                  Traffic Overview
                </h3>
                <p className="text-sm text-slate-500 mt-1">Weekly visitor trends</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                  <span className="text-xs text-slate-600">This Week</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                  <span className="text-xs text-slate-600">Last Week</span>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-64 relative">
              <MiniChart data={weeklyTrafficData} />
              
              {/* X-Axis Labels */}
              <div className="flex justify-between mt-4 px-2">
                {weeklyTrafficData.map((point) => (
                  <span key={point.label} className="text-xs text-slate-500">{point.label}</span>
                ))}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">312K</p>
                <p className="text-xs text-slate-500">Total Visits</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">+18%</p>
                <p className="text-xs text-slate-500">vs Last Week</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">2m 34s</p>
                <p className="text-xs text-slate-500">Avg. Duration</p>
              </div>
            </div>
          </div>

          {/* Top Pages Table */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-lg shadow-indigo-500/4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-violet-500" />
              Top Pages
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Page</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Views</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 uppercase hidden sm:table-cell">Bounce %</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 uppercase hidden md:table-cell">Avg Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topPages.map((page) => (
                    <tr key={page.path} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <code className="text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{page.path}</code>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-900">{page.views.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right hidden sm:table-cell">
                        <span className={`font-medium ${page.bounceRate > 40 ? 'text-red-600' : 'text-green-600'}`}>
                          {page.bounceRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 hidden md:table-cell">{page.avgTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar - Takes 1 column on XL */}
        <div className="space-y-4">
          {/* Traffic Sources */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg shadow-indigo-500/4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-emerald-500" />
              Traffic Sources
            </h3>

            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.source}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{source.source}</span>
                    <span className="text-xs text-slate-500">{source.percentage}% ({(source.visits / 1000).toFixed(1)}k)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${source.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-5 text-white shadow-xl">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Users size={18} />
              Device Breakdown
            </h4>
            
            <div className="space-y-4">
              {deviceBreakdown.map((device) => (
                <div key={device.device} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${device.color.replace('bg-', 'bg-white/')} flex items-center justify-center`}>
                      {device.device === 'Desktop' ? '🖥️' : device.device === 'Mobile' ? '📱' : '📋'}
                    </div>
                    <div>
                      <p className="font-medium">{device.device}</p>
                      <p className="text-xs text-white/70">{device.users.toLocaleString()} users</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold">{device.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Activity */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg shadow-indigo-500/4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <RefreshCw size={18} className="text-cyan-500 animate-spin" style={{ animationDuration: '3s' }} />
              Live Activity
            </h3>

            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
              {[
                { action: 'Page View', location: '/products', time: 'Just now', type: 'view' as const },
                { action: 'Sign Up', location: 'New User from US', time: '2m ago', type: 'conversion' as const },
                { action: 'Purchase', location: '$245.00 order', time: '5m ago', type: 'revenue' as const },
                { action: 'Page View', location: '/pricing', time: '7m ago', type: 'view' as const },
                { action: 'Download', location: 'Whitepaper PDF', time: '12m ago', type: 'engagement' as const }
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'view' ? 'bg-blue-500' :
                    activity.type === 'conversion' ? 'bg-green-500' :
                    activity.type === 'revenue' ? 'bg-emerald-500' :
                    'bg-purple-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                    <p className="text-xs text-slate-500 truncate">{activity.location}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
